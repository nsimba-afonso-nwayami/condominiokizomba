import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCode({ item, size = 80 }) {
  const canvasRef = useRef(null);
  const [qrImage, setQrImage] = useState("");

  // const qrValue = `https://condominiokizomba.com/evento/${item.id}`;
   const qrValue = `https://condominiokizomba.vercel.app/evento/${item.id}`;
  // const qrValue = `http://localhost:5173/evento/${item.id}`;

  useEffect(() => {
    if (canvasRef.current) {
      const image = canvasRef.current.toDataURL("image/png");

      setQrImage(image);
    }
  }, [item.id, size]);

  return (
    <>
      {/* QR CODE ORIGINAL */}
      <div className="hidden">
        <QRCodeCanvas
          ref={canvasRef}
          value={qrValue}
          size={size}
          level="H"
        />
      </div>

      {/* QR CODE */}
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
