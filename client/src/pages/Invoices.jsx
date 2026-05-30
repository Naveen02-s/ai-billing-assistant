import { useEffect } from "react";
import { Download } from "lucide-react";
import api from "../api/client";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import StatusPill from "../components/StatusPill";
import { useBusinessStore } from "../stores/businessStore";

export default function Invoices() {
  const { invoices, fetchCore } = useBusinessStore();
  useEffect(() => { fetchCore(); }, [fetchCore]);

  const downloadPdf = async (invoice) => {
    const { data } = await api.get(`/invoices/${invoice.id}/pdf`, { responseType: "blob" });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoiceNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader eyebrow="Receivables" title="Invoice history" />
      {invoices.length === 0 ? <EmptyState title="No invoices yet" subtitle="Invoices will appear after billing." /> : (
        <div className="glass overflow-hidden rounded-lg">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-900/80 text-slate-400">
              <tr><th className="table-cell">Invoice</th><th className="table-cell">Customer</th><th className="table-cell">Amount</th><th className="table-cell">Items</th><th className="table-cell">Status</th><th className="table-cell">Created</th><th className="table-cell"></th></tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="table-cell font-bold text-white">{invoice.invoiceNumber}</td>
                  <td className="table-cell">{invoice.customer?.name}</td>
                  <td className="table-cell">₹{Number(invoice.totalAmount).toLocaleString("en-IN")}</td>
                  <td className="table-cell">{invoice.items?.length}</td>
                  <td className="table-cell"><StatusPill status={invoice.status} /></td>
                  <td className="table-cell">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td className="table-cell text-right">
                    <button className="btn btn-secondary p-2" onClick={() => downloadPdf(invoice)} aria-label="Download PDF">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
