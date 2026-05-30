import { Inbox } from "lucide-react";

export default function EmptyState({ title, subtitle }) {
  return (
    <div className="glass rounded-lg p-8 text-center">
      <Inbox className="mx-auto text-slate-500" size={36} />
      <h3 className="mt-4 font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}
