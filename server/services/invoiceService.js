import prisma from "../lib/prisma.js";
import { ApiError } from "../lib/apiError.js";
import { createCashfreeOrder, createUpiQrPayment } from "./cashfreeService.js";

const money = (value) => Number(Number(value).toFixed(2));

export const createInvoiceWithPayment = async ({ userId, payload }) => {
  const customer = await prisma.customer.findUnique({ where: { id: payload.customerId } });
  if (!customer) throw new ApiError(404, "Customer not found");

  const productIds = payload.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { inventory: true }
  });

  if (products.length !== productIds.length) {
    throw new ApiError(404, "One or more products were not found");
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  const invoiceItems = payload.items.map((item) => {
    const product = productMap.get(item.productId);
    if (product.inventory && product.inventory.stock < item.quantity) {
      throw new ApiError(409, `${product.name} does not have enough stock`);
    }

    const unitPrice = money(product.price);
    const taxable = money(unitPrice * item.quantity);
    const tax = money(taxable * (Number(product.taxRate) / 100));

    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice,
      taxRate: Number(product.taxRate),
      lineTotal: money(taxable + tax)
    };
  });

  const subtotal = money(invoiceItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0));
  const taxAmount = money(invoiceItems.reduce((sum, item) => {
    const taxable = item.unitPrice * item.quantity;
    return sum + taxable * (item.taxRate / 100);
  }, 0));
  const discountAmount = money(payload.discountAmount || 0);
  const totalAmount = money(Math.max(subtotal + taxAmount - discountAmount, 0));
  const invoiceNumber = `SB-${Date.now()}`;

  const invoice = await prisma.$transaction(async (tx) => {
    const created = await tx.invoice.create({
      data: {
        invoiceNumber,
        customerId: payload.customerId,
        userId,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        dueDate: payload.dueDate || null,
        notes: payload.notes || null,
        items: { create: invoiceItems }
      },
      include: { customer: true, items: { include: { product: true } } }
    });

    for (const item of payload.items) {
      await tx.inventory.updateMany({
        where: { productId: item.productId },
        data: { stock: { decrement: item.quantity }, reservedStock: { increment: item.quantity } }
      });
    }

    return created;
  });

  const order = await createCashfreeOrder({ invoice, customer });
  const qr = await createUpiQrPayment({
    paymentSessionId: order.payment_session_id,
    invoiceId: invoice.id
  });

  return prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      amount: totalAmount,
      cashfreeOrderId: order.order_id,
      cashfreeCfOrderId: String(order.cf_order_id || ""),
      paymentSessionId: order.payment_session_id,
      cashfreePaymentId: String(qr.cf_payment_id || ""),
      paymentMethod: "upi",
      qrPayload: qr.qrPayload,
      qrImageDataUrl: qr.qrImageDataUrl
    },
    include: {
      invoice: {
        include: {
          customer: true,
          items: { include: { product: true } }
        }
      }
    }
  });
};

export const listInvoices = () => prisma.invoice.findMany({
  orderBy: { createdAt: "desc" },
  include: {
    customer: true,
    payment: true,
    items: { include: { product: true } }
  }
});

export const getInvoiceById = (id) => prisma.invoice.findUnique({
  where: { id },
  include: {
    customer: true,
    payment: true,
    items: { include: { product: true } }
  }
});
