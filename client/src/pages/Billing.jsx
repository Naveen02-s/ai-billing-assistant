import { useEffect, useMemo, useState } from "react";
import { Plus, Printer, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import StatusPill from "../components/StatusPill";
import { socket } from "../api/socket";
import { useBusinessStore } from "../stores/businessStore";

export default function Billing() {
  const { products, customers, fetchCore, createInvoice, upsertPaidInvoice } = useBusinessStore();
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCore(); }, [fetchCore]);

  useEffect(() => {
    if (!created?.invoice?.id) return undefined;
    socket.connect();
    socket.emit("invoice:watch", created.invoice.id);
    socket.on("payment:paid", (invoice) => {
      upsertPaidInvoice(invoice);
      setCreated((current) => current ? { ...current, invoice: { ...current.invoice, status: "PAID" } } : current);
      toast.success("Payment received. Invoice marked PAID.");
    });
    return () => socket.off("payment:paid");
  }, [created?.invoice?.id, upsertPaidInvoice]);

  const totals = useMemo(() => {
    return items.reduce((acc, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return acc;
      const subtotal = Number(product.price) * Number(item.quantity || 1);
      const tax = subtotal * (Number(product.taxRate) / 100);
      return { subtotal: acc.subtotal + subtotal, tax: acc.tax + tax, total: acc.total + subtotal + tax };
    }, { subtotal: 0, tax: 0, total: 0 });
  }, [items, products]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payment = await createInvoice({ customerId, items: items.filter((item) => item.productId), discountAmount: 0 });
      setCreated(payment);
      toast.success("Invoice and Cashfree UPI QR created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Point of sale" title="Create invoice" />
      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <form onSubmit={submit} className="glass rounded-lg p-5">
          <label className="text-sm font-bold text-slate-300">Customer</label>
          <select className="input mt-2" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
            <option value="">Select customer</option>
            {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
          </select>

          <div className="mt-6 space-y-3">
            {items.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3 md:grid-cols-[1fr_120px_44px]">
                <select className="input" value={item.productId} onChange={(e) => setItems(items.map((row, i) => i === index ? { ...row, productId: e.target.value } : row))} required>
                  <option value="">Select product</option>
                  {products.map((product) => <option key={product.id} value={product.id}>{product.name} - ₹{product.price}</option>)}
                </select>
                <input className="input" type="number" min="1" value={item.quantity} onChange={(e) => setItems(items.map((row, i) => i === index ? { ...row, quantity: Number(e.target.value) } : row))} />
                <button type="button" className="btn btn-secondary p-2" onClick={() => setItems(items.filter((_, i) => i !== index))} aria-label="Remove">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="btn btn-secondary mt-4" onClick={() => setItems([...items, { productId: "", quantity: 1 }])}>
            <Plus size={18} /> Add line item
          </button>

          <div className="mt-6 rounded-lg bg-slate-950/70 p-4">
            <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>₹{totals.subtotal.toLocaleString("en-IN")}</span></div>
            <div className="mt-2 flex justify-between text-slate-400"><span>Tax</span><span>₹{totals.tax.toLocaleString("en-IN")}</span></div>
            <div className="mt-3 flex justify-between text-xl font-extrabold text-white"><span>Total</span><span>₹{totals.total.toLocaleString("en-IN")}</span></div>
          </div>

          <button className="btn btn-primary mt-6 w-full" disabled={loading}>{loading ? "Creating Cashfree order..." : "Generate invoice and UPI QR"}</button>
        </form>

        <section className="glass rounded-lg p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Payment QR</h2>
            {created?.invoice && <StatusPill status={created.invoice.status} />}
          </div>
          {created ? (
            <div className="mt-5 text-center">
              <div className="mx-auto w-full max-w-sm rounded-lg bg-white p-4">
                <img className="w-full" src={created.qrImageDataUrl} alt="Cashfree UPI payment QR" />
              </div>
              <p className="mt-4 font-bold text-white">Invoice {created.invoice.invoiceNumber}</p>
              <p className="text-slate-400">Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI app.</p>
              <button className="btn btn-secondary mt-5" onClick={() => window.print()}><Printer size={18} /> Print invoice</button>
            </div>
          ) : (
            <div className="mt-10 rounded-lg border border-dashed border-slate-700 p-8 text-center text-slate-400">
              Create an invoice to receive a Cashfree-generated UPI QR.
            </div>
          )}
        </section>
      </div>
    </>
  );
}
