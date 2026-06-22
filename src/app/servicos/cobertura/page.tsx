import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Shield, Check, Calendar, ArrowRight, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Serviço de Cobertura e Monta | Reprodutores Pastor do Cáucaso",
  description: "Melhore a genética de sua criação. Oferecemos serviços de monta natural ou inseminação artificial com nossos reprodutores importados com pedigree CBKC.",
  keywords: ["cobertura pastor do caucaso", "padreador pastor do caucaso", "reprodutor causo sp", "cruzamento pastor do caucaso"],
};

export default function CoberturaPage() {
  const studs = [
    {
      name: "Kahn da Aura",
      details: "Importado da Rússia, 78 cm de cernelha, 73 kg, pelagem cinza carvão abundante, excelente temperamento de guarda territorial.",
      exams: ["Laudo HD- (Isento de Displasia Coxofemoral)", "Microchipado", "Pedigree CBKC/FCI de campeões"],
      image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=400",
    }
  ];

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Intro */}
        <section className="space-y-6 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Melhoramento Genético</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Serviço de <span className="text-[#C9A96E]">Cobertura / Monta</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Disponibilizamos padreadores de linhagens fechadas do Leste Europeu para criadores selecionados. Todo o processo é realizado com contrato de garantia e acompanhamento veterinário especializado.
          </p>
        </section>

        {/* Stud cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {studs.map((stud, idx) => (
            <div key={idx} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-xl">
              <div className="md:w-1/2 h-64 md:h-auto relative bg-gray-900">
                <img src={stud.image} alt={stud.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:w-1/2 space-y-4">
                <h3 className="text-xl font-bold">{stud.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{stud.details}</p>
                <div className="space-y-2 border-t border-[#2A2A2A] pt-4">
                  <h4 className="text-[10px] font-bold text-[#C9A96E] uppercase tracking-wider">Laudos e Certificados</h4>
                  {stud.exams.map((exam, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-gray-300">
                      <Check className="w-3.5 h-3.5 text-[#C9A96E]" />
                      <span>{exam}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Terms info */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Requisitos para Cobertura</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Para preservar a saúde de nossos cães e a integridade da raça, exigimos que as fêmeas candidatas preencham as seguintes condições:
            </p>
            <div className="space-y-3 text-xs">
              <div className="flex gap-2">
                <span className="text-[#C9A96E] font-bold">01.</span>
                <span>Pedigree CBKC ativo com histórico completo.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#C9A96E] font-bold">02.</span>
                <span>Exame radiográfico de displasia coxofemoral com laudo oficial (A ou B).</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#C9A96E] font-bold">03.</span>
                <span>Exames de brucelose negativos atualizados.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#C9A96E] font-bold">04.</span>
                <span>Carteira de vacinação em dia.</span>
              </div>
            </div>
            <a
              href="https://wa.me/5511998765432?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20servi%C3%A7o%20de%20cobertura%20do%20Kahn."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#C9A96E] hover:bg-[#B8965C] text-[#0F0F0F] font-bold px-6 py-2.5 rounded-lg text-xs mt-4 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)]"
            >
              <span>Consultar Condições</span>
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
