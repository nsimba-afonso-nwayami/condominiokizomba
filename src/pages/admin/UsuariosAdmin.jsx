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

import {
  userSchema,
  resetPasswordSchema,
} from "../../validations/userSchema";

export default function UsuariosAdmin() {
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] =
    useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [isResetting, setIsResetting] = useState(false);

  // =========================================================
  // FORMULÁRIO DE CADASTRO
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
  // =========================================================

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    reset: resetReset,
    formState: {
      errors: resetErrors,
    },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // =========================================================
  // BUSCAR USUÁRIOS
  // =========================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    console.log(
      "[UsuariosAdmin] INICIANDO BUSCA DE USUÁRIOS...",
    );

    try {
      setIsLoading(true);

      const response = await getUsers();

      console.log(
        "[UsuariosAdmin] RESPOSTA DO SERVICE:",
        response,
      );

      /*
       * O service pode devolver:
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * ou:
       *
       * {
       *   results: [...]
       * }
       */

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.results)
          ? response.results
          : [];

      console.log(
        "[UsuariosAdmin] USUÁRIOS RECEBIDOS:",
        data,
      );

      /*
       * O endpoint atualmente devolve usuários com:
       *
       * id
       * username
       * email
       * first_name
       * last_name
       * is_admin
       * is_staff
       * is_superuser
       *
       * Como a resposta não possui created_at/date_joined,
       * usamos o ID para garantir que o último usuário
       * registado apareça primeiro.
       */

      const normalizedUsers = [...data].sort(
        (a, b) =>
          Number(b.id || 0) - Number(a.id || 0),
      );

      console.log(
        "[UsuariosAdmin] USUÁRIOS ORDENADOS:",
        normalizedUsers,
      );

      setUsers(normalizedUsers);
    } catch (error) {
      console.error(
        "[UsuariosAdmin] ERRO AO BUSCAR USUÁRIOS:",
        error,
      );

      console.error(
        "[UsuariosAdmin] STATUS:",
        error.response?.status,
      );

      console.error(
        "[UsuariosAdmin] RESPOSTA DA API:",
        error.response?.data,
      );

      toast.error(
        "Não foi possível carregar os usuários.",
      );
    } finally {
      setIsLoading(false);

      console.log(
        "[UsuariosAdmin] BUSCA DE USUÁRIOS FINALIZADA.",
      );
    }
  };

  // =========================================================
  // PESQUISA
  // =========================================================

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return users;
    }

    return users.filter((user) => {
      const username =
        user.username?.toLowerCase() || "";

      const email =
        user.email?.toLowerCase() || "";

      const firstName =
        user.first_name?.toLowerCase() || "";

      const lastName =
        user.last_name?.toLowerCase() || "";

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
  // =========================================================

  const handleCreateUser = async (data) => {
    const loadingToast = toast.loading(
      "Cadastrando usuário...",
    );

    console.log(
      "[UsuariosAdmin] DADOS DO FORMULÁRIO:",
      data,
    );

    try {
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
      };

      console.log(
        "[UsuariosAdmin] PAYLOAD DE REGISTRO:",
        payload,
      );

      const response = await registerUser(payload);

      console.log(
        "[UsuariosAdmin] USUÁRIO CRIADO:",
        response,
      );

      /*
       * Depois do cadastro buscamos novamente a lista.
       *
       * Assim não dependemos do formato da resposta do
       * endpoint de registro e garantimos que o novo
       * usuário apareça no topo através do ID.
       */

      await fetchUsers();

      toast.dismiss(loadingToast);

      toast.success(
        "Usuário cadastrado com sucesso!",
        {
          duration: 5000,
        },
      );

      handleCloseCreate();
    } catch (error) {
      console.error(
        "[UsuariosAdmin] ERRO AO CADASTRAR USUÁRIO:",
        error,
      );

      console.error(
        "[UsuariosAdmin] STATUS:",
        error.response?.status,
      );

      console.error(
        "[UsuariosAdmin] RESPOSTA DA API:",
        error.response?.data,
      );

      toast.dismiss(loadingToast);

      const apiError = error.response?.data;

      if (apiError?.username) {
        toast.error(
          Array.isArray(apiError.username)
            ? apiError.username[0]
            : apiError.username,
        );

        return;
      }

      if (apiError?.email) {
        toast.error(
          Array.isArray(apiError.email)
            ? apiError.email[0]
            : apiError.email,
        );

        return;
      }

      if (apiError?.password) {
        toast.error(
          Array.isArray(apiError.password)
            ? apiError.password[0]
            : apiError.password,
        );

        return;
      }

      toast.error(
        "Não foi possível cadastrar o usuário.",
      );
    }
  };

  // =========================================================
  // ABRIR RESET DE SENHA
  // =========================================================

  const handleOpenReset = (user) => {
    console.log(
      "[UsuariosAdmin] USUÁRIO SELECIONADO PARA RESET:",
      user,
    );

    setSelectedUser(user);

    resetReset({
      password: "",
      confirmPassword: "",
    });

    setIsResetModalOpen(true);
  };

  // =========================================================
  // FECHAR RESET DE SENHA
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
  // =========================================================

  const handleResetPassword = async (data) => {
    if (!selectedUser) return;

    const loadingToast = toast.loading(
      "Redefinindo senha...",
    );

    console.log(
      "[UsuariosAdmin] RESET DE SENHA PARA:",
      selectedUser,
    );

    try {
      const payload = {
        password: data.password,
      };

      console.log(
        "[UsuariosAdmin] PAYLOAD RESET PASSWORD:",
        {
          userId: selectedUser.id,
          payload: {
            password: "***",
          },
        },
      );

      setIsResetting(true);

      const response = await resetUserPassword(
        selectedUser.id,
        payload,
      );

      console.log(
        "[UsuariosAdmin] RESPOSTA RESET PASSWORD:",
        response,
      );

      toast.dismiss(loadingToast);

      toast.success(
        "Senha redefinida com sucesso!",
        {
          duration: 5000,
        },
      );

      handleCloseReset();
    } catch (error) {
      console.error(
        "[UsuariosAdmin] ERRO AO RESETAR SENHA:",
        error,
      );

      console.error(
        "[UsuariosAdmin] STATUS:",
        error.response?.status,
      );

      console.error(
        "[UsuariosAdmin] RESPOSTA DA API:",
        error.response?.data,
      );

      toast.dismiss(loadingToast);

      const apiError = error.response?.data;

      if (apiError?.password) {
        toast.error(
          Array.isArray(apiError.password)
            ? apiError.password[0]
            : apiError.password,
        );

        return;
      }

      toast.error(
        "Não foi possível redefinir a senha.",
      );
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <title>
        Usuários | Admin | Condomínio Kizomba
      </title>

      <AdminLayout title="Usuários">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="flex flex-col justify-between gap-4 border-b border-neutral-400/30 pb-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-blue-900 sm:text-2xl">
              Gestão de Usuários
            </h1>

            <p className="mt-0.5 text-xs text-neutral-600 sm:text-sm">
              Consulte, cadastre e gerencie os
              usuários do condomínio.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-blue-800 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-900"
          >
            <i className="fas fa-plus text-xs" />
            Novo Usuário
          </button>
        </section>

        {/* =====================================================
            PESQUISA
        ====================================================== */}

        <section className="rounded-2xl border border-neutral-400/40 bg-neutral-50 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <i className="fas fa-magnifying-glass text-sm text-blue-800" />

            <h2 className="text-sm font-bold text-blue-900">
              Pesquisar usuários
            </h2>
          </div>

          <div className="relative">
            <i className="fas fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Pesquisar username, nome ou email..."
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
                Usuários
              </h2>

              <p className="mt-0.5 text-xs text-neutral-600">
                Usuários registados no sistema.
              </p>
            </div>

            <span className="rounded-full bg-blue-800/10 px-3 py-1 text-xs font-bold text-blue-800">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1
                ? "usuário"
                : "usuários"}
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
                Nenhum usuário encontrado.
              </p>

              {search && (
                <p className="mt-1 text-xs text-neutral-400">
                  Tente pesquisar por outro nome,
                  username ou email.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-neutral-200 bg-neutral-100/70">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Username
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Nome
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Email
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-white"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-neutral-800">
                        {user.username}
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {user.first_name}{" "}
                        {user.last_name}
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {user.email || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenReset(user)
                            }
                            title="Resetar senha"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                          >
                            <i className="fas fa-key text-xs" />
                          </button>
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
          title="Novo Usuário"
          icon="fas fa-user-plus"
        >
          <form
            onSubmit={handleSubmit(handleCreateUser)}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Dados do usuário
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Preencha os dados para criar um novo
                usuário.
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
                  placeholder="Nome de usuário"
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
                  placeholder="Primeiro nome"
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
                  placeholder="Último nome"
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
                  placeholder="Defina uma senha"
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
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus" />
                    Cadastrar usuário
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
          title="Resetar senha"
          icon="fas fa-key"
        >
          <form
            onSubmit={handleSubmitReset(
              handleResetPassword,
            )}
            className="space-y-5"
          >
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <i className="fas fa-key text-lg" />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                Redefinir senha do usuário
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Defina uma nova senha para{" "}
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
                Nova senha
              </label>

              <input
                id="reset-password"
                type="password"
                placeholder="Digite a nova senha"
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
                Confirmar senha
              </label>

              <input
                id="confirm-password"
                type="password"
                placeholder="Digite novamente a senha"
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
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isResetting}
                className="cursor-pointer rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResetting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Redefinindo...
                  </>
                ) : (
                  <>
                    <i className="fas fa-key mr-2" />
                    Redefinir senha
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
