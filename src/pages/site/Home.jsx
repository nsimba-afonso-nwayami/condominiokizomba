import WhatsAppButton from "../../components/whatsapp/WhatsAppButton";
import Start from "../../components/home/Start";

export default function Home() {
  return (
    <>
      <title>Condomínio kizomba</title>

      <Start />

      {/* Botão WhatsApp fixo */}
      <WhatsAppButton phone="244972614886" size={64} />
    </>
  );
}
