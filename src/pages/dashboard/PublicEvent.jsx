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
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-500">
            Carregando dados do evento... / Loading event data...
          </p>
        </div>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-4xl font-black text-slate-300">404</p>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Evento não encontrado
          </h1>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Event not found
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            O evento associado a este QR Code não existe ou já não está
            disponível.
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            The event associated with this QR Code does not exist or is no
            longer available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <title>{event.tipoEvento} | Sistema de QR Code</title>

      <section className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          {/* CABEÇALHO */}
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold text-blue-800">
              Sistema de Gestão de Acesso
            </p>

            <p className="mt-1 text-xs text-slate-400">
              QR Code Access Management System
            </p>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Dados do evento
            </h1>

            <p className="mt-1 text-sm text-slate-500">Event information</p>
          </div>

          {/* EVENTO */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-6">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Tipo de evento / Event type
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                {event.tipoEvento}
              </h2>
            </div>

            {/* DADOS */}
            <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
              <EventInfo label="Morador / Resident" value={event.morador} />

              <EventInfo label="Local / Location" value={event.local} />

              <EventInfo label="Data / Date" value={formatDate(event.data)} />

              <EventInfo
                label="Horário / Time"
                value={`${event.hora} - ${event.horaFim}`}
              />

              <div className="sm:col-span-2">
                <EventInfo
                  label="Convidados / Guests"
                  value={event.convidados}
                />
              </div>
            </div>

            {/* INFORMAÇÃO */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
              <p className="text-xs leading-5 text-slate-500">
                Este QR Code está associado ao evento acima. Apresente estas
                informações quando solicitado na entrada.
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                This QR Code is associated with the event above. Present this
                information when requested at the entrance.
              </p>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-slate-200 px-6 py-4 text-center">
              <p className="text-xs font-semibold text-slate-500">
                Sistema de Gestão de Acesso
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                QR Code Access Management System
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function EventInfo({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-800">
        {value || "Não informado / Not provided"}
      </p>
    </div>
  );
}
