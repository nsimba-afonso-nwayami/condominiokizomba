import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getEventById } from "../../services/eventService";
import { formatDate } from "../../utils/dateUtils";

export default function Event() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);

        setEvent(data);
      } catch (error) {
        toast.error(
          "Não foi possível carregar o evento. / Unable to load the event.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-blue-700" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Carregando dados do evento... / Loading event data...
          </p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <i className="fa-solid fa-calendar-xmark text-xl" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Evento não encontrado
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Event not found
          </p>

          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            O evento associado a este QR Code não existe ou não está disponível.
            <br />
            The event associated with this QR Code does not exist or is
            unavailable.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <title>{event.tipo_evento} | Gestão de Eventos</title>

      <main className="min-h-screen bg-slate-50">
        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-5">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Gestão de Eventos
              </h1>

              <p className="mt-0.5 text-xs text-slate-500">
                Event Management & QR Code System
              </p>
            </div>
          </div>
        </header>

        {/* CONTEÚDO */}
        <section className="mx-auto max-w-4xl px-6 py-10">
          {/* INTRODUÇÃO */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Evento registado / Registered event
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Dados do evento
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Event details
            </p>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
              Consulte as informações associadas a este QR Code.
              <br />
              View the information associated with this QR Code.
            </p>
          </div>

          {/* EVENTO */}
          <div className="overflow-hidden border border-slate-200 bg-white">
            {/* CABEÇALHO DO EVENTO */}
            <div className="border-b border-slate-200 bg-blue-800 px-6 py-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                Tipo de evento / Event type
              </p>

              <h3 className="mt-1 text-xl font-bold">{event.tipo_evento}</h3>
            </div>

            {/* DADOS */}
            <div className="grid gap-x-8 gap-y-7 p-6 sm:grid-cols-2 md:p-8">
              <EventInfo
                icon="fa-solid fa-user"
                label="Morador / Resident"
                value={event.morador}
              />

              <EventInfo
                icon="fa-solid fa-calendar-days"
                label="Data do evento / Event date"
                value={formatDate(event.data_evento)}
              />

              <EventInfo
                icon="fa-solid fa-clock"
                label="Horário / Time"
                value={`${event.hora_inicio} - ${event.hora_fim}`}
              />

              <EventInfo
                icon="fa-solid fa-location-dot"
                label="Local / Location"
                value={event.local}
              />

              <div className="sm:col-span-2">
                <EventInfo
                  icon="fa-solid fa-users"
                  label="Convidados / Guests"
                  value={event.convidado}
                />
              </div>
            </div>

            {/* INFORMAÇÃO */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle-info mt-0.5 text-blue-700" />

                <div>
                  <p className="text-xs font-semibold text-slate-600">
                    Informação
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Estas informações correspondem ao evento associado ao QR
                    Code apresentado.
                    <br />
                    This information corresponds to the event associated with
                    the presented QR Code.
                  </p>
                </div>
              </div>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-slate-200 px-6 py-4">
              <p className="text-center text-xs text-slate-400">
                Gestão de Eventos / Event Management & QR Code System
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function EventInfo({ icon, label, value }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <i className={icon} />
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}
