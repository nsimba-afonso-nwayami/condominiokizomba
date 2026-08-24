import { Link } from "react-router-dom";
import HomeBg from "../../assets/img/home.jpg";

export default function Start() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-10"
      style={{
        backgroundImage: `url(${HomeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-slate-950/80" />

      {/* GRADIENTE */}
      <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/70 to-blue-950/60" />

      {/* CONTEÚDO */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="max-w-3xl">
          {/* IDENTIFICAÇÃO */}
          <div className="mb-7">
            <p className="text-sm font-semibold tracking-wide text-white">
              Sistema de Gestão de Eventos
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Event Management System
            </p>
          </div>

          {/* TÍTULO */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Crie e organize eventos
            <span className="block text-blue-500">
              com QR Codes.
            </span>
          </h1>

          <p className="mt-2 text-lg font-medium text-slate-300 sm:text-xl">
            Create and manage events with QR Codes.
          </p>

          {/* DESCRIÇÃO */}
          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Registe eventos, organize as informações dos participantes e
            gere QR Codes para facilitar a identificação e consulta dos
            dados do evento.
          </p>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Register events, organize participant information and generate
            QR Codes to simplify event identification and information access.
          </p>

          {/* CTA */}
          <div className="mt-9">
            <Link
              to="/login"
              className="inline-flex cursor-pointer items-center rounded-xl bg-red-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <span>Criar evento / Create Event</span>
            </Link>
          </div>

          {/* RODAPÉ DA ÁREA */}
          <div className="mt-12 border-t border-white/10 pt-5">
            <p className="text-xs text-slate-500">
              Gestão simples, organizada e segura dos seus eventos.
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Simple, organized and secure event management.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
