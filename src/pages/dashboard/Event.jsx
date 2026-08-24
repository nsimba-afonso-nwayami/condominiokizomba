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
          <p className="text-sm font-medium text-slate-500">
            Carregando dados do evento... / Loading event data...
          </p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">
            Evento não encontrado / Event not found
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-500">
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
      <title>Evento | Sistema de QR Code</title>

      <main className="min-h-screen bg-slate-50">
        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-5">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Sistema de Gestão de Acesso
              </h1>

              <p className="mt-0.5 text-xs text-slate-500">
                QR Code Access Management System
              </p>
            </div>
          </div>
        </header>

        {/* CONTEÚDO */}
        <section className="mx-auto max-w-4xl px-6 py-10">
          {/* INTRODUÇÃO */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Acesso autorizado / Authorized access
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Dados do evento / Event details
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Consulte as informações associadas a este QR Code.
              <br />
              View the information associated with this QR Code.
            </p>
          </div>

          {/* EVENTO */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5">
              <span className="text-xs font-semibold text-blue-700">
                {event.tipo_evento}
              </span>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                {event.morador}
              </h3>
            </div>

            {/* DADOS */}
            <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
              <EventInfo label="Morador / Resident" value={event.morador} />

              <EventInfo
                label="Data do evento / Event date"
                value={formatDate(event.data_evento)}
              />

              <EventInfo
                label="Horário / Time"
                value={`${event.hora_inicio} - ${event.hora_fim}`}
              />

              <EventInfo label="Local / Location" value={event.local} />

              <div className="sm:col-span-2">
                <EventInfo
                  label="Convidados / Guests"
                  value={event.convidado}
                />
              </div>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-slate-200 px-6 py-4">
              <p className="text-center text-xs text-slate-400">
                Sistema de Gestão de Acesso / QR Code Access Management System
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function EventInfo({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}
