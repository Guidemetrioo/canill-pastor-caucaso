import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
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
              O Canil Vale da Kubera nasceu da paixão e dedicação dos criadores <strong>Rafael Avellar</strong> (estudante de veterinária) e <strong>José Carlos (Zé Carlos)</strong>. Movidos pela admiração profunda pela robustez, lealdade e instinto de guarda inigualável do Pastor do Cáucaso, eles uniram forças para revolucionar a criação da raça no Brasil, com base em organização, ciência e respeito ao padrão oficial.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Localizado em Itatiba - SP, o canil conta com uma estrutura cercada de área verde e piquetes planejados. Trabalhamos exclusivamente com linhagens de elite importadas diretamente de países que são referências mundiais na raça, como Rússia, Geórgia, Romênia, Ucrânia e Espanha. Nosso compromisso é selecionar cães de excelente temperamento de proteção e guarda, preservando a saúde física e a beleza morfológica para pistas de exposição.
            </p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-xl">
            <img
              src="/dogs/vasilisia_1.jpg"
              alt="Vasilísia - Fêmea importada da Rússia - Canil Vale da Kubera"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
              <p className="text-xs text-white font-semibold">VASILÍSIA &bull; Fêmea Importada da Rússia</p>
            </div>
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

        {/* Video / Documentary Section */}
        <section className="space-y-8 py-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs text-[#D97457] font-bold uppercase tracking-wider">Documentário em Vídeo</span>
            <h2 className="text-2xl md:text-4xl font-extrabold">Canil Vale da Kubera no Cinofilia Digital</h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Assista à visita de Sávio do canal <strong>Cinofilia Digital</strong> ao nosso canil. Veja o nosso plantel real em ação, incluindo nossos reprodutores importados e a análise do padrão de guarda e estrutura dos nossos cães.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto relative aspect-video w-full rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-2xl bg-gray-950">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/UgnjXPSdQTY"
              title="Canil Vale da Kubera | Pastor do Cáucaso | Cinofilia Digital"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
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
      <SocialFloatingButtons />
    </div>
  );
}
