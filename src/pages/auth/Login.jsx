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

      // Buscar informações do usuário autenticado
      const user = await getCurrentUser();

      //console.log("[Login] USUÁRIO AUTENTICADO:", user);

      toast.dismiss(loadingToast);
      toast.success("Login realizado com sucesso!");

      const from = location.state?.from?.pathname;

      // ADMIN
      /*if (user.is_admin || user.is_superuser) {
        navigate(from || "/dashboard/admin/", { replace: true });
        return;
      }*/
      if (user.is_admin || user.is_superuser) {
        const destination = from?.startsWith("/dashboard/admin/")
          ? from
          : "/dashboard/admin/";

        navigate(destination, { replace: true });

        return;
      }

      // MORADOR
      //navigate(from || "/my-dashboard", { replace: true });

      const destination = from?.startsWith("/my-dashboard")
      ? from
      : "/my-dashboard";

      navigate(destination, { replace: true });
    } catch (error) {
      console.error("Erro no login:", error);

      toast.dismiss(loadingToast);

      if (error.response?.status === 401) {
        toast.error("Nome de usuário ou palavra-passe inválidos.");
        return;
      }

      if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.detail ||
            "Os dados enviados são inválidos.",
        );
        return;
      }

      toast.error("Não foi possível realizar o login. Tente novamente.");
    }
  };

  return (
    <>
      <title>Entrar | Condomínio Kizomba</title>

      <section
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-6 py-10"
        style={{
          backgroundImage: `url(${LoginBg})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-950/80" />

        {/* Container */}
        <div className="relative z-10 w-full max-w-md">
          {/* Cabeçalho */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700">
              <i className="fa-solid fa-qrcode text-3xl text-white" />
            </div>

            <h1 className="text-3xl font-bold text-white">
              Condomínio <span className="text-sky-600">Kizomba</span>
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              Entre na sua conta para gerar o QR Code
            </p>
          </div>

          {/* Formulário */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 backdrop-blur-md sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Nome de usuário */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Nome de usuário
                </label>

                <div className="relative">
                  <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    id="username"
                    type="text"
                    placeholder="Digite o seu nome de usuário"
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
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                    <i className="fa-solid fa-circle-exclamation" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Palavra-passe */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Palavra-passe
                  </label>

                  <Link
                    to="/recuperar-senha"
                    className="text-xs font-medium text-sky-600 transition hover:text-sky-500"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    id="password"
                    type="password"
                    placeholder="Digite a sua palavra-passe"
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
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                    <i className="fa-solid fa-circle-exclamation" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-blue-800 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-right-to-bracket" />
                    Entrar
                  </>
                )}
              </button>
            </form>

            {/* Voltar */}
            <div className="mt-6 border-t border-slate-800 pt-5 text-center">
              <Link
                to="/"
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-400 transition hover:text-white"
              >
                <i className="fa-solid fa-arrow-left text-xs" />
                Voltar para a página inicial
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
