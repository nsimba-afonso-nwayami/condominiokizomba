import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCurrentUser } from "../../../services/userService";

export default function HeaderAdmin({ sidebarOpen, setSidebarOpen, title }) {
  const [user, setUser] = useState(null);

  // BUSCAR USUÁRIO AUTENTICADO
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getCurrentUser();

        setUser(response);
      } catch (error) {
        console.error(
          "[HeaderAdmin] ERRO AO BUSCAR USUÁRIO AUTENTICADO:",
          error,
        );
      }
    };

    fetchCurrentUser();
  }, []);

  // NOME DO USUÁRIO
  const userName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "Administrador";

  // TIPO DE CONTA
  const userRole = user?.is_superuser
    ? "Super Administrador"
    : user?.is_admin
      ? "Administrador"
      : "Usuário";

  return (
    <header
      className="
        fixed left-0 right-0 top-0 z-30
        flex h-16 items-center justify-between
        border-b border-blue-800/60
        bg-blue-900/95
        px-6
        text-slate-50
        backdrop-blur-md
        transition-all duration-300
        md:left-64
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* MOBILE MENU */}
        <button
          type="button"
          className="
            cursor-pointer p-1
            text-lg text-slate-300
            transition-colors
            hover:text-slate-50
            md:hidden
          "
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Abrir menu"
        >
          <i className="fas fa-bars-staggered" />
        </button>

        {/* SEPARADOR */}
        <div className="hidden h-6 w-px bg-blue-800/80 sm:block" />

        {/* TÍTULO */}
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-50">
            {title}
          </h2>

          <p className="hidden text-[10px] font-semibold uppercase tracking-wider text-sky-400/80 md:block">
            Sistema de Gestão de Acesso
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold leading-tight text-slate-50">
              {userName}
            </p>

            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400/80">
              {userRole}
            </p>
          </div>

          {/* PERFIL */}
          <Link
            to="/dashboard/admin/perfil"
            className="
              flex h-9 w-9
              cursor-pointer items-center justify-center
              rounded-full
              border border-blue-800/40
              bg-slate-50
              text-blue-900
              shadow-sm
              transition-colors duration-200
              hover:bg-blue-800
              hover:text-slate-50
            "
            aria-label="Perfil do administrador"
          >
            <i className="fas fa-user-shield text-sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}
