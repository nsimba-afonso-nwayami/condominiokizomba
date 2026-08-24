import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCode({ item, size = 80 }) {
  const canvasRef = useRef(null);
  const [qrImage, setQrImage] = useState("");

  // LINKS DO SISTEMA

  // Produção
  const productionUrl = `https://sistemagestaodeacesso.com/evento/${item.id}`;

  // Vercel
  const vercelUrl = `https://condominiokizomba.vercel.app/evento/${item.id}`;

  // Desenvolvimento
  const localhostUrl = `http://localhost:5173/evento/${item.id}`;

  // Link utilizado atualmente
  const eventUrl = vercelUrl;

  // CONTEÚDO DO QR CODE
  // PORTUGUÊS + INGLÊS

  const qrValue = `
    Sistema de Gestão de Acesso / Access Management System

    Evento #${item.id} / Event #${item.id}

    Morador / Resident:
    ${item.morador || "Não informado / Not informed"}

    Evento / Event:
    ${item.tipoEvento || "Não informado / Not informed"}

    Data / Date:
    ${item.data || "Não informada / Not informed"}

    Horário / Time:
    ${item.hora || "--:--"} - ${item.horaFim || "--:--"}

    Local / Location:
    ${item.local || "Não informado / Not informed"}

    Convidados / Guests:
    ${item.convidados || "Não informado / Not informed"}

    Link do evento / Event link:
    ${eventUrl}
    `.trim();

  // =========================================================
  // RESOLUÇÃO DO QR CODE
  // =========================================================
  //
  // A imagem visual pode ser pequena (80px, 240px etc.),
  // mas o canvas original será sempre gerado em alta resolução.
  //
  // Isso é especialmente importante para o PDF.
  // =========================================================

  const canvasSize = Math.max(size * 4, 600);

  // GERAR IMAGEM

  useEffect(() => {
    if (!canvasRef.current) return;

    const image = canvasRef.current.toDataURL("image/png");

    setQrImage(image);
  }, [item.id, size, qrValue]);

  return (
    <>
      {/* QR CODE ORIGINAL - ALTA RESOLUÇÃO */}

      <div
        id={`qr-code-${item.id}`}
        className="hidden"
      >
        <QRCodeCanvas
          ref={canvasRef}
          value={qrValue}
          size={canvasSize}
          level="M"
          includeMargin
        />
      </div>

      {/* QR CODE VISUAL */}

      {qrImage && (
        <div className="block rounded-lg border border-slate-200 bg-white p-2">
          <img
            src={qrImage}
            alt={`QR Code do evento de ${item.morador}`}
            width={size}
            height={size}
            className="block"
          />
        </div>
      )}
    </>
  );
}
