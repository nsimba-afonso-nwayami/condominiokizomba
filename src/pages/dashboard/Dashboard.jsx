import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { formatDate } from "../../utils/dateUtils";
import { logout } from "../../services/authService";
import { getCurrentUser } from "../../services/userService";
import { qrcodeSchema } from "../../validations/qrcodeSchema";
import { createEvent } from "../../services/eventService";
import { generateEventPDF } from "../../services/pdfService";
import QRCode from "./components/QRCode";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const [generatedEvent, setGeneratedEvent] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(qrcodeSchema),
    defaultValues: {
      morador: "",
      tipoEvento: "",
      data: "",
      hora: "",
      horaFim: "",
      local: "",
      convidados: "",
    },
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsUserLoading(true);

        const response = await getCurrentUser();

        setUser(response);
      } catch (error) {
        toast.error(
          "Não foi possível carregar os dados do usuário. / Unable to load user data.",
        );
      } finally {
        setIsUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    logout();

    toast.success(
      "Sessão terminada com sucesso. / Session ended successfully.",
    );

    navigate("/login", { replace: true });
  };

  const handleGenerateQRCode = async (data) => {
    const loadingToast = toast.loading(
      "Cadastrando evento... / Registering event...",
    );

    try {
      const payload = {
        morador: data.morador,
        tipo_evento: data.tipoEvento,
        data_evento: data.data,
        hora_inicio: data.hora,
        hora_fim: data.horaFim,
        local: data.local,
        convidado: data.convidados,
      };

      const newEvent = await createEvent(payload);

      const normalizedEvent = {
        id: newEvent.id,
        morador: newEvent.morador,
        tipoEvento: newEvent.tipo_evento,
        data: newEvent.data_evento,
        hora: newEvent.hora_inicio,
        horaFim: newEvent.hora_fim,
        local: newEvent.local,
        convidados: newEvent.convidado,
      };

      setGeneratedEvent(normalizedEvent);

      reset();

      toast.dismiss(loadingToast);

      toast.success(
        "Evento cadastrado com sucesso! Role a tela para baixo para consultar o QR Code. / Event registered successfully! Scroll down to view the QR Code.",
        { duration: 5000 },
      );
    } catch (error) {
      toast.dismiss(loadingToast);

      toast.error(
        "Não foi possível cadastrar o evento. / Unable to register the event.",
      );
    }
  };

  return (
    <>
      <title>Dashboard | Gestão de Eventos</title>

      <section className="min-h-screen bg-slate-50">
        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 px-6 py-5 md:flex-row md:justify-between md:gap-4">
            {/* IDENTIDADE DO SISTEMA */}
            <div className="text-center md:text-left">
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Gestão de Eventos
              </h1>

              <p className="text-xs text-slate-500">
                Event Management & QR Code System
              </p>
            </div>

            {/* UTILIZADOR */}
            <div className="flex items-center justify-center gap-3">
              {isUserLoading ? (
                <div className="text-center md:text-right">
                  <p className="text-sm font-semibold text-slate-800">
                    Carregando... / Loading...
                  </p>

                  <p className="text-xs text-slate-500">Morador / Resident</p>
                </div>
              ) : (
                <div className="text-center md:text-right">
                  <p className="text-sm font-semibold text-slate-800">
                    {user?.first_name || user?.last_name
                      ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
                      : user?.username || "Morador"}
                  </p>

                  <p className="text-xs text-slate-500">Morador / Resident</p>
                </div>
              )}

              {/* AVATAR */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                <i className="fa-solid fa-user" />
              </div>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <i className="fa-solid fa-right-from-bracket" />

                <span className="hidden sm:inline">Sair / Sign out</span>
              </button>
            </div>
          </div>
        </header>

        {/* CONTEÚDO */}
        <main className="mx-auto max-w-5xl px-6 py-8">
          {/* INTRODUÇÃO */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Criar Evento</h2>

            <p className="mt-1 text-sm text-slate-500">
              Preencha os dados do evento para gerar o respetivo QR Code.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Fill in the event details to generate its QR Code.
            </p>
          </div>

          {/* FORMULÁRIO */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
            <form
              onSubmit={handleSubmit(handleGenerateQRCode)}
              className="space-y-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                {/* MORADOR */}
                <div>
                  <label
                    htmlFor="morador"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Morador / Resident
                  </label>

                  <div className="relative">
                    <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      id="morador"
                      type="text"
                      placeholder="Nome do morador / Resident name"
                      {...register("morador")}
                      className={`w-full rounded-lg border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.morador
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                      }`}
                    />
                  </div>

                  {errors.morador && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.morador.message}
                    </p>
                  )}
                </div>

                {/* TIPO DE EVENTO */}
                <div>
                  <label
                    htmlFor="tipoEvento"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Tipo de Evento / Type of Event
                  </label>

                  <select
                    id="tipoEvento"
                    {...register("tipoEvento")}
                    className={`w-full cursor-pointer rounded-lg border bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                      errors.tipoEvento
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                    }`}
                  >
                    <option value="">
                      Selecione o tipo de evento / Select Event Type
                    </option>

                    <option value="Aniversário/Birthday">
                      Aniversário / Birthday
                    </option>

                    <option value="Reunião/Meeting">Reunião / Meeting</option>

                    <option value="Palestras/Lectures">
                      Palestras / Lectures
                    </option>

                    <option value="Aulas para criança/ Classes for children">
                      Aulas para criança / Classes for children
                    </option>

                    <option value="Jogos/Games">Jogos / Games</option>
                  </select>

                  {errors.tipoEvento && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.tipoEvento.message}
                    </p>
                  )}
                </div>

                {/* DATA */}
                <div>
                  <label
                    htmlFor="data"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Data do Evento / Event Date
                  </label>

                  <input
                    id="data"
                    type="date"
                    {...register("data")}
                    className={`w-full rounded-lg border bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                      errors.data
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                    }`}
                  />

                  {errors.data && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.data.message}
                    </p>
                  )}
                </div>

                {/* HORA INÍCIO */}
                <div>
                  <label
                    htmlFor="hora"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Hora de início / Start Time
                  </label>

                  <input
                    id="hora"
                    type="time"
                    {...register("hora")}
                    className={`w-full rounded-lg border bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                      errors.hora
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                    }`}
                  />

                  {errors.hora && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.hora.message}
                    </p>
                  )}
                </div>

                {/* HORA FIM */}
                <div>
                  <label
                    htmlFor="horaFim"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Hora de Fim / End Time
                  </label>

                  <input
                    id="horaFim"
                    type="time"
                    {...register("horaFim")}
                    className={`w-full rounded-lg border bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                      errors.horaFim
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                    }`}
                  />

                  {errors.horaFim && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.horaFim.message}
                    </p>
                  )}
                </div>

                {/* LOCAL */}
                <div>
                  <label
                    htmlFor="local"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Local / Location
                  </label>

                  <select
                    id="local"
                    {...register("local")}
                    className={`w-full cursor-pointer rounded-lg border bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                      errors.local
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                    }`}
                  >
                    <option value="">
                      Selecione o local / Select location
                    </option>

                    <option value="Rés do chão">
                      Rés do chão / Ground floor
                    </option>

                    <option value="Piso 01/ Floor 01">
                      Piso 01 / Floor 01
                    </option>

                    <option value="Residência/ Residencial">
                      Residência / Residential
                    </option>

                    <option value="Ginásio/ Gym">Ginásio / Gym</option>

                    <option value="Campo Padel/ Padel court">
                      Campo de Padel / Padel court
                    </option>

                    <option value="Campo de Ténis/Tennis Court">
                      Campo de Ténis / Tennis court
                    </option>

                    <option value="Campo de Futebol/FootBall Court">
                      Campo de Futebol / Football court
                    </option>
                  </select>

                  {errors.local && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.local.message}
                    </p>
                  )}
                </div>

                {/* CONVIDADOS */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="convidados"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Convidados / Guests
                  </label>

                  <textarea
                    id="convidados"
                    {...register("convidados")}
                    placeholder="Escreva o nome dos convidados / Enter guest names"
                    rows={4}
                    className={`w-full resize-none rounded-lg border bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.convidados
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                    }`}
                  />

                  {errors.convidados && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.convidados.message}
                    </p>
                  )}
                </div>
              </div>

              {/* BOTÃO */}
              <div className="flex justify-end border-t border-slate-200 pt-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" />
                      Gerando... / Generating...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-qrcode" />
                      Gerar QR Code / Generate QR Code
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* QR CODE GERADO */}
          {generatedEvent && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 md:p-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900">
                  QR Code gerado com sucesso
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  O QR Code foi associado ao evento e está pronto para ser
                  utilizado.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  The QR Code has been linked to the event and is ready to use.
                </p>
              </div>

              {/* INFORMAÇÕES */}
              <div className="mx-auto mt-6 max-w-md rounded-lg bg-slate-50 p-5">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Morador / Resident</span>

                    <span className="font-semibold text-slate-800">
                      {generatedEvent.morador}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Evento / Event</span>

                    <span className="text-right font-semibold text-slate-800">
                      {generatedEvent.tipoEvento}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Data / Date</span>

                    <span className="font-semibold text-slate-800">
                      {formatDate(generatedEvent.data)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Horário / Time</span>

                    <span className="font-semibold text-slate-800">
                      {generatedEvent.hora} - {generatedEvent.horaFim}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Local / Location</span>

                    <span className="text-right font-semibold text-slate-800">
                      {generatedEvent.local}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR CODE */}
              <div className="mt-8 flex justify-center">
                <div className="border border-slate-200 bg-white p-5">
                  <QRCode item={generatedEvent} size={320} />
                </div>
              </div>

              {/* PDF */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => generateEventPDF(generatedEvent)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                >
                  <i className="fa-solid fa-file-pdf" />
                  Baixar PDF / Download PDF
                </button>
              </div>
            </div>
          )}
        </main>
      </section>
    </>
  );
}
