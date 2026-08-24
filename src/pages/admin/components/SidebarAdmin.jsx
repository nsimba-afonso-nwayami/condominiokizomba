import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logout } from "../../../services/authService";

export default function SidebarAdmin({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const linkStyle =
    "flex items-center gap-3 rounded-lg px-3.5 py-2.5 font-semibold text-xs transition-all duration-200 sm:text-sm";

  const normalStyle =
    "text-slate-300/80 hover:bg-blue-800/60 hover:text-slate-50";

  const activeStyle =
    "border-l-4 border-sky-400 bg-blue-800 font-bold text-slate-50 shadow-sm";

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
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          overflow-y-auto border-r border-blue-800/60 bg-blue-900 p-5
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
          md:translate-x-0
        `}
      >
        {/* CLOSE MOBILE */}
        <button
          type="button"
          className="absolute right-4 top-4 cursor-pointer p-1 text-base text-slate-300 transition-colors hover:text-slate-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* LOGO / IDENTIDADE */}
        <div className="mb-8 pt-1">
          <Link
            to="/dashboard/admin/"
            onClick={closeSidebarMobile}
            className="block"
          >
            <span className="block text-base font-bold leading-none tracking-tight text-slate-50">
              Sistema de Gestão
            </span>

            <span className="mt-1 block text-xs font-semibold text-sky-400">
              de Acesso
            </span>
          </Link>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Painel Administrativo
          </p>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-1.5">
          {/* INÍCIO */}
          <Link
            to="/dashboard/admin/"
            onClick={closeSidebarMobile}
            className={`${linkStyle} ${
              isActive("/dashboard/admin/") ? activeStyle : normalStyle
            }`}
          >
            <i
              className={`fas fa-house w-4 text-sm ${
                isActive("/dashboard/admin/")
                  ? "text-slate-50"
                  : "text-sky-400/80"
              }`}
            />

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
              className={`fas fa-calendar-days w-4 text-sm ${
                isActive("/dashboard/admin/eventos")
                  ? "text-slate-50"
                  : "text-sky-400/80"
              }`}
            />

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
              className={`fas fa-users w-4 text-sm ${
                isActive("/dashboard/admin/usuarios")
                  ? "text-slate-50"
                  : "text-sky-400/80"
              }`}
            />

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
              className={`fas fa-user-shield w-4 text-sm ${
                isActive("/dashboard/admin/perfil")
                  ? "text-slate-50"
                  : "text-sky-400/80"
              }`}
            />

            <span>Perfil do Admin</span>
          </Link>
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-blue-800/60 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="
              group flex w-full cursor-pointer items-center gap-3
              rounded-lg px-3.5 py-2.5
              text-xs font-semibold text-slate-300/80
              transition-colors duration-200
              hover:bg-red-500/10 hover:text-slate-50
              sm:text-sm
            "
          >
            <i className="fas fa-arrow-right-from-bracket text-sm text-red-500 transition-transform group-hover:translate-x-0.5" />

            <span>Sair da conta</span>
          </button>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="
            fixed inset-0 z-40
            bg-slate-950/60
            backdrop-blur-sm
            transition-opacity duration-300
            md:hidden
          "
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
