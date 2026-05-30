import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Bot, CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";

const features = [
  ["Cashfree UPI QR", "Generate provider-backed UPI QR payments with webhook-confirmed settlement.", CreditCard],
  ["Realtime Billing", "Socket.io pushes paid status to invoice screens and dashboards instantly.", Zap],
  ["AI-ready Core", "Clean folders and endpoints for future assistants, insights, and recommendations.", Bot],
  ["Secure Operations", "JWT, roles, webhook signatures, idempotency, and backend-only payment approval.", ShieldCheck]
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-500 shadow-glow">
            <Sparkles size={20} />
          </div>
          <span className="font-extrabold text-white">SmartBill AI</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#preview">Preview</a>
        </nav>
        <Link className="btn btn-secondary" to="/login">Login</Link>
      </header>

      <main>
        <section className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_.88fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mb-5 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-sm font-semibold text-cyan-200">
              AI-powered billing for modern businesses
            </p>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-tight text-white md:text-7xl">
              Smart billing, realtime payments, sharper business decisions.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A premium SaaS platform for invoices, inventory, customers, UPI QR payments, analytics, and future AI business intelligence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn btn-primary" to="/register">
                Start building <ArrowRight size={18} />
              </Link>
              <Link className="btn btn-secondary" to="/login">View dashboard</Link>
            </div>
          </motion.div>

          <motion.div
            id="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 }}
            className="glass rounded-lg p-4"
          >
            <div className="rounded-lg border border-slate-700/70 bg-slate-950/70 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Revenue today</p>
                  <p className="text-3xl font-bold text-white">₹84,250</p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-200">+18.4%</span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {["Paid", "Pending", "Low stock"].map((item, index) => (
                  <div key={item} className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
                    <p className="text-sm text-slate-400">{item}</p>
                    <p className="mt-2 text-xl font-bold text-white">{[42, 7, 3][index]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 h-48 rounded-lg border border-indigo-400/10 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-cyan-500/10 p-5">
                <div className="flex h-full items-end gap-2">
                  {[44, 70, 52, 90, 74, 112, 96, 132, 118, 154, 144].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ delay: index * 0.04 }}
                      className="w-full rounded-t bg-gradient-to-t from-indigo-500 to-cyan-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-4 md:grid-cols-4">
            {features.map(([title, text, Icon]) => (
              <motion.div whileHover={{ y: -4 }} key={title} className="glass rounded-lg p-5">
                <Icon className="text-cyan-200" />
                <h3 className="mt-4 font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 lg:grid-cols-3">
          {["Analytics Preview", "Billing Preview", "Testimonials"].map((title, index) => (
            <div key={title} className="glass rounded-lg p-6">
              <BarChart3 className="text-indigo-200" />
              <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
              <p className="mt-3 text-slate-400">
                {[
                  "Track revenue trends, product velocity, customer growth, and payment health.",
                  "Create invoices with multiple products, tax, stock updates, and printable records.",
                  "Built for founders, store teams, finance operators, and fast-moving service businesses."
                ][index]}
              </p>
            </div>
          ))}
        </section>

        <section id="pricing" className="mx-auto max-w-5xl px-5 py-16">
          <div className="glass rounded-lg p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Pricing</p>
            <h2 className="mt-3 text-4xl font-extrabold text-white">Launch-ready starter plan</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">Use the whole product locally, connect Neon and Cashfree, then deploy it as your portfolio-grade SaaS.</p>
            <div className="mt-7 text-5xl font-extrabold text-white">₹0 <span className="text-base text-slate-400">dev build</span></div>
            <Link className="btn btn-primary mt-8" to="/register">Create account</Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl border-t border-slate-800 px-5 py-8 text-sm text-slate-500">
        SmartBill AI. Built with React, Express, Prisma 6, PostgreSQL, Socket.io, and Cashfree.
      </footer>
    </div>
  );
}
