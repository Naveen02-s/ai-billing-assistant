import { create } from "zustand";
import api from "../api/client";

export const useBusinessStore = create((set, get) => ({
  products: [],
  customers: [],
  invoices: [],
  payments: [],
  dashboard: null,
  analytics: null,
  loading: false,
  fetchCore: async () => {
    set({ loading: true });
    const [products, customers, invoices, payments] = await Promise.all([
      api.get("/products"),
      api.get("/customers"),
      api.get("/invoices"),
      api.get("/payments")
    ]);
    set({
      products: products.data,
      customers: customers.data,
      invoices: invoices.data,
      payments: payments.data,
      loading: false
    });
  },
  fetchDashboard: async () => {
    const { data } = await api.get("/dashboard");
    set({ dashboard: data });
  },
  fetchAnalytics: async () => {
    const { data } = await api.get("/analytics");
    set({ analytics: data });
  },
  saveProduct: async (payload, id) => {
    const { data } = id ? await api.put(`/products/${id}`, payload) : await api.post("/products", payload);
    const products = id
      ? get().products.map((item) => (item.id === id ? data : item))
      : [data, ...get().products];
    set({ products });
  },
  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`);
    set({ products: get().products.filter((item) => item.id !== id) });
  },
  saveCustomer: async (payload, id) => {
    const { data } = id ? await api.put(`/customers/${id}`, payload) : await api.post("/customers", payload);
    const customers = id
      ? get().customers.map((item) => (item.id === id ? data : item))
      : [data, ...get().customers];
    set({ customers });
  },
  createInvoice: async (payload) => {
    const { data } = await api.post("/invoices", payload);
    await get().fetchCore();
    return data;
  },
  upsertPaidInvoice: (invoice) => {
    set({
      invoices: get().invoices.map((item) => (item.id === invoice.id ? invoice : item)),
      payments: get().payments.map((item) => (
        item.invoiceId === invoice.id ? { ...item, paymentStatus: "PAID", invoice } : item
      ))
    });
  }
}));
