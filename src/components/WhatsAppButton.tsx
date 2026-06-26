"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const handleClick = () => {
    // Standard link redirecting to the qualification bot
    window.open("https://wa.me/5511974992059?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20filhotes%20de%20Pastor%20do%20Cáucaso%20com%20padrão%20de%20exposição.", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA56] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
      aria-label="Fale conosco no WhatsApp"
      id="whatsapp-floating-button"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-out text-sm font-semibold whitespace-nowrap">
        Fale Conosco
      </span>
    </button>
  );
}
