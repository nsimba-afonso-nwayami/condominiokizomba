import { Link } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";

export default function NotFoundAdmin() {
  return (
    <>
      <title>
        Página não encontrada | Admin | Sistema de Gestão de Acesso
      </title>

      <AdminLayout title="Página não encontrada">
        <section className="flex min-h-[calc(100vh-180px)] items-center justify-center px-4 py-10">
          <div className="w-full max-w-xl text-center">
            {/* ÍCONE */}

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-800/10 text-blue-800">
              <i className="fas fa-compass text-4xl" />
            </div>

            {/* 404 */}

            <p className="mt-8 text-7xl font-black tracking-tight text-blue-900 sm:text-8xl">
              404
            </p>

            {/* TÍTULO */}

            <h1 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
              Página não encontrada
            </h1>

            {/* DESCRIÇÃO */}

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              A página que você está procurando não
              existe, foi removida ou o endereço informado
              está incorreto.
            </p>

            {/* BOTÃO */}

            <div className="mt-8 flex justify-center">
              <Link
                to="/admin"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-900"
              >
                <i className="fas fa-house" />
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </section>
      </AdminLayout>
    </>
  );
}
