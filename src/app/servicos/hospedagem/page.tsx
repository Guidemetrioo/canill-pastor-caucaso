import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Home, Check, ArrowRight, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Hospedagem Canina e Hotel | Canil Vale da Kubera Itatiba",
  description: "Hospede seu cão com total segurança. Boxes individuais higienizados, área verde para recreação e supervisão 24h em Itatiba - SP.",
  keywords: ["hotel para caes sp", "hospedagem pastor do caucaso", "creche canina itatiba", "hotelzinho caes grande porte"],
};

export default function HospedagemPage() {
  const specs = [
    { title: "Piquetes Individuais", desc: "Áreas cercadas e gramadas de 150m² para o cão correr e gastar energia com total segurança." },
    { title: "Boxes Higienizados", desc: "Acomodações internas individuais climatizadas, limpas duas vezes ao dia e desinfectadas." },
    { title: "Supervisão 24h", desc: "Cuidadores residentes na chácara e monitoramento por câmeras garantindo socorro imediato." },
    { title: "Alimentação de Elite", desc: "Manejo da ração trazida pelo tutor ou fornecimento de marcas premium conforme contrato." },
  ];

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Intro */}
        <section className="space-y-6 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-xs font-bold uppercase tracking-wider">
            <Home className="w-3.5 h-3.5" />
            <span>Bem-estar e Segurança</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Hospedagem &amp; <span className="text-[#D97457]">Creche Canina</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Viaje com tranquilidade sabendo que seu cão está hospedado em um ambiente estruturado para o porte e comportamento dele. Contamos com chácara ampla e equipe altamente treinada em manejo de cães de grande porte.
          </p>
        </section>

        {/* Specs Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((s, idx) => (
            <div key={idx} className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-xl space-y-3 hover:border-[#D97457]/30 transition-all">
              <span className="text-[#D97457] font-bold text-sm">Estrutura 0{idx + 1}</span>
              <h4 className="font-bold text-sm text-white">{s.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </section>

        {/* Boarding booking card */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Hospedagem sob Medida</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Traga o brinquedo e a ração preferida do seu cão. Cuidamos do resto com carinho e disciplina.
            </p>

            <div className="space-y-3.5 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D97457]" />
                <span><strong>Valor da Diária:</strong> R$ 80,00 (Descontos para estadias longas)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D97457]" />
                <span><strong>Requisitos:</strong> Carteira vacinação completa (V10, Raiva, Gripe) e vermifugação/antipulgas aplicado</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D97457]" />
                <span><strong>Check-in/Check-out:</strong> Flexível, sob agendamento prévio</span>
              </div>
            </div>

            <a
              href="https://wa.me/5511974992059?text=Ol%C3%A1!%20Gostaria%20de%20reservar%20uma%20vaga%20de%20hospedagem%20para%20meu%20c%C3%A3o."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] font-bold px-6 py-2.5 rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)]"
            >
              <span>Reservar Vaga no Hotel</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="relative h-60 sm:h-80 rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600"
              alt="Boxes e Lazer Canino"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

      </main>

      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
