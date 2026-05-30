import prisma from "../lib/prisma.js";
import { emitInvoicePaid } from "../lib/socket.js";
import { getCashfreePayment } from "./cashfreeService.js";

const eventIdFromPayload = (payload) => (
  payload?.event_id ||
  payload?.data?.payment?.cf_payment_id ||
  payload?.data?.order?.order_id ||
  null
);

export const handleVerifiedCashfreeWebhook = async (payload) => {
  const eventId = eventIdFromPayload(payload);
  if (eventId) {
    const existing = await prisma.transaction.findUnique({ where: { gatewayEventId: String(eventId) } });
    if (existing) return { duplicate: true };
  }

  const order = payload?.data?.order || {};
  const paymentPayload = payload?.data?.payment || {};
  const orderId = order.order_id;
  const paymentId = String(paymentPayload.cf_payment_id || "");

  const payment = await prisma.payment.findUnique({
    where: { cashfreeOrderId: orderId },
    include: { invoice: true }
  });

  if (!payment) return { ignored: true, reason: "Payment record not found" };

  let verifiedPayment = paymentPayload;
  if (paymentId) {
    verifiedPayment = await getCashfreePayment({ orderId, paymentId });
  }

  const gatewayStatus = verifiedPayment.payment_status || paymentPayload.payment_status;
  const amountMatches = Number(verifiedPayment.payment_amount || order.order_amount) === Number(payment.amount);
  const isPaid = gatewayStatus === "SUCCESS" && amountMatches;

  const updated = await prisma.$transaction(async (tx) => {
    await tx.transaction.create({
      data: {
        paymentId: payment.id,
        amount: Number(payment.amount),
        gatewayEventId: eventId ? String(eventId) : null,
        cashfreePaymentId: paymentId || null,
        paymentMethod: verifiedPayment.payment_group || "upi",
        status: isPaid ? "PAID" : "FAILED",
        rawPayload: payload
      }
    });

    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: isPaid ? "PAID" : "FAILED",
        cashfreePaymentId: paymentId || payment.cashfreePaymentId,
        paymentMethod: verifiedPayment.payment_group || "upi",
        webhookPayload: payload,
        paidAt: isPaid ? new Date() : null
      }
    });

    const invoice = await tx.invoice.update({
      where: { id: payment.invoiceId },
      data: { status: isPaid ? "PAID" : "PENDING" },
      include: {
        customer: true,
        payment: true,
        items: { include: { product: true } }
      }
    });

    if (isPaid) {
      await tx.invoiceItem.findMany({ where: { invoiceId: invoice.id } }).then((items) => Promise.all(
        items.map((item) => tx.inventory.updateMany({
          where: { productId: item.productId },
          data: { reservedStock: { decrement: item.quantity } }
        }))
      ));
    }

    return { invoice, payment: updatedPayment, isPaid };
  });

  if (updated.isPaid) emitInvoicePaid(updated.invoice);
  return updated;
};

export const listPayments = () => prisma.payment.findMany({
  orderBy: { createdAt: "desc" },
  include: { invoice: { include: { customer: true } }, transactions: true }
});
