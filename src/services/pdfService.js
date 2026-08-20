import jsPDF from "jspdf";

export const generateEventPDF = (event) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // =========================================================
  // CORES
  // =========================================================

  const blueDark = [30, 58, 138];
  const blue = [37, 99, 235];
  const slate = [71, 85, 105];
  const lightSlate = [148, 163, 184];
  const border = [226, 232, 240];
  const white = [255, 255, 255];

  // =========================================================
  // FUNDO
  // =========================================================

  pdf.setFillColor(...white);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // =========================================================
  // CABEÇALHO
  // =========================================================

  pdf.setFillColor(...blueDark);
  pdf.rect(0, 0, pageWidth, 38, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(19);
  pdf.setTextColor(...white);

  pdf.text(
    "Condomínio Kizomba",
    pageWidth / 2,
    17,
    { align: "center" },
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  pdf.text(
    "Comprovativo de acesso",
    pageWidth / 2,
    26,
    { align: "center" },
  );

  // =========================================================
  // NOME DO MORADOR
  // =========================================================

  pdf.setTextColor(...slate);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  pdf.text(
    "MORADOR",
    pageWidth / 2,
    55,
    { align: "center" },
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(...blueDark);

  pdf.text(
    event.morador || "Morador",
    pageWidth / 2,
    64,
    { align: "center" },
  );

  // =========================================================
  // QR CODE
  // =========================================================

  const qrContainer = document.getElementById(
    `qr-code-${event.id}`,
  );

  const qrCanvas = qrContainer?.querySelector("canvas");

  if (!qrCanvas) {
    console.error(
      "QR Code não encontrado para o evento:",
      event.id,
    );

    return;
  }

  const qrDataUrl = qrCanvas.toDataURL("image/png");

  const qrSize = 105;

  const qrX = (pageWidth - qrSize) / 2;
  const qrY = 78;

  // Moldura externa
  pdf.setDrawColor(...border);
  pdf.setLineWidth(0.5);

  pdf.roundedRect(
    qrX - 10,
    qrY - 10,
    qrSize + 20,
    qrSize + 20,
    6,
    6,
    "S",
  );

  // Área branca do QR
  pdf.setFillColor(...white);

  pdf.roundedRect(
    qrX - 6,
    qrY - 6,
    qrSize + 12,
    qrSize + 12,
    4,
    4,
    "F",
  );

  // QR Code
  pdf.addImage(
    qrDataUrl,
    "PNG",
    qrX,
    qrY,
    qrSize,
    qrSize,
  );

  // =========================================================
  // INSTRUÇÃO
  // =========================================================

  const instructionY = qrY + qrSize + 28;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(...slate);

  pdf.text(
    "Apresente este QR Code na entrada",
    pageWidth / 2,
    instructionY,
    { align: "center" },
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...lightSlate);

  pdf.text(
    "O código será utilizado para validar o acesso ao evento.",
    pageWidth / 2,
    instructionY + 7,
    { align: "center" },
  );

  // =========================================================
  // ID DO EVENTO
  // =========================================================

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...lightSlate);

  pdf.text(
    `Evento #${event.id}`,
    pageWidth / 2,
    pageHeight - 22,
    { align: "center" },
  );

  // =========================================================
  // RODAPÉ
  // =========================================================

  pdf.setDrawColor(...border);
  pdf.setLineWidth(0.3);

  pdf.line(
    20,
    pageHeight - 16,
    pageWidth - 20,
    pageHeight - 16,
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...lightSlate);

  pdf.text(
    "Condomínio Kizomba",
    20,
    pageHeight - 9,
  );

  pdf.text(
    "Documento digital",
    pageWidth - 20,
    pageHeight - 9,
    { align: "right" },
  );

  // =========================================================
  // DOWNLOAD
  // =========================================================

  pdf.save(`qrcode-evento-${event.id}.pdf`);
};
