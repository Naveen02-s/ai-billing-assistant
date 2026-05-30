import { create } from "zustand";
import api from "../api/client";

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("smartbill_user") || "null"),
  token: localStorage.getItem("smartbill_token"),
  loading: false,
  isAuthenticated: () => Boolean(get().token),
  login: async (credentials) => {
    set({ loading: true });
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("smartbill_token", data.token);
    localStorage.setItem("smartbill_user", JSON.stringify(data.user));
    set({ user: data.user, token: data.token, loading: false });
  },
  register: async (payload) => {
    set({ loading: true });
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("smartbill_token", data.token);
    localStorage.setItem("smartbill_user", JSON.stringify(data.user));
    set({ user: data.user, token: data.token, loading: false });
  },
  logout: () => {
    localStorage.removeItem("smartbill_token");
    localStorage.removeItem("smartbill_user");
    set({ user: null, token: null });
  }
}));
