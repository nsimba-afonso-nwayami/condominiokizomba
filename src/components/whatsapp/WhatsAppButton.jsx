
export default function WhatsAppButton({
  phone = "244972614886",
  size = 64,
  tooltip = "Fale connosco no WhatsApp",
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:block bg-neutral-900 text-white text-sm px-3 py-1 rounded-md shadow-lg whitespace-nowrap animate-fade-left">
        {tooltip}
      </span>

      {/* Botão com borda animada */}
      <a
        href={`https://wa.me/${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 transition transform hover:scale-110"
      >
        {/* Borda animada pulse */}
        <span className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping"></span>
        <span className="absolute inset-0 rounded-full border-4 border-green-400 opacity-50 animate-ping delay-200"></span>

        {/* Ícone WhatsApp */}
        <i className="fab fa-whatsapp text-white text-2xl relative z-10"></i>
      </a>
    </div>
  );
}
