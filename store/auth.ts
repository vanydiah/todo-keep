import { create } from "zustand";

type AuthState = {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  setToken: (token) => {
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/`;
    set({ token });
    },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },
}));