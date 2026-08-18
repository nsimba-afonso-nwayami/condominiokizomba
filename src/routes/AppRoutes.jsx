import { Routes, Route } from "react-router-dom";

// Layout do site
import SiteLayout from "../layouts/SiteLayout";

//Rotas privadas
import PrivateRoute from "../routes/PrivateRoute";

//Site
import Home from "../pages/site/Home";
import NotFound from "../pages/site/NotFound";

//Autenticação
import Login from "../pages/auth/Login";

//Dashboard
import Dashboard from "../pages/dashboard/Dashboard";
import Event from "../pages/dashboard/PublicEvent";
import PublicEvent from "../pages/dashboard/Event";
import NotFoundDashboard from "../pages/dashboard/NotFoundDashboard";

//Admin
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import EventosAdmin from "../pages/admin/EventosAdmin";

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

      <Route
        path="/evento/:id"
        element={<PublicEvent />}
      />
      <Route element={<PrivateRoute />}>
        <Route path="/my-dashboard/">
          <Route path="" element={<Dashboard />} />
          <Route path="evento/:id" element={<Event />} />
          <Route path="*" element={<NotFoundDashboard />} />
        </Route>
      </Route>

      <Route path="/dashboard/admin/">
        <Route path="" element={<DashboardAdmin />} />
        <Route path="eventos" element={<EventosAdmin />} />
        <Route path="*" element={<NotFoundDashboard />} />
      </Route>
    </Routes>
  );
}
