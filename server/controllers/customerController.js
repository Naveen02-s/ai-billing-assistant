import prisma from "../lib/prisma.js";
import { asyncHandler } from "../lib/asyncHandler.js";

export const listCustomers = asyncHandler(async (_req, res) => {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { invoices: { include: { payment: true } } }
  });
  res.json(customers);
});

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await prisma.customer.create({ data: req.body });
  res.status(201).json(customer);
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await prisma.customer.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(customer);
});

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where: { id: req.params.id },
    include: {
      invoices: {
        orderBy: { createdAt: "desc" },
        include: { payment: true, items: { include: { product: true } } }
      }
    }
  });
  res.json(customer);
});
