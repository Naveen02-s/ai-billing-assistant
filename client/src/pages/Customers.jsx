import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import { useBusinessStore } from "../stores/businessStore";

const emptyForm = { name: "", email: "", phone: "", company: "", gstin: "", address: "" };

export default function Customers() {
  const { customers, fetchCore, saveCustomer } = useBusinessStore();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchCore(); }, [fetchCore]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await saveCustomer(form);
      toast.success("Customer saved");
      setModal(false);
      setForm(emptyForm);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save customer");
    }
  };

  return (
    <>
      <PageHeader eyebrow="CRM" title="Customers" action={<button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={18} /> Add customer</button>} />
      {customers.length === 0 ? <EmptyState title="No customers yet" subtitle="Create customer profiles with purchase history and dues." /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {customers.map((customer) => {
            const outstanding = customer.invoices?.filter((item) => item.status === "PENDING").reduce((sum, item) => sum + Number(item.totalAmount), 0) || 0;
            return (
              <div key={customer.id} className="glass rounded-lg p-5">
                <p className="font-bold text-white">{customer.name}</p>
                <p className="mt-1 text-sm text-slate-400">{customer.company || customer.email}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-950/70 p-3"><p className="text-slate-500">Invoices</p><p className="font-bold text-white">{customer.invoices?.length || 0}</p></div>
                  <div className="rounded-lg bg-slate-950/70 p-3"><p className="text-slate-500">Dues</p><p className="font-bold text-white">₹{outstanding.toLocaleString("en-IN")}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal title="Add customer" onClose={() => setModal(false)}>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
            {Object.keys(emptyForm).map((key) => (
              <input key={key} className="input" placeholder={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            ))}
            <button className="btn btn-primary md:col-span-2">Save customer</button>
          </form>
        </Modal>
      )}
    </>
  );
}
