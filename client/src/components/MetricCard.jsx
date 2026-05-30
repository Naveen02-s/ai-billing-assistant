import { motion } from "framer-motion";

export default function MetricCard({ icon: Icon, label, value, hint }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-lg p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          {hint && <p className="mt-2 text-xs text-cyan-200">{hint}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg border border-indigo-400/20 bg-indigo-500/10 p-3 text-indigo-200">
            <Icon size={20} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
