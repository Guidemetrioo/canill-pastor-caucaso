"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { Shield, Check, ArrowRight, Heart } from "lucide-react";

export default function FilhotesPage() {
  const { filhotes } = useAura();
  const [genderFilter, setGenderFilter] = useState<"todos" | "macho" | "fêmea">("todos");

  const availablePuppies = filhotes.filter(
    (f) => f.status === "Disponível" && (genderFilter === "todos" || f.gender === genderFilter)
  );

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans flex flex-col justify-between">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Ninhadas Recentes</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Filhotes de <span className="text-[#C9A96E]">Pastor do Cáucaso</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
            Nossos filhotes são criados com acompanhamento profissional. Selecione abaixo para ver os detalhes, fotos e histórico de vacinação de cada filhote disponível.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-3 text-xs">
          <button
            onClick={() => setGenderFilter("todos")}
            className={`px-4 py-2 rounded-lg font-bold border transition-all ${
              genderFilter === "todos" ? "bg-[#C9A96E] text-[#0F0F0F] border-[#C9A96E]" : "bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:border-gray-500"
            }`}
          >
            Todos ({filhotes.filter((f) => f.status === "Disponível").length})
          </button>
          <button
            onClick={() => setGenderFilter("macho")}
            className={`px-4 py-2 rounded-lg font-bold border transition-all ${
              genderFilter === "macho" ? "bg-[#C9A96E] text-[#0F0F0F] border-[#C9A96E]" : "bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:border-gray-500"
            }`}
          >
            Machos ({filhotes.filter((f) => f.status === "Disponível" && f.gender === "macho").length})
          </button>
          <button
            onClick={() => setGenderFilter("fêmea")}
            className={`px-4 py-2 rounded-lg font-bold border transition-all ${
              genderFilter === "fêmea" ? "bg-[#C9A96E] text-[#0F0F0F] border-[#C9A96E]" : "bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:border-gray-500"
            }`}
          >
            Fêmeas ({filhotes.filter((f) => f.status === "Disponível" && f.gender === "fêmea").length})
          </button>
        </div>

        {/* Puppies Grid */}
        {availablePuppies.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-16 text-center text-gray-400 text-xs">
            Nenhum filhote disponível no momento. Entre em contato conosco para entrar na lista de reserva das próximas ninhadas.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {availablePuppies.map((puppy) => {
              const genderSlug = puppy.gender === "macho" ? "macho" : "femea";
              const puppySlug = `filhote-${genderSlug}-pastor-do-caucaso-${puppy.id}`;

              return (
                <div
                  key={puppy.id}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-[#C9A96E]/50 transition-all flex flex-col justify-between group shadow-xl"
                >
                  <div className="relative h-64 bg-gray-900 overflow-hidden">
                    <img
                      src={puppy.avatar_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400"}
                      alt={puppy.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                    <span className="absolute top-4 right-4 bg-[#0F0F0F]/85 border border-[#2A2A2A] text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                      {puppy.gender === "macho" ? "Macho" : "Fêmea"}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold group-hover:text-[#C9A96E] transition-colors">{puppy.name}</h3>
                      <span className="text-[#C9A96E] font-extrabold text-sm">
                        R$ {puppy.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                      {puppy.notes || "Excelente ninhada de Pastor do Cáucaso, com estrutura pesada, pelagem abundante e linhagem premiada."}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-[#2A2A2A]/50">
                      <div className="flex items-center gap-2 text-[10px] text-gray-300">
                        <Check className="w-3.5 h-3.5 text-[#C9A96E]" />
                        <span>Pedigree CBKC Incluso</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-300">
                        <Check className="w-3.5 h-3.5 text-[#C9A96E]" />
                        <span>Contrato de Garantia de Saúde</span>
                      </div>
                    </div>

                    <Link
                      href={`/filhotes/${puppySlug}`}
                      className="w-full mt-4 bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0F0F0F] py-2.5 rounded-lg text-xs font-bold transition-all text-center block"
                    >
                      Ver Detalhes do Filhote
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
