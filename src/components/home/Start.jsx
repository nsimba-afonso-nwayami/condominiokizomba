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
              Sistema de Gestão de Acesso
            </p>

            <p className="mt-1 text-xs text-slate-400">
              QR Code Access Management System
            </p>
          </div>

          {/* TÍTULO */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Gere QR Codes para
            <span className="block text-blue-500">acessos ao condomínio.</span>
          </h1>

          <p className="mt-2 text-lg font-medium text-slate-300 sm:text-xl">
            Generate QR Codes for condominium access.
          </p>

          {/* DESCRIÇÃO */}
          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Crie códigos QR de acesso para moradores e convidados de forma
            simples, rápida e organizada.
          </p>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Create access QR Codes for residents and guests quickly and
            efficiently.
          </p>

          {/* CTA */}
          <div className="mt-9">
            <Link
              to="/login"
              className="inline-flex cursor-pointer items-center rounded-xl bg-red-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <span>Gerar QR Code / Generate QR Code</span>
            </Link>
          </div>

          {/* RODAPÉ DA ÁREA */}
          <div className="mt-12 border-t border-white/10 pt-5">
            <p className="text-xs text-slate-500">
              Acesso seguro e organizado para moradores e convidados.
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Secure and organized access for residents and guests.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
