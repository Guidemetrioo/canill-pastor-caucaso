"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
import { Image as ImageIcon } from "lucide-react";

export default function GaleriaClientPage() {
  const { activeTheme, themes } = useAura();
  const t = themes[activeTheme];

  const [galleryFilter, setGalleryFilter] = useState<"todos" | "caes" | "filhotes" | "canil">("todos");

  // Photo gallery media items
  const media = [
    { type: "caes", url: "/dogs/nero_4.jpg", title: "NERO - Reprodutor (Ucrânia)" },
    { type: "caes", url: "/dogs/nero_5.jpg", title: "NERO - Perfil (Ucrânia)" },
    { type: "caes", url: "/dogs/nero_6.jpg", title: "NERO - Closeup (Ucrânia)" },
    { type: "caes", url: "/dogs/nero_7.jpg", title: "NERO - Descansando" },
    { type: "caes", url: "/dogs/nero_1.jpg", title: "NERO - Retrato" },
    { type: "caes", url: "/dogs/nero_2.jpg", title: "NERO - Lateral" },
    { type: "caes", url: "/dogs/nero_3.jpg", title: "NERO - Posição" },
    { type: "caes", url: "/dogs/vasilisia_1.jpg", title: "VASILÍSIA - Fêmea Robusta (Rússia)" },
    { type: "caes", url: "/dogs/vasilisia_2.jpg", title: "VASILÍSIA - Sentada" },
    { type: "caes", url: "/dogs/vasilisia_3.jpg", title: "VASILÍSIA - Posição" },
    { type: "caes", url: "/dogs/venus_1.jpg", title: "VENÛS - Fêmea Importada (Rússia)" },
    { type: "caes", url: "/dogs/venus_2.jpg", title: "VENÛS - Retrato" },
    { type: "canil", url: "/dogs/canil_1.jpg", title: "Canil Vale da Kubera - Instalações" },
  ];

  const filteredMedia = media.filter((m) => galleryFilter === "todos" || m.type === galleryFilter);

  return (
    <div className={`min-h-screen pt-24 font-sans transition-colors duration-500 flex flex-col justify-between`} style={{ backgroundColor: t.bgHex }}>
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-10 w-full">
        {/* Title Header */}
        <div className="space-y-4 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: `${t.accentHex}15`, color: t.accentHex }}>
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Mídias &amp; Fotos</span>
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-comfortaa">
            Galeria de <span style={{ color: t.accentHex }}>Fotos</span>
          </h1>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: t.textMuted }}>
            Confira registros reais de nossos cães adultos, das instalações e do dia a dia dos filhotes.
          </p>
        </div>

        {/* Gallery filter buttons */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs border-t border-white/10 pt-6">
          <button
            onClick={() => setGalleryFilter("todos")}
            className="px-4 py-2 rounded-lg font-bold border transition-all"
            style={{
              backgroundColor: galleryFilter === "todos" ? t.accentHex : "transparent",
              color: galleryFilter === "todos" ? "#FFFFFF" : t.accentHex,
              borderColor: t.borderHex,
            }}
          >
            Ver Tudo
          </button>
          <button
            onClick={() => setGalleryFilter("caes")}
            className="px-4 py-2 rounded-lg font-bold border transition-all"
            style={{
              backgroundColor: galleryFilter === "caes" ? t.accentHex : "transparent",
              color: galleryFilter === "caes" ? "#FFFFFF" : t.accentHex,
              borderColor: t.borderHex,
            }}
          >
            Adultos / Reprodutores
          </button>
          <button
            onClick={() => setGalleryFilter("canil")}
            className="px-4 py-2 rounded-lg font-bold border transition-all"
            style={{
              backgroundColor: galleryFilter === "canil" ? t.accentHex : "transparent",
              color: galleryFilter === "canil" ? "#FFFFFF" : t.accentHex,
              borderColor: t.borderHex,
            }}
          >
            Estrutura Canil
          </button>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((m, idx) => (
            <div
              key={idx}
              className="border rounded-2xl overflow-hidden group shadow-xl transition-all flex flex-col justify-between"
              style={{ backgroundColor: t.cardBgHex, borderColor: t.borderHex }}
            >
              <div className="relative h-64 bg-black/40 overflow-hidden">
                <img
                  src={m.url}
                  alt={m.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>
              <div className="p-4 border-t" style={{ borderColor: t.borderHex }}>
                <h4 className="text-xs font-bold leading-tight" style={{ color: t.textMain }}>{m.title}</h4>
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
