import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import AdminLayout from "./components/AdminLayout";
import Modal from "./components/Modal";
import ModalSmall from "./components/ModalSmall";
import QRCode from "./components/QRCode";

import {
  getEvents,
  createEvent,
  deleteEvent,
} from "../../services/eventService";
import { generateEventPDF } from "../../services/pdfService";
import { qrcodeSchema } from "../../validations/qrcodeSchema";
import { formatDate, getToday } from "../../utils/dateUtils";

export default function EventosAdmin() {
  const [events, setEvents] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

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

  // =========================================================
  // BUSCAR EVENTOS
  // =========================================================

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);

      const data = await getEvents();

      const normalizedEvents = data.map((item) => ({
        id: item.id,
        morador: item.morador,
        tipoEvento: item.tipo_evento,
        data: item.data_evento,
        hora: item.hora_inicio,
        horaFim: item.hora_fim,
        local: item.local,
        convidados: item.convidado,
      }));

      setEvents(normalizedEvents);
    } catch (error) {
      console.error("ERRO AO BUSCAR EVENTOS:", error);
      console.error("RESPOSTA DA API:", error.response?.data);

      toast.error("Não foi possível carregar os eventos.");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // ÚLTIMOS 10 REGISTROS
  // =========================================================

  const latestEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => {
        const dateA = new Date(
          `${a.data}T${a.hora || "00:00:00"}`,
        );

        const dateB = new Date(
          `${b.data}T${b.hora || "00:00:00"}`,
        );

        return dateB - dateA;
      })
      .slice(0, 10);
  }, [events]);

  // =========================================================
  // PESQUISA + FILTROS
  // =========================================================

  const filteredEvents = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    const today = getToday();

    return latestEvents.filter((item) => {
      const morador = item.morador?.toLowerCase() || "";
      const local = item.local?.toLowerCase() || "";
      const convidados = item.convidados?.toLowerCase() || "";
      const tipoEvento = item.tipoEvento?.toLowerCase() || "";

      const matchesSearch =
        morador.includes(searchValue) ||
        local.includes(searchValue) ||
        convidados.includes(searchValue) ||
        tipoEvento.includes(searchValue);

      let matchesDate = true;

      if (dateFilter === "today") {
        matchesDate = item.data === today;
      }

      if (dateFilter === "previous") {
        matchesDate = item.data < today;
      }

      return matchesSearch && matchesDate;
    });
  }, [latestEvents, search, dateFilter]);

  // =========================================================
  // ABRIR MODAL DO QR CODE
  // =========================================================

  const handleOpenQRCode = (event) => {
    setSelectedEvent(event);
    setIsQRCodeModalOpen(true);
  };

  // =========================================================
  // ABRIR MODAL PARA CRIAR
  // =========================================================

  const handleOpenCreate = () => {
    setSelectedEvent(null);

    reset({
      morador: "",
      tipoEvento: "",
      data: "",
      hora: "",
      horaFim: "",
      local: "",
      convidados: "",
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // CRIAR EVENTO
  // =========================================================

  const handleSubmitEvent = async (data) => {
    const loadingToast = toast.loading("Cadastrando evento...");

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

      const response = await createEvent(payload);

      const normalizedEvent = {
        id: response.id,
        morador: response.morador,
        tipoEvento: response.tipo_evento,
        data: response.data_evento,
        hora: response.hora_inicio,
        horaFim: response.hora_fim,
        local: response.local,
        convidados: response.convidado,
      };

      setEvents((prev) => [normalizedEvent, ...prev]);

      reset();
      setSelectedEvent(null);
      setIsModalOpen(false);

      toast.dismiss(loadingToast);

      toast.success("Evento cadastrado com sucesso!", {
        duration: 5000,
      });
    } catch (error) {
      /*console.error("ERRO AO CADASTRAR EVENTO:", error);
      console.error("RESPOSTA DA API:", error.response?.data);*/

      toast.dismiss(loadingToast);

      toast.error("Não foi possível cadastrar o evento.");
    }
  };

  // =========================================================
  // ABRIR CONFIRMAÇÃO DE EXCLUSÃO
  // =========================================================

  const handleOpenDelete = (event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  // =========================================================
  // EXCLUIR
  // =========================================================

  const handleDelete = async () => {
    if (!selectedEvent) return;

    const loadingToast = toast.loading("Excluindo evento...");

    try {
      setIsDeleting(true);

      await deleteEvent(selectedEvent.id);

      setEvents((prev) =>
        prev.filter((item) => item.id !== selectedEvent.id),
      );

      setSelectedEvent(null);
      setIsDeleteModalOpen(false);

      toast.dismiss(loadingToast);

      toast.success("Evento eliminado com sucesso!", {
        duration: 5000,
      });
    } catch (error) {
      /*console.error("ERRO AO ELIMINAR EVENTO:", error);
      console.error("RESPOSTA DA API:", error.response?.data);*/

      toast.dismiss(loadingToast);

      toast.error("Não foi possível eliminar o evento.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <title>Eventos | Admin | Condomínio Kizomba</title>

      <AdminLayout title="Eventos">
        {/* HEADER */}
        <section className="flex flex-col justify-between gap-4 border-b border-neutral-400/30 pb-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-blue-900 sm:text-2xl">
              Gestão de Eventos
            </h1>

            <p className="mt-0.5 text-xs text-neutral-600 sm:text-sm">
              Consulte, cadastre e gerencie os eventos do condomínio.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-blue-800 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-900"
          >
            <i className="fas fa-plus text-xs" />
            Novo Evento
          </button>
        </section>

        {/* PESQUISA + FILTROS */}
        <section className="rounded-2xl border border-neutral-400/40 bg-neutral-50 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <i className="fas fa-magnifying-glass text-sm text-blue-800" />

            <h2 className="text-sm font-bold text-blue-900">
              Pesquisar eventos
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <i className="fas fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar morador, local ou convidado..."
                className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-11 pr-4 text-sm text-neutral-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
              />
            </div>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
            >
              <option value="all">Todos</option>
              <option value="today">Hoje</option>
              <option value="previous">Anteriores</option>
            </select>
          </div>
        </section>

        {/* LISTAGEM */}
        <section className="overflow-hidden rounded-2xl border border-neutral-400/40 bg-neutral-50 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-400/20 p-5">
            <div>
              <h2 className="text-sm font-bold text-blue-900">
                Eventos
              </h2>

              <p className="mt-0.5 text-xs text-neutral-600">
                Últimos 10 registros realizados.
              </p>
            </div>

            <span className="rounded-full bg-blue-800/10 px-3 py-1 text-xs font-bold text-blue-800">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1
                ? "registo"
                : "registos"}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center px-6 py-16">
              <i className="fas fa-spinner fa-spin text-xl text-blue-800" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <i className="fas fa-calendar-xmark text-3xl text-neutral-300" />

              <p className="mt-3 text-sm font-medium text-neutral-500">
                Nenhum evento encontrado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-275 text-left">
                <thead className="border-b border-neutral-200 bg-neutral-100/70">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Morador
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Evento
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Data
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Horário
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Local
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Convidados
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      QR Code
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-200">
                  {filteredEvents.map((item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-white"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-neutral-800">
                        {item.morador}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-800/10 px-3 py-1 text-xs font-semibold text-blue-800">
                          {item.tipoEvento}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {formatDate(item.data)}
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {item.hora} - {item.horaFim}
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {item.local}
                      </td>

                      <td className="max-w-xs px-5 py-4 text-sm text-neutral-600">
                        {item.convidados}
                      </td>

                      {/* QR CODE CLICÁVEL */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleOpenQRCode(item)}
                          title="Ver QR Code"
                          className="cursor-pointer rounded-xl border border-transparent bg-white p-2 transition hover:border-blue-200 hover:bg-blue-50"
                        >
                          <div className="w-fit rounded-xl border border-neutral-200 bg-white p-2">
                            <QRCode item={item} size={80} />
                          </div>
                        </button>
                      </td>

                      {/* AÇÕES */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(item)}
                            title="Eliminar evento"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
                          >
                            <i className="fas fa-trash text-xs" />
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
            MODAL CRIAR EVENTO
        ====================================================== */}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            if (!isSubmitting) {
              setIsModalOpen(false);
              setSelectedEvent(null);
              reset();
            }
          }}
          title="Novo Evento"
          icon="fas fa-calendar-plus"
        >
          <form
            onSubmit={handleSubmit(handleSubmitEvent)}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Dados do evento
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Preencha os campos abaixo.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* MORADOR */}
              <div>
                <label
                  htmlFor="morador"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Morador / Resident
                </label>

                <input
                  id="morador"
                  type="text"
                  placeholder="Nome do morador"
                  {...register("morador")}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                    errors.morador
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                  }`}
                />

                {errors.morador && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.morador.message}
                  </p>
                )}
              </div>

              {/* TIPO EVENTO */}
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
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                >
                  <option value="">
                    Selecione o tipo de evento / Select Event Type
                  </option>

                  <option value="Aniversário/Birthday">
                    Aniversário / Birthday
                  </option>

                  <option value="Reunião/Meeting">
                    Reunião / Meeting
                  </option>

                  <option value="Palestras/Lectures">
                    Palestras / Lectures
                  </option>

                  <option value="Aulas para criança/ Classes for children">
                    Aulas para criança / Classes for children
                  </option>

                  <option value="Jogos/Games">
                    Jogos / Games
                  </option>
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                />

                {errors.data && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.data.message}
                  </p>
                )}
              </div>

              {/* HORA */}
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
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
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
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

                  <option value="Ginásio/ Gym">
                    Ginásio / Gym
                  </option>

                  <option value="Campo Padel/ Padel court">
                    Campo Padel / Padel court
                  </option>

                  <option value="Campo de Ténis/Tennis Court">
                    Campo de Ténis / Tennis Court
                  </option>

                  <option value="Campo de Futebol/FootBall Court">
                    Campo de Futebol / Football Court
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
                  Convidados / Guest
                </label>

                <textarea
                  id="convidados"
                  {...register("convidados")}
                  placeholder="Escreva o nome dos convidados..."
                  rows="4"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
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
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus" />
                    Cadastrar evento
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>

        {/* =====================================================
            MODAL QR CODE
        ====================================================== */}

        <Modal
          isOpen={isQRCodeModalOpen}
          onClose={() => {
            setIsQRCodeModalOpen(false);
            setSelectedEvent(null);
          }}
          title="QR Code do Evento"
          icon="fas fa-qrcode"
        >
          {selectedEvent && (
            <div className="space-y-6">
              {/* QR CODE */}
              <div className="flex justify-center">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <QRCode item={selectedEvent} size={240} />
                </div>
              </div>

              {/* MORADOR */}
              <div className="text-center">
                <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Morador / Resident
                </span>

                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {selectedEvent.morador}
                </h3>
              </div>

              {/* PDF */}
              <div className="border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => generateEventPDF(selectedEvent)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <i className="fa-solid fa-file-pdf" />
                  Baixar PDF
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* =====================================================
            MODAL CONFIRMAR EXCLUSÃO
        ====================================================== */}

        <ModalSmall
          isOpen={isDeleteModalOpen}
          onClose={() => {
            if (!isDeleting) {
              setIsDeleteModalOpen(false);
              setSelectedEvent(null);
            }
          }}
          title="Eliminar evento"
          icon="fas fa-trash"
        >
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <i className="fas fa-trash text-lg" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              Tem certeza que deseja eliminar?
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              O evento de{" "}
              <strong className="font-semibold text-slate-700">
                {selectedEvent?.morador}
              </strong>{" "}
              será eliminado permanentemente.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedEvent(null);
                }}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="cursor-pointer rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash mr-2" />
                    Eliminar evento
                  </>
                )}
              </button>
            </div>
          </div>
        </ModalSmall>
      </AdminLayout>
    </>
  );
}
