import { Link } from "react-router-dom";

export default function HeaderAdmin({
  sidebarOpen,
  setSidebarOpen,
  title,
}) {
  return (
    <header
      className="
        bg-blue-900/95
        backdrop-blur-md
        text-slate-50
        border-b border-blue-800/60
        fixed top-0 right-0 left-0 md:left-64
        h-16
        flex items-center justify-between
        px-6
        z-30
        transition-all duration-300
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* MOBILE MENU */}
        <button
          type="button"
          className="
            md:hidden
            text-lg
            text-slate-300
            hover:text-slate-50
            transition-colors
            cursor-pointer
            p-1
          "
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Abrir menu"
        >
          <i className="fas fa-bars-staggered"></i>
        </button>

        <div className="hidden sm:block h-6 w-px bg-blue-800/80"></div>

        <div>
          <h2 className="text-base font-bold text-slate-50 tracking-tight">
            {title}
          </h2>
          <p className="hidden md:block text-[10px] text-sky-400/80 uppercase tracking-wider font-semibold">
            Condomínio Kizomba
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-slate-50 font-bold leading-tight">
              Adriano
            </p>
            <p className="text-[10px] text-sky-400/80 uppercase font-bold tracking-wider">
              Administrador
            </p>
          </div>

          <Link
            to="/dashboard/admin/perfil"
            className="
              w-9 h-9
              bg-slate-50
              text-blue-900
              rounded-lg
              flex items-center justify-center
              hover:bg-blue-800 hover:text-slate-50
              transition-all duration-200
              shadow-sm
              border border-blue-800/40
            "
            aria-label="Perfil do administrador"
          >
            <i className="fas fa-user-shield text-sm"></i>
          </Link>
        </div>
      </div>
    </header>
  );
}
