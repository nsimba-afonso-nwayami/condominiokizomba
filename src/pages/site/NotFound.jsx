import { Link } from "react-router-dom";
import ErrorBg from "../../assets/img/404.jpg";

export default function NotFound() {
  return (
    <>
      <title>Página não encontrada | Condomínio Kizonmba</title>

      <section
        className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-6 py-10"
        style={{
          backgroundImage: `url(${ErrorBg})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-950/80" />

        {/* Conteúdo */}
        <div className="relative z-10 w-full max-w-2xl text-center text-white">
          {/* Ícone */}
          <div className="mb-5 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-900/80 border border-blue-700/40">
              <i className="fa-solid fa-qrcode text-4xl text-sky-600" />
            </div>
          </div>

          {/* 404 */}
          <h1 className="text-8xl font-black tracking-tight text-white sm:text-9xl">
            404
          </h1>

          {/* Título */}
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            Página não encontrada
          </h2>

          {/* Descrição */}
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
            A página que procura não existe ou pode ter sido movida. Verifique o
            endereço ou volte para a página inicial.
          </p>

          {/* Botão */}
          <div className="mt-8 flex justify-center">
            <Link
              to="/"
              className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-red-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <i className="fa-solid fa-house" />
              Voltar para o início
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
