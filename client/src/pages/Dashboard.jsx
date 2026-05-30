import { useEffect } from "react";
import { IndianRupee, PackageSearch, Receipt, Users, WalletCards, Warehouse } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import toast from "react-hot-toast";
import MetricCard from "../components/MetricCard";
import PageHeader from "../components/PageHeader";
import StatusPill from "../components/StatusPill";
import { socket } from "../api/socket";
import { useBusinessStore } from "../stores/businessStore";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Dashboard() {
  const { dashboard, fetchDashboard, fetchCore } = useBusinessStore();

  useEffect(() => {
    fetchDashboard();
    fetchCore();
    socket.connect();
    socket.emit("dashboard:watch");
    socket.on("dashboard:refresh", () => {
      toast.success("Payment confirmed. Dashboard updated.");
      fetchDashboard();
      fetchCore();
    });
    return () => socket.off("dashboard:refresh");
  }, [fetchCore, fetchDashboard]);

  const metrics = dashboard?.metrics || {};

  return (
    <>
      <PageHeader eyebrow="Command center" title="Business dashboard" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard icon={IndianRupee} label="Total Revenue" value={formatCurrency(metrics.totalRevenue)} hint="Verified paid invoices" />
        <MetricCard icon={Receipt} label="Total Sales" value={metrics.totalSales || 0} />
        <MetricCard icon={Users} label="Customers" value={metrics.totalCustomers || 0} />
        <MetricCard icon={PackageSearch} label="Products" value={metrics.totalProducts || 0} />
        <MetricCard icon={WalletCards} label="Pending Payments" value={metrics.pendingPayments || 0} />
        <MetricCard icon={Warehouse} label="Low Stock Alerts" value={metrics.lowStockAlerts || 0} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_.8fr]">
        <section className="glass rounded-lg p-5">
          <h2 className="mb-4 text-lg font-bold text-white">Revenue trends</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <AreaChart data={dashboard?.revenueChart || []}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,.12)" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="url(#revenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass rounded-lg p-5">
          <h2 className="mb-4 text-lg font-bold text-white">Recent transactions</h2>
          <div className="space-y-3">
            {(dashboard?.recentTransactions || []).map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-white">{item.payment?.invoice?.customer?.name}</p>
                    <p className="text-sm text-slate-400">{formatCurrency(item.amount)}</p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
