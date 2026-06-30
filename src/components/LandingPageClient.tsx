"use client";

import { useRef, useEffect, useState } from "react";
import { useAura } from "@/context/AuraContext";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import Link from "next/link";
import {
  Shield,
  Check,
  Calendar,
  ArrowRight,
  Star,
  Heart,
  MapPin,
  Award,
  MessageCircle,
  Users,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function LandingPageClient() {
  const { addLead } = useAura();
  const videoRef = useRef<HTMLVideoElement>(null);
  const bookingVideoRef = useRef<HTMLVideoElement>(null);

  // States
  const [activeDogType, setActiveDogType] = useState<"femeas" | "machos">("femeas");
  const [activeExpoGuarda, setActiveExpoGuarda] = useState<"exposicao" | "guarda">("exposicao");
  const [activeInfoTab, setActiveInfoTab] = useState<"lugar" | "criacao" | "historia" | "disponibilidade">("lugar");

  // Booking Form State
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00");
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    if (bookingVideoRef.current) {
      bookingVideoRef.current.play().catch(() => {});
    }
  }, []);

  // Dog Active Photos
  const [activePhotos, setActivePhotos] = useState<Record<number, string>>({
    1: "/dogs/venus_1.jpg",
    2: "/dogs/vasilisia_1.jpg",
    3: "/dogs/nero_4.jpg",
    4: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800"
  });

  const changePhoto = (dogId: number, photo: string) => {
    setActivePhotos(prev => ({ ...prev, [dogId]: photo }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingDate) return;

    try {
      await addLead({
        name: bookingName,
        phone: bookingPhone,
        status: "Visita Agendada",
        origin: "Site Principal",
        data_qualificado: {
          service_type: "Visita Presencial",
          visit_date: bookingDate,
          visit_time: bookingTime,
          lead_city: "Web Visitor"
        },
        current_step: "MENU",
        auto_respond: false,
        tags: ["web_booking"],
        notes: `Agendamento solicitado via site para o dia ${bookingDate} às ${bookingTime}h.`
      });
    } catch (err) {
      console.error("Erro ao registrar lead de agendamento:", err);
    }

    const formattedDate = bookingDate.split("-").reverse().join("/");
    const message = `Olá! Gostaria de solicitar um agendamento de visita presencial ao Canil Vale da Kubera.\n\n👤 *Nome:* ${bookingName}\n📞 *WhatsApp:* ${bookingPhone}\n📅 *Data:* ${formattedDate}\n⏰ *Horário:* ${bookingTime}h`;
    const whatsappUrl = `https://wa.me/5511974992059?text=${encodeURIComponent(message)}`;
    
    setFormSubmitted(true);
    window.open(whatsappUrl, "_blank");

    setBookingName("");
    setBookingPhone("");
    setBookingDate("");
    setBookingTime("10:00");
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const femaleDogs = [
    {
      id: 1,
      name: "VENÛS",
      gender: "Fêmea",
      origin: "Rússia",
      weight: "70kg",
      age: "3 anos",
      notes: "Fêmea importada da Rússia. Estrutura extremamente robusta e excelente temperamento familiar.",
      avatar_url: "/dogs/venus_1.jpg",
      photos: ["/dogs/venus_1.jpg", "/dogs/venus_2.jpg", "/dogs/venus_3.jpg"]
    },
    {
      id: 2,
      name: "VASILÍSIA",
      gender: "Fêmea",
      origin: "Rússia",
      weight: "68kg",
      age: "2 anos",
      notes: "Fêmea robusta importada da Rússia. Temperamento equilibrado e excelente guardiã.",
      avatar_url: "/dogs/vasilisia_1.jpg",
      photos: ["/dogs/vasilisia_1.jpg", "/dogs/vasilisia_2.jpg", "/dogs/vasilisia_3.jpg"]
    }
  ];

  const maleDogs = [
    {
      id: 3,
      name: "NERO",
      gender: "Macho",
      origin: "Ucrânia",
      weight: "40kg (com 4 meses)",
      age: "Jovem",
      notes: "Macho importado da Ucrânia. Cão de guarda de altíssimo nível, temperamento explosivo, focado e ossatura extremamente robusta.",
      avatar_url: "/dogs/nero_4.jpg",
      photos: ["/dogs/nero_4.jpg", "/dogs/nero_5.jpg", "/dogs/nero_6.jpg", "/dogs/nero_7.jpg", "/dogs/nero_1.jpg", "/dogs/nero_2.jpg"]
    },
    {
      id: 4,
      name: "SYMION da Kubera",
      gender: "Macho",
      origin: "Rússia",
      weight: "100kg",
      age: "Adulto",
      notes: "Importado da Rússia (Canil Baraik Azskaz). Gigante de estrutura impressionante e guarda territorial implacável.",
      avatar_url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800",
      photos: ["https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800"]
    }
  ];

  const activeDogs = activeDogType === "femeas" ? femaleDogs : maleDogs;

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
    <div className="bg-[#F4F5F2] text-[#222521] min-h-screen pt-20 font-sans transition-colors duration-500">
      <PublicNavbar />

      {/* Hero Section (Vercel Style) */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center bg-black overflow-hidden border-b border-gray-900">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-black">
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            autoPlay
            preload="auto"
            className="w-full h-full object-cover object-center opacity-85"
            style={{ filter: "brightness(1.05) contrast(0.95)" }}
            poster="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800"
          >
            <source src="/banner-hero.mp4" type="video/mp4" />
          </video>
          {/* Ambient Lighting Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/45 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-radial-vignette opacity-20 pointer-events-none z-10" style={{ background: "radial-gradient(circle, #0F6B2E 0%, transparent 80%)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/60 border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-white" />
              <span>Criação Selecionada CBKC/FCI</span>
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none text-white font-comfortaa">
              Canil <br />
              <span className="text-[#0F6B2E]">Vale da Kubera</span>
            </h1>

            <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-sans">
              Criação especializada em Pastor do Cáucaso (Kavkazskaya Ovcharka) com padrão de exposição internacional, unindo estrutura premiada e instinto de guarda em um único cão.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#caes"
                className="bg-[#B24F18] hover:bg-[#964213] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <span>Ver Nossos Cães</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#agendar"
                className="bg-[#0F6B2E] hover:bg-[#0D5B27] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar sua Visita</span>
              </a>
              <Link
                href="/sobre"
                className="border border-white/20 bg-white/10 text-white hover:bg-white/20 font-bold px-6 py-3.5 rounded-xl transition-all text-xs flex items-center justify-center"
              >
                Conheça Nosso Trabalho
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nós Section (Vercel Style) */}
      <section className="py-20 border-b border-[#E2E8F0] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E]">
              <Users className="w-3.5 h-3.5" />
              <span>Sobre Nós</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-comfortaa">
              O Canil <span className="text-[#0F6B2E]">Vale da Kubera</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#555E54] font-sans">
              O Canil Vale da Kubera é fruto de uma dedicação absoluta à preservação, criação e aprimoramento da raça Pastor do Cáucaso no Brasil. Nosso trabalho é estruturado a partir de três pilares inegociáveis: saúde de ferro, conformação morfológica perfeita e o autêntico temperamento de guarda territorial.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[#555E54] font-sans">
              Buscamos sempre unir a nobreza e rusticidade do padrão clássico europeu às necessidades de proteção e companheirismo das famílias brasileiras. Nossos cães são membros da nossa família e guardiões de nossa propriedade.
            </p>
          </div>

          {/* Image Content */}
          <div className="lg:col-span-5 relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-xl border border-[#E2E8F0]">
            <img
              src="/dogs/canil_1.jpg"
              alt="Estrutura Canil Vale da Kubera"
              className="w-full h-full object-cover"
            />
            {/* Ambient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 text-white">
              <p className="text-xs font-bold text-[#E5A880]">10.000m² de Área Verde</p>
              <p className="text-[10px] text-gray-300">Estrutura projetada para o bem-estar animal</p>
            </div>
          </div>
        </div>

        {/* Horizontal information bar */}
        <div className="space-y-6">
          <div className="flex border-b border-[#E2E8F0] gap-4 text-xs sm:text-sm font-bold font-comfortaa overflow-x-auto pb-1.5 scrollbar-thin">
            <button
              onClick={() => setActiveInfoTab("lugar")}
              className={`pb-2 transition-all shrink-0 border-b-2 px-1 ${
                activeInfoTab === "lugar"
                  ? "border-[#0F6B2E] text-[#0F6B2E]"
                  : "border-transparent text-[#555E54] hover:text-[#222521]"
              }`}
            >
              O Lugar
            </button>
            <button
              onClick={() => setActiveInfoTab("criacao")}
              className={`pb-2 transition-all shrink-0 border-b-2 px-1 ${
                activeInfoTab === "criacao"
                  ? "border-[#0F6B2E] text-[#0F6B2E]"
                  : "border-transparent text-[#555E54] hover:text-[#222521]"
              }`}
            >
              Criação &amp; Cães
            </button>
            <button
              onClick={() => setActiveInfoTab("historia")}
              className={`pb-2 transition-all shrink-0 border-b-2 px-1 ${
                activeInfoTab === "historia"
                  ? "border-[#0F6B2E] text-[#0F6B2E]"
                  : "border-transparent text-[#555E54] hover:text-[#222521]"
              }`}
            >
              A História
            </button>
            <button
              onClick={() => setActiveInfoTab("disponibilidade")}
              className={`pb-2 transition-all shrink-0 border-b-2 px-1 ${
                activeInfoTab === "disponibilidade"
                  ? "border-[#0F6B2E] text-[#0F6B2E]"
                  : "border-transparent text-[#555E54] hover:text-[#222521]"
              }`}
            >
              Disponibilidade
            </button>
          </div>

          <div className="bg-white border border-[#E2E8F0] p-6 sm:p-8 rounded-2xl shadow-sm transition-all duration-300 animate-fadeIn min-h-[140px] flex flex-col justify-center">
            {activeInfoTab === "lugar" && (
              <div className="space-y-4 flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold font-comfortaa text-[#222521]">O Lugar</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#555E54] font-sans">
                    Localizado em Itatiba - SP, o canil conta com uma chácara verde de mais de 10.000m² totalmente estruturada, com piquetes espaçosos, área de solário e maternidade climatizada, proporcionando espaço de sobra para exercícios e sociabilidade.
                  </p>
                </div>
              </div>
            )}
            {activeInfoTab === "criacao" && (
              <div className="space-y-4 flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E] shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold font-comfortaa text-[#222521]">Criação &amp; Cães</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#555E54] font-sans">
                    Trabalhamos com matrizes e padreadores importados das linhagens europeias mais renomadas (Rússia, Ucrânia, Romênia e Espanha). Todos os nossos cães possuem controle radiográfico rígido de quadril (HD) e cotovelos livre de displasia.
                  </p>
                </div>
              </div>
            )}
            {activeInfoTab === "historia" && (
              <div className="space-y-4 flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E] shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold font-comfortaa text-[#222521]">A História</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#555E54] font-sans">
                    Acumulamos mais de 8 anos de estudos cinófilos e prática com a raça. Fomos pioneiros na busca pelo equilíbrio perfeito: produzir cães aptos para as exigentes pistas de exposição sem perder a coragem territorial inerente ao Pastor do Cáucaso.
                  </p>
                </div>
              </div>
            )}
            {activeInfoTab === "disponibilidade" && (
              <div className="space-y-4 flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E] shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1 text-left">
                  <h3 className="text-base sm:text-lg font-bold font-comfortaa text-[#222521]">Disponibilidade de Visitas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#555E54] font-sans mt-2">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#0F6B2E] shrink-0" />
                      <div>
                        <span className="font-bold text-[#222521] block leading-tight">Segunda a Sexta-feira</span>
                        <span className="text-[10px] text-gray-400 block">Dias de visitação</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#0F6B2E] shrink-0" />
                      <div>
                        <span className="font-bold text-[#222521] block leading-tight">10:00 às 18:00</span>
                        <span className="text-[10px] text-gray-400 block">Horários disponíveis</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-red-600 bg-red-50 border border-red-200/50 p-2.5 rounded-xl font-sans mt-3">
                    <strong>Aviso Importante:</strong> Para segurança do canil e bem-estar dos cães, não realizamos visitas sem agendamento prévio.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Plantel Section (Vercel Style) */}
      <section id="caes" className="py-20 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F6B2E]">Plantel Canino</span>
              <h2 className="text-3xl font-extrabold font-comfortaa text-[#222521]">Nossos Cães</h2>
              <p className="text-xs max-w-lg leading-relaxed text-[#555E54] font-sans">
                Conheça os exemplares importados e matrizes selecionadas de Pastor do Cáucaso do nosso canil.
              </p>
            </div>

            {/* Switcher Buttons */}
            <div className="flex items-center gap-3 p-1.5 rounded-xl border border-[#E2E8F0] self-start md:self-end bg-white">
              <button
                onClick={() => setActiveDogType("femeas")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeDogType === "femeas" ? "bg-[#0F6B2E] text-white shadow-sm" : "text-[#555E54] hover:text-[#222521]"
                }`}
              >
                Fêmeas (Matrizes)
              </button>
              <button
                onClick={() => setActiveDogType("machos")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeDogType === "machos" ? "bg-[#0F6B2E] text-white shadow-sm" : "text-[#555E54] hover:text-[#222521]"
                }`}
              >
                Machos (Padreadores)
              </button>
            </div>
          </div>

          {/* Dogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {activeDogs.map((dog) => (
              <div key={dog.id} className="border border-[#E5E7EB] bg-white rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group hover:border-[#0F6B2E]/30">
                {/* Photo container */}
                <div className="relative h-72 bg-gray-100 overflow-hidden select-none border-b border-[#E2E8F0]">
                  <img
                    src={activePhotos[dog.id] || dog.avatar_url}
                    alt={dog.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <span className="absolute top-4 right-4 bg-black/75 text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider z-20">
                    {dog.gender}
                  </span>

                  {/* Thumbnail gallery switchers at bottom */}
                  {dog.photos && dog.photos.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                      <div className="flex gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {dog.photos.map((photo, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.preventDefault();
                              changePhoto(dog.id, photo);
                            }}
                            className={`w-5 h-5 rounded border transition-all flex items-center justify-center text-[9px] font-bold ${
                              (activePhotos[dog.id] || dog.avatar_url) === photo
                                ? "bg-white text-black border-white scale-110"
                                : "bg-black/60 text-gray-300 border-gray-600 hover:bg-black hover:text-white"
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
                    <h3 className="text-lg font-bold font-comfortaa text-[#222521] group-hover:text-[#0F6B2E] transition-colors">{dog.name}</h3>

                    {/* Dog Details Table Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] sm:text-xs text-[#555E54] border border-[#E2E8F0] p-4 rounded-xl bg-[#F9FAFB] font-sans">
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Raça</span>
                        <span className="font-semibold text-[#222521]">Pastor do Cáucaso</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Origem</span>
                        <span className="font-semibold text-[#222521]">{dog.origin || "—"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Peso</span>
                        <span className="font-semibold text-[#222521]">{dog.weight || "—"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Idade</span>
                        <span className="font-semibold text-[#222521]">{dog.age || "—"}</span>
                      </div>
                    </div>

                    <p className="text-[#555E54] text-xs leading-relaxed min-h-[48px] font-sans">
                      {dog.notes}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] text-[#222521]">
                        <Check className="w-3.5 h-3.5 text-[#0F6B2E]" />
                        <span>Pedigree CBKC Incluso</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#222521]">
                        <Check className="w-3.5 h-3.5 text-[#0F6B2E]" />
                        <span>Linhagem Importada Selecionada</span>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/5511974992059?text=Olá! Gostaria de saber mais detalhes sobre o cão ${dog.name}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border border-[#E2E8F0] py-2.5 rounded-lg text-xs font-bold transition-all text-center block text-[#0F6B2E] bg-white hover:bg-gray-50"
                    >
                      Consultar Detalhes
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competições & Aptidão Section (Vercel Style) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F6B2E]">A Raça &amp; Criação</span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight font-comfortaa">
              Padrão de Exposição <br />
              <span className="text-[#0F6B2E]">com Funcionalidade</span>
            </h2>
            <p className="text-xs max-w-2xl leading-relaxed text-[#555E54] font-sans">
              No Canil Vale da Kubera, unimos a beleza e o rigor morfológico exigidos pelas exposições internacionais ao instinto de proteção nato do Pastor do Cáucaso. Deslize para o lado ou selecione abaixo para ver os pilares de cada perfil.
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-3 self-start md:self-end bg-white p-1 rounded-xl border border-[#E2E8F0]">
            <button
              onClick={() => setActiveExpoGuarda("exposicao")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeExpoGuarda === "exposicao" ? "bg-[#0F6B2E] text-white" : "text-gray-500 hover:text-black"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Exposição</span>
            </button>
            <button
              onClick={() => setActiveExpoGuarda("guarda")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeExpoGuarda === "guarda" ? "bg-[#0F6B2E] text-white" : "text-gray-500 hover:text-black"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Guarda</span>
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="font-sans">
          {activeExpoGuarda === "exposicao" ? (
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#E2E8F0] p-6 sm:p-10 rounded-3xl shadow-lg bg-white animate-fadeIn">
              <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E]">
                  <Award className="w-3 h-3" />
                  <span>Padrão Oficial Morfológico</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold font-comfortaa text-[#222521]">Cão de Exposição: Genética &amp; Beleza de Padrão Internacional</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#555E54]">
                  Nossos exemplares de exposição são criados com base nas diretrizes oficiais da FCI/CBKC. Focamos no aprimoramento morfológico para produzir cães saudáveis, robustos e com conformação perfeita.
                </p>
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-2.5 text-xs text-[#555E54]">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E]">
                      <Check className="w-3 h-3" />
                    </div>
                    <div><strong>Genética Importada Selecta:</strong> Linhagens exclusivas da Rússia, Romênia, Ucrânia e Espanha de alto rendimento morfológico.</div>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-[#555E54]">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E]">
                      <Check className="w-3 h-3" />
                    </div>
                    <div><strong>Estrutura &amp; Tipicidade:</strong> Cabeça massiva, mordedura correta em tesoura, pelagem dupla extremamente densa e movimentação harmônica.</div>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-[#555E54]">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E]">
                      <Check className="w-3 h-3" />
                    </div>
                    <div><strong>Laudos de Saúde Oficiais:</strong> Controle genético rígido com radiografias de quadril (HD-A/B) e cotovelos para eliminação de displasia.</div>
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-5 relative h-64 sm:h-80 md:h-[350px] w-full rounded-2xl overflow-hidden shadow-md order-1 lg:order-2 border border-[#E2E8F0]">
                <img
                  src="/dogs/venus_1.jpg"
                  alt="Pastor do Cáucaso padrão de exposição - Vênus"
                  className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#E2E8F0] p-6 sm:p-10 rounded-3xl shadow-lg bg-white animate-fadeIn">
              <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E]">
                  <Shield className="w-3 h-3" />
                  <span>Instinto Territorial de Guarda</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold font-comfortaa text-[#222521]">Cão de Guarda: Proteção Inata, Equilibrada &amp; Incorruptível</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#555E54]">
                  O Pastor do Cáucaso possui um instinto de defesa nativo da raça. Ele atua de maneira vigilante e altamente territorial, sendo uma proteção real para fazendas, sítios e residências.
                </p>
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-2.5 text-xs text-[#555E54]">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E]">
                      <Check className="w-3 h-3" />
                    </div>
                    <div><strong>Instinto Autônomo de Guarda:</strong> O Cáucaso dispensa treinamentos agressivos ou induções ao ataque; sua vigilância territorial é totalmente nata.</div>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-[#555E54]">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E]">
                      <Check className="w-3 h-3" />
                    </div>
                    <div><strong>Temperamento Equilibrado:</strong> Alta lealdade e afeto com a família, enquanto se mantém como uma barreira inabalável contra ameaças externas.</div>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-[#555E54]">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#0F6B2E]/10 border border-[#0F6B2E]/20 text-[#0F6B2E]">
                      <Check className="w-3 h-3" />
                    </div>
                    <div><strong>Desenvolvimento e Maturação:</strong> Amadurecimento mental tardio. O potencial pleno de guarda territorial se consolida após os 2 anos de idade.</div>
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-5 relative h-64 sm:h-80 md:h-[350px] w-full rounded-2xl overflow-hidden shadow-md order-1 lg:order-2 border border-[#E2E8F0]">
                <img
                  src="/dogs/nero_4.jpg"
                  alt="Pastor do Cáucaso cão de guarda - Nero"
                  className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Agendamento Section (Vercel Style) */}
      <section id="agendar" className="relative h-[95vh] min-h-[550px] bg-black overflow-hidden flex flex-col justify-center items-center border-b border-gray-900">
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-black">
          <video
            ref={bookingVideoRef}
            loop
            muted
            playsInline
            autoPlay
            preload="auto"
            className="w-full h-full object-cover object-center opacity-85"
            style={{ filter: "brightness(1.05) contrast(0.95)" }}
            poster="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800"
          >
            <source src="/banner2.mp4" type="video/mp4" />
          </video>
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full space-y-8 flex flex-col justify-center items-center">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-white">
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span>Visitas Presenciais</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-comfortaa text-white">Agende sua Visita</h2>
            <p className="text-xs sm:text-sm leading-relaxed max-w-xl mx-auto text-gray-300 font-sans">
              Venha conhecer de perto nossa estrutura de 10.000m² e o temperamento dos nossos reprodutores. As visitas devem ser agendadas previamente de acordo com a nossa disponibilidade.
            </p>
          </div>

          <div className="max-w-xl w-full bg-black/35 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
            {formSubmitted ? (
              <div className="p-8 bg-[#0F6B2E]/20 border border-[#0F6B2E]/40 text-[#0F6B2E] rounded-2xl text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-[#0F6B2E] mx-auto" />
                <h4 className="font-bold text-lg text-white font-comfortaa">Solicitação Enviada!</h4>
                <p className="text-xs text-gray-300">Estamos te redirecionando para o WhatsApp do Canil...</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold block text-gray-300">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold block text-gray-300">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="(XX) XXXXX-XXXX"
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block text-gray-300">Data da Visita</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold block text-gray-300">Horário</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white transition-all font-sans"
                    >
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                      <option value="18:00">18:00</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full font-bold py-3.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 mt-4 shadow-lg bg-[#B24F18] text-white hover:bg-[#964213]"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Solicitar Agendamento via WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials (Vercel Style) */}
      <section className="py-20 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <span className="text-xs text-[#0F6B2E] font-bold uppercase tracking-wider">Depoimentos</span>
            <h2 className="text-3xl font-extrabold font-comfortaa text-[#222521]">O que dizem os tutores</h2>
            <p className="text-gray-500 text-xs leading-relaxed font-sans">
              Confiança e transparência que resultam em parcerias duradouras com nossos clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((test, index) => (
              <div
                key={index}
                className="bg-white border border-[#E5E7EB] p-6 rounded-2xl space-y-4 hover:border-[#0F6B2E]/30 transition-all shadow-sm relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-[#B24F18]">
                    {[...Array(test.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#B24F18] fill-[#B24F18]" />
                    ))}
                  </div>
                  <p className="text-[#555E54] text-xs italic leading-relaxed font-sans">&ldquo;{test.text}&rdquo;</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[#222521] text-xs font-bold">{test.name}</span>
                    <span className="text-gray-400 text-[10px]">{test.location}</span>
                  </div>
                  <span className="text-xs text-[#0F6B2E] font-bold font-comfortaa">{test.dog}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / Map Section (Vercel Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs text-[#0F6B2E] font-bold uppercase tracking-wider">Localização</span>
          <h2 className="text-3xl font-extrabold font-comfortaa text-[#222521]">Venha nos visitar em Itatiba - SP</h2>
          <p className="text-gray-500 text-xs leading-relaxed font-sans">
            Nossas instalações ficam em uma chácara verde estruturada especificamente para o bem-estar e criação da raça Pastor do Cáucaso.
          </p>

          <div className="space-y-3.5 text-xs text-[#555E54] font-sans">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-[#0F6B2E] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-[#222521] text-sm">Endereço Oficial</h5>
                <p className="text-[#555E54] text-xs mt-0.5">Itatiba - SP, CEP 13250-000</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Calendar className="w-5 h-5 text-[#0F6B2E] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-[#222521] text-sm">Horários de Visitas</h5>
                <p className="text-[#555E54] text-xs mt-0.5">Terça a Sábado: 09h às 17h (Sob agendamento prévio no WhatsApp)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Embed Google Map */}
        <div className="h-80 w-full rounded-3xl overflow-hidden border border-[#E2E8F0] bg-white shadow-xl">
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

      {/* Floating Action Interaction Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        <a
          href="https://www.youtube.com/@CanilValedaKubera"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Vídeos no YouTube"
          className="bg-[#FF0000] hover:bg-[#CC0000] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          title="Vídeos no YouTube"
        >
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.387.51A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.862.51 9.387.51 9.387.51s7.524 0 9.387-.51a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
          </svg>
        </a>

        <a
          href="https://www.instagram.com/valedakubera/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nosso Instagram"
          className="text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}
          title="Nosso Instagram"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>

        <a
          href="https://wa.me/5511974992059?text=Olá! Gostaria de saber mais sobre os filhotes de Pastor do Cáucaso."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Fale conosco no WhatsApp"
          className="bg-[#25D366] hover:bg-[#20BA56] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          title="Fale no WhatsApp"
        >
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"></path>
          </svg>
        </a>
      </div>

      <PublicFooter />
    </div>
  );
}
