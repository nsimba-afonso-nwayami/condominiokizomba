import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getEventById } from "../../services/eventService";
import { formatDate } from "../../utils/dateUtils";

export default function PublicEvent() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);

        setEvent({
          id: data.id,
          morador: data.morador,
          tipoEvento: data.tipo_evento,
          data: data.data_evento,
          hora: data.hora_inicio,
          horaFim: data.hora_fim,
          local: data.local,
          convidados: data.convidado,
        });
      } catch (error) {
        console.error("Erro ao carregar evento:", error);
        toast.error("Não foi possível carregar o evento.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-700" />

          <p className="mt-4 text-sm text-slate-500">
            Carregando dados do evento...
          </p>
        </div>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <i className="fa-solid fa-circle-exclamation text-2xl" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Evento não encontrado
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            O evento associado a este QR Code não existe ou já não está
            disponível.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <title>{event.tipoEvento} | Condomínio Kizomba</title>

      <section className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          {/* HEADER */}
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white">
              <i className="fa-solid fa-qrcode text-2xl" />
            </div>

            <h1 className="mt-4 text-2xl font-bold text-slate-900">
              Condomínio Kizomba
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Dados do evento
            </p>
          </div>

          {/* EVENTO */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 bg-blue-800 px-6 py-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                Tipo de evento
              </p>

              <h2 className="mt-1 text-xl font-bold">
                {event.tipoEvento}
              </h2>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <EventInfo
                icon="fa-solid fa-user"
                label="Morador"
                value={event.morador}
              />

              <EventInfo
                icon="fa-solid fa-location-dot"
                label="Local"
                value={event.local}
              />

              <EventInfo
                icon="fa-solid fa-calendar"
                label="Data"
                value={formatDate(event.data)}
              />

              <EventInfo
                icon="fa-solid fa-clock"
                label="Horário"
                value={`${event.hora} - ${event.horaFim}`}
              />

              <div className="sm:col-span-2">
                <EventInfo
                  icon="fa-solid fa-users"
                  label="Convidados"
                  value={event.convidados}
                />
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle-info mt-0.5 text-blue-700" />

                <p className="text-xs leading-relaxed text-slate-500">
                  Este QR Code está associado ao evento acima. Apresente
                  estas informações quando solicitado na entrada do
                  condomínio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function EventInfo({ icon, label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        <i className={`${icon} mr-2`} />
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-800">
        {value || "Não informado"}
      </p>
    </div>
  );
}
