import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Award, Check, ArrowRight, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Adestramento para Cães de Grande Porte | Canil Vale da Kubera",
  description: "Adestramento de obediência e controle comportamental para Pastor do Cáucaso, Rottweiler, Fila e outras raças de guarda. Aulas presenciais com profissionais em Itatiba - SP.",
  keywords: ["adestramento pastor do caucaso", "treino caes de guarda sp", "adestrador cão grande porte", "obediencia urbana caes"],
};

export default function AdestramentoPage() {
  const steps = [
    { title: "Foco e Atenção", desc: "Aprender a manter o contato visual e focar nos comandos do tutor mesmo sob fortes distrações externas." },
    { title: "Obediência Básica", desc: "Comandos fundamentais de controle: senta, deita, aqui, fica, junto na guia sem puxar." },
    { title: "Manejo Territorial", desc: "Controle de ansiedade e liderança em portões, evitando avanços desnecessários ou agressividade fora do limite." },
    { title: "Socialização Controlada", desc: "Inserção em diferentes ambientes e convívio com outros estímulos urbanos de forma tranquila e controlada." },
  ];

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Intro */}
        <section className="space-y-6 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Educação e Controle</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Adestramento de <span className="text-[#D97457]">Grande Porte</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ter um cão de guarda territorial gigante exige responsabilidade absoluta. Nosso adestramento visa construir um canal de comunicação claro entre tutor e cão, gerando controle e segurança total.
          </p>
        </section>

        {/* Focus Steps */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-xl space-y-3 hover:border-[#D97457]/30 transition-all">
              <span className="text-[#D97457] font-bold text-sm">Passo 0{idx + 1}</span>
              <h4 className="font-bold text-sm text-white">{s.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </section>

        {/* Pricing/Contract info */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600"
              alt="Cão em Treinamento"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Pacote Adestramento Básico</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Nosso programa de obediência consiste em aulas práticas na residência do cliente (ou no canil) sob a supervisão do adestrador chefe.
            </p>

            <div className="space-y-3.5 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D97457]" />
                <span><strong>Aulas:</strong> 10 Sessões presenciais e práticas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D97457]" />
                <span><strong>Frequência:</strong> Recomendável 1 ou 2x por semana</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D97457]" />
                <span><strong>Valor do Investimento:</strong> R$ 1.200,00 por pacote</span>
              </div>
            </div>

            <a
              href="https://wa.me/5521998765432?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20plano%20de%20adestramento%20para%20meu%20c%C3%A3o."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] font-bold px-6 py-2.5 rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)]"
            >
              <span>Contratar Adestramento</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

      </main>

      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
