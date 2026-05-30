import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg"
      >
        <div className="flex items-center justify-between border-b border-slate-700/60 p-5">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button className="btn btn-secondary p-2" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );
}
