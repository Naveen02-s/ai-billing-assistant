import prisma from "../lib/prisma.js";
import { asyncHandler } from "../lib/asyncHandler.js";

export const getDashboard = asyncHandler(async (_req, res) => {
  const [paid, sales, customers, products, pending, inventoryRows, recentTransactions] = await Promise.all([
    prisma.invoice.aggregate({ where: { status: "PAID" }, _sum: { totalAmount: true } }),
    prisma.invoice.count({ where: { status: "PAID" } }),
    prisma.customer.count(),
    prisma.product.count(),
    prisma.invoice.count({ where: { status: "PENDING" } }),
    prisma.inventory.findMany({ include: { product: true } }),
    prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { payment: { include: { invoice: { include: { customer: true } } } } }
    })
  ]);

  const lowStock = inventoryRows
    .filter((item) => item.stock <= item.lowStockLevel)
    .slice(0, 8);

  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "asc" },
    take: 80,
    select: { createdAt: true, totalAmount: true, status: true }
  });

  const revenueByDay = invoices.reduce((acc, invoice) => {
    const key = invoice.createdAt.toISOString().slice(0, 10);
    acc[key] = acc[key] || { date: key, revenue: 0, pending: 0 };
    if (invoice.status === "PAID") acc[key].revenue += Number(invoice.totalAmount);
    if (invoice.status === "PENDING") acc[key].pending += Number(invoice.totalAmount);
    return acc;
  }, {});

  res.json({
    metrics: {
      totalRevenue: Number(paid._sum.totalAmount || 0),
      totalSales: sales,
      totalCustomers: customers,
      totalProducts: products,
      pendingPayments: pending,
      lowStockAlerts: lowStock.length
    },
    lowStock,
    recentTransactions,
    revenueChart: Object.values(revenueByDay)
  });
});
