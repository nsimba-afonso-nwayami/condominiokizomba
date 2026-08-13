import { Link } from "react-router-dom";
import HomeBg from "../../assets/img/home.jpg";

export default function Start() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-6 py-10"
      style={{
        backgroundImage: `url(${HomeBg})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/75" />

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-2xl text-center text-white">
        {/* Ícone */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-700 shadow-lg shadow-blue-950/40">
            <i className="fa-solid fa-qrcode text-4xl text-white" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Condomínio <span className="text-sky-600">Kizomba</span>
        </h1>

        {/* Descrição */}
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
          Gere facilmente o seu QR Code de acesso ao Condomínio Kizomba através
          de uma plataforma simples, rápida e segura.
        </p>

        {/* Botão */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/login"
            className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-red-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <i className="fa-solid fa-qrcode" />
            Gerar QR Code
          </Link>
        </div>
      </div>
    </section>
  );
}
