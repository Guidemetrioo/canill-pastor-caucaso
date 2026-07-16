import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
import TrafficTracker from "@/components/TrafficTracker";
import { Shield, MapPin, Award, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Quem Somos | Canil Pastor do Cáucaso Vale da Kubera",
  description: "Conheça a história do Canil Vale da Kubera, especializado na criação e seleção genética de Pastor do Cáucaso in Itatiba - SP. Laudos negativos de displasia e pedigree CBKC.",
  keywords: ["canil pastor do caucaso", "criacao responsavel causo", "pastor do caucaso itatiba", "criador pastor do caucaso valedakubera"],
};

export default function SobrePage() {
  const stats = [
    { label: "Área Verde", value: "20.000m²" },
    { label: "Anos de Seleção", value: "8+ Anos" },
    { label: "Matrizes Selecionadas", value: "100% CBKC" },
    { label: "Best in Show Europa", value: "² Títulos" },
  ];

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Quem Somos | Canil Vale da Kubera",
    "description": "Conheça a história do Canil Vale da Kubera, especializado na criação e seleção genética de cães de guarda Pastor do Cáucaso.",
    "url": "https://canil-pastor-do-caucaso.vercel.app/sobre",
    "mainEntity": {
      "@type": "Organization",
      "name": "Canil Vale da Kubera",
      "founder": [
        {
          "@type": "Person",
          "name": "Rafael Avellar",
          "jobTitle": "Criador & Estudante de Medicina Veterinária",
          "description": "Estudante de medicina veterinária e criador dedicado do cão Pastor do Cáucaso, com foco em genética de exposição, saúde e temperamento equilibrado.",
          "sameAs": "https://www.instagram.com/valedakubera/"
        },
        {
          "@type": "Person",
          "name": "Zé Carlos",
          "jobTitle": "Co-fundador & Criador",
          "description": "Colecionador apaixonado pela raça Pastor do Cáucaso e parceiro na seleção genética do plantel Vale da Kubera."
        }
      ],
      "areaServed": "Brasil",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Itatiba",
        "addressRegion": "SP",
        "addressCountry": "BR"
      }
    }
  };

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans">
      <PublicNavbar />
      <TrafficTracker path="/sobre" />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />

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
              O Canil Vale da Kubera foi fundado por <strong>Rafael Avellar</strong> — estudante de medicina veterinária e criador dedicado — em parceria com <strong>Zé Carlos</strong>, colecionar apaixonado pela raça. Juntos, impulsionados pela admiração pela robustez, lealdade e instinto de guarda inigualável do Pastor do Cáucaso, construíram um dos plantéis mais representativos e geneticamente ricos da raça no Brasil. Localizado em Itatiba - SP, o compromisso é produzir cães de altíssima qualidade genética, com temperamento equilibrado e saúde certificada.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Trabalhamos com linhagens selecionadas e importadas diretamente dos países de referência da raça: <strong>Rússia, Ucrânia, Romênia e Espanha</strong>. Em 2023, trouxemos ao Brasil o <strong>Goran</strong> — o primeiro Pastor do Cáucaso a chegar ao país com dois títulos de <em>Best in Show</em> conquistados na Europa, uma conquista histórica para a cinofilia brasileira.
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

        {/* Plantel Internacional */}
        <section className="space-y-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 md:p-10">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <span className="text-xs text-[#D97457] font-bold uppercase tracking-wider">Importáveis de Excelência</span>
            <h2 className="text-2xl md:text-3xl font-bold">Plantél de Linhagens Internacionais</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Nossos reprodutores foram selecionados nos países de origem mais respeitados da raça, garantindo genética de nível mundial.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {[
              {
                country: "Rússia",
                description: "Linhagens com foco em temperamento equilibrado e estrutura robusta. Importamos de canis de exposição de alto nível, incluindo o renomado Canil Baraik Azskaz.",
                highlight: "Afár, Symion, Vénus"
              },
              {
                country: "Ucrânia",
                description: "Cães com porte excepcional, ossatura massiva e temperamento explosivo. Preferidos por criadores que buscam tamanho e presença imponente.",
                highlight: "Nero (40kg aos 4 meses)"
              },
              {
                country: "Romênia",
                description: "Casa do Goran — campeão europeu com dois títulos de Best in Show. O primeiro Pastor do Cáucaso com essa conquista a chegar ao Brasil.",
                highlight: "Goran — 2x Best in Show Europa"
              },
              {
                country: "Espanha",
                description: "Cães mais altos, com estrutura elegante e caráter forte e explosivo. O Canil Nirvana (Espanha) é referência mundial para a raça.",
                highlight: "Apolo (Canil Nirvana)"
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 bg-[#0F0F0F] border border-[#2A2A2A] p-5 rounded-xl hover:border-[#D97457]/30 transition-colors">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-white text-sm">{item.country}</h4>
                  <p className="text-gray-400 text-[11px] leading-relaxed">{item.description}</p>
                  <span className="inline-block text-[10px] font-bold text-[#D97457] border border-[#D97457]/20 bg-[#D97457]/5 px-2 py-0.5 rounded-full">{item.highlight}</span>
                </div>
              </div>
            ))}
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
                  Mais de 20.000m² com piquetes gramados espaçosos, boxes higienizados diariamente e maternidade climatizada para o conforto absoluto das fêmeas e filhotes.
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
