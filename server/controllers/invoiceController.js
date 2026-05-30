import { asyncHandler } from "../lib/asyncHandler.js";
import { createInvoiceWithPayment, getInvoiceById, listInvoices } from "../services/invoiceService.js";
import PDFDocument from "pdfkit";

export const createInvoice = asyncHandler(async (req, res) => {
  const payment = await createInvoiceWithPayment({ userId: req.user.id, payload: req.body });
  res.status(201).json(payment);
});

export const getInvoices = asyncHandler(async (_req, res) => {
  res.json(await listInvoices());
});

export const getInvoice = asyncHandler(async (req, res) => {
  res.json(await getInvoiceById(req.params.id));
});

export const exportInvoicePdf = asyncHandler(async (req, res) => {
  const invoice = await getInvoiceById(req.params.id);
  const doc = new PDFDocument({ margin: 48 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${invoice.invoiceNumber}.pdf"`);
  doc.pipe(res);

  doc.fontSize(22).text("SmartBill AI Invoice", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor("#555").text(`Invoice: ${invoice.invoiceNumber}`);
  doc.text(`Status: ${invoice.status}`);
  doc.text(`Customer: ${invoice.customer.name}`);
  doc.text(`Created: ${new Date(invoice.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  doc.fillColor("#111").fontSize(13).text("Items");
  doc.moveDown(0.5);
  invoice.items.forEach((item) => {
    doc.fontSize(10).text(`${item.product.name}  x ${item.quantity}  @ INR ${item.unitPrice}  = INR ${item.lineTotal}`);
  });

  doc.moveDown();
  doc.fontSize(11).text(`Subtotal: INR ${invoice.subtotal}`);
  doc.text(`Tax: INR ${invoice.taxAmount}`);
  doc.text(`Discount: INR ${invoice.discountAmount}`);
  doc.fontSize(16).text(`Total: INR ${invoice.totalAmount}`);

  doc.end();
});
