"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
import { Image as ImageIcon, Shield, Award, Users, Check, ChevronLeft, ChevronRight } from "lucide-react";

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

export default function GaleriaClientPage() {
  const { activeTheme, themes, animals } = useAura();
  const t = themes[activeTheme];

  const [activeTab, setActiveTab] = useState<"plantel" | "galeria">("plantel");
  const [activeGender, setActiveGender] = useState<"fêmea" | "macho">("fêmea");
  const [galleryFilter, setGalleryFilter] = useState<"todos" | "caes" | "filhotes" | "canil">("todos");

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
    const photos = dog.photos && dog.photos.length > 0 
      ? dog.photos 
      : dog.avatar_url 
        ? [dog.avatar_url] 
        : ["/logo.png"];
    
    // Enrich with typical static details if missing from database
    if (nameUpper.includes("VENÛS") || nameUpper.includes("VENUS")) {
      return { 
        ...dog, 
        weight: dog.weight || "70kg", 
        age: dog.age || "3 anos", 
        origin: dog.origin || "Rússia", 
        photos,
        notes: dog.notes || "Fêmea importada da Rússia. Excelente temperamento de guarda com padrão de exposição.",
        history: dog.history || "Fêmea importada de um dos melhores canis da Rússia. Laudos de quadril e cotovelos perfeitos."
      };
    }
    if (nameUpper.includes("NERO")) {
      return { 
        ...dog, 
        weight: dog.weight || "85kg", 
        age: dog.age || "4 anos", 
        origin: dog.origin || "Ucrânia", 
        photos,
        notes: dog.notes || "Macho importado da Ucrânia. Cão de guarda de alto nível com temperamento extremamente explosivo.",
        history: dog.history || "Macho importado da Ucrânia. Cão de guarda de alto nível com temperamento extremamente explosivo e focado."
      };
    }
    if (nameUpper.includes("VASILÍSIA") || nameUpper.includes("VASILISIA")) {
      return { 
        ...dog, 
        weight: dog.weight || "68kg", 
        age: dog.age || "2 anos", 
        origin: dog.origin || "Rússia", 
        photos,
        notes: dog.notes || "Fêmea robusta importada da Rússia. Temperamento equilibrado e excelente guardiã.",
        history: dog.history || "Fêmea importada da Rússia de linhagem tradicional de trabalho. Estrutura forte."
      };
    }
    return { ...dog, photos };
  });

  const filteredDogs = allDogs.filter((dog) => dog.gender === activeGender);

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
            <span>Genética e Proteção</span>
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-comfortaa">
            Nossos Cães / <span style={{ color: t.accentHex }}>Plantel</span>
          </h1>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: t.textMuted }}>
            Conheça as matrizes russas e reprodutores importados que compõem a base genética do Canil Vale da Kubera. Selecionamos cães com laudo radiográfico perfeito e excelente aptidão física.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center border-b border-white/10 pb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("plantel")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{
                backgroundColor: activeTab === "plantel" ? t.accentHex : "transparent",
                color: activeTab === "plantel" ? "#FFFFFF" : t.accentHex,
              }}
            >
              O Plantel Canino
            </button>
            <button
              onClick={() => setActiveTab("galeria")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{
                backgroundColor: activeTab === "galeria" ? t.accentHex : "transparent",
                color: activeTab === "galeria" ? "#FFFFFF" : t.accentHex,
              }}
            >
              Galeria de Fotos
            </button>
          </div>
        </div>

        {/* ----------------- TAB: PLANTEL ----------------- */}
        {activeTab === "plantel" && (
          <div className="space-y-10">
            {/* Gender Toggle */}
            <div className="flex justify-center">
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
            <div className="space-y-12">
              {filteredDogs.length === 0 ? (
                <div className="border rounded-3xl p-12 text-center text-xs" style={{ backgroundColor: t.cardBgHex, borderColor: t.borderHex, color: t.textMuted }}>
                  Nenhum cão cadastrado nesta categoria.
                </div>
              ) : (
                filteredDogs.map((dog) => {
                  const photoIdx = carouselIndices[dog.id] || 0;
                  const maxPhotos = dog.photos ? dog.photos.length : 1;
                  const activePhoto = dog.photos ? dog.photos[photoIdx] : dog.avatar_url || "/logo.png";

                  return (
                    <div
                      key={dog.id}
                      className="border rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8"
                      style={{ backgroundColor: t.cardBgHex, borderColor: t.borderHex }}
                    >
                      {/* Photo Gallery Column */}
                      <div className="lg:col-span-5 space-y-3">
                        <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-black/40 border" style={{ borderColor: t.borderHex }}>
                          <img
                            src={activePhoto}
                            alt={dog.name}
                            className="w-full h-full object-cover"
                          />
                          {maxPhotos > 1 && (
                            <>
                              <button
                                onClick={() => handlePrevPhoto(dog.id, maxPhotos)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 flex items-center justify-center text-white transition-all focus:outline-none"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleNextPhoto(dog.id, maxPhotos)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 flex items-center justify-center text-white transition-all focus:outline-none"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                              <div className="absolute bottom-3 right-3 bg-black/75 px-2.5 py-1 rounded-md text-[10px] font-bold text-white">
                                {photoIdx + 1} / {maxPhotos}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Thumbnail Indicators */}
                        {maxPhotos > 1 && (
                          <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
                            {dog.photos.map((p: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => setCarouselIndices((prev) => ({ ...prev, [dog.id]: idx }))}
                                className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                                  photoIdx === idx ? "border-[#D97457] scale-102" : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                              >
                                <img src={p} alt="Thumbnail" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Dog Details Column */}
                      <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-2xl sm:text-3xl font-extrabold font-comfortaa leading-none uppercase" style={{ color: t.accentHex }}>
                              {dog.name}
                            </h2>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ backgroundColor: `${t.accentHex}10`, color: t.accentHex }}>
                              {dog.origin}
                            </span>
                          </div>

                          {/* Hip Displasia Certificate (Critical E-E-A-T criteria) */}
                          <div className="flex items-center gap-2 p-3 rounded-xl border border-dashed text-xs" style={{ borderColor: `${t.accentHex}40`, backgroundColor: `${t.accentHex}05` }}>
                            <Shield className="w-4 h-4 shrink-0" style={{ color: t.accentHex }} />
                            <span>
                              <strong>Laudo Clínico:</strong> Displasia Coxofemural (Hip Displasia) <strong>Grau A (Livre)</strong> com certificação veterinária internacional.
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                            <div className="p-3.5 rounded-xl border" style={{ backgroundColor: t.bgHex, borderColor: t.borderHex }}>
                              <p className="text-gray-400 text-[10px] uppercase font-bold">Idade</p>
                              <p className="font-bold text-sm" style={{ color: t.textMain }}>{dog.age || "N/A"}</p>
                            </div>
                            <div className="p-3.5 rounded-xl border" style={{ backgroundColor: t.bgHex, borderColor: t.borderHex }}>
                              <p className="text-gray-400 text-[10px] uppercase font-bold">Peso aproximado</p>
                              <p className="font-bold text-sm" style={{ color: t.textMain }}>{dog.weight || "N/A"}</p>
                            </div>
                            <div className="p-3.5 rounded-xl border" style={{ backgroundColor: t.bgHex, borderColor: t.borderHex }}>
                              <p className="text-gray-400 text-[10px] uppercase font-bold">Raça</p>
                              <p className="font-bold text-sm" style={{ color: t.textMain }}>{dog.breed || "Pastor do Cáucaso"}</p>
                            </div>
                            <div className="p-3.5 rounded-xl border" style={{ backgroundColor: t.bgHex, borderColor: t.borderHex }}>
                              <p className="text-gray-400 text-[10px] uppercase font-bold">Registro / Pedigree</p>
                              <p className="font-bold text-sm" style={{ color: t.textMain }}>{dog.registry || "CBKC / Export Pedigree"}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs uppercase font-extrabold tracking-wider" style={{ color: t.accentHex }}>Histórico &amp; Linhagem</h4>
                            <p className="text-xs leading-relaxed" style={{ color: t.textMuted }}>
                              {dog.history}
                            </p>
                          </div>
                        </div>

                        {/* Highlight footer */}
                        <div className="border-t pt-4 flex items-center justify-between text-xs" style={{ borderColor: t.borderHex }}>
                          <span className="flex items-center gap-1.5 font-bold" style={{ color: t.accentHex }}>
                            <Check className="w-4 h-4" />
                            <span>Linhagem Oficial</span>
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase font-bold">Código Ref: #{dog.id}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB: GALERIA ----------------- */}
        {activeTab === "galeria" && (
          <div className="space-y-8">
            {/* Gallery filter buttons */}
            <div className="flex flex-wrap justify-center gap-3 text-xs">
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
          </div>
        )}
      </main>

      <PublicFooter />
      <SocialFloatingButtons />
    </div>
  );
}
