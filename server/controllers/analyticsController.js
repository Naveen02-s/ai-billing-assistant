import prisma from "../lib/prisma.js";
import { asyncHandler } from "../lib/asyncHandler.js";

export const getAnalytics = asyncHandler(async (_req, res) => {
  const [invoices, items, customers] = await Promise.all([
    prisma.invoice.findMany({ include: { payment: true } }),
    prisma.invoiceItem.findMany({ include: { product: true } }),
    prisma.customer.findMany({ select: { createdAt: true } })
  ]);

  const monthlyRevenue = invoices.reduce((acc, invoice) => {
    const key = invoice.createdAt.toISOString().slice(0, 7);
    acc[key] = acc[key] || { month: key, revenue: 0, paid: 0, pending: 0 };
    if (invoice.status === "PAID") {
      acc[key].revenue += Number(invoice.totalAmount);
      acc[key].paid += 1;
    } else {
      acc[key].pending += 1;
    }
    return acc;
  }, {});

  const topProducts = Object.values(items.reduce((acc, item) => {
    acc[item.productId] = acc[item.productId] || {
      name: item.product.name,
      quantity: 0,
      revenue: 0
    };
    acc[item.productId].quantity += item.quantity;
    acc[item.productId].revenue += Number(item.lineTotal);
    return acc;
  }, {})).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  const customerGrowth = customers.reduce((acc, customer) => {
    const key = customer.createdAt.toISOString().slice(0, 7);
    acc[key] = acc[key] || { month: key, customers: 0 };
    acc[key].customers += 1;
    return acc;
  }, {});

  res.json({
    monthlyRevenue: Object.values(monthlyRevenue),
    topProducts,
    customerGrowth: Object.values(customerGrowth),
    paymentMix: [
      { name: "UPI", value: invoices.filter((i) => i.payment?.paymentMethod === "upi").length },
      { name: "Pending", value: invoices.filter((i) => i.status === "PENDING").length }
    ]
  });
});
