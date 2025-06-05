// src/routes/RequireAdmin.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const { user } = useSelector((state) => state.auth);
  return user?.isAdmin ? children : <Navigate to="/signin" />;
}
