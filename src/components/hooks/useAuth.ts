import { create } from "zustand";

interface AuthStateType {
  user: User | null;
  setAuth: (value: User) => void;
  logout: () => void;
}

export const useAuthSore = create<AuthStateType>((set) => ({
  user: JSON.parse(localStorage.getItem("user")!),

  setAuth: (value: User) => {
    set(() => {
      localStorage.setItem("user", JSON.stringify(value));
      return { user: value };
    });
  },

  logout: () => {
    set(() => {
      localStorage.removeItem("user");
      return { user: null };
    });
  },
}));
