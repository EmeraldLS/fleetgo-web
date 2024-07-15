import { ReactNode } from "react";
import { useAuthSore } from "./hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuthSore();
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
}
