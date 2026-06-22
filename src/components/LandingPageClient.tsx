"use client";

import { useAura } from "@/context/AuraContext";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { Shield, Check, Calendar, ArrowRight, Star, Heart, MapPin, Award } from "lucide-react";

export default function LandingPageClient() {
  const { filhotes, services } = useAura();

  // Filter available puppies (limit to 3 for the home cards)
  const homePuppies = filhotes.filter((f) => f.status === "Disponível").slice(0, 3);

  const testimonials = [
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
  ];

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-20 font-sans">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.08),transparent_70%)] overflow-hidden border-b border-[#2A2A2A]">
        {/* Visual elements */}
        <div className="absolute top-0 right-0 w-[50vw] h-full opacity-30 md:opacity-40 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800"
            alt="Pastor do Cáucaso Guardião"
            className="w-full h-full object-cover object-center mask-gradient-to-l"
          />
        </div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#C9A96E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 md:py-24">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Criação Selecionada CBKC/FCI</span>
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-white">
              Guardiões de Elite: <br />
              <span className="text-[#C9A96E]">Pastor do Cáucaso</span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Criação responsável em Itatiba - SP. Reprodutores selecionados, importados da Rússia, Europa e Geórgia, com laudos negativos de displasia. Cães com robustez física e temperamento equilibrado de guarda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/filhotes"
                className="bg-[#C9A96E] hover:bg-[#B8965C] text-[#0F0F0F] font-bold px-8 py-3.5 rounded-xl transition-all text-center text-sm shadow-[0_0_20px_rgba(201,169,110,0.25)] flex items-center justify-center gap-2"
              >
                <span>Ver Filhotes Disponíveis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sobre"
                className="bg-[#1A1A1A] border border-[#2A2A2A] text-white hover:bg-gray-900 font-bold px-8 py-3.5 rounded-xl transition-all text-center text-sm"
              >
                Conheça Nosso Trabalho
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Available Puppies Section */}
      <section className="py-20 bg-[#121212]/50 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs text-[#C9A96E] font-bold uppercase tracking-wider">Oportunidade</span>
              <h2 className="text-3xl font-extrabold">Ninhadas Disponíveis</h2>
              <p className="text-gray-400 text-xs max-w-lg leading-relaxed">
                Leve para casa um legítimo Pastor do Cáucaso com pedigree e garantia de saúde contratual.
              </p>
            </div>
            <Link
              href="/filhotes"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A96E] hover:underline"
            >
              <span>Ver todos os filhotes ({filhotes.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {homePuppies.length === 0 ? (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-10 text-center text-gray-400 text-xs">
              Nenhum filhote disponível no momento. Entre em contato para registrar interesse na fila de reserva da próxima ninhada.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {homePuppies.map((puppy) => {
                const genderSlug = puppy.gender === "macho" ? "macho" : "femea";
                const puppySlug = `filhote-${genderSlug}-pastor-do-caucaso-${puppy.id}`;

                return (
                  <div
                    key={puppy.id}
                    className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-[#C9A96E]/50 transition-all flex flex-col justify-between group shadow-xl"
                  >
                    <div className="relative h-60 bg-gray-900 overflow-hidden">
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
                        {puppy.notes || "Lindo filhote com ossatura gigante, temperamento equilibrado de guarda ativa."}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-[#2A2A2A]/50">
                        <div className="flex items-center gap-2 text-[10px] text-gray-300">
                          <Check className="w-3.5 h-3.5 text-[#C9A96E]" />
                          <span>Pedigree CBKC Incluso</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-300">
                          <Check className="w-3.5 h-3.5 text-[#C9A96E]" />
                          <span>Vermifugado e Vacinado (V10)</span>
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
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <span className="text-xs text-[#C9A96E] font-bold uppercase tracking-wider">Nossos Serviços</span>
          <h2 className="text-3xl font-extrabold">Soluções Completas para seu Cão</h2>
          <p className="text-gray-400 text-xs leading-relaxed">
            Oferecemos uma gama de serviços especializados liderados por profissionais experientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1: Stud */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 space-y-6 flex flex-col justify-between hover:border-[#C9A96E]/30 transition-all shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-xl flex items-center justify-center text-[#C9A96E]">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Cobertura / Monta</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Padreadores importados russos ativos para reprodução. Oferecemos monta natural assistida ou inseminação artificial com contrato e laudos negativos de displasia.
              </p>
            </div>
            <Link
              href="/servicos/cobertura"
              className="text-xs font-bold text-[#C9A96E] hover:underline flex items-center gap-1.5 pt-4"
            >
              <span>Saiba mais</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Service 2: Training */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 space-y-6 flex flex-col justify-between hover:border-[#C9A96E]/30 transition-all shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-xl flex items-center justify-center text-[#C9A96E]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Adestramento Canino</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Especialistas em obediência básica e modificação comportamental para cães de grande porte. Foco em obediência urbana, liderança e socialização ambiental.
              </p>
            </div>
            <Link
              href="/servicos/adestramento"
              className="text-xs font-bold text-[#C9A96E] hover:underline flex items-center gap-1.5 pt-4"
            >
              <span>Saiba mais</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Service 3: Boarding */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 space-y-6 flex flex-col justify-between hover:border-[#C9A96E]/30 transition-all shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-xl flex items-center justify-center text-[#C9A96E]">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Hospedagem &amp; Creche</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Piquetes individuais gramados de 150m², boxes climatizados, alimentação supervisionada e monitoramento por câmeras 24h. Bem-estar garantido para o seu cão.
              </p>
            </div>
            <Link
              href="/servicos/hospedagem"
              className="text-xs font-bold text-[#C9A96E] hover:underline flex items-center gap-1.5 pt-4"
            >
              <span>Saiba mais</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#121212]/50 border-t border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <span className="text-xs text-[#C9A96E] font-bold uppercase tracking-wider">Depoimentos</span>
            <h2 className="text-3xl font-extrabold">O que dizem os tutores</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Confiança e transparência que resultam em parcerias duradouras com nossos clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 space-y-4 shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center gap-1">
                  {[...Array(test.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#C9A96E] fill-[#C9A96E]" />
                  ))}
                </div>
                <p className="text-gray-300 text-xs leading-relaxed italic">
                  {"“"}{test.text}{"”"}
                </p>
                <div className="pt-4 border-t border-[#2A2A2A]/50 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white leading-none">{test.name}</h5>
                    <span className="text-[10px] text-gray-400">{test.location}</span>
                  </div>
                  <span className="text-xs text-[#C9A96E] font-semibold">{test.dog}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs text-[#C9A96E] font-bold uppercase tracking-wider">Localização</span>
          <h2 className="text-3xl font-extrabold">Venha nos visitar em Itatiba - SP</h2>
          <p className="text-gray-400 text-xs leading-relaxed">
            Nossas instalações ficam em uma chácara verde estruturada especificamente para o bem-estar e criação da raça Pastor do Cáucaso.
          </p>

          <div className="space-y-3.5 text-xs text-gray-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-[#C9A96E] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-white text-sm">Endereço Oficial</h5>
                <p className="text-gray-400 text-xs mt-0.5">Itatiba - SP, CEP 13250-000</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Calendar className="w-5 h-5 text-[#C9A96E] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-white text-sm">Horários de Visitas</h5>
                <p className="text-gray-400 text-xs mt-0.5">Terça a Sábado: 09h às 17h (Sob agendamento prévio no WhatsApp)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Embed Map Map */}
        <div className="h-80 w-full rounded-2xl overflow-hidden border border-[#2A2A2A] bg-gray-950 shadow-xl">
          <iframe
            title="Mapa Canil Vale da Kubera"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14686.082725893302!2d-46.85244584346001!3d-23.00392931168172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cec205c6d3df37%3A0xb35a09282365a6b5!2sItatiba%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1672322300000!5md2"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
          />
        </div>
      </section>

      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
