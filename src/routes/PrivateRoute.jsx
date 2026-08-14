import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/authStorage";

export default function PrivateRoute() {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
