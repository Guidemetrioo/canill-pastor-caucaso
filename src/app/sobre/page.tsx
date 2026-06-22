import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Shield, MapPin, Award, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Quem Somos | Canil Pastor do Cáucaso Vale da Kubera",
  description: "Conheça a história do Canil Vale da Kubera, especializado na criação e seleção genética de Pastor do Cáucaso em Itatiba - SP. Laudos negativos de displasia e pedigree CBKC.",
  keywords: ["canil pastor do caucaso", "criacao responsavel causo", "pastor do caucaso itatiba", "criador pastor do caucaso valedakubera"],
};

export default function SobrePage() {
  const stats = [
    { label: "Área Verde", value: "10.000m²" },
    { label: "Anos de Seleção", value: "8+ Anos" },
    { label: "Matrizes Selecionadas", value: "100% CBKC" },
    { label: "Cães Saudáveis", value: "Laudo Displasia" },
  ];

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Intro */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Nossa História</span>
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Dedicação Absoluta à Raça <br />
              <span className="text-[#D97457]">Pastor do Cáucaso</span>
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              O Canil Vale da Kubera nasceu sob a liderança do criador Rafael Avellar, da admiração profunda pela robustez, lealdade e instinto de guarda inigualável do Pastor do Cáucaso. Localizado em Itatiba - SP, nosso compromisso é produzir cães de altíssima qualidade genética, com temperamento equilibrado e saúde certificada.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Trabalhamos exclusivamente com linhagens selecionadas, muitas delas importadas diretamente de países do Leste Europeu (Rússia, Geórgia), garantindo a rusticidade e a tipicidade da raça que são valorizadas no mundo inteiro.
            </p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600"
              alt="Instalações do Canil"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-xl text-center space-y-2">
              <span className="block text-2xl font-extrabold text-[#D97457]">{s.value}</span>
              <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </section>

        {/* Features / Differentials */}
        <section className="space-y-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 md:p-12">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">Nossos Diferenciais</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Como criadores responsáveis, seguimos protocolos rigorosos para entregar o melhor companheiro de guarda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="flex gap-4">
              <Award className="w-10 h-10 text-[#D97457] shrink-0" />
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold">Laudos de Saúde</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Todas as nossas matrizes e padreadores realizam exames radiográficos para atestar a ausência de Displasia Coxofemoral antes de qualquer acasalamento.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Shield className="w-10 h-10 text-[#D97457] shrink-0" />
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold">Temperamento Equilibrado</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Realizamos socialização precoce com estímulos ambientais e humanos para desenvolver cães seguros, autoconfiantes e territorialistas no nível correto.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="w-10 h-10 text-[#D97457] shrink-0" />
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold">Instalações Premium</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Mais de 10.000m² com piquetes gramados espaçosos, boxes higienizados diariamente e maternidade climatizada para o conforto absoluto das fêmeas e filhotes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-10 h-10 text-[#D97457] shrink-0" />
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold">Suporte Vitalício</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Ao adquirir um de nossos filhotes, você terá canal aberto permanente com o criador para tirar dúvidas de alimentação, manejo, adestramento e desenvolvimento.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
