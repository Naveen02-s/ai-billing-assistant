import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

const roles = ["Admin", "Manager", "Cashier"];

async function main() {
  for (const name of roles) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
  const password = await bcrypt.hash("Admin@12345", 12);

  await prisma.user.upsert({
    where: { email: "admin@smartbill.ai" },
    update: {},
    create: {
      name: "SmartBill Admin",
      email: "admin@smartbill.ai",
      password,
      roleId: adminRole.id
    }
  });

  const retail = await prisma.category.upsert({
    where: { name: "Retail" },
    update: {},
    create: { name: "Retail" }
  });

  const products = [
    { name: "Premium Coffee Beans", sku: "COF-001", price: 599, stock: 32 },
    { name: "Thermal Receipt Roll", sku: "POS-ROLL", price: 85, stock: 8 },
    { name: "Business Consultation", sku: "CONSULT-1H", price: 2500, stock: 999 }
  ];

  for (const item of products) {
    await prisma.product.upsert({
      where: { sku: item.sku },
      update: {},
      create: {
        name: item.name,
        sku: item.sku,
        price: item.price,
        categoryId: retail.id,
        inventory: { create: { stock: item.stock, lowStockLevel: 10 } }
      }
    });
  }

  await prisma.customer.upsert({
    where: { id: "demo-customer" },
    update: {},
    create: {
      id: "demo-customer",
      name: "Aster Retail Co.",
      email: "finance@aster.example",
      phone: "9876543210",
      company: "Aster Retail Co.",
      address: "Bengaluru, Karnataka"
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
