"use client";

import { useState } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { Check, ArrowLeft, Shield, Calendar, Award, Scale } from "lucide-react";

interface Puppy {
  id: number;
  name: string;
  gender: "macho" | "fêmea";
  price: number;
  notes?: string;
  avatar_url?: string;
  photos: string[];
  health_records: { type: "vacina" | "vermífugo" | "exame"; name: string; date: string; status: "Pendente" | "Aplicado" }[];
  weight_history: { date: string; weight: number }[];
  status: string;
  mother_name?: string;
  father_name?: string;
  origin?: string;
}

export default function PuppyDetailClient({ puppy: initialPuppy }: { puppy: Puppy }) {
  const [activeTab, setActiveTab] = useState<"saude" | "peso" | "genealogia">("saude");
  
  const nameUpper = initialPuppy.name.toUpperCase();
  let finalOrigin = "";
  if (nameUpper.includes("BURAN")) {
    finalOrigin = "Rússia";
  } else if (nameUpper.includes("J-ARA") || nameUpper.includes("JARA")) {
    finalOrigin = "Romênia";
  } else if (nameUpper.includes("PANDORA")) {
    finalOrigin = "Espanha";
  }

  const displayName = nameUpper.includes("VALE DA KUBERA") || nameUpper.includes("DA KUBERA") ? initialPuppy.name : `${initialPuppy.name} Vale da Kubera`;

  const puppy = {
    ...initialPuppy,
    name: displayName,
    origin: finalOrigin
  };

  const [activePhoto, setActivePhoto] = useState(puppy.avatar_url || puppy.photos[0] || "");

  const handleReserveClick = () => {
    const text = `Olá! Tenho interesse no filhote ${puppy.name} (${puppy.gender === "macho" ? "Macho" : "Fêmea"}).`;
    window.open(`https://wa.me/5511974992059?text=${encodeURIComponent(text)}`, "_blank");
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `Filhote de Pastor do Cáucaso - ${puppy.name}`,
    "image": puppy.avatar_url || puppy.photos[0],
    "description": puppy.notes || "Filhote de Pastor do Cáucaso com pedigree e vacinado.",
    "sku": `PUP-${puppy.id}`,
    "offers": {
      "@type": "Offer",
      "price": puppy.price,
      "priceCurrency": "BRL",
      "availability": puppy.status === "Disponível" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://canil-pastor-do-caucaso.vercel.app/filhotes/filhote-${puppy.gender === "macho" ? "macho" : "femea"}-pastor-do-caucaso-${puppy.id}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans flex flex-col justify-between">
        <PublicNavbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12">
          {/* Back button */}
          <Link
            href="/filhotes"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#D97457] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para listagem</span>
          </Link>

          {/* Core Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery Box */}
            <div className="space-y-4">
              <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-[#2A2A2A] bg-gray-950">
                <img
                  src={activePhoto || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600"}
                  alt={`Foto de ${puppy.name}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {puppy.photos && puppy.photos.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {puppy.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhoto(photo)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border shrink-0 transition-all ${
                        activePhoto === photo ? "border-[#D97457]" : "border-[#2A2A2A] hover:border-gray-500"
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Buying Box */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    {puppy.gender === "macho" ? "Macho" : "Fêmea"}
                  </span>
                  {puppy.origin && (
                    <span className="bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      Origem: {puppy.origin}
                    </span>
                  )}
                  <span className="bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Disponível
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold">{puppy.name}</h1>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {puppy.notes ||
                    "Filhote de excelente temperamento, ideal para proteção patrimonial ou de propriedade familiar. Criado com ração super premium e estimulação neurológica precoce."}
                </p>
              </div>

              <div className="space-y-4 border-t border-[#2A2A2A] pt-6">
                <h3 className="text-sm font-semibold">O que acompanha o filhote:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D97457]" />
                    <span>Pedigree CBKC Registrado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D97457]" />
                    <span>Carteira de Vacina Emitida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D97457]" />
                    <span>Contrato de Garantia de Saúde</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D97457]" />
                    <span>Microchip de Identificação</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleReserveClick}
                  className="w-full bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(201,169,110,0.25)] flex items-center justify-center gap-2"
                >
                  <span>Reservar Filhote pelo WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Details Tabs */}
          <div className="border-t border-[#2A2A2A] pt-12 space-y-6">
            <div className="flex border-b border-[#2A2A2A] gap-6 text-sm">
              <button
                onClick={() => setActiveTab("saude")}
                className={`pb-3 font-semibold transition-all border-b-2 ${
                  activeTab === "saude" ? "border-[#D97457] text-white" : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Saúde &amp; Vacinação
              </button>
              <button
                onClick={() => setActiveTab("peso")}
                className={`pb-3 font-semibold transition-all border-b-2 ${
                  activeTab === "peso" ? "border-[#D97457] text-white" : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Histórico de Peso
              </button>
              <button
                onClick={() => setActiveTab("genealogia")}
                className={`pb-3 font-semibold transition-all border-b-2 ${
                  activeTab === "genealogia" ? "border-[#D97457] text-white" : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Genealogia (Pedigree)
              </button>
            </div>

            {/* Tab content 1 */}
            {activeTab === "saude" && (
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 space-y-4">
                <h4 className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#D97457]" />
                  <span>Histórico de Vermifugação e Vacinas</span>
                </h4>
                <div className="space-y-3">
                  {puppy.health_records && puppy.health_records.length > 0 ? (
                    puppy.health_records.map((rec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 bg-[#0F0F0F] rounded-lg border border-[#2A2A2A]"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-semibold">{rec.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">{rec.type}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                              rec.status === "Aplicado"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            }`}
                          >
                            {rec.status}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-1">Data: {new Date(rec.date).toLocaleDateString("pt-BR")}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">Nenhum registro de saúde cadastrado ainda.</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab content 2 */}
            {activeTab === "peso" && (
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 space-y-4">
                <h4 className="text-base font-semibold flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#D97457]" />
                  <span>Curva de Crescimento (Histórico de Peso)</span>
                </h4>
                <div className="space-y-3">
                  {puppy.weight_history && puppy.weight_history.length > 0 ? (
                    puppy.weight_history.map((rec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 bg-[#0F0F0F] rounded-lg border border-[#2A2A2A]"
                      >
                        <span className="text-sm font-semibold">Peso: {rec.weight} kg</span>
                        <span className="text-xs text-gray-400">Data da medição: {new Date(rec.date).toLocaleDateString("pt-BR")}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">Nenhum histórico de peso cadastrado.</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab content 3 */}
            {activeTab === "genealogia" && (
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 space-y-6">
                <h4 className="text-base font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#D97457]" />
                  <span>Árvore Genealógica (Pedigree do Filhote)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  {/* Filhote */}
                  <div className="bg-[#0F0F0F] border border-[#2A2A2A] p-4 rounded-xl flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] text-[#D97457] font-bold uppercase tracking-wider mb-1">Filhote</span>
                    <p className="font-bold text-sm">{puppy.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase mt-1">Aura Canil</p>
                  </div>

                  {/* Parents */}
                  <div className="flex flex-col gap-4">
                    <div className="bg-[#0F0F0F] border border-[#2A2A2A] p-4 rounded-xl flex flex-col justify-center items-center text-center flex-1">
                      <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Pai</span>
                      <p className="font-bold text-sm">{puppy.father_name || "Kahn da Aura"}</p>
                      <p className="text-[9px] text-gray-400 mt-1">Linhagem Russa Importada</p>
                    </div>
                    <div className="bg-[#0F0F0F] border border-[#2A2A2A] p-4 rounded-xl flex flex-col justify-center items-center text-center flex-1">
                      <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider mb-1">Mãe</span>
                      <p className="font-bold text-sm">{puppy.mother_name || "Sasha da Aura"}</p>
                      <p className="text-[9px] text-gray-400 mt-1">Linhagem de Campeões</p>
                    </div>
                  </div>

                  {/* Grandparents */}
                  <div className="flex flex-col gap-2 justify-between">
                    <div className="bg-[#0F0F0F]/55 border border-[#2A2A2A]/60 p-3 rounded-lg text-center">
                      <span className="text-[9px] text-gray-400 block font-semibold">Avô Paterno</span>
                      <span className="text-xs font-medium">Volkan da Russia</span>
                    </div>
                    <div className="bg-[#0F0F0F]/55 border border-[#2A2A2A]/60 p-3 rounded-lg text-center">
                      <span className="text-[9px] text-gray-400 block font-semibold">Avó Paterna</span>
                      <span className="text-xs font-medium">Zara da Faria</span>
                    </div>
                    <div className="bg-[#0F0F0F]/55 border border-[#2A2A2A]/60 p-3 rounded-lg text-center">
                      <span className="text-[9px] text-gray-400 block font-semibold">Avô Materno</span>
                      <span className="text-xs font-medium">Dimitri do Caucaso</span>
                    </div>
                    <div className="bg-[#0F0F0F]/55 border border-[#2A2A2A]/60 p-3 rounded-lg text-center">
                      <span className="text-[9px] text-gray-400 block font-semibold">Avó Materna</span>
                      <span className="text-xs font-medium">Yara da Montanha</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <PublicFooter />
        <WhatsAppButton />
      </div>
    </>
  );
}
