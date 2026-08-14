import { api } from "./api";

export const generateQRCode = async (data) => {
  const response = await api.post("/generate_qrcode/", data);
  return response.data;
};

export const downloadPDF = async (eventoId) => {
  const response = await api.get(`/download_pdf/${eventoId}/`, {
    responseType: "blob",
  });

  return response.data;
};
