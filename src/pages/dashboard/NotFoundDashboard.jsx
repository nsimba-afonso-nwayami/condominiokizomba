import { Link } from "react-router-dom";

export default function NotFoundDashboard() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-lg text-center">
        {/* ÍCONE */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <i className="fa-solid fa-file-circle-exclamation text-3xl" />
        </div>

        {/* CÓDIGO */}
        <p className="mt-6 text-7xl font-black tracking-tight text-blue-800">
          404
        </p>

        {/* TÍTULO */}
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Página não encontrada
        </h1>

        {/* DESCRIÇÃO */}
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          A página que procuras não existe ou foi removida. Verifica o endereço
          ou volta ao painel principal.
        </p>

        {/* AÇÃO */}
        <div className="mt-7">
          <Link
            to="/my-dashboard"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <i className="fa-solid fa-house" />
            Voltar ao Dashboard
          </Link>
        </div>

        {/* DETALHE */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <i className="fa-solid fa-qrcode text-blue-700" />
          <span>Condomínio Kizomba</span>
        </div>
      </div>
    </section>
  );
}

