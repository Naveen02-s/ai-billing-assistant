import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { useBusinessStore } from "../stores/businessStore";

const emptyForm = { name: "", sku: "", description: "", price: "", taxRate: 18, categoryName: "", stock: 0, lowStockLevel: 5 };

export default function Products() {
  const { products, fetchCore, saveProduct, deleteProduct } = useBusinessStore();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchCore(); }, [fetchCore]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await saveProduct({ ...form, price: Number(form.price), stock: Number(form.stock), lowStockLevel: Number(form.lowStockLevel) });
      toast.success("Product saved");
      setModal(false);
      setForm(emptyForm);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save product");
    }
  };

  return (
    <>
      <PageHeader eyebrow="Inventory" title="Products" action={<button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={18} /> Add product</button>} />
      {products.length === 0 ? <EmptyState title="No products yet" subtitle="Add products to start creating smart invoices." /> : (
        <div className="glass overflow-hidden rounded-lg">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-900/80 text-slate-400">
              <tr><th className="table-cell">Product</th><th className="table-cell">SKU</th><th className="table-cell">Price</th><th className="table-cell">Stock</th><th className="table-cell">Category</th><th className="table-cell"></th></tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="table-cell font-bold text-white">{product.name}</td>
                  <td className="table-cell">{product.sku}</td>
                  <td className="table-cell">₹{Number(product.price).toLocaleString("en-IN")}</td>
                  <td className="table-cell">{product.inventory?.stock}</td>
                  <td className="table-cell">{product.category?.name || "Uncategorized"}</td>
                  <td className="table-cell text-right">
                    <button className="btn btn-secondary p-2" onClick={() => deleteProduct(product.id)} aria-label="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title="Add product" onClose={() => setModal(false)}>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
            {["name", "sku", "categoryName", "price", "stock", "lowStockLevel"].map((key) => (
              <input key={key} className="input" placeholder={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            ))}
            <textarea className="input md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="btn btn-primary md:col-span-2">Save product</button>
          </form>
        </Modal>
      )}
    </>
  );
}
