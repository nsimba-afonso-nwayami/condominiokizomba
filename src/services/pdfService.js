import jsPDF from "jspdf";

export const generateEventPDF = (event) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // CORES

  const blueDark = [30, 58, 138];
  const white = [255, 255, 255];
  const border = [226, 232, 240];

  // FUNDO

  pdf.setFillColor(...white);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // CABEÇALHO

  pdf.setFillColor(...blueDark);
  pdf.rect(0, 0, pageWidth, 38, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(...white);

  pdf.text("Sistema de Gestão de Eventos", pageWidth / 2, 16, {
    align: "center",
  });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  pdf.text("Event Management System", pageWidth / 2, 25, {
    align: "center",
  });

  // QR CODE

  const qrContainer = document.getElementById(`qr-code-${event.id}`);

  const qrCanvas = qrContainer?.querySelector("canvas");

  if (!qrCanvas) {
    console.error("QR Code não encontrado para o evento:", event.id);

    return;
  }

  const qrDataUrl = qrCanvas.toDataURL("image/png");

  // TAMANHO DO QR CODE

  const qrSize = 80;

  const framePadding = 6;

  const frameSize = qrSize + framePadding * 2;

  const qrX = (pageWidth - qrSize) / 2;

  const qrY = 78;

  const frameX = (pageWidth - frameSize) / 2;

  const frameY = qrY - framePadding;

  // MOLDURA

  pdf.setDrawColor(...border);
  pdf.setLineWidth(0.5);

  pdf.roundedRect(frameX, frameY, frameSize, frameSize, 4, 4, "S");

  // FUNDO BRANCO

  pdf.setFillColor(...white);

  pdf.roundedRect(frameX, frameY, frameSize, frameSize, 4, 4, "F");

  // QR CODE

  pdf.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

  // DOWNLOAD

  pdf.save(`qrcode-evento-${event.id}.pdf`);
};
