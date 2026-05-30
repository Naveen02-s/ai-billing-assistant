const styles = {
  PAID: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  PENDING: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  FAILED: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  OVERDUE: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  CANCELLED: "border-slate-400/30 bg-slate-400/10 text-slate-200"
};

export default function StatusPill({ status }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
}
