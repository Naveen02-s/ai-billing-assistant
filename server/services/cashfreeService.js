import axios from "axios";
import crypto from "crypto";
import QRCode from "qrcode";
import { nanoid } from "nanoid";
import { ApiError } from "../lib/apiError.js";

const apiVersion = () => process.env.CASHFREE_API_VERSION || "2025-01-01";
const baseUrl = () => process.env.CASHFREE_ENV === "production"
  ? "https://api.cashfree.com/pg"
  : "https://sandbox.cashfree.com/pg";

const cashfreeClient = () => axios.create({
  baseURL: baseUrl(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-version": apiVersion(),
    "x-client-id": process.env.CASHFREE_CLIENT_ID,
    "x-client-secret": process.env.CASHFREE_CLIENT_SECRET
  }
});

const getCashfreeErrorMessage = (error) => (
  error.response?.data?.message ||
  error.response?.data?.error_description ||
  error.response?.data?.error ||
  error.message ||
  "Cashfree request failed"
);

const ensureCredentials = () => {
  if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
    throw new ApiError(500, "Cashfree credentials are not configured");
  }
};

export const createCashfreeOrder = async ({ invoice, customer }) => {
  ensureCredentials();

  const orderId = `INV-${invoice.invoiceNumber}-${nanoid(8)}`;
  const payload = {
    order_id: orderId,
    order_amount: Number(invoice.totalAmount),
    order_currency: "INR",
    customer_details: {
      customer_id: customer.id,
      customer_name: customer.name,
      customer_email: customer.email || "customer@example.com",
      customer_phone: customer.phone
    },
    order_meta: {
      notify_url: process.env.CASHFREE_NOTIFY_URL,
      return_url: `${process.env.CLIENT_URL}/invoices/${invoice.id}`
    },
    order_note: `Invoice ${invoice.invoiceNumber}`
  };

  try {
    const { data } = await cashfreeClient().post("/orders", payload, {
      headers: {
        "x-request-id": nanoid(),
        "x-idempotency-key": invoice.id
      }
    });

    return data;
  } catch (error) {
    console.error("Cashfree order creation failed:", error.response?.status, error.response?.data || error.message);
    throw new ApiError(502, getCashfreeErrorMessage(error));
  }
};

export const createUpiQrPayment = async ({ paymentSessionId, invoiceId }) => {
  ensureCredentials();

  const expiry = new Date(Date.now() + 2 * 60 * 1000).toISOString();

  try {
    const { data } = await cashfreeClient().post(
      "/orders/sessions",
      {
        payment_session_id: paymentSessionId,
        transaction_expiry_time: expiry,
        payment_method: {
          upi: {
            channel: "qrcode"
          }
        }
      },
      {
        headers: {
          "x-request-id": nanoid(),
          "x-idempotency-key": `upi-qr-${invoiceId}`
        }
      }
    );

    const qrPayload = data?.data?.payload?.qrcode || data?.data?.url || null;

    if (!qrPayload) {
      throw new ApiError(502, "Cashfree did not return a UPI QR payload");
    }

    const qrImageDataUrl = String(qrPayload).startsWith("data:image/")
      ? qrPayload
      : await QRCode.toDataURL(String(qrPayload), {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 512
      });

    return {
      ...data,
      qrPayload,
      qrImageDataUrl
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;

    console.error("Cashfree QR creation failed:", error.response?.status, error.response?.data || error.message);
    throw new ApiError(502, getCashfreeErrorMessage(error));
  }
};

export const verifyCashfreeWebhookSignature = ({ signature, timestamp, rawBody }) => {
  if (!signature || !timestamp || !rawBody) return false;

  const signedPayload = `${timestamp}${rawBody}`;
  const expected = crypto
    .createHmac("sha256", process.env.CASHFREE_CLIENT_SECRET)
    .update(signedPayload)
    .digest("base64");

  if (Buffer.byteLength(expected) !== Buffer.byteLength(signature)) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};

export const getCashfreePayment = async ({ orderId, paymentId }) => {
  ensureCredentials();
  const { data } = await cashfreeClient().get(`/orders/${orderId}/payments/${paymentId}`);
  return data;
};
