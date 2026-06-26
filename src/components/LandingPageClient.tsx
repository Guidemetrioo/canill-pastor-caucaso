"use client";

import { useRef, useEffect, useState } from "react";
import { useAura } from "@/context/AuraContext";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
import Link from "next/link";
import { Shield, Check, Calendar, ArrowRight, Star, Heart, MapPin, Award, MessageCircle } from "lucide-react";

export default function LandingPageClient() {
  const { filhotes } = useAura();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  // Static dog profiles — always shown regardless of backend status
  const staticDogs = [
    {
      id: 1,
      name: "VENÛS",
      gender: "fêmea" as const,
      status: "Disponível" as const,
      price: 0,
      health_records: [],
      weight_history: [],
      avatar_url: "/dogs/venus_1.jpg",
      photos: ["/dogs/venus_1.jpg", "/dogs/venus_2.jpg"],
      breed: "Pastor do Cáucaso",
      age: "",
      origin: "Rússia",
      weight: "70kg",
      notes: "Fêmea importada da Rússia. Estrutura extremamente robusta.",
      history: "Fêmea importada da Rússia com excelente temperamento e ossatura muito robusta.",
    },
    {
      id: 2,
      name: "NERO",
      gender: "macho" as const,
      status: "Disponível" as const,
      price: 0,
      health_records: [],
      weight_history: [],
      avatar_url: "/dogs/nero_4.jpg",
      photos: ["/dogs/nero_4.jpg", "/dogs/nero_5.jpg", "/dogs/nero_1.jpg", "/dogs/nero_2.jpg", "/dogs/nero_6.jpg", "/dogs/nero_7.jpg"],
      breed: "Pastor do Cáucaso",
      age: "",
      origin: "Ucrânia",
      weight: "",
      notes: "Macho importado da Ucrânia. Um cão extremamente explosivo.",
      history: "Macho importado da Ucrânia. Cão de guarda de alto nível com temperamento extremamente explosivo e focado.",
    },
    {
      id: 3,
      name: "VASILÍSIA",
      gender: "fêmea" as const,
      status: "Disponível" as const,
      price: 0,
      health_records: [],
      weight_history: [],
      avatar_url: "/dogs/vasilisia_1.jpg",
      photos: ["/dogs/vasilisia_1.jpg", "/dogs/vasilisia_2.jpg", "/dogs/vasilisia_3.jpg"],
      breed: "Pastor do Cáucaso",
      age: "",
      origin: "Rússia",
      weight: "",
      notes: "Fêmea robusta importada da Rússia. Temperamento equilibrado e excelente guardiã.",
      history: "Fêmea importada da Rússia. Estrutura robusta e temperamento equilibrado de guarda.",
    },
  ];

  // Use context data if loaded, otherwise use static dogs
  const homePuppies = filhotes.filter((f) => f.status === "Disponível").length > 0
    ? filhotes.filter((f) => f.status === "Disponível").slice(0, 4)
    : staticDogs;

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

      {/* Fixed Hero Section (Horizontal Banner) */}
      <section 
        className="relative h-[60vh] min-h-[450px] md:h-[70vh] flex items-center overflow-hidden border-b border-[#2A2A2A] bg-black"
      >
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            autoPlay
            preload="auto"
            className="w-full h-full object-cover object-center opacity-55"
            style={{ filter: "brightness(1.4) contrast(0.95)" }}
            poster="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800"
          >
            <source src="/banner-hero.mp4" type="video/mp4" />
          </video>
          {/* Gradients overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/85 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent z-10" />
        </div>
        
        {/* Decorative ambient light */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D97457]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Criação Selecionada CBKC/FCI</span>
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
              Canil <br />
              <span className="text-[#D97457]">Vale da Kubera</span>
            </h1>

            <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
              Criação especializada em Pastor do Cáucaso (Kavkazskaya Ovcharka) com padrão de exposição internacional, unindo estrutura premiada e instinto de guarda em um único cão.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/filhotes"
                className="bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] font-bold px-6 py-3 rounded-xl transition-all text-center text-xs shadow-[0_0_20px_rgba(217,116,87,0.25)] flex items-center justify-center gap-2"
              >
                <span>Ver Nossos Cães</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sobre"
                className="bg-[#1A1A1A] border border-[#2A2A2A] text-white hover:bg-gray-900 font-bold px-6 py-3 rounded-xl transition-all text-center text-xs"
              >
                Conheça Nosso Trabalho
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Available Puppies & Dogs Section */}
      <section className="py-20 bg-[#121212]/50 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs text-[#D97457] font-bold uppercase tracking-wider">Cães &amp; Ninhadas</span>
              <h2 className="text-3xl font-extrabold">Nossos Cães</h2>
              <p className="text-gray-400 text-xs max-w-lg leading-relaxed">
                Conheça nossos reprodutores importados e ninhadas selecionadas de Pastor do Cáucaso.
              </p>
            </div>
            <Link
              href="/filhotes"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97457] hover:underline"
            >
              <span>Ver todos ({filhotes.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {homePuppies.length === 0 ? (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-10 text-center text-gray-400 text-xs">
              Nenhum cão ou filhote cadastrado no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {homePuppies.map((puppy) => (
                <DogCard key={puppy.id} dog={puppy} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Breed Info & Social Media Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs text-[#D97457] font-bold uppercase tracking-wider">A Raça &amp; Criação</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Padrão de Exposição <br />
              <span className="text-[#D97457]">com Funcionalidade</span>
            </h2>
            <div className="space-y-4 text-gray-400 text-xs sm:text-sm leading-relaxed font-sans">
              <p>
                No <strong>Canil Vale da Kubera</strong>, o cão de exposição é a base de toda a nossa seleção genética. Trabalhamos com exemplares avaliados por especialistas e aprovados no padrão oficial da raça — estrutura, peso, pelagem, dentição e movimentação — e que, ao mesmo tempo, exercem naturalmente a guarda territorial da família.
              </p>
              <p>
                Não enxergamos &quot;linha de exposição&quot; e &quot;linha de trabalho&quot; como conceitos opostos: um cão bem estruturado e aprovado em exposição é, por definição, um cão saudável e funcional.
              </p>
            </div>

            {/* Social links hint */}
            <p className="text-sm text-gray-500 pt-2">
              Siga nas redes sociais pelos ícones flutuantes na lateral direita da tela.
            </p>
          </div>

          {/* Image Content (Nero_2) */}
          <div className="lg:col-span-5 relative h-96 sm:h-[450px] w-full rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-2xl">
            <img
              src="/dogs/nero_2.jpg"
              alt="Pastor do Cáucaso Nero"
              className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
            />
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#121212]/50 border-t border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <span className="text-xs text-[#D97457] font-bold uppercase tracking-wider">Depoimentos</span>
            <h2 className="text-3xl font-extrabold">O que dizem os tutores</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Confiança e transparência que resultam em parcerias duradouras com nossos clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((test, index) => (
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
      {/* Location / Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs text-[#D97457] font-bold uppercase tracking-wider">Localização</span>
          <h2 className="text-3xl font-extrabold">Venha nos visitar em Itatiba - SP</h2>
          <p className="text-gray-400 text-xs leading-relaxed">
            Nossas instalações ficam em uma chácara verde estruturada especificamente para o bem-estar e criação da raça Pastor do Cáucaso.
          </p>

          <div className="space-y-3.5 text-xs text-gray-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-[#D97457] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-white text-sm">Endereço Oficial</h5>
                <p className="text-gray-400 text-xs mt-0.5">Itatiba - SP, CEP 13250-000</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Calendar className="w-5 h-5 text-[#D97457] shrink-0 mt-0.5" />
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
      <SocialFloatingButtons />
    </div>
  );
}

// DogCard Sub-component for individual dog profiles with attributes & gallery switcher
function DogCard({ dog }: { dog: any }) {
  const [activePhoto, setActivePhoto] = useState(dog.avatar_url || (dog.photos && dog.photos[0]) || "");

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-[#D97457]/50 transition-all flex flex-col justify-between group shadow-xl">
      {/* Photo Container */}
      <div className="relative h-72 bg-gray-900 overflow-hidden select-none">
        {activePhoto ? (
          <img
            src={activePhoto}
            alt={dog.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
            Sem foto disponível
          </div>
        )}
        <span className="absolute top-4 right-4 bg-[#0F0F0F]/85 border border-[#2A2A2A] text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider z-20">
          {dog.gender === "macho" ? "Macho" : "Fêmea"}
        </span>

        {/* Thumbnails Overlay at the bottom */}
        {dog.photos && dog.photos.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
            <div className="flex gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {dog.photos.map((photo: string, i: number) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePhoto(photo);
                  }}
                  className={`w-5 h-5 rounded border transition-all flex items-center justify-center text-[9px] font-bold ${
                    activePhoto === photo 
                      ? "bg-[#D97457] text-[#0F0F0F] border-[#D97457] scale-110" 
                      : "bg-[#1A1A1A] text-gray-400 border-[#2A2A2A] hover:bg-gray-800 hover:text-white"
                  }`}
                  title={`Foto ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold group-hover:text-[#D97457] transition-colors">{dog.name}</h3>
            {dog.price > 0 && (
              <span className="text-[#D97457] font-extrabold text-sm">
                R$ {dog.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Dog Details Table Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] sm:text-xs text-gray-300 bg-[#121212]/50 p-4 rounded-xl border border-[#2A2A2A] font-sans">
            <div>
              <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Raça</span>
              <span className="font-semibold">{dog.breed || "Pastor do Cáucaso"}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Origem</span>
              <span className="font-semibold">{dog.origin || "—"}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Peso</span>
              <span className="font-semibold">{dog.weight || "—"}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Idade</span>
              <span className="font-semibold">{dog.age || "—"}</span>
            </div>
          </div>

          <p className="text-gray-400 text-xs leading-relaxed min-h-[48px] font-sans">
            {dog.notes || dog.history || "Sem descrição disponível."}
          </p>
        </div>

        <div className="space-y-3 pt-3 border-t border-[#2A2A2A]/50">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] text-gray-300">
              <Check className="w-3.5 h-3.5 text-[#D97457]" />
              <span>Pedigree CBKC Incluso</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-300">
              <Check className="w-3.5 h-3.5 text-[#D97457]" />
              <span>Linhagem Importada Selecionada</span>
            </div>
          </div>

          {dog.name.includes("[Espaço") ? (
            <div className="w-full text-center py-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest border border-dashed border-gray-800 rounded-lg">
              Espaço Reservado
            </div>
          ) : (
            <Link
              href={`https://wa.me/5511998765432?text=Olá!%20Gostaria%20de%20saber%20mais%20detalhes%20sobre%20o%20cão%20${dog.name}.`}
              target="_blank"
              className="w-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] hover:bg-[#D97457] hover:text-[#0F0F0F] py-2.5 rounded-lg text-xs font-bold transition-all text-center block"
            >
              Consultar Detalhes
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
