import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";

export default function QRCode({ item, size = 80 }) {
  const canvasRef = useRef(null);
  const [qrImage, setQrImage] = useState("");

  //const eventUrl = `https://condominiokizomba.com/my-dashboard/evento/${item.id}`;
  const eventUrl = `https://condominiokizomba.vercel.app/evento/${item.id}`;
  // const eventUrl = `http://localhost:5173/my-dashboard/evento/${item.id}`;

  const qrValue = `${eventUrl}

    Condomínio Kizomba
    Morador: ${item.morador}
    Evento: ${item.tipoEvento}
    Data: ${item.data}
    Horário: ${item.hora} - ${item.horaFim}
    Local: ${item.local}`;

  useEffect(() => {
    if (canvasRef.current) {
      const image = canvasRef.current.toDataURL("image/png");

      setQrImage(image);
    }
  }, [item, size]);

  return (
    <>
      <div className="hidden">
        <QRCodeCanvas
          ref={canvasRef}
          value={qrValue}
          size={size}
          level="H"
        />
      </div>

      {qrImage && (
        <LightGallery speed={500} plugins={[lgZoom]}>
          <a
            href={qrImage}
            className="group block cursor-pointer rounded-lg border border-slate-200 bg-white p-2 transition hover:border-blue-300"
          >
            <div className="relative">
              <img
                src={qrImage}
                alt={`QR Code do evento de ${item.morador}`}
                width={size}
                height={size}
                className="block"
              />

              <div className="absolute inset-0 flex items-center justify-center rounded opacity-0 transition group-hover:bg-slate-900/20 group-hover:opacity-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
                  <i className="fa-solid fa-magnifying-glass-plus text-xs" />
                </div>
              </div>
            </div>
          </a>
        </LightGallery>
      )}
    </>
  );
}
