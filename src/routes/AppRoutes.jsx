import { Routes, Route } from "react-router-dom";

// Layout do site
import SiteLayout from "../layouts/SiteLayout";

//
//import PrivateRoute from "../routes/PrivateRoute";

//Site
import Home from "../pages/site/Home";
import NotFound from "../pages/site/NotFound";

//Autenticação
import Login from "../pages/auth/Login";

//Dashboard
import Dashboard from "../pages/dashboard/Dashboard";
import NotFoundDashboard from "../pages/dashboard/NotFoundDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/*Rotas do site */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/*Rotas de autenticação*/}
      <Route path="/login" element={<Login />} />

      <Route path="/my-dashboard/">
        <Route path="" element={<Dashboard />} />
        <Route path="*" element={<NotFoundDashboard />} />
      </Route>
    </Routes>
  );
}
