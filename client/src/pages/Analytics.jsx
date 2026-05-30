import { useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PageHeader from "../components/PageHeader";
import { useBusinessStore } from "../stores/businessStore";

export default function Analytics() {
  const { analytics, fetchAnalytics } = useBusinessStore();
  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  return (
    <>
      <PageHeader eyebrow="Insights" title="Analytics" />
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="glass rounded-lg p-5">
          <h2 className="mb-4 text-lg font-bold text-white">Monthly reports</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={analytics?.monthlyRevenue || []}>
                <CartesianGrid stroke="rgba(148,163,184,.12)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                <Legend />
                <Bar dataKey="revenue" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                <Bar dataKey="paid" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass rounded-lg p-5">
          <h2 className="mb-4 text-lg font-bold text-white">Top selling products</h2>
          <div className="space-y-3">
            {(analytics?.topProducts || []).map((product) => (
              <div key={product.name} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white">{product.name}</p>
                  <p className="text-cyan-200">₹{Number(product.revenue).toLocaleString("en-IN")}</p>
                </div>
                <p className="mt-1 text-sm text-slate-400">{product.quantity} units sold</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
