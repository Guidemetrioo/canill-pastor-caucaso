import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
import { Shield, MapPin, Award, CheckCircle, Star } from "lucide-react";

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
              O Canil Vale da Kubera é especializado na criação do Pastor do Cáucaso (Kavkazskaya Ovcharka), com plantel formado por linhagens importadas da Rússia, Ucrânia, Romênia e Espanha. Nosso trabalho é guiado por três pilares: genética de qualidade, estrutura compatível com o padrão da raça e temperamento equilibrado. Selecionamos exemplares com histórico comprovado — incluindo cães premiados em exposições na Europa — para formar uma linhagem brasileira sólida, livre de problemas como displasia e hipotireoidismo, e funcional tanto para exposição quanto para guarda residencial.
            </p>
          </div>
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-xl">
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
            <h2 className="text-2xl md:text-3xl font-bold">Nossa Filosofia de Criação</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Trabalhamos com os mais rígidos critérios técnicos internacionais para criar exemplares saudáveis e fiéis ao padrão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="flex gap-4">
              <Award className="w-10 h-10 text-[#D97457] shrink-0" />
              <div className="space-y-1.5 font-sans">
                <h4 className="text-sm font-bold">Padrão de Exposição com Funcionalidade</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  No Canil Vale da Kubera, o cão de exposição é a base de toda a nossa seleção genética. Trabalhamos com exemplares avaliados por especialistas e aprovados no padrão oficial da raça — estrutura, peso, pelagem, dentição e movimentação — e que, ao mesmo tempo, exercem naturalmente a guarda territorial da família. Não enxergamos &quot;linha de exposição&quot; e &quot;linha de trabalho&quot; como conceitos opostos: um cão bem estruturado e aprovado em exposição é, por definição, um cão saudável e funcional.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Shield className="w-10 h-10 text-[#D97457] shrink-0" />
              <div className="space-y-1.5 font-sans">
                <h4 className="text-sm font-bold">Genética Selecionada para Padrão de Exposição</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Cada cruzamento no Canil Vale da Kubera é pensado para atender ao padrão de exposição da raça: estrutura óssea robusta, angulações corretas, dentição completa e vitalidade comprovada — sempre livres de displasia e hipotireoidismo. Nosso plantel inclui exemplares com tatuagem de identificação e procedência documentada da Rússia, Ucrânia, Romênia e Espanha, selecionados por critérios técnicos avaliados em exposições internacionais.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="w-10 h-10 text-[#D97457] shrink-0" />
              <div className="space-y-1.5 font-sans">
                <h4 className="text-sm font-bold">Conheça o Temperamento do Pastor do Cáucaso</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  O Pastor do Cáucaso é uma raça de guarda territorial, com temperamento controlado e maturação tardia — atinge a fase adulta após os 2 anos de idade. É um cão dócil com a família e protetor com estranhos, equilibrando instinto de guarda com comportamento estável em ambientes de exposição.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-10 h-10 text-[#D97457] shrink-0" />
              <div className="space-y-1.5 font-sans">
                <h4 className="text-sm font-bold">O Que Define um Cão de Exposição</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Um cão de exposição é avaliado por especialistas quanto à conformidade com o padrão oficial da raça: estrutura, peso, pelagem, dentição, formato de cabeça, angulações e movimentação. No Canil Vale da Kubera, esse é o ponto de partida de toda a nossa seleção — só avançamos com exemplares que comprovam saúde, vitalidade e fidelidade ao padrão do Pastor do Cáucaso, características que se traduzem diretamente em cães mais equilibrados também como guardiões da família.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials (Migrated from Home) */}
        <section className="py-20 bg-[#121212]/50 border border-[#2A2A2A] rounded-2xl">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2 max-w-lg mx-auto">
              <span className="text-xs text-[#D97457] font-bold uppercase tracking-wider">Depoimentos</span>
              <h2 className="text-3xl font-extrabold text-white">O que dizem os tutores</h2>
              <p className="text-gray-400 text-xs leading-relaxed">
                Confiança e transparência que resultam em parcerias duradouras com nossos clientes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  name: "Rodrigo Almeida",
                  location: "São Paulo - SP",
                  dog: "Thor (Macho, 2 anos)",
                  text: "Excelente cão de guarda. O Thor é extremamente dócil com as minhas filhas, mas um guardião implacável na propriedade. O suporte pós-venda do canil foi nota 10.",
                  stars: 5,
                },
                {
                  name: "Mariana Costa",
                  location: "Curitiba - PR",
                  dog: "Athena (Fêmea, 1 ano e meio)",
                  text: "Fêmea atenta, muito equilibrada e rústica. Veio com pedigree CBKC completo e laudos negativos de displasia dos pais. Indico o canil de olhos fechados.",
                  stars: 5,
                },
              ].map((test, index) => (
                <div
                  key={index}
                  className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl space-y-4 hover:border-gray-800 transition-colors shadow-lg relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex gap-1 text-[#D97457]">
                      {[...Array(test.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#D97457] fill-[#D97457]" />
                      ))}
                    </div>
                    <p className="text-gray-300 text-xs italic leading-relaxed font-sans">&ldquo;{test.text}&rdquo;</p>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#2A2A2A]/50">
                    <div className="flex flex-col">
                      <span className="text-white text-xs font-bold">{test.name}</span>
                      <span className="text-gray-500 text-[10px]">{test.location}</span>
                    </div>
                    <span className="text-xs text-[#D97457] font-semibold">{test.dog}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
      <SocialFloatingButtons />
    </div>
  );
}
