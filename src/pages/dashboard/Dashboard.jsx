import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./components/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { formatDate, getToday } from "../../utils/dateUtils";
import { logout } from "../../services/authService";
import { qrcodeSchema } from "../../validations/qrcodeSchema";
import { getEvents, createEvent } from "../../services/eventService";
import { QRCodeCanvas } from "qrcode.react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [qrcodes, setQrcodes] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Sessão terminada com sucesso.");
    navigate("/login", { replace: true });
  };

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
    const fetchEvents = async () => {
      try {
        const data = await getEvents();

        console.log("EVENTOS RETORNADOS PELA API:", data);
        console.log("PRIMEIRO EVENTO:", data[0]);

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

        console.log("EVENTOS NORMALIZADOS:", normalizedEvents);

        setQrcodes(normalizedEvents);
      } catch (error) {
        console.error("ERRO AO BUSCAR EVENTOS:", error);
        console.error("RESPOSTA DA API:", error.response?.data);

        toast.error("Não foi possível carregar os eventos.");
      }
    };

    fetchEvents();
  }, []);

  const today = getToday();

  const qrcodesHoje = qrcodes.filter((item) => item.data === today);

  const getDateRange = () => {
    const todayDate = new Date(`${today}T00:00:00`);

    const yesterday = new Date(todayDate);
    yesterday.setDate(yesterday.getDate() - 1);

    const startOfWeek = new Date(todayDate);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? 6 : day - 1;

    startOfWeek.setDate(startOfWeek.getDate() - diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const previousWeekStart = new Date(startOfWeek);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);

    const previousWeekEnd = new Date(startOfWeek);
    previousWeekEnd.setDate(previousWeekEnd.getDate() - 1);

    const startOfMonth = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      1,
    );

    const endOfMonth = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth() + 1,
      0,
    );

    const startOfPreviousMonth = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth() - 1,
      1,
    );

    const endOfPreviousMonth = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      0,
    );

    return {
      today: {
        start: todayDate,
        end: todayDate,
      },

      yesterday: {
        start: yesterday,
        end: yesterday,
      },

      thisWeek: {
        start: startOfWeek,
        end: endOfWeek,
      },

      lastWeek: {
        start: previousWeekStart,
        end: previousWeekEnd,
      },

      thisMonth: {
        start: startOfMonth,
        end: endOfMonth,
      },

      lastMonth: {
        start: startOfPreviousMonth,
        end: endOfPreviousMonth,
      },
    };
  };

  const isDateInRange = (date, filter) => {
    if (filter === "all") return true;

    if (filter === "previous") {
      return date < today;
    }

    const ranges = getDateRange();
    const selectedRange = ranges[filter];

    if (!selectedRange) return true;

    const itemDate = new Date(`${date}T00:00:00`);

    return itemDate >= selectedRange.start && itemDate <= selectedRange.end;
  };

  const filteredQrcodes = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return qrcodes
      .filter((item) => {
        const morador = item.morador?.toLowerCase() || "";
        const local = item.local?.toLowerCase() || "";
        const convidados = item.convidados?.toLowerCase() || "";
        const tipoEvento = item.tipoEvento?.toLowerCase() || "";

        const matchesSearch =
          morador.includes(searchValue) ||
          local.includes(searchValue) ||
          convidados.includes(searchValue) ||
          tipoEvento.includes(searchValue);

        const matchesDate = isDateInRange(item.data, dateFilter);

        return matchesSearch && matchesDate;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.data}T${a.hora || "00:00:00"}`);
        const dateB = new Date(`${b.data}T${b.hora || "00:00:00"}`);

        return dateB - dateA;
      });
  }, [qrcodes, search, dateFilter, today]);

  const handleGenerateQRCode = async (data) => {
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

      console.log("PAYLOAD ENVIADO:", payload);

      const newEvent = await createEvent(payload);

      console.log("EVENTO CRIADO:", newEvent);

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

      setQrcodes((prev) => [normalizedEvent, ...prev]);

      reset();
      setIsModalOpen(false);

      toast.dismiss(loadingToast);
      toast.success("Evento cadastrado com sucesso!");
    } catch (error) {
      console.error("ERRO AO CADASTRAR EVENTO:", error);
      console.error("RESPOSTA DA API:", error.response?.data);

      toast.dismiss(loadingToast);

      toast.error("Não foi possível cadastrar o evento.");
    }
  };

  return (
    <>
      <title>My Dashboard</title>

      <section className="min-h-screen bg-slate-50">
        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white">
                <i className="fa-solid fa-qrcode text-xl" />
              </div>

              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Condomínio Kizomba
                </h1>

                <p className="text-xs text-slate-500">Gestão de QR Codes</p>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">
                  Bem-vindo
                </p>

                <p className="text-xs text-slate-500">Administrador</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-800">
                <i className="fa-solid fa-user" />
              </div>
            </div>
          </div>
        </header>

        {/* CONTEÚDO */}
        <main className="mx-auto max-w-7xl px-6 py-8">
          {/* TÍTULO + AÇÕES */}
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">QR Codes</h2>

              <p className="mt-1 text-sm text-slate-500">
                Gere e acompanhe os acessos dos moradores e convidados.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <i className="fa-solid fa-qrcode" />
                Gerar QR Code
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <i className="fa-solid fa-right-from-bracket" />
                Sair
              </button>
            </div>
          </div>

          {/* PESQUISA E FILTROS */}
          {/* PESQUISA */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass text-sm text-blue-700" />

              <h3 className="text-sm font-bold text-slate-800">
                Pesquisar QR Codes
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_240px]">
              {/* PESQUISA */}
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar morador, local ou convidado..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
                />
              </div>

              {/* DATA */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
              >
                <option value="today">Hoje</option>
                <option value="yesterday">Ontem</option>
                <option value="thisWeek">Esta semana</option>
                <option value="lastWeek">Semana passada</option>
                <option value="thisMonth">Este mês</option>
                <option value="lastMonth">Mês passado</option>
                <option value="previous">Anteriores</option>
                <option value="all">Todos</option>
              </select>
            </div>
          </div>

          {/* QR CODES DE HOJE */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  QR Codes gerados hoje
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Acessos programados para hoje.
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                {qrcodesHoje.length}{" "}
                {qrcodesHoje.length === 1 ? "registo" : "registos"}
              </span>
            </div>

            {qrcodesHoje.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <i className="fa-solid fa-qrcode text-xl" />
                </div>

                <h4 className="mt-4 font-bold text-slate-800">
                  Nenhum QR Code gerado hoje
                </h4>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Ainda não existe nenhum QR Code registado para hoje.
                </p>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-5 cursor-pointer rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <i className="fa-solid fa-plus mr-2" />
                  Gerar QR Code
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {qrcodesHoje.map((item) => (
                  <QRCodeCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* TODOS OS REGISTOS */}
          {/* HISTÓRICO */}
          <div className="mt-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Histórico de QR Codes
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Consulte os QR Codes de hoje e dos períodos anteriores.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowHistory((prev) => !prev)}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <i
                  className={`fa-solid ${
                    showHistory ? "fa-chevron-up" : "fa-clock-rotate-left"
                  }`}
                />

                {showHistory ? "Ocultar histórico" : "Mostrar histórico"}
              </button>
            </div>

            {showHistory && (
              <div className="mt-5">
                {filteredQrcodes.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
                    <i className="fa-solid fa-magnifying-glass text-3xl text-slate-300" />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                      Nenhum QR Code encontrado para o período selecionado.
                    </p>

                    {dateFilter !== "all" && (
                      <button
                        type="button"
                        onClick={() => setDateFilter("all")}
                        className="mt-4 cursor-pointer text-sm font-semibold text-blue-700 hover:text-blue-800"
                      >
                        Ver todos os QR Codes
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-275 text-left">
                        <thead className="border-b border-slate-200 bg-slate-50">
                          <tr>
                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                              Morador
                            </th>

                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                              Evento
                            </th>

                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                              Data
                            </th>

                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                              Horário
                            </th>

                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                              Local
                            </th>

                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                              Convidados
                            </th>

                            <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                              QR Code
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {filteredQrcodes.map((item) => (
                            <tr
                              key={item.id}
                              className="transition hover:bg-slate-50"
                            >
                              <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                                {item.morador}
                              </td>

                              <td className="px-5 py-4">
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                                  {item.tipoEvento}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-600">
                                {formatDate(item.data)}
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-600">
                                {item.hora} - {item.horaFim}
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-600">
                                {item.local}
                              </td>

                              <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                                {item.convidados}
                              </td>

                              <td className="px-5 py-4">
                                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
                                  <QRCodeCanvas
                                    value={`https://condominiokizomba.com/evento/${item.id}`}
                                    size={64}
                                    level="H"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* MODAL */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Gerar QR Code"
          icon="fa-solid fa-qrcode"
        >
          <form
            onSubmit={handleSubmit(handleGenerateQRCode)}
            className="space-y-6"
          >
            {/* INTRODUÇÃO */}
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Dados do acesso
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Preencha os dados abaixo para gerar um novo QR Code.
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

                <div className="relative">
                  <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="morador"
                    type="text"
                    placeholder="Nome do morador"
                    {...register("morador")}
                    className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
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
                  name="tipoEvento"
                  {...register("tipoEvento")}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                >
                  <option value="">
                    Selecione o tipo de evento / Select Event Type
                  </option>

                  <option value="Aniversário/Birthday">
                    Aniversário / Birthday
                  </option>

                  <option value="Reunião/Meeting">Reunião/Meeting</option>

                  <option value="Palestras/Lectures">
                    Palestras / Palestras
                  </option>

                  <option value="Aulas para criança/ Classes for children">
                    Aulas para criança / Aulas para crianças
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
                  name="data"
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
                  name="hora"
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
                  name="horaFim"
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
                  name="local"
                  {...register("local")}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                >
                  <option value="">Selecione o local/ Selecionar local</option>

                  <option value="Rés do chão">
                    Rés do chão / Ground floor
                  </option>

                  <option value="Piso 01/ Floor 01">Piso 01 / Andar 01</option>

                  <option value="Residência/ Residencial">
                    Residência / Residencial
                  </option>

                  <option value="Ginásio/ Gym">Ginásio / Ginásio</option>

                  <option value="Campo Padel/ Padel court">
                    Campo de Padel / Quadra de Padel
                  </option>

                  <option value="Campo de Ténis/Tennis Court">
                    Campo de Ténis / Campo de Ténis
                  </option>

                  <option value="Campo de Futebol/FootBall Court">
                    Campo de Futebol / Quadra de Futebol
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
                  name="convidados"
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
                    <i className="fa-solid fa-spinner fa-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-qrcode" />
                    Gerar QR Code
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      </section>
    </>
  );
}

function QRCodeCard({ item }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-800">
            {item.tipoEvento}
          </span>

          <h4 className="mt-3 font-bold text-slate-900">{item.morador}</h4>

          <p className="mt-1 text-xs text-slate-500">
            <i className="fa-solid fa-location-dot mr-1 text-blue-700" />
            {item.local}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-2">
          <QRCodeCanvas
            value={`https://condominiokizomba.com/evento/${item.id}`}
            size={80}
            level="H"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
        <InfoItem
          icon="fa-solid fa-calendar"
          label="Data"
          value={formatDate(item.data)}
        />

        <InfoItem
          icon="fa-solid fa-clock"
          label="Horário"
          value={`${item.hora} - ${item.horaFim}`}
        />

        <InfoItem
          icon="fa-solid fa-users"
          label="Convidados"
          value={item.convidados}
        />
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <i className={`${icon} mr-1`} />
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-700">{value}</p>
    </div>
  );
}
