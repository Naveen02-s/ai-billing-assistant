import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const [form, setForm] = useState({ email: "admin@smartbill.ai", password: "Admin@12345" });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="glass w-full max-w-md rounded-lg p-7">
        <h1 className="text-3xl font-extrabold text-white">Login</h1>
        <p className="mt-2 text-slate-400">Demo admin is prefilled after you run the seed.</p>
        <div className="mt-6 space-y-4">
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary mt-6 w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        <p className="mt-5 text-center text-sm text-slate-400">
          New here? <Link className="font-bold text-cyan-200" to="/register">Create an account</Link>
        </p>
      </motion.form>
    </div>
  );
}
