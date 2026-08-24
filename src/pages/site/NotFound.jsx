import { Link } from "react-router-dom";
import ErrorBg from "../../assets/img/404.jpg";

export default function NotFound() {
  return (
    <>
      <title>404 | Página não encontrada | Gestão de Eventos</title>

      <section
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-6 py-10"
        style={{
          backgroundImage: `url(${ErrorBg})`,
        }}
      >
        {/* Overlay */}

        <div className="absolute inset-0 bg-slate-950/85" />

        {/* Conteúdo */}

        <div className="relative z-10 w-full max-w-2xl text-center text-white">
          {/* 404 */}

          <h1 className="text-8xl font-black tracking-tight sm:text-9xl">
            404
          </h1>

          {/* Título */}

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            Página não encontrada
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-400">
            Page not found
          </p>

          {/* Descrição */}

          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
            A página que procura não existe ou pode ter sido movida. Verifique o
            endereço ou volte para a página inicial.
          </p>

          <p className="mx-auto mt-1 max-w-lg text-xs leading-relaxed text-slate-500 sm:text-sm">
            The page you are looking for does not exist or may have been moved.
            Check the address or return to the home page.
          </p>

          {/* Botão */}

          <div className="mt-8 flex justify-center">
            <Link
              to="/"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-red-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Voltar para o início / Back to home
            </Link>
          </div>

          {/* Identificação */}

          <div className="mt-8 border-t border-white/10 pt-5">
            <p className="text-xs font-semibold text-slate-400">
              Sistema de Gestão de Eventos
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Event Management System
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
