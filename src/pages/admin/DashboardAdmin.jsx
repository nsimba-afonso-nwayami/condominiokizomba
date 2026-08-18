import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import AdminLayout from "./components/AdminLayout";
import Modal from "./components/Modal";
import QRCode from "./components/QRCode";

import { formatDate, getToday } from "../../utils/dateUtils";
import { getEvents } from "../../services/eventService";
import { generateEventPDF } from "../../services/pdfService";

export default function DashboardAdmin() {
  const [events, setEvents] = useState([]);
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();

        console.log("EVENTOS RETORNADOS PELA API:", data);

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

        setEvents(normalizedEvents);
      } catch (error) {
        console.error("ERRO AO BUSCAR EVENTOS:", error);
        console.error("RESPOSTA DA API:", error.response?.data);

        toast.error("Não foi possível carregar os eventos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const today = getToday();

  // Apenas eventos de hoje
  const qrcodesHoje = events.filter((item) => item.data === today);

  const stats = [
    {
      title: "Total de Eventos",
      value: events.length,
      description: "Eventos registados",
      icon: "fa-calendar-days",
    },
    {
      title: "Eventos Hoje",
      value: qrcodesHoje.length,
      description: "Agendados para hoje",
      icon: "fa-calendar-check",
    },
    {
      title: "Utilizadores",
      value: "—",
      description: "Utilizadores cadastrados",
      icon: "fa-users",
    },
  ];

  return (
    <>
      <title>Início | Admin | Condomínio Kizomba</title>

      <AdminLayout title="Início">
        {/* WELCOME HEADER */}
        <section className="flex flex-col justify-between gap-4 border-b border-neutral-400/30 pb-2 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-blue-900 sm:text-2xl">
              Bem-vindo, Adriano
            </h1>

            <p className="mt-0.5 text-xs text-neutral-600 sm:text-sm">
              Resumo da atividade recente no Condomínio Kizomba.
            </p>
          </div>

          <Link
            to="/dashboard/admin/eventos"
            className="
              inline-flex w-fit items-center gap-2
              rounded-xl bg-blue-800
              px-4 py-2
              text-xs font-semibold text-neutral-50
              shadow-sm transition-colors duration-200
              hover:bg-blue-900
            "
          >
            <i className="fas fa-plus text-xs" />
            Novo Evento
          </Link>
        </section>

        {/* STATS CARDS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="
                rounded-2xl
                border border-neutral-400/40
                bg-neutral-50
                p-5
                shadow-sm
                transition-all duration-200
                hover:border-blue-800/40
              "
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    {stat.title}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-blue-900">
                    {isLoading ? "..." : stat.value}
                  </h2>

                  <p className="mt-1 text-xs text-neutral-600">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-800/10 text-blue-800">
                  <i className={`fas ${stat.icon} text-base`} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* QR CODES DE HOJE */}
        <section className="rounded-2xl border border-neutral-400/40 bg-neutral-50 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-blue-900">
                QR Codes gerados hoje
              </h2>

              <p className="mt-0.5 text-xs text-neutral-600">
                Acessos programados para hoje.
              </p>
            </div>

            <span className="rounded-full bg-blue-800/10 px-3 py-1 text-xs font-bold text-blue-800">
              {isLoading
                ? "..."
                : `${qrcodesHoje.length} ${
                    qrcodesHoje.length === 1 ? "registo" : "registos"
                  }`}
            </span>
          </div>

          {isLoading ? (
            <div className="flex min-h-40 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <i className="fas fa-spinner fa-spin text-blue-800" />
                Carregando eventos...
              </div>
            </div>
          ) : qrcodesHoje.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-400/50 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-800/10 text-blue-800">
                <i className="fas fa-qrcode text-xl" />
              </div>

              <h4 className="mt-4 font-bold text-blue-900">
                Nenhum QR Code gerado hoje
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
                Ainda não existe nenhum QR Code registado para hoje.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {qrcodesHoje.map((item) => (
                <QRCodeCard
                  key={item.id}
                  item={item}
                  onQRCodeClick={setSelectedQRCode}
                />
              ))}
            </div>
          )}
        </section>

        {/* MODAL DO QR CODE */}
        <Modal
          isOpen={!!selectedQRCode}
          onClose={() => setSelectedQRCode(null)}
          title="QR Code"
          icon="fa-solid fa-qrcode"
        >
          {selectedQRCode && (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedQRCode.morador}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedQRCode.tipoEvento}
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
                <QRCode item={selectedQRCode} size={320} />
              </div>

              <p className="mt-5 text-center text-sm text-slate-500">
                Apresente este QR Code para leitura na entrada do condomínio.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => generateEventPDF(selectedQRCode)}
                  className="
                    flex cursor-pointer items-center justify-center
                    gap-2 rounded-xl border border-slate-200
                    bg-white px-5 py-3 text-sm font-semibold
                    text-slate-700 transition
                    hover:border-blue-200 hover:bg-blue-50
                    hover:text-blue-700
                  "
                >
                  <i className="fa-solid fa-file-pdf" />
                  Baixar PDF
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedQRCode(null)}
                  className="
                    flex cursor-pointer items-center justify-center
                    gap-2 rounded-xl bg-blue-800
                    px-5 py-3 text-sm font-semibold text-white
                    transition hover:bg-blue-700
                  "
                >
                  <i className="fa-solid fa-check" />
                  Fechar
                </button>
              </div>
            </div>
          )}
        </Modal>
      </AdminLayout>
    </>
  );
}

function QRCodeCard({ item, onQRCodeClick }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-800">
            {item.tipoEvento}
          </span>

          <h4 className="mt-3 font-bold text-slate-900">
            {item.morador}
          </h4>

          <p className="mt-1 text-xs text-slate-500">
            <i className="fa-solid fa-location-dot mr-1 text-blue-700" />
            {item.local}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onQRCodeClick(item)}
          className="cursor-pointer rounded-xl border border-transparent p-1 transition hover:border-blue-200 hover:bg-blue-50"
        >
          <div id={`qr-code-${item.id}`}>
            <QRCode item={item} size={140} />
          </div>
        </button>
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

      <div className="mt-5 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => generateEventPDF(item)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <i className="fa-solid fa-file-pdf" />
          Baixar PDF
        </button>
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
