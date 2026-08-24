import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import LoginBg from "../../assets/img/login.jpg";
import { loginSchema } from "../../validations/loginSchema";
import { login } from "../../services/authService";
import { getCurrentUser } from "../../services/userService";
import { saveTokens } from "../../services/authStorage";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Processando o login...");

    try {
      const response = await login({
        username: data.username,
        password: data.password,
      });

      saveTokens({
        access: response.access,
        refresh: response.refresh,
      });

      const user = await getCurrentUser();

      toast.dismiss(loadingToast);
      toast.success("Login realizado com sucesso!");

      const from = location.state?.from?.pathname;

      if (user.is_admin || user.is_superuser) {
        const destination = from?.startsWith("/dashboard/admin/")
          ? from
          : "/dashboard/admin/";

        navigate(destination, { replace: true });

        return;
      }

      const destination = from?.startsWith("/my-dashboard")
        ? from
        : "/my-dashboard";

      navigate(destination, { replace: true });
    } catch (error) {
      console.error("Erro no login:", error);

      toast.dismiss(loadingToast);

      if (error.response?.status === 401) {
        toast.error(
          "Nome de usuário ou palavra-passe inválidos. / Invalid username or password.",
        );
        return;
      }

      if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.detail ||
            "Os dados enviados são inválidos. / The submitted data is invalid.",
        );
        return;
      }

      toast.error(
        "Não foi possível realizar o login. Tente novamente. / Unable to sign in. Please try again.",
      );
    }
  };

  return (
    <>
      <title>Entrar | Gestão de Eventos</title>

      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 bg-cover bg-center px-6 py-10"
        style={{
          backgroundImage: `url(${LoginBg})`,
        }}
      >
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-slate-950/85" />

        {/* GRADIENTE */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-950/90 to-blue-950/70" />

        {/* CONTEÚDO */}
        <div className="relative z-10 w-full max-w-md">
          {/* INTRODUÇÃO */}
          <div className="mb-7 text-center">
            <p className="text-sm font-semibold text-white">
              Sistema de Gestão de Eventos
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Event Management System
            </p>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Entrar no sistema
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Aceda à plataforma para criar e gerir eventos.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Access the platform to create and manage events.
            </p>
          </div>

          {/* FORMULÁRIO */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 backdrop-blur-md sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-base font-bold text-white">
                Autenticação / Authentication
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Introduza os seus dados de acesso. / Enter your login details.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* NOME DE USUÁRIO */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Nome de usuário / Username
                </label>

                <div className="relative">
                  <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    id="username"
                    type="text"
                    placeholder="Digite o seu nome de usuário / Enter your username"
                    autoComplete="username"
                    disabled={isSubmitting}
                    {...register("username")}
                    className={`w-full rounded-xl border bg-slate-950/70 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.username
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-700 focus:border-blue-600 focus:ring-blue-600/20"
                    }`}
                  />
                </div>

                {errors.username && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* PALAVRA-PASSE */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Palavra-passe / Password
                </label>

                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    id="password"
                    type="password"
                    placeholder="Digite a sua palavra-passe / Enter your password"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    {...register("password")}
                    className={`w-full rounded-xl border bg-slate-950/70 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-700 focus:border-blue-600 focus:ring-blue-600/20"
                    }`}
                  />
                </div>

                {errors.password && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-blue-800 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-3" />
                    Processando... / Processing...
                  </>
                ) : (
                  "Entrar / Sign in"
                )}
              </button>
            </form>

            {/* VOLTAR */}
            <div className="mt-6 border-t border-slate-800 pt-5">
              <Link
                to="/"
                className="flex cursor-pointer items-center justify-center text-xs text-slate-500 transition hover:text-slate-300"
              >
                Voltar à página inicial / Back to home
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] text-slate-600">
            Sistema de Gestão de Eventos
          </p>
        </div>
      </section>
    </>
  );
}
