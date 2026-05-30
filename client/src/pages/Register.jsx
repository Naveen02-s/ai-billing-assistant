import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Cashier" });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="glass w-full max-w-md rounded-lg p-7">
        <h1 className="text-3xl font-extrabold text-white">Create account</h1>
        <p className="mt-2 text-slate-400">Invite your billing team with role-aware access.</p>
        <div className="mt-6 space-y-4">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option>Cashier</option>
            <option>Manager</option>
            <option>Admin</option>
          </select>
        </div>
        <button className="btn btn-primary mt-6 w-full" disabled={loading}>{loading ? "Creating..." : "Create workspace"}</button>
        <p className="mt-5 text-center text-sm text-slate-400">
          Already have access? <Link className="font-bold text-cyan-200" to="/login">Login</Link>
        </p>
      </motion.form>
    </div>
  );
}
