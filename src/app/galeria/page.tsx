"use client";

import { useState } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
import { Image as ImageIcon } from "lucide-react";

export default function GaleriaPage() {
  const [filter, setFilter] = useState<"todos" | "caes" | "filhotes" | "canil">("todos");

  const media = [
    // Nero - Reprodutor Ucrânia
    { type: "caes", url: "/dogs/nero_4.jpg", title: "NERO - Reprodutor (Ucrânia)" },
    { type: "caes", url: "/dogs/nero_5.jpg", title: "NERO - Perfil (Ucrânia)" },
    { type: "caes", url: "/dogs/nero_6.jpg", title: "NERO - Closeup (Ucrânia)" },
    { type: "caes", url: "/dogs/nero_7.jpg", title: "NERO - Descansando" },
    { type: "caes", url: "/dogs/nero_1.jpg", title: "NERO - Retrato" },
    { type: "caes", url: "/dogs/nero_2.jpg", title: "NERO - Lateral" },
    { type: "caes", url: "/dogs/nero_3.jpg", title: "NERO - Posição" },
    // Vasilísia - Fêmea Rússia
    { type: "caes", url: "/dogs/vasilisia_1.jpg", title: "VASILÍSIA - Fêmea Robusta (Rússia)" },
    { type: "caes", url: "/dogs/vasilisia_2.jpg", title: "VASILÍSIA - Sentada" },
    { type: "caes", url: "/dogs/vasilisia_3.jpg", title: "VASILÍSIA - Posição" },
    // Venus - Fêmea Rússia
    { type: "caes", url: "/dogs/venus_1.jpg", title: "VENÛS - Fêmea Importada (Rússia)" },
    { type: "caes", url: "/dogs/venus_2.jpg", title: "VENÛS - Retrato" },
    // Canil / Estrutura
    { type: "canil", url: "/dogs/canil_1.jpg", title: "Canil Vale da Kubera - Instalações" },
  ];

  const filteredMedia = media.filter((m) => filter === "todos" || m.type === filter);

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans flex flex-col justify-between">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-xs font-bold uppercase tracking-wider">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Mídias &amp; Fotos</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Galeria do <span className="text-[#D97457]">Canil Vale da Kubera</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
            Confira registros reais de nossos cães adultos, das instalações e do dia a dia dos filhotes.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-3 text-xs">
          <button
            onClick={() => setFilter("todos")}
            className={`px-4 py-2 rounded-lg font-bold border transition-all ${
              filter === "todos" ? "bg-[#D97457] text-[#0F0F0F] border-[#D97457]" : "bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:border-gray-500"
            }`}
          >
            Ver Tudo
          </button>
          <button
            onClick={() => setFilter("caes")}
            className={`px-4 py-2 rounded-lg font-bold border transition-all ${
              filter === "caes" ? "bg-[#D97457] text-[#0F0F0F] border-[#D97457]" : "bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:border-gray-500"
            }`}
          >
            Adultos / Reprodutores
          </button>
          <button
            onClick={() => setFilter("filhotes")}
            className={`px-4 py-2 rounded-lg font-bold border transition-all ${
              filter === "filhotes" ? "bg-[#D97457] text-[#0F0F0F] border-[#D97457]" : "bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:border-gray-500"
            }`}
          >
            Filhotes
          </button>
          <button
            onClick={() => setFilter("canil")}
            className={`px-4 py-2 rounded-lg font-bold border transition-all ${
              filter === "canil" ? "bg-[#D97457] text-[#0F0F0F] border-[#D97457]" : "bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:border-gray-500"
            }`}
          >
            Estrutura Canil
          </button>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden group shadow-xl hover:border-[#D97457]/50 transition-all flex flex-col justify-between"
            >
              <div className="relative h-64 bg-gray-900 overflow-hidden">
                <img
                  src={m.url}
                  alt={m.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>
              <div className="p-4 bg-[#1A1A1A] border-t border-[#2A2A2A]/50">
                <h4 className="text-xs font-bold text-white leading-tight">{m.title}</h4>
              </div>
            </div>
          ))}
        </div>

      </main>

      <PublicFooter />
      <SocialFloatingButtons />
    </div>
  );
}
