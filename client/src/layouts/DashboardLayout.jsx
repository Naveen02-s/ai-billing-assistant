import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  Settings,
  Sparkles,
  Users,
  X
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Boxes },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/billing", label: "Billing", icon: ReceiptText },
  { to: "/invoices", label: "Invoices", icon: FileText },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings }
];

function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-800/80 bg-slate-950/82 p-5 backdrop-blur-xl">
      <NavLink to="/" className="mb-8 flex items-center gap-3" onClick={onNavigate}>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-500 text-white shadow-glow">
          <Sparkles size={20} />
        </div>
        <div>
          <p className="font-extrabold text-white">SmartBill AI</p>
          <p className="text-xs text-slate-400">Billing command center</p>
        </div>
      </NavLink>

      <nav className="space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                isActive ? "bg-indigo-500/16 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/70" onClick={() => setOpen(false)} aria-label="Close menu" />
          <motion.div initial={{ x: -300 }} animate={{ x: 0 }} className="relative h-full">
            <Sidebar onNavigate={() => setOpen(false)} />
          </motion.div>
        </div>
      )}

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800/70 bg-slate-950/76 px-4 backdrop-blur-xl md:px-8">
          <button className="btn btn-secondary p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-slate-400">Realtime operations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
            <button className="btn btn-secondary p-2" onClick={handleLogout} aria-label="Logout">
              <LogOut size={18} />
            </button>
          </div>
          <button className="hidden" aria-label="Close"><X /></button>
        </header>
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
