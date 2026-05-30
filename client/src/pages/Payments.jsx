import { useEffect } from "react";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import StatusPill from "../components/StatusPill";
import { useBusinessStore } from "../stores/businessStore";

export default function Payments() {
  const { payments, fetchCore } = useBusinessStore();
  useEffect(() => { fetchCore(); }, [fetchCore]);

  return (
    <>
      <PageHeader eyebrow="Cashfree" title="Payment history" />
      {payments.length === 0 ? <EmptyState title="No payments yet" subtitle="Payment orders are created with every invoice." /> : (
        <div className="grid gap-4">
          {payments.map((payment) => (
            <div key={payment.id} className="glass rounded-lg p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-white">{payment.invoice?.invoiceNumber} · {payment.invoice?.customer?.name}</p>
                  <p className="mt-1 text-sm text-slate-400">Order: {payment.cashfreeOrderId}</p>
                  <p className="text-sm text-slate-400">Payment: {payment.cashfreePaymentId || "Awaiting webhook"}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xl font-extrabold text-white">₹{Number(payment.amount).toLocaleString("en-IN")}</p>
                  <div className="mt-2"><StatusPill status={payment.paymentStatus} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
