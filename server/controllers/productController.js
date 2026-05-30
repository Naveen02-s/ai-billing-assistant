import prisma from "../lib/prisma.js";
import { asyncHandler } from "../lib/asyncHandler.js";

export const listProducts = asyncHandler(async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, inventory: true }
  });
  res.json(products);
});

export const createProduct = asyncHandler(async (req, res) => {
  const category = req.body.categoryName
    ? await prisma.category.upsert({
      where: { name: req.body.categoryName },
      update: {},
      create: { name: req.body.categoryName }
    })
    : null;

  const product = await prisma.product.create({
    data: {
      name: req.body.name,
      sku: req.body.sku,
      description: req.body.description,
      price: req.body.price,
      taxRate: req.body.taxRate,
      categoryId: category?.id,
      inventory: {
        create: {
          stock: req.body.stock,
          lowStockLevel: req.body.lowStockLevel
        }
      }
    },
    include: { category: true, inventory: true }
  });

  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const category = req.body.categoryName
    ? await prisma.category.upsert({
      where: { name: req.body.categoryName },
      update: {},
      create: { name: req.body.categoryName }
    })
    : null;

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      name: req.body.name,
      sku: req.body.sku,
      description: req.body.description,
      price: req.body.price,
      taxRate: req.body.taxRate,
      categoryId: category?.id,
      inventory: {
        upsert: {
          update: { stock: req.body.stock, lowStockLevel: req.body.lowStockLevel },
          create: { stock: req.body.stock, lowStockLevel: req.body.lowStockLevel }
        }
      }
    },
    include: { category: true, inventory: true }
  });

  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
