import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import AdminLayout from "./components/AdminLayout";
import Modal from "./components/Modal";
import ModalSmall from "./components/ModalSmall";

import {
  getUsers,
  registerUser,
  resetUserPassword,
} from "../../services/userService";

import { userSchema, resetPasswordSchema } from "../../validations/userSchema";

export default function UsuariosAdmin() {
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [isResetting, setIsResetting] = useState(false);

  // =========================================================
  // FORMULÁRIO DE CADASTRO
  // REGISTRATION FORM
  // =========================================================

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });

  // =========================================================
  // FORMULÁRIO DE RESET DE SENHA
  // PASSWORD RESET FORM
  // =========================================================

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    reset: resetReset,
    formState: { errors: resetErrors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // =========================================================
  // BUSCAR USUÁRIOS
  // FETCH USERS
  // =========================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      const response = await getUsers();

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.results)
          ? response.results
          : [];

      const normalizedUsers = [...data].sort(
        (a, b) => Number(b.id || 0) - Number(a.id || 0),
      );

      setUsers(normalizedUsers);
    } catch (error) {
      console.error("[UsuariosAdmin] ERRO AO BUSCAR USUÁRIOS:", error);

      toast.error(
        "Não foi possível carregar os usuários. / Unable to load users.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // PESQUISA
  // SEARCH
  // =========================================================

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return users;
    }

    return users.filter((user) => {
      const username = user.username?.toLowerCase() || "";

      const email = user.email?.toLowerCase() || "";

      const firstName = user.first_name?.toLowerCase() || "";

      const lastName = user.last_name?.toLowerCase() || "";

      return (
        username.includes(searchValue) ||
        email.includes(searchValue) ||
        firstName.includes(searchValue) ||
        lastName.includes(searchValue)
      );
    });
  }, [users, search]);

  // =========================================================
  // ABRIR MODAL DE CADASTRO
  // OPEN REGISTRATION MODAL
  // =========================================================

  const handleOpenCreate = () => {
    reset({
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // FECHAR MODAL DE CADASTRO
  // CLOSE REGISTRATION MODAL
  // =========================================================

  const handleCloseCreate = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);

    reset({
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    });
  };

  // =========================================================
  // CADASTRAR USUÁRIO
  // REGISTER USER
  // =========================================================

  const handleCreateUser = async (data) => {
    const loadingToast = toast.loading(
      "Cadastrando usuário... / Registering user...",
    );

    try {
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
      };

      await registerUser(payload);

      await fetchUsers();

      toast.dismiss(loadingToast);

      toast.success(
        "Usuário cadastrado com sucesso! / User registered successfully!",
        {
          duration: 5000,
        },
      );

      handleCloseCreate();
    } catch (error) {
      console.error("[UsuariosAdmin] ERRO AO CADASTRAR USUÁRIO:", error);

      toast.dismiss(loadingToast);

      toast.error(
        "Não foi possível cadastrar o usuário. / Unable to register the user.",
      );
    }
  };

  // =========================================================
  // ABRIR RESET DE SENHA
  // OPEN PASSWORD RESET
  // =========================================================

  const handleOpenReset = (user) => {
    console.log("[UsuariosAdmin] USUÁRIO SELECIONADO PARA RESET:", user);

    setSelectedUser(user);

    resetReset({
      password: "",
      confirmPassword: "",
    });

    setIsResetModalOpen(true);
  };

  // =========================================================
  // FECHAR RESET DE SENHA
  // CLOSE PASSWORD RESET
  // =========================================================

  const handleCloseReset = () => {
    if (isResetting) return;

    setIsResetModalOpen(false);
    setSelectedUser(null);

    resetReset({
      password: "",
      confirmPassword: "",
    });
  };

  // =========================================================
  // RESETAR SENHA
  // RESET PASSWORD
  // =========================================================

  const handleResetPassword = async (data) => {
    if (!selectedUser) return;

    const loadingToast = toast.loading(
      "Redefinindo senha... / Resetting password...",
    );

    try {
      const payload = {
        password: data.password,
      };

      setIsResetting(true);

      await resetUserPassword(selectedUser.id, payload);

      toast.dismiss(loadingToast);

      toast.success(
        "Senha redefinida com sucesso! / Password reset successfully!",
        {
          duration: 5000,
        },
      );

      handleCloseReset();
    } catch (error) {
      console.error("[UsuariosAdmin] ERRO AO RESETAR SENHA:", error);

      toast.dismiss(loadingToast);

      toast.error(
        "Não foi possível redefinir a senha. / Unable to reset the password.",
      );
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <title>
        Usuários / Users | Admin | Sistema de Gestão de Acesso / Access
        Management System
      </title>

      <AdminLayout title="Usuários / Users">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="flex flex-col justify-between gap-4 border-b border-neutral-400/30 pb-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-blue-900 sm:text-2xl">
              Gestão de Usuários / User Management
            </h1>

            <p className="mt-0.5 text-xs text-neutral-600 sm:text-sm">
              Consulte, cadastre e gerencie os usuários do condomínio. / View,
              register and manage condominium users.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-blue-800 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-900"
          >
            <i className="fas fa-plus text-xs" />
            Novo Usuário / New User
          </button>
        </section>

        {/* =====================================================
            PESQUISA
        ====================================================== */}

        <section className="rounded-2xl border border-neutral-400/40 bg-neutral-50 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <i className="fas fa-magnifying-glass text-sm text-blue-800" />

            <h2 className="text-sm font-bold text-blue-900">
              Pesquisar usuários / Search users
            </h2>
          </div>

          <div className="relative">
            <i className="fas fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar username, nome ou email... / Search username, name or email..."
              className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-11 pr-4 text-sm text-neutral-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
            />
          </div>
        </section>

        {/* =====================================================
            LISTAGEM
        ====================================================== */}

        <section className="overflow-hidden rounded-2xl border border-neutral-400/40 bg-neutral-50 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-400/20 p-5">
            <div>
              <h2 className="text-sm font-bold text-blue-900">
                Usuários / Users
              </h2>

              <p className="mt-0.5 text-xs text-neutral-600">
                Usuários registados no sistema. / Users registered in the
                system.
              </p>
            </div>

            <span className="rounded-full bg-blue-800/10 px-3 py-1 text-xs font-bold text-blue-800">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1
                ? "usuário / user"
                : "usuários / users"}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center px-6 py-16">
              <i className="fas fa-spinner fa-spin text-xl text-blue-800" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <i className="fas fa-users text-3xl text-neutral-300" />

              <p className="mt-3 text-sm font-medium text-neutral-500">
                Nenhum usuário encontrado. / No users found.
              </p>

              {search && (
                <p className="mt-1 text-xs text-neutral-400">
                  Tente pesquisar por outro nome, username ou email. / Try
                  searching for another name, username or email.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left">
                <thead className="border-b border-neutral-200 bg-neutral-100/70">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Username
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Nome / Name
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Email
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Ações / Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="transition hover:bg-white">
                      <td className="px-5 py-4 text-sm font-semibold text-neutral-800">
                        {user.username}
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {user.first_name} {user.last_name}
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {user.email || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          {!user.is_admin && !user.is_superuser && (
                            <button
                              type="button"
                              onClick={() => handleOpenReset(user)}
                              title="Resetar senha / Reset password"
                              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                            >
                              <i className="fas fa-key text-xs" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* =====================================================
            MODAL — NOVO USUÁRIO
        ====================================================== */}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseCreate}
          title="Novo Usuário / New User"
          icon="fas fa-user-plus"
        >
          <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Dados do usuário / User information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Preencha os dados para criar um novo usuário. / Fill in the
                information to create a new user.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nome de usuário / Username
                </label>

                <input
                  id="username"
                  type="text"
                  placeholder="Nome de usuário / Username"
                  {...register("username")}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                    errors.username
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                  }`}
                />

                {errors.username && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="usuario@email.com"
                  {...register("email")}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                  }`}
                />

                {errors.email && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="first_name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Primeiro Nome / First Name
                </label>

                <input
                  id="first_name"
                  type="text"
                  placeholder="Primeiro nome / First name"
                  {...register("first_name")}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                    errors.first_name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                  }`}
                />

                {errors.first_name && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Último Nome / Last Name
                </label>

                <input
                  id="last_name"
                  type="text"
                  placeholder="Último nome / Last name"
                  {...register("last_name")}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                    errors.last_name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                  }`}
                />

                {errors.last_name && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Senha / Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Defina uma senha / Set a password"
                  {...register("password")}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                  }`}
                />

                {errors.password && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 pt-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin" />
                    Cadastrando... / Registering...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus" />
                    Cadastrar usuário / Register user
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>

        {/* =====================================================
            MODAL — RESETAR SENHA
        ====================================================== */}

        <ModalSmall
          isOpen={isResetModalOpen}
          onClose={handleCloseReset}
          title="Resetar senha / Reset password"
          icon="fas fa-key"
        >
          <form
            onSubmit={handleSubmitReset(handleResetPassword)}
            className="space-y-5"
          >
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <i className="fas fa-key text-lg" />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                Redefinir senha do usuário / Reset user password
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Defina uma nova senha para{" "}
                <strong className="font-semibold text-slate-700">
                  {selectedUser?.username}
                </strong>
                . / Set a new password for{" "}
                <strong className="font-semibold text-slate-700">
                  {selectedUser?.username}
                </strong>
                .
              </p>
            </div>

            <div>
              <label
                htmlFor="reset-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nova senha / New password
              </label>

              <input
                id="reset-password"
                type="password"
                placeholder="Digite a nova senha / Enter the new password"
                {...registerReset("password")}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                  resetErrors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                }`}
              />

              {resetErrors.password && (
                <p className="mt-2 text-xs text-red-500">
                  {resetErrors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirmar senha / Confirm password
              </label>

              <input
                id="confirm-password"
                type="password"
                placeholder="Digite novamente a senha / Enter the password again"
                {...registerReset("confirmPassword")}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                  resetErrors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                }`}
              />

              {resetErrors.confirmPassword && (
                <p className="mt-2 text-xs text-red-500">
                  {resetErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isResetting}
                onClick={handleCloseReset}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar / Cancel
              </button>

              <button
                type="submit"
                disabled={isResetting}
                className="cursor-pointer rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResetting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Redefinindo... / Resetting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-key mr-2" />
                    Redefinir senha / Reset password
                  </>
                )}
              </button>
            </div>
          </form>
        </ModalSmall>
      </AdminLayout>
    </>
  );
}
