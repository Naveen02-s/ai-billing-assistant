import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(2).required(),
  sku: Joi.string().min(2).required(),
  description: Joi.string().allow("", null),
  price: Joi.number().positive().required(),
  taxRate: Joi.number().min(0).max(100).default(18),
  categoryName: Joi.string().allow("", null),
  stock: Joi.number().integer().min(0).default(0),
  lowStockLevel: Joi.number().integer().min(0).default(5)
});

export const customerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().allow("", null),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  company: Joi.string().allow("", null),
  gstin: Joi.string().allow("", null),
  address: Joi.string().allow("", null)
});

export const invoiceSchema = Joi.object({
  customerId: Joi.string().required(),
  discountAmount: Joi.number().min(0).default(0),
  dueDate: Joi.date().allow(null),
  notes: Joi.string().allow("", null),
  items: Joi.array().items(Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required()
  })).min(1).required()
});
