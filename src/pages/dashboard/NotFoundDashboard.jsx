import { Link } from "react-router-dom";

export default function NotFoundDashboard() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-lg text-center">
        {/* CÓDIGO */}
        <p className="text-7xl font-black tracking-tight text-blue-800">404</p>

        {/* TÍTULO */}
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Página não encontrada
        </h1>

        <p className="mt-1 text-sm font-medium text-slate-500">
          Page not found
        </p>

        {/* DESCRIÇÃO */}
        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-slate-500">
          A página que procura não existe ou foi removida. Verifique o endereço
          ou volte ao painel principal.
        </p>

        <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-400">
          The page you are looking for does not exist or has been removed. Check
          the address or return to the main dashboard.
        </p>

        {/* AÇÃO */}
        <div className="mt-8">
          <Link
            to="/my-dashboard"
            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-blue-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Voltar ao Dashboard / Back to Dashboard
          </Link>
        </div>

        {/* IDENTIFICAÇÃO */}
        <div className="mt-8 border-t border-slate-200 pt-5">
          <p className="text-xs font-semibold text-slate-500">
            Sistema de Gestão de Acesso
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            QR Code Access Management System
          </p>
        </div>
      </div>
    </section>
  );
}
