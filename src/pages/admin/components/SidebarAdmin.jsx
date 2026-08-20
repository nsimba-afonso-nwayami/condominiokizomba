import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logout } from "../../../services/authService";

export default function SidebarAdmin({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const linkStyle =
    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 font-semibold text-xs sm:text-sm";

  const normalStyle =
    "text-slate-300/80 hover:text-slate-50 hover:bg-blue-800/60";

  const activeStyle =
    "bg-blue-800 text-slate-50 font-bold border-l-4 border-sky-400 shadow-sm";

  const closeSidebarMobile = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();

    setSidebarOpen(false);

    toast.success("Sessão terminada com sucesso.");

    navigate("/login", { replace: true });
  };

  return (
    <>
      <aside
        className={`
          bg-blue-900 border-r border-blue-800/60
          w-64 fixed top-0 left-0 h-screen
          transition-transform duration-300 overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
          md:translate-x-0
          z-50 flex flex-col
          p-5
        `}
      >
        {/* CLOSE MOBILE */}
        <button
          type="button"
          className="md:hidden absolute top-4 right-4 text-base text-slate-300 hover:text-slate-50 transition-colors cursor-pointer p-1"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* LOGO */}
        <div className="mb-8 pt-1">
          <Link
            to="/dashboard/admin/"
            onClick={closeSidebarMobile}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 bg-slate-50 text-blue-900 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <i className="fas fa-building-shield text-base"></i>
            </div>

            <div>
              <span className="text-base font-bold tracking-tight text-slate-50 block leading-none">
                Condomínio
              </span>
              <span className="text-xs font-semibold text-sky-400">
                Kizomba
              </span>
            </div>
          </Link>

          <p className="text-[10px] text-slate-400 mt-4 uppercase font-semibold tracking-wider">
            Painel Administrativo
          </p>
        </div>

        {/* NAV */}
        <nav className="space-y-1.5 flex-1">
          {/* INÍCIO */}
          <Link
            to="/dashboard/admin/"
            onClick={closeSidebarMobile}
            className={`${linkStyle} ${
              isActive("/dashboard/admin/") ? activeStyle : normalStyle
            }`}
          >
            <i
              className={`fas fa-gauge-high text-sm ${
                isActive("/dashboard/admin/")
                  ? "text-slate-50"
                  : "text-sky-400/80"
              }`}
            ></i>
            <span>Início</span>
          </Link>

          {/* GESTÃO DE EVENTOS */}
          <Link
            to="/dashboard/admin/eventos"
            onClick={closeSidebarMobile}
            className={`${linkStyle} ${
              isActive("/dashboard/admin/eventos") ? activeStyle : normalStyle
            }`}
          >
            <i
              className={`fas fa-calendar-days text-sm ${
                isActive("/dashboard/admin/eventos")
                  ? "text-slate-50"
                  : "text-sky-400/80"
              }`}
            ></i>
            <span>Gestão de Eventos</span>
          </Link>

          {/* GESTÃO DE USUÁRIOS */}
          <Link
            to="/dashboard/admin/usuarios"
            onClick={closeSidebarMobile}
            className={`${linkStyle} ${
              isActive("/dashboard/admin/usuarios") ? activeStyle : normalStyle
            }`}
          >
            <i
              className={`fas fa-users text-sm ${
                isActive("/dashboard/admin/usuarios")
                  ? "text-slate-50"
                  : "text-sky-400/80"
              }`}
            ></i>
            <span>Gestão de Usuários</span>
          </Link>

          {/* PERFIL */}
          <Link
            to="/dashboard/admin/perfil"
            onClick={closeSidebarMobile}
            className={`${linkStyle} ${
              isActive("/dashboard/admin/perfil") ? activeStyle : normalStyle
            }`}
          >
            <i
              className={`fas fa-user-shield text-sm ${
                isActive("/dashboard/admin/perfil")
                  ? "text-slate-50"
                  : "text-sky-400/80"
              }`}
            ></i>
            <span>Perfil do Admin</span>
          </Link>
        </nav>

        {/* LOGOUT */}
        <div className="pt-4 border-t border-blue-800/60">
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex items-center gap-3
              cursor-pointer w-full
              px-3.5 py-2.5 rounded-lg
              text-slate-300/80
              hover:text-slate-50
              hover:bg-red-500/10
              transition-colors duration-200
              font-semibold text-xs sm:text-sm
              group
            "
          >
            <i className="fas fa-arrow-right-from-bracket group-hover:translate-x-0.5 transition-transform text-red-500 text-sm"></i>
            <span>Sair da conta</span>
          </button>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="
            fixed inset-0
            bg-slate-950/60
            backdrop-blur-sm
            md:hidden
            z-40
            transition-opacity duration-300
          "
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
