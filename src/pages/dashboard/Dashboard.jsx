import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./components/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { qrcodeSchema } from "../../validations/qrcodeSchema";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("today");

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

  const [qrcodes, setQrcodes] = useState([
    {
      id: 1,
      morador: "João Manuel",
      tipoEvento: "Aniversário/ Birthday",
      data: "2026-08-13",
      hora: "10:30",
      horaFim: "13:00",
      local: "Rés do chão",
      convidados: "Pedro Manuel, Ana Costa e Carlos José",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=KIZONMBA-001",
    },
    {
      id: 2,
      morador: "Maria José",
      tipoEvento: "Reunião/Meeting",
      data: "2026-08-13",
      hora: "14:00",
      horaFim: "18:00",
      local: "Piso 01/ Floor 01",
      convidados: "João Silva, Paulo António, Maria Clara",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=KIZONMBA-002",
    },
    {
      id: 3,
      morador: "Carlos Pedro",
      tipoEvento: "Palestras/Lectures",
      data: "2026-08-12",
      hora: "08:00",
      horaFim: "12:00",
      local: "Ginásio/ Gym",
      convidados: "Miguel Santos e Luís Pedro",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=KIZONMBA-003",
    },
    {
      id: 4,
      morador: "Ana Cristina",
      tipoEvento: "Jogos/ Games",
      data: "2026-08-08",
      hora: "15:00",
      horaFim: "18:00",
      local: "Campo Padel/ Padel court",
      convidados: "Ricardo, Bruno, André e Filipe",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=KIZONMBA-004",
    },
    {
      id: 5,
      morador: "Paulo Manuel",
      tipoEvento: "Aulas para criança/ Classes for children",
      data: "2026-08-03",
      hora: "09:00",
      horaFim: "11:00",
      local: "Campo de Futebol/FootBall Court",
      convidados: "Mário, João, Lucas e Pedro",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=KIZONMBA-005",
    },
  ]);

  const today = "2026-08-13";

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
    return qrcodes.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        item.morador.toLowerCase().includes(searchValue) ||
        item.local.toLowerCase().includes(searchValue) ||
        item.convidados.toLowerCase().includes(searchValue);

      const matchesEvent =
        eventFilter === "" || item.tipoEvento === eventFilter;

      const matchesLocation =
        locationFilter === "" || item.local === locationFilter;

      const matchesDate = isDateInRange(item.data, dateFilter);

      return matchesSearch && matchesEvent && matchesLocation && matchesDate;
    });
  }, [qrcodes, search, eventFilter, locationFilter, dateFilter]);

  const handleGenerateQRCode = async (data) => {
    const loadingToast = toast.loading("Gerando QR Code...");

    try {
      // Simulação de processamento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newQRCode = {
        id: Date.now(),
        ...data,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=KIZONMBA-${Date.now()}`,
      };

      setQrcodes((prev) => [newQRCode, ...prev]);

      reset();

      setIsModalOpen(false);

      toast.dismiss(loadingToast);

      toast.success("QR Code gerado com sucesso!");
    } catch (error) {
      console.error(error);

      toast.dismiss(loadingToast);

      toast.error("Não foi possível gerar o QR Code.");
    }
  };

  const locations = [
    "Rés do chão",
    "Piso 01/ Floor 01",
    "Residência/ Residencial",
    "Ginásio/ Gym",
    "Campo Padel/ Padel court",
    "Campo de Ténis/Tennis Court",
    "Campo de Futebol/FootBall Court",
  ];

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

              <Link
                to="/login"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <i className="fa-solid fa-right-from-bracket" />
                Sair
              </Link>
            </div>
          </div>

          {/* PESQUISA E FILTROS */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <i className="fa-solid fa-filter text-sm text-blue-700" />

              <h3 className="text-sm font-bold text-slate-800">
                Pesquisar QR Codes
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* PESQUISA */}
              <div className="relative lg:col-span-2">
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
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
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

              {/* EVENTO */}
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
              >
                <option value="">
                  Selecione o tipo de evento/Select Event Type
                </option>

                <option value="Aniversário/ Birthday">
                  Aniversário/ Aniversário
                </option>

                <option value="Reunião/Meeting">Reunião/Meeting</option>

                <option value="Palestras/Lectures">Palestras/Palestras</option>

                <option value="Aulas para criança/ Classes for children">
                  Aulas para criança/ Aulas para crianças
                </option>

                <option value="Jogos/ Games">Jogos/ Games</option>
              </select>

              {/* LOCAL */}
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
              >
                <option value="">Selecione o local/ Selecionar local</option>

                <option value="Rés do chão">Rés do chão / Ground floor</option>

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
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                QR Codes cadastrados
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Histórico de QR Codes gerados no sistema.
              </p>
            </div>

            {filteredQrcodes.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
                <i className="fa-solid fa-magnifying-glass text-3xl text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-500">
                  Nenhum QR Code encontrado para o período selecionado.
                </p>

                <button
                  type="button"
                  onClick={() => setDateFilter("all")}
                  className="mt-4 cursor-pointer text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  Ver todos os QR Codes
                </button>
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
                            <img
                              src={item.qrCode}
                              alt={`QR Code de ${item.morador}`}
                              className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

        <img
          src={item.qrCode}
          alt={`QR Code de ${item.morador}`}
          className="h-20 w-20 rounded-lg border border-slate-200"
        />
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

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-PT");
}
