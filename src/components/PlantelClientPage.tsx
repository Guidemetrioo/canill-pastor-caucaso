"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
import { Shield, Award, Users, Check, ChevronLeft, ChevronRight } from "lucide-react";

interface DogProfile {
  id: number;
  name: string;
  gender: "macho" | "fêmea";
  status: string;
  avatar_url: string;
  photos: string[];
  breed: string;
  age: string;
  origin: string;
  weight: string;
  notes: string;
  history: string;
}

export default function PlantelClientPage() {
  const { activeTheme, themes, animals } = useAura();
  const t = themes[activeTheme];

  const [activeGender, setActiveGender] = useState<"fêmea" | "macho">("fêmea");

  // Keep track of active photo index for each dog profile carousel
  const [carouselIndices, setCarouselIndices] = useState<Record<number, number>>({});

  const staticDogs: DogProfile[] = [
    {
      id: 1,
      name: "VENÛS",
      gender: "fêmea",
      status: "Disponível",
      avatar_url: "/dogs/venus_1.jpg",
      photos: ["/dogs/venus_1.jpg", "/dogs/venus_2.jpg"],
      breed: "Pastor do Cáucaso",
      age: "3 anos",
      origin: "Rússia",
      weight: "70kg",
      notes: "Fêmea importada da Rússia. Excelente temperamento de guarda com padrão de exposição.",
      history: "Fêmea importada de um dos melhores canis da Rússia. Laudos de quadril e cotovelos perfeitos, temperamento calmo em família e atenta no território.",
    },
    {
      id: 2,
      name: "NERO",
      gender: "macho",
      status: "Disponível",
      avatar_url: "/dogs/nero_new_4.jpg",
      photos: ["/dogs/nero_new_4.jpg", "/dogs/nero_new_1.jpg", "/dogs/nero_new_2.jpg", "/dogs/nero_new_3.jpg"],
      breed: "Pastor do Cáucaso",
      age: "4 anos",
      origin: "Ucrânia",
      weight: "85kg",
      notes: "Macho importado da Ucrânia. Cão de guarda de alto nível com temperamento extremamente explosivo e focado.",
      history: "Macho importado da Ucrânia. Apresenta ossatura extremamente pesada, cabeça típica de grande molosso e excelente movimentação. Cão de guarda ativo com territorialidade extrema.",
    },
    {
      id: 3,
      name: "VASILÍSIA",
      gender: "fêmea",
      status: "Disponível",
      avatar_url: "/dogs/vasilisia_new_1.jpg",
      photos: ["/dogs/vasilisia_new_1.jpg", "/dogs/vasilisia_new_2.jpg", "/dogs/vasilisia_new_3.jpg", "/dogs/vasilisia_new_4.jpg"],
      breed: "Pastor do Cáucaso",
      age: "2 anos",
      origin: "Rússia",
      weight: "68kg",
      notes: "Fêmea robusta importada da Rússia. Temperamento equilibrado e excelente guardiã.",
      history: "Fêmea importada da Rússia de linhagem tradicional de trabalho. Excelente estrutura de garupa, membros posteriores fortes e angulação perfeita.",
    },
  ];

  // Map backend dogs if available, fallback to static
  const baseDogs = animals.length > 0 ? animals : staticDogs;
  const allDogs = (baseDogs as any[]).map(dog => {
    const nameUpper = dog.name.toUpperCase();
    
    // Default photos setup
    let photos = dog.photos && dog.photos.length > 0 
      ? dog.photos 
      : dog.avatar_url 
        ? [dog.avatar_url] 
        : ["/logo.png"];
    
    // We only display origin for Buran, J-Ara, and Pandora, and enrich their photos carousels
    let finalOrigin = "";
    if (nameUpper.includes("BURAN")) {
      finalOrigin = "Rússia";
      photos = ["/dogs/buran_1.jpg", "/dogs/buran_2.jpg", "/dogs/buran_3.jpg", "/dogs/buran_4.jpg", "/dogs/buran_5.jpg", "/dogs/buran_6.jpg", "/dogs/buran_7.jpg"];
    } else if (nameUpper.includes("J-ARA") || nameUpper.includes("JARA")) {
      finalOrigin = "Romênia";
      photos = ["/dogs/jara_1.jpg", "/dogs/jara_2.jpg", "/dogs/jara_3.jpg", "/dogs/jara_4.jpg", "/dogs/jara_5.jpg"];
    } else if (nameUpper.includes("PANDORA")) {
      finalOrigin = "Espanha";
      photos = ["/dogs/pandora_1.jpg", "/dogs/pandora_2.jpg", "/dogs/pandora_3.jpg", "/dogs/pandora_4.jpg", "/dogs/pandora_5.jpg", "/dogs/pandora_6.jpg"];
    }

    return { 
      ...dog, 
      origin: finalOrigin, 
      photos 
    };
  });

  const filteredDogs = allDogs.filter((dog) => dog.gender === activeGender);

  const handleNextPhoto = (dogId: number, maxPhotos: number) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [dogId]: ((prev[dogId] || 0) + 1) % maxPhotos,
    }));
  };

  const handlePrevPhoto = (dogId: number, maxPhotos: number) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [dogId]: ((prev[dogId] || 0) - 1 + maxPhotos) % maxPhotos,
    }));
  };

  return (
    <div className={`min-h-screen pt-24 font-sans transition-colors duration-500 flex flex-col justify-between`} style={{ backgroundColor: t.bgHex }}>
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12 w-full">
        {/* Title Header */}
        <div className="space-y-4 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: `${t.accentHex}15`, color: t.accentHex }}>
            <Users className="w-3.5 h-3.5" />
            <span>Nossos Cães</span>
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-comfortaa">
            Plantel Canino / <span style={{ color: t.accentHex }}>Vale da Kubera</span>
          </h1>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: t.textMuted }}>
            Conheça as matrizes russas e reprodutores importados que compõem a base genética do Canil Vale da Kubera. Selecionamos cães com laudo radiográfico perfeito e excelente aptidão física.
          </p>
        </div>

        {/* Gender Toggle */}
        <div className="flex justify-center border-t border-white/10 pt-6">
          <div className="flex items-center gap-3 p-1.5 rounded-xl border" style={{ backgroundColor: t.cardBgHex, borderColor: t.borderHex }}>
            <button
              onClick={() => setActiveGender("fêmea")}
              className="px-5 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                backgroundColor: activeGender === "fêmea" ? t.accentHex : "transparent",
                color: activeGender === "fêmea" ? "#FFFFFF" : t.accentHex,
              }}
            >
              Fêmeas (Matrizes)
            </button>
            <button
              onClick={() => setActiveGender("macho")}
              className="px-5 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                backgroundColor: activeGender === "macho" ? t.accentHex : "transparent",
                color: activeGender === "macho" ? "#FFFFFF" : t.accentHex,
              }}
            >
              Machos (Padreadores)
            </button>
          </div>
        </div>

        {/* Profiles Roster */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDogs.length === 0 ? (
            <div className="col-span-full border rounded-3xl p-12 text-center text-xs" style={{ backgroundColor: t.cardBgHex, borderColor: t.borderHex, color: t.textMuted }}>
              Nenhum cão cadastrado nesta categoria.
            </div>
          ) : (
            filteredDogs.map((dog) => {
              const photoIdx = carouselIndices[dog.id] || 0;
              const maxPhotos = dog.photos ? dog.photos.length : 1;
              const activePhoto = dog.photos ? dog.photos[photoIdx] : dog.avatar_url || "/logo.png";
              
              const nameUpper = dog.name.toUpperCase();
              const displayName = nameUpper.includes("VALE DA KUBERA") || nameUpper.includes("DA KUBERA") ? dog.name : `${dog.name} Vale da Kubera`;

              return (
                <div
                  key={dog.id}
                  className="border rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group"
                  style={{ backgroundColor: t.cardBgHex, borderColor: t.borderHex }}
                >
                  {/* Photo Gallery Column */}
                  <div className="relative h-64 bg-black/40 overflow-hidden select-none border-b" style={{ borderColor: t.borderHex }}>
                    <img
                      src={activePhoto}
                      alt={dog.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                    {maxPhotos > 1 && (
                      <>
                        <button
                          onClick={() => handlePrevPhoto(dog.id, maxPhotos)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 flex items-center justify-center text-white transition-all focus:outline-none z-20"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleNextPhoto(dog.id, maxPhotos)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 flex items-center justify-center text-white transition-all focus:outline-none z-20"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-3 right-3 bg-black/75 px-2.5 py-1 rounded-md text-[10px] font-bold text-white z-20">
                          {photoIdx + 1} / {maxPhotos}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Dog Details Column */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold font-comfortaa uppercase tracking-tight" style={{ color: t.accentHex }}>
                        {displayName}
                      </h3>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#2A2A2A]/50 text-xs font-sans">
                        <div className="p-3 rounded-xl border" style={{ backgroundColor: t.bgHex, borderColor: t.borderHex }}>
                          <p className="text-gray-400 text-[9px] uppercase font-bold">Sexo</p>
                          <p className="font-bold text-sm capitalize" style={{ color: t.textMain }}>{dog.gender || "N/A"}</p>
                        </div>
                        {dog.origin && (
                          <div className="p-3 rounded-xl border" style={{ backgroundColor: t.bgHex, borderColor: t.borderHex }}>
                            <p className="text-gray-400 text-[9px] uppercase font-bold">Origem</p>
                            <p className="font-bold text-sm" style={{ color: t.textMain }}>{dog.origin}</p>
                          </div>
                        )}
                      </div>

                      {dog.notes && (
                        <p className="text-xs leading-relaxed" style={{ color: t.textMuted }}>
                          {dog.notes}
                        </p>
                      )}
                    </div>

                    <div className="border-t pt-4 flex items-center justify-between text-[10px]" style={{ borderColor: t.borderHex }}>
                      <span className="flex items-center gap-1.5 font-bold" style={{ color: t.accentHex }}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Linhagem Oficial</span>
                      </span>
                      <span className="text-gray-400 uppercase font-bold">Ref: #{dog.id}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <PublicFooter />
      <SocialFloatingButtons />
    </div>
  );
}
