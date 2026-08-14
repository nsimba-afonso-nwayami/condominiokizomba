import jsPDF from "jspdf";

export const generateEventPDF = (event) => {
  const pdf = new jsPDF();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("Condomínio Kizomba", 20, 20);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text("Comprovativo de acesso", 20, 29);

  pdf.setDrawColor(220, 220, 220);
  pdf.line(20, 35, 190, 35);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Dados do evento", 20, 50);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  pdf.text(`Morador: ${event.morador}`, 20, 62);
  pdf.text(`Tipo de evento: ${event.tipoEvento}`, 20, 72);
  pdf.text(`Data: ${event.data}`, 20, 82);
  pdf.text(`Horário: ${event.hora} - ${event.horaFim}`, 20, 92);
  pdf.text(`Local: ${event.local}`, 20, 102);

  pdf.setFont("helvetica", "bold");
  pdf.text("Convidados:", 20, 116);

  pdf.setFont("helvetica", "normal");

  const convidados = pdf.splitTextToSize(
    event.convidados || "Nenhum convidado informado.",
    160,
  );

  pdf.text(convidados, 20, 126);

  const qrElement = document.getElementById(`qr-code-${event.id}`);

  if (qrElement) {
    const qrDataUrl = qrElement.toDataURL("image/png");

    pdf.addImage(qrDataUrl, "PNG", 135, 45, 55, 55);
  }

  pdf.setFontSize(9);
  pdf.setTextColor(120, 120, 120);

  pdf.text(
    "Apresente este QR Code na entrada do condomínio.",
    20,
    270,
  );

  pdf.save(`qrcode-evento-${event.id}.pdf`);
};
