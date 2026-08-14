import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/authStorage";

export default function PrivateRoute() {
  const authenticated = isAuthenticated();
  const location = useLocation();

  /*if (!authenticated) {
    return <Navigate to="/login" replace />;
  }*/

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
