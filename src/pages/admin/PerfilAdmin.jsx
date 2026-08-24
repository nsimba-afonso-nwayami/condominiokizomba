import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import AdminLayout from "./components/AdminLayout";

import {
  getCurrentUser,
  changePassword,
} from "../../services/userService";

import {
  changePasswordSchema,
} from "../../validations/userSchema";

export default function PerfilAdmin() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // =========================================================
  // BUSCAR USUÁRIO AUTENTICADO
  // FETCH AUTHENTICATED USER
  // =========================================================

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);

      /*console.log(
        "[PerfilAdmin] BUSCANDO DADOS DO ADMIN..."
      );*/

      const response = await getCurrentUser();

      console.log(
        "[PerfilAdmin] ADMIN AUTENTICADO:",
        response,
      );

      setUser(response);
    } catch (error) {
      /*console.error(
        "[PerfilAdmin] ERRO AO BUSCAR ADMIN:",
        error,
      );

      console.error(
        "[PerfilAdmin] RESPOSTA DA API:",
        error.response?.data,
      );*/

      toast.error(
        "Não foi possível carregar os dados do perfil. / Unable to load profile data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // ALTERAR SENHA
  // CHANGE PASSWORD
  // =========================================================

  const handleChangePassword = async (data) => {
    const loadingToast = toast.loading(
      "Alterando senha... / Changing password...",
    );

    try {
      const payload = {
        old_password: data.currentPassword,
        new_password: data.newPassword,
      };

      /*console.log(
        "[PerfilAdmin] DADOS PARA ALTERAÇÃO DE SENHA:",
        payload,
      );*/

      await changePassword(payload);

      /*console.log(
        "[PerfilAdmin] SENHA ALTERADA COM SUCESSO.",
      );*/

      toast.dismiss(loadingToast);

      toast.success(
        "Senha alterada com sucesso! / Password changed successfully!",
        {
          duration: 5000,
        },
      );

      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      /*console.error(
        "[PerfilAdmin] ERRO AO ALTERAR SENHA:",
        error,
      );

      console.error(
        "[PerfilAdmin] RESPOSTA DA API:",
        error.response?.data,
      );*/

      toast.dismiss(loadingToast);

      toast.error(
        "Não foi possível alterar a senha. Verifique os dados informados e tente novamente. / Unable to change the password. Check the information provided and try again.",
      );
    }
  };

  return (
    <>
      <title>
        Perfil / Profile | Admin | Sistema de Gestão de Acesso / Access Management System
      </title>

      <AdminLayout title="Perfil / Profile">
        {/* =====================================================
            CABEÇALHO
            HEADER
        ====================================================== */}

        <section className="border-b border-neutral-400/30 pb-4">
          <h1 className="text-xl font-bold tracking-tight text-blue-900 sm:text-2xl">
            Meu Perfil / My Profile
          </h1>

          <p className="mt-0.5 text-xs text-neutral-600 sm:text-sm">
            Consulte os seus dados e altere a sua senha. / View your
            information and change your password.
          </p>
        </section>

        {/* =====================================================
            DADOS DO USUÁRIO
            USER INFORMATION
        ====================================================== */}

        <section className="rounded-2xl border border-neutral-400/40 bg-neutral-50 p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3 border-b border-neutral-400/20 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-800 text-white">
              <i className="fas fa-user" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-blue-900">
                Dados do administrador / Administrator Information
              </h2>

              <p className="mt-0.5 text-xs text-neutral-600">
                Informações da conta atualmente autenticada. / Information
                about the currently authenticated account.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <i className="fas fa-spinner fa-spin text-xl text-blue-800" />
            </div>
          ) : !user ? (
            <div className="py-12 text-center">
              <i className="fas fa-user-slash text-3xl text-neutral-300" />

              <p className="mt-3 text-sm font-medium text-neutral-500">
                Não foi possível carregar os dados do usuário. / Unable to
                load user information.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {/* USERNAME */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                  Username / Nome de usuário
                </label>

                <div className="flex min-h-12 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800">
                  {user.username || "Não informado / Not provided"}
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                  Email / E-mail
                </label>

                <div className="flex min-h-[48px] items-center rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800">
                  {user.email || "Não informado / Not provided"}
                </div>
              </div>

              {/* PRIMEIRO NOME */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                  Primeiro nome / First name
                </label>

                <div className="flex min-h-[48px] items-center rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800">
                  {user.first_name || "Não informado / Not provided"}
                </div>
              </div>

              {/* ÚLTIMO NOME */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                  Apelido / Last name
                </label>

                <div className="flex min-h-[48px] items-center rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800">
                  {user.last_name || "Não informado / Not provided"}
                </div>
              </div>

              {/* TIPO DE CONTA */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                  Tipo de conta / Account type
                </label>

                <div className="flex min-h-[48px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-blue-800">
                  <i className="fas fa-shield-halved" />

                  {user.is_superuser
                    ? "Super Administrador / Super Administrator"
                    : user.is_admin
                      ? "Administrador / Administrator"
                      : "Usuário / User"}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =====================================================
            ALTERAR SENHA
            CHANGE PASSWORD
        ====================================================== */}

        <section className="rounded-2xl border border-neutral-400/40 bg-neutral-50 p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3 border-b border-neutral-400/20 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-800 text-white">
              <i className="fas fa-lock" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-blue-900">
                Alterar senha / Change password
              </h2>

              <p className="mt-0.5 text-xs text-neutral-600">
                Defina uma nova senha para a sua conta. / Set a new password
                for your account.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(
              handleChangePassword,
            )}
            className="space-y-5"
          >
            {/* SENHA ATUAL / CURRENT PASSWORD */}

            <div>
              <label
                htmlFor="current-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Senha atual / Current password
              </label>

              <input
                id="current-password"
                type="password"
                placeholder="Digite a sua senha atual / Enter your current password"
                {...register("currentPassword")}
                className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                  errors.currentPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                }`}
              />

              {errors.currentPassword && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* NOVA SENHA / NEW PASSWORD */}

              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nova senha / New password
                </label>

                <input
                  id="new-password"
                  type="password"
                  placeholder="Digite a nova senha / Enter the new password"
                  {...register("newPassword")}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                    errors.newPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                  }`}
                />

                {errors.newPassword && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* CONFIRMAR SENHA / CONFIRM PASSWORD */}

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirmar nova senha / Confirm new password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Digite novamente a nova senha / Enter the new password again"
                  {...register("confirmPassword")}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                  }`}
                />

                {errors.confirmPassword && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* BOTÃO / BUTTON */}

            <div className="flex justify-end border-t border-slate-200 pt-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin" />
                    Alterando... / Changing...
                  </>
                ) : (
                  <>
                    Alterar senha / Change password
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </AdminLayout>
    </>
  );
}