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
        /*console.error("ERRO AO BUSCAR EVENTO:", error);
        console.error("RESPOSTA DA API:", error.response?.data);*/

        toast.error("Não foi possível carregar o evento.");
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
          <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-700" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Carregando dados do evento...
          </p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <i className="fa-solid fa-circle-exclamation text-xl" />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Evento não encontrado
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            O evento associado a este QR Code não existe ou não está disponível.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <title>Evento | Condomínio Kizomba</title>

      <main className="min-h-screen bg-slate-50">
        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white">
              <i className="fa-solid fa-qrcode text-xl" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Condomínio Kizomba
              </h1>

              <p className="text-xs text-slate-500">
                Dados do evento
              </p>
            </div>
          </div>
        </header>

        {/* CONTEÚDO */}
        <section className="mx-auto max-w-4xl px-6 py-10">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Acesso autorizado
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Dados do evento
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Consulte as informações associadas a este QR Code.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* EVENTO */}
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                {event.tipo_evento}
              </span>

              <h3 className="mt-3 text-xl font-bold text-slate-900">
                {event.morador}
              </h3>
            </div>

            {/* DADOS */}
            <div className="grid gap-6 p-6 sm:grid-cols-2">
              <EventInfo
                icon="fa-solid fa-user"
                label="Morador"
                value={event.morador}
              />

              <EventInfo
                icon="fa-solid fa-calendar"
                label="Data do evento"
                value={formatDate(event.data_evento)}
              />

              <EventInfo
                icon="fa-solid fa-clock"
                label="Horário"
                value={`${event.hora_inicio} - ${event.hora_fim}`}
              />

              <EventInfo
                icon="fa-solid fa-location-dot"
                label="Local"
                value={event.local}
              />

              <div className="sm:col-span-2">
                <EventInfo
                  icon="fa-solid fa-users"
                  label="Convidados"
                  value={event.convidado}
                />
              </div>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-slate-200 px-6 py-4">
              <p className="text-center text-xs text-slate-400">
                Condomínio Kizomba • Sistema de Gestão de Acessos
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
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <i className={`${icon} mr-1`} />
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}
