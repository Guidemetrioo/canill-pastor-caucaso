"use client";

import { useRef, useEffect, useState } from "react";
import { useAura } from "@/context/AuraContext";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
import Link from "next/link";
import { Shield, Check, Calendar, ArrowRight, Star, Heart, MapPin, Award, MessageCircle, Clock, Users, Palette } from "lucide-react";

type ThemeName = "eco-rustic" | "terracota-warmth" | "minimalista-organica";

export default function LandingPageClient() {
  const { filhotes, animals, activeTheme, setActiveTheme, activeFont, setActiveFont, themes, addAgendaEvent, trackEvent, agendaEvents } = useAura();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const agendaWrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<"exposicao" | "guarda">("exposicao");
  const [activeDogGender, setActiveDogGender] = useState<"fêmea" | "macho">("fêmea");
  const [aboutTab, setAboutTab] = useState<"lugar" | "criacao" | "historia">("lugar");

  // Dynamic Theme Selector open state
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Booking Form State
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("08:00");
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitIntention, setVisitIntention] = useState("");
  const [visitError, setVisitError] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const bookedDates = agendaEvents
    ? agendaEvents
        .filter((event) => event.type === "visita" && event.status !== "Cancelado")
        .map((event) => {
          const d = new Date(event.datetime);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${y}-${m}-${day}`;
        })
    : [];

  // Dynamic Scroll & Animation State
  const [scrollY, setScrollY] = useState(0);
  const [agendaScrollProgress, setAgendaScrollProgress] = useState(0);

  const t = themes[activeTheme];

  const navbarBg = activeTheme === 'eco-rustic' ? '#F4F5F2' : activeTheme === 'terracota-warmth' ? '#FAF8F5' : '#ECEFEA';
  const footerBg = activeTheme === 'eco-rustic' ? '#E9EAE7' : activeTheme === 'terracota-warmth' ? '#F3EFEA' : '#DFE3DD';
  const textColor = activeTheme === 'terracota-warmth' ? '#26211E' : activeTheme === 'eco-rustic' ? '#222521' : '#1C1C1C';
  const accentHex = t.accentHex;
  const secondaryAccentHex = t.secondaryAccentHex;
  const borderHex = t.borderHex;

  // Scroll Animation Calculations
  const scrollRange = 350;
  const progress = Math.min(Math.max(scrollY / scrollRange, 0), 1);
  const videoBrightness = 1.05 - (progress * 0.35); // 1.05 to 0.70
  const videoContrast = 0.95 + (progress * 0.15);   // 0.95 to 1.10
  const videoOpacity = 0.85 + (progress * 0.15);     // 0.85 to 1.00
  const overlayOpacity = progress * 0.75;            // 0.00 to 0.75
  const textTranslateY = (1 - progress) * 150;       // 150px to 0px
  const textOpacity = progress;                       // 0.00 to 1.00

  // Scroll Agenda Calculations (video starts bright/clean, card rises and background darkens slightly)
  const agendaVideoBrightness = 1.05 - (agendaScrollProgress * 0.35);
  const agendaVideoContrast = 0.95 + (agendaScrollProgress * 0.15);
  const agendaVideoOpacity = 0.85 + (agendaScrollProgress * 0.15);
  const agendaOverlayOpacity = agendaScrollProgress * 0.65;
  const agendaTextTranslateY = (1 - agendaScrollProgress) * 200;
  const agendaTextOpacity = agendaScrollProgress;

  // Scroll Navbar Calculations
  const isHeroScrolled = scrollY > 80;
  const currentNavBg = isHeroScrolled ? `${navbarBg}EE` : 'transparent';
  const currentNavBorder = isHeroScrolled ? borderHex : 'transparent';
  const currentNavText = isHeroScrolled ? textColor : '#ffffff';

  useEffect(() => {
    trackEvent("page_view", "/");
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (agendaWrapperRef.current) {
        const rect = agendaWrapperRef.current.getBoundingClientRect();
        const wrapperHeight = rect.height;
        const scrolledOffset = -rect.top;
        const totalTrack = wrapperHeight - window.innerHeight;
        if (totalTrack > 0) {
          const agendaProgress = Math.min(Math.max(scrolledOffset / totalTrack, 0), 1);
          setAgendaScrollProgress(agendaProgress);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleTabClick = (tab: "exposicao" | "guarda") => {
    setActiveTab(tab);
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = container.clientWidth;
    container.scrollTo({
      left: tab === "exposicao" ? 0 : cardWidth,
      behavior: "smooth",
    });
  };

  const handleContainerScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const clientWidth = container.clientWidth;
    if (scrollLeft + 10 >= clientWidth) {
      setActiveTab("guarda");
    } else if (scrollLeft <= 10) {
      setActiveTab("exposicao");
    } else {
      const center = scrollLeft + clientWidth / 2;
      if (center < clientWidth) {
        setActiveTab("exposicao");
      } else {
        setActiveTab("guarda");
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setVisitDate(val);
    if (!val) return;
    
    if (bookedDates.includes(val)) {
      setVisitError("Este dia já possui uma visita agendada. Por favor, escolha outra data.");
    } else {
      setVisitError("");
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDate) {
      setVisitError("Por favor, selecione uma data.");
      return;
    }
    if (bookedDates.includes(visitDate)) {
      setVisitError("Este dia já possui uma visita agendada. Por favor, escolha outra data.");
      return;
    }
    if (!visitorName.trim()) {
      setVisitError("Por favor, insira o seu nome.");
      return;
    }
    if (!visitorPhone.trim()) {
      setVisitError("Por favor, insira o seu telefone.");
      return;
    }

    setVisitError("");
    const parts = visitDate.split("-");
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

    // 1. Save in the administration schedule (Supabase agenda)
    const eventDateTime = new Date(`${visitDate}T${visitTime}:00`).toISOString();
    try {
      await addAgendaEvent({
        type: "visita",
        title: `Visita de ${visitorName.trim()}`,
        description: `Agendado pelo site. Telefone: ${visitorPhone.trim()}.${visitIntention.trim() ? ` Intenção: ${visitIntention.trim()}` : ""}`,
        datetime: eventDateTime,
        status: "Agendado"
      });
      trackEvent("booking_click", "/");
    } catch (err) {
      console.error("Erro ao registrar agendamento na agenda:", err);
    }

    // 2. Open WhatsApp link as fallback/instant notification
    const text = `Olá! Gostaria de agendar uma visita ao Canil Vale da Kubera no dia ${formattedDate} às ${visitTime}. Meu nome é ${visitorName.trim()} e meu telefone/WhatsApp é ${visitorPhone.trim()}.${visitIntention.trim() ? ` Intenção da visita: ${visitIntention.trim()}` : ""}`;
    const url = `https://wa.me/5511974992059?text=${encodeURIComponent(text)}`;
    trackEvent("whatsapp_click", "/");
    window.open(url, "_blank");

    // 3. Clear fields
    setVisitorName("");
    setVisitorPhone("");
    setVisitDate("");
    setVisitIntention("");
  };

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
      age: "3 anos",
      origin: "Rússia",
      weight: "70kg",
      notes: "Fêmea importada da Rússia. Estrutura extremamente robusta e excelente temperamento familiar.",
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
      avatar_url: "/dogs/nero_new_4.jpg",
      photos: ["/dogs/nero_new_4.jpg", "/dogs/nero_new_1.jpg", "/dogs/nero_new_2.jpg", "/dogs/nero_new_3.jpg"],
      breed: "Pastor do Cáucaso",
      age: "4 anos",
      origin: "Ucrânia",
      weight: "85kg",
      notes: "Macho importado da Ucrânia. Cão de guarda de alto nível com temperamento extremamente explosivo e focado.",
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
      avatar_url: "/dogs/vasilisia_new_1.jpg",
      photos: ["/dogs/vasilisia_new_1.jpg", "/dogs/vasilisia_new_2.jpg", "/dogs/vasilisia_new_3.jpg", "/dogs/vasilisia_new_4.jpg"],
      breed: "Pastor do Cáucaso",
      age: "2 anos",
      origin: "Rússia",
      weight: "68kg",
      notes: "Fêmea robusta importada da Rússia. Temperamento equilibrado e excelente guardiã.",
      history: "Fêmea importada da Rússia. Estrutura robusta e temperamento equilibrado de guarda.",
    },
  ];

  // Use context animals (plantel) if loaded, otherwise use static dogs
  const baseDogs = animals.length > 0
    ? animals
    : staticDogs;

  // Enrich data for known dogs to ensure fields (weight, age) are fully populated
  const allDogs = (baseDogs as any[]).map(dog => {
    const nameUpper = dog.name.toUpperCase();
    if (nameUpper.includes("VENÛS") || nameUpper.includes("VENUS")) {
      return { ...dog, weight: dog.weight || "70kg", age: dog.age || "3 anos" };
    }
    if (nameUpper.includes("NERO")) {
      return { ...dog, weight: dog.weight || "85kg", age: dog.age || "4 anos" };
    }
    if (nameUpper.includes("VASILÍSIA") || nameUpper.includes("VASILISIA")) {
      return { ...dog, weight: dog.weight || "68kg", age: dog.age || "2 anos" };
    }
    return dog;
  });

  // Filter dogs by selected gender tab
  const filteredDogs = allDogs.filter((dog) => dog.gender === activeDogGender);

  return (
    <div className={`min-h-screen pt-20 font-sans transition-colors duration-500 ${t.bg} ${t.textMain}`}>
      <PublicNavbar />

      {/* Scroll-pinned Hero Wrapper */}
      <div className="relative h-[145vh] bg-black">
        <section 
          id="hero-banner"
          className="sticky top-0 w-full h-screen overflow-hidden border-b flex items-center" 
          style={{ borderColor: isHeroScrolled ? borderHex : 'transparent' }}
        >
          {/* Background Video */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-black">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center transition-all duration-75"
              style={{ 
                filter: `brightness(${videoBrightness}) contrast(${videoContrast})`,
                opacity: videoOpacity 
              }}
            >
              <source src="/banner-hero.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay: starts transparent (clean video) and gets darker as we scroll */}
            <div 
              className="absolute inset-0 z-10 transition-all duration-75" 
              style={{ background: `linear-gradient(to right, rgba(0, 0, 0, ${overlayOpacity * 1.13}), rgba(0, 0, 0, ${overlayOpacity * 0.5}), transparent)` }} 
            />
            <div 
              className="absolute inset-0 z-10 transition-all duration-75" 
              style={{ background: `linear-gradient(to top, rgba(0, 0, 0, ${overlayOpacity * 0.9}), transparent)` }} 
            />
          </div>
          
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none z-10" style={{ backgroundColor: `${accentHex}20` }} />

          {/* Text Content: Animated Translate and Opacity */}
          <div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex items-center transition-all duration-75"
            style={{ 
              transform: `translateY(${textTranslateY}px)`,
              opacity: textOpacity
            }}
          >
            <div className="max-w-5xl space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 border border-white/20 text-white">
                <Shield className="w-3.5 h-3.5 text-white" />
                <span>Criação Selecionada CBKC/FCI</span>
              </span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight font-comfortaa text-white">
                Canil <span style={{ color: t.accentHex }}>Vale da Kubera</span>
              </h1>

              <p className="text-sm sm:text-base leading-relaxed max-w-xl font-sans text-gray-200">
                Criação especializada em Pastor do Cáucaso (Kavkazskaya Ovcharka) com padrão de exposição internacional, unindo estrutura premiada e instinto de guarda em um único cão.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#caes"
                  className={`font-bold px-6 py-3.5 rounded-xl transition-all text-center text-xs flex items-center justify-center gap-2 shadow-lg ${t.secondaryAccent}`}
                >
                  <span>Ver Nossos Cães</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#agendar"
                  className={`font-bold px-6 py-3.5 rounded-xl transition-all text-center text-xs flex items-center justify-center gap-2 shadow-lg ${t.primaryAccent}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar sua Visita</span>
                </a>
                <Link
                  href="/sobre"
                  className="border border-white/20 bg-white/10 text-white hover:bg-white/20 font-bold px-6 py-3.5 rounded-xl transition-all text-center text-xs flex items-center justify-center"
                >
                  Conheça Nosso Trabalho
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="py-20 border-b" style={{ borderColor: borderHex }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${t.tagBg} ${t.tagText}`}>
                <Users className="w-3.5 h-3.5" />
                <span>Sobre Nós</span>
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-comfortaa">
                O Canil <span style={{ color: accentHex }}>Vale da Kubera</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed max-w-2xl font-sans ${t.textMuted}`}>
                O Canil Vale da Kubera é fruto de uma dedicação absoluta à preservação, criação e aprimoramento da raça Pastor do Cáucaso no Brasil. Nosso trabalho é estruturado a partir de três pilares inegociáveis: genética de qualidade, morfologia robusta própria da raça e o autêntico temperamento de guarda territorial.
              </p>
              <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl font-sans ${t.textMuted}`}>
                Buscamos sempre unir a nobreza e rusticidade do padrão clássico europeu às necessidades de proteção e companheirismo das famílias brasileiras. Nossos cães são membros da nossa família e guardiões de nossa propriedade.
              </p>
            </div>
            <div className="lg:col-span-5 relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl border" style={{ borderColor: borderHex }}>
              <img
                src="/dogs/canil_1.jpg"
                alt="Estrutura Canil Vale da Kubera"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 text-white">
                <p className="text-xs font-bold" style={{ color: "#E5A880" }}>20.000m² de Área Verde</p>
                <p className="text-[10px] text-gray-300">Estrutura projetada para o bem-estar animal</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4 max-w-[280px] md:max-w-xl mx-auto border-b pb-6" style={{ borderColor: borderHex }}>
            <button
              onClick={() => setAboutTab("lugar")}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                aboutTab === "lugar"
                  ? (isMobile ? "shadow-lg scale-102 text-white active-tab-btn" : `${t.primaryAccent} shadow-lg scale-102 active-tab-btn`)
                  : `border-gray-200 text-gray-500 hover:border-gray-400 ${t.cardBg}`
              }`}
              style={{ 
                background: (aboutTab === "lugar" && isMobile)
                  ? `linear-gradient(135deg, ${t.accentHex}, ${t.secondaryAccentHex})`
                  : undefined,
                borderColor: aboutTab === "lugar" ? "transparent" : borderHex 
              }}
            >
              <MapPin className="w-4 h-4" />
              <span>O Lugar</span>
            </button>
            <button
              onClick={() => setAboutTab("criacao")}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                aboutTab === "criacao"
                  ? (isMobile ? "shadow-lg scale-102 text-white active-tab-btn" : `${t.primaryAccent} shadow-lg scale-102 active-tab-btn`)
                  : `border-gray-200 text-gray-500 hover:border-gray-400 ${t.cardBg}`
              }`}
              style={{ 
                background: (aboutTab === "criacao" && isMobile)
                  ? `linear-gradient(135deg, ${t.accentHex}, ${t.secondaryAccentHex})`
                  : undefined,
                borderColor: aboutTab === "criacao" ? "transparent" : borderHex 
              }}
            >
              <Shield className="w-4 h-4" />
              <span>Criação &amp; Cães</span>
            </button>
            <button
              onClick={() => setAboutTab("historia")}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                aboutTab === "historia"
                  ? (isMobile ? "shadow-lg scale-102 text-white active-tab-btn" : `${t.primaryAccent} shadow-lg scale-102 active-tab-btn`)
                  : `border-gray-200 text-gray-500 hover:border-gray-400 ${t.cardBg}`
              }`}
              style={{ 
                background: (aboutTab === "historia" && isMobile)
                  ? `linear-gradient(135deg, ${t.accentHex}, ${t.secondaryAccentHex})`
                  : undefined,
                borderColor: aboutTab === "historia" ? "transparent" : borderHex 
              }}
            >
              <Award className="w-4 h-4" />
              <span>A História</span>
            </button>
          </div>

          {/* Active Tab Content Card */}
          <div className="max-w-3xl mx-auto">
            {aboutTab === "lugar" && (
              <div className={`border p-8 sm:p-10 rounded-3xl space-y-4 transition-all duration-300 shadow-xl border-dashed ${t.cardBg}`} style={{ borderColor: borderHex }}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${t.tagBg} ${t.tagText}`}>
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold font-comfortaa">O Lugar</h3>
                <p className={`text-sm sm:text-base leading-relaxed font-sans ${t.textMuted}`}>
                  Localizado em Itatiba - SP, o canil conta com uma chácara verde de mais de 20.000m² totalmente estruturada, com piquetes espaçosos, área de solário e maternidade climatizada, proporcionando espaço de sobra para exercises e sociabilidade.
                </p>
              </div>
            )}

            {aboutTab === "criacao" && (
              <div className={`border p-8 sm:p-10 rounded-3xl space-y-4 transition-all duration-300 shadow-xl border-dashed ${t.cardBg}`} style={{ borderColor: borderHex }}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${t.tagBg} ${t.tagText}`}>
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold font-comfortaa">Criação &amp; Cães</h3>
                <p className={`text-sm sm:text-base leading-relaxed font-sans ${t.textMuted}`}>
                  Trabalhamos com matrizes e padreadores importados das linhagens europeias mais renomadas (Rússia, Ucrânia, Romênia e Espanha). Todos os nossos cães possuem controle radiográfico rígido de quadril (HD) e cotovelos livre de displasia.
                </p>
              </div>
            )}

            {aboutTab === "historia" && (
              <div className={`border p-8 sm:p-10 rounded-3xl space-y-4 transition-all duration-300 shadow-xl border-dashed ${t.cardBg}`} style={{ borderColor: borderHex }}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${t.tagBg} ${t.tagText}`}>
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold font-comfortaa">A História</h3>
                <p className={`text-sm sm:text-base leading-relaxed font-sans ${t.textMuted}`}>
                  Acumulamos mais de 8 anos de estudos cinófilos e prática com a raça. Fomos pioneiros na busca pelo equilíbrio perfeito: produzir cães aptos para as exigentes pistas de exposição sem perder a coragem territorial inerente ao Pastor do Cáucaso.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Scroll-pinned Agenda Wrapper */}
      <div ref={agendaWrapperRef} className="relative h-auto md:h-[145vh] bg-black">
        <section 
          id="agendar" 
          className="relative md:sticky top-0 w-full h-auto min-h-screen md:h-screen overflow-visible md:overflow-hidden border-b flex flex-col justify-center items-center py-16 md:py-0" 
          style={{ borderColor: borderHex }}
        >
          {/* Background Video */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-black">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center transition-all duration-75"
              style={{ 
                filter: `brightness(${agendaVideoBrightness}) contrast(${agendaVideoContrast})`,
                opacity: agendaVideoOpacity 
              }}
            >
              <source src="/banner2.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay: starts transparent (clean video) and gets darker as we scroll */}
            <div 
              className="absolute inset-0 z-10 transition-all duration-75" 
              style={{ background: `linear-gradient(to right, rgba(0, 0, 0, ${agendaOverlayOpacity * 1.13}), rgba(0, 0, 0, ${agendaOverlayOpacity * 0.5}), transparent)` }} 
            />
            <div 
              className="absolute inset-0 z-10 transition-all duration-75" 
              style={{ background: `linear-gradient(to top, rgba(0, 0, 0, ${agendaOverlayOpacity * 0.9}), transparent)` }} 
            />
          </div>
          
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none z-10" style={{ backgroundColor: `${accentHex}20` }} />

          {/* Animated Header & Form Card */}
          <div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full space-y-8 flex flex-col justify-center items-center transition-all duration-75"
            style={{ 
              transform: isMobile ? undefined : `translateY(${agendaTextTranslateY}px)`,
              opacity: isMobile ? 1 : agendaTextOpacity
            }}
          >
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-white">
                <Calendar className="w-3.5 h-3.5 text-white" />
                <span>Venha os Visitar</span>
              </span>
              <h2 className="text-3xl font-extrabold font-comfortaa text-white">Agende sua Visita</h2>
              <p className="text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-sans text-gray-300">
                Venha conhecer de perto nossa estrutura de 20.000m² e o temperamento dos nossos reprodutores. As visitas devem ser agendadas previamente de acordo com a nossa disponibilidade.
              </p>
            </div>

            <div className="max-w-2xl w-full bg-black/35 border border-white/10 rounded-3xl p-5 sm:p-6 pb-6 sm:pb-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: `${accentHex}20` }} />

              <div className="space-y-4">
                {/* Header availability row */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 border-b border-white/10 pb-4 text-xs text-gray-200">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span><strong>Todos os dias</strong> (Visitação)</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span><strong>08:00 às 10:30</strong> (Horários)</span>
                  </div>
                </div>

                <form onSubmit={handleScheduleSubmit} className="mx-auto w-full space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1 text-left">
                      <label htmlFor="visitor-name" className="text-[10px] font-bold uppercase tracking-wider block text-gray-300">Nome Completo</label>
                      <input
                        id="visitor-name"
                        type="text"
                        required
                        placeholder="Seu nome"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        className="w-full min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all font-sans"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label htmlFor="visitor-phone" className="text-[10px] font-bold uppercase tracking-wider block text-gray-300">Telefone / WhatsApp</label>
                      <input
                        id="visitor-phone"
                        type="tel"
                        required
                        placeholder="(XX) XXXXX-XXXX"
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        className="w-full min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1 text-left">
                      <label htmlFor="visit-date" className="text-[10px] font-bold uppercase tracking-wider block text-gray-300">Data da Visita</label>
                      <input
                        id="visit-date"
                        type="text"
                        placeholder="Escolha a data da visita"
                        onFocus={(e) => {
                          e.currentTarget.type = "date";
                          if ('showPicker' in e.currentTarget) {
                            try {
                              e.currentTarget.showPicker();
                            } catch (err) {}
                          }
                        }}
                        onBlur={(e) => {
                          if (!e.currentTarget.value) e.currentTarget.type = "text";
                        }}
                        required
                        min={todayStr}
                        value={visitDate}
                        onChange={handleDateChange}
                        className="w-full min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all font-sans"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label htmlFor="visit-time" className="text-[10px] font-bold uppercase tracking-wider block text-gray-300">Horário</label>
                      <select
                        id="visit-time"
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        className="w-full min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-all font-sans"
                        style={{ minWidth: 0, width: '100%', boxSizing: 'border-box' }}
                      >
                        <option value="08:00">08:00</option>
                        <option value="08:30">08:30</option>
                        <option value="09:00">09:00</option>
                        <option value="09:30">09:30</option>
                        <option value="10:00">10:00</option>
                        <option value="10:30">10:30</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label htmlFor="visit-intention" className="text-[10px] font-bold uppercase tracking-wider block text-gray-300">Intenção da Visita</label>
                    <textarea
                      id="visit-intention"
                      placeholder="Qual o motivo ou intenção da visita? (Ex: conhecer filhotes, ver matrizes, etc.)"
                      value={visitIntention}
                      onChange={(e) => setVisitIntention(e.target.value)}
                      rows={2}
                      className="w-full min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all font-sans resize-none"
                    />
                  </div>

                  {visitError && (
                    <p className="text-xs text-red-500 font-semibold mt-1 text-left font-sans">{visitError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full font-bold py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-2 mt-2 shadow-lg text-white font-sans hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: t.accentHex }}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar Visita</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="caes" className="py-20 border-b" style={{ borderColor: borderHex }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${t.tagText}`}>Plantel Canino</span>
              <h2 className="text-3xl font-extrabold font-comfortaa">Nossos Cães</h2>
              <p className={`text-xs max-w-lg leading-relaxed font-sans ${t.textMuted}`}>
                Conheça os exemplares importados e matrizes selecionadas de Pastor do Cáucaso do nosso canil.
              </p>
            </div>
            <div className="flex items-center gap-3 p-1.5 rounded-xl border self-start md:self-end" style={{ backgroundColor: t.cardBgHex, borderColor: borderHex }}>
              <button
                onClick={() => setActiveDogGender("fêmea")}
                className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                style={{
                  backgroundColor: activeDogGender === "fêmea" ? t.accentHex : "transparent",
                  color: activeDogGender === "fêmea" ? "#FFFFFF" : t.accentHex,
                }}
              >
                Fêmeas (Matrizes)
              </button>
              <button
                onClick={() => setActiveDogGender("macho")}
                className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                style={{
                  backgroundColor: activeDogGender === "macho" ? t.accentHex : "transparent",
                  color: activeDogGender === "macho" ? "#FFFFFF" : t.accentHex,
                }}
              >
                Machos (Padreadores)
              </button>
            </div>
          </div>

          {filteredDogs.length === 0 ? (
            <div className={`border rounded-2xl p-10 text-center text-xs font-sans ${t.cardBg} ${t.textMuted}`} style={{ borderColor: borderHex }}>
              Nenhum cão ou filhote disponível nesta categoria no momento.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {filteredDogs.slice(0, 2).map((dog) => (
                  <DogCard key={dog.id} dog={dog} theme={t} />
                ))}
              </div>
              <div className="flex justify-center mt-10">
                <Link
                  href="/plantel"
                  className="font-bold px-8 py-3.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: t.accentHex, color: "#FFFFFF" }}
                >
                  Ver Plantel Completo
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${t.tagText}`}>A Raça &amp; Criação</span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight font-comfortaa">
              Padrão de Exposição <br />
              <span style={{ color: accentHex }}>com Funcionalidade</span>
            </h2>
            <p className={`text-xs max-w-2xl leading-relaxed font-sans ${t.textMuted}`}>
              No Canil Vale da Kubera, unimos a beleza e o rigor morfológico exigidos pelas exposições internacionais ao instinto de proteção nato do Pastor do Cáucaso. Deslize para o lado ou selecione abaixo para ver os pilares de cada perfil.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => handleTabClick("exposicao")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                activeTab === "exposicao"
                  ? `${t.primaryAccent} active-tab-btn`
                  : `bg-white text-gray-500 hover:text-black`
              }`}
              style={{ borderColor: borderHex }}
            >
              <Award className="w-4 h-4" />
              <span>Exposição</span>
            </button>
            <button
              onClick={() => handleTabClick("guarda")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                activeTab === "guarda"
                  ? `${t.primaryAccent} active-tab-btn`
                  : `bg-white text-gray-500 hover:text-black`
              }`}
              style={{ borderColor: borderHex }}
            >
              <Shield className="w-4 h-4" />
              <span>Guarda</span>
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          onScroll={handleContainerScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 no-scrollbar scroll-smooth pb-4"
        >
          <div className={`w-full flex-shrink-0 snap-start grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border p-6 sm:p-10 rounded-3xl shadow-lg font-sans ${t.cardBg}`} style={{ borderColor: borderHex }}>
            <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${t.tagBg} ${t.tagText}`}>
                <Award className="w-3 h-3" />
                <span>Padrão Oficial Morfológico</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold font-comfortaa">
                Cão de Exposição: Genética &amp; Beleza de Padrão Internacional
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${t.textMuted}`}>
                Nossos exemplares de exposição são criados com base nas diretrizes oficiais da FCI/CBKC. Focamos no aprimoramento morfológico para produzir cães saudáveis, robustos e com conformação perfeita.
              </p>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${t.tagBg} ${t.tagText}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong>Genética Importada Selecta:</strong> Linhagens exclusivas da Rússia, Romênia, Ucrânia e Espanha de alto rendimento morfológico.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${t.tagBg} ${t.tagText}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong>Estrutura &amp; Tipicidade:</strong> Cabeça massiva, mordedura correta em tesoura, pelagem dupla extremamente densa e movimentação harmônica.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${t.tagBg} ${t.tagText}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong>Laudos de Saúde Oficiais:</strong> Controle genético rígido com radiografias de quadril (HD-A/B) e cotovelos para eliminação de displasia.
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="lg:col-span-5 relative h-64 sm:h-80 md:h-[350px] w-full rounded-2xl overflow-hidden shadow-md order-1 lg:order-2 border" style={{ borderColor: borderHex }}>
              <img
                src="/dogs/venus_1.jpg"
                alt="Pastor do Cáucaso padrão de exposição - Vênus"
                className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          <div className={`w-full flex-shrink-0 snap-start grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border p-6 sm:p-10 rounded-3xl shadow-lg font-sans ${t.cardBg}`} style={{ borderColor: borderHex }}>
            <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${t.tagBg} ${t.tagText}`}>
                <Shield className="w-3 h-3" />
                <span>Instinto Territorial de Guarda</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold font-comfortaa">
                Cão de Guarda: Proteção Inata, Equilibrada &amp; Incorruptível
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${t.textMuted}`}>
                O Pastor do Cáucaso possui um instinto de defesa nativo da raça. Ele atua de maneira vigilante e altamente territorial, sendo uma proteção real para fazendas, sítios e residências.
              </p>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${t.tagBg} ${t.tagText}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong>Instinto Autônomo de Guarda:</strong> O Cáucaso dispensa treinamentos agressivos ou induções ao ataque; sua vigilância territorial é totalmente nata.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${t.tagBg} ${t.tagText}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong>Temperamento Equilibrado:</strong> Alta lealdade e afeto com a família, enquanto se mantém como uma barreira inabalável contra ameaças externas.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${t.tagBg} ${t.tagText}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong>Desenvolvimento e Maturação:</strong> Amadurecimento mental tardio. O potencial pleno de guarda territorial se consolida após os 2 anos de idade.
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="lg:col-span-5 relative h-64 sm:h-80 md:h-[350px] w-full rounded-2xl overflow-hidden shadow-md order-1 lg:order-2 border" style={{ borderColor: borderHex }}>
              <img
                src="/dogs/nero_4.jpg"
                alt="Pastor do Cáucaso cão de guarda - Nero"
                className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 pt-2">
          <span
            onClick={() => handleTabClick("exposicao")}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              activeTab === "exposicao" ? "w-6" : "bg-gray-300"
            }`}
            style={{ backgroundColor: activeTab === "exposicao" ? accentHex : undefined }}
          />
          <span
            onClick={() => handleTabClick("guarda")}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              activeTab === "guarda" ? "w-6" : "bg-gray-300"
            }`}
            style={{ backgroundColor: activeTab === "guarda" ? accentHex : undefined }}
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t" style={{ borderColor: borderHex }}>
        <div className="space-y-6">
          <span className={`text-xs font-bold uppercase tracking-wider ${t.tagText}`}>Localização</span>
          <h2 className="text-3xl font-extrabold font-comfortaa">Venha nos visitar em Itatiba - SP</h2>
          <p className={`text-xs leading-relaxed font-sans ${t.textMuted}`}>
            Nossas instalações ficam em uma chácara verde estruturada especificamente para o bem-estar e criação da raça Pastor do Cáucaso.
          </p>

          <div className="space-y-3.5 text-xs font-sans">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accentHex }} />
              <div>
                <h5 className="font-bold text-sm">Endereço Oficial</h5>
                <p className={`text-xs mt-0.5 ${t.textMuted}`}>Itatiba - SP, CEP 13250-000</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Calendar className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accentHex }} />
              <div>
                <h5 className="font-bold text-sm">Horários de Visitas</h5>
                <p className={`text-xs mt-0.5 ${t.textMuted}`}>Terça a Sábado: 09h às 17h (Sob agendamento prévio no WhatsApp)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-60 sm:h-80 w-full rounded-2xl overflow-hidden shadow-xl border bg-white" style={{ borderColor: borderHex }}>
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

      <div className="fixed bottom-6 left-6 z-50 font-sans">
        <button
          onClick={() => setIsSelectorOpen(!isSelectorOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all border text-white font-bold whatsapp-theme-button hover:scale-105 active:scale-95`}
          style={{ borderColor: borderHex }}
        >
          <Palette className="w-5 h-5 text-white" />
          <span className="text-xs hidden sm:inline">Paletas de Cores</span>
        </button>

        {isSelectorOpen && (
          <div className="absolute bottom-16 left-0 w-72 bg-white border border-gray-200 shadow-2xl rounded-2xl p-4 space-y-4 text-black animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h4 className="text-xs font-bold font-comfortaa uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-gray-500" />
                <span>Escolher Paleta</span>
              </h4>
              <button 
                onClick={() => setIsSelectorOpen(false)}
                className="text-gray-400 hover:text-black text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {(Object.keys(themes) as ThemeName[]).map((key) => {
                const themeItem = themes[key];
                const isSelected = activeTheme === key;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTheme(key);
                      if (window.innerWidth < 640) setIsSelectorOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col gap-1.5 ${
                      isSelected 
                        ? "border-black bg-gray-50 font-bold" 
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[11px]">{themeItem.name}</span>
                      {isSelected && <span className="text-[10px] text-green-600">✔</span>}
                    </div>

                    <div className="flex gap-1.5 items-center">
                      <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: themeItem.bgHex }} title="Fundo" />
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: themeItem.accentHex }} title="Destaque Principal" />
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: themeItem.secondaryAccentHex }} title="Destaque Secundário" />
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: themeItem.cardBgHex }} title="Cards" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-3">
              <h4 className="text-[10px] font-bold font-comfortaa uppercase tracking-wider text-gray-500">
                Fonte dos Títulos
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveFont("megrim")}
                  className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                    activeFont === "megrim"
                      ? "border-black bg-gray-50 text-black"
                      : "border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
                  style={{ fontFamily: "'Megrim', cursive" }}
                >
                  Megrim
                </button>
                <button
                  onClick={() => setActiveFont("comfortaa")}
                  className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                    activeFont === "comfortaa"
                      ? "border-black bg-gray-50 text-black"
                      : "border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
                  style={{ fontFamily: "'Comfortaa', sans-serif" }}
                >
                  Comfortaa
                </button>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed font-sans pt-1 border-t border-gray-100">
              * Clique em uma das opções acima para alternar as cores ou fontes do site em tempo real!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DogCard({ dog, theme }: { dog: any; theme: any }) {
  const [activePhoto, setActivePhoto] = useState(dog.avatar_url || (dog.photos && dog.photos[0]) || "");

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all flex flex-col justify-between group shadow-lg ${theme.cardBg} ${theme.cardBorder}`}>
      <div className="relative h-72 bg-gray-100 overflow-hidden select-none border-b" style={{ borderColor: theme.border.replace('border-[', '').replace(']', '') }}>
        {activePhoto ? (
          <img
            src={activePhoto}
            alt={dog.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-xs ${theme.textMuted}`}>
            Sem foto disponível
          </div>
        )}
        <span className="absolute top-4 right-4 bg-black/75 text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider z-20">
          {dog.gender === "macho" ? "Macho" : "Fêmea"}
        </span>

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

      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold font-comfortaa transition-colors group-hover:text-opacity-80">{dog.name}</h3>
            {dog.price > 0 && (
              <span className="font-extrabold text-sm" style={{ color: theme.accentHex }}>
                R$ {dog.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          <div className={`grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] sm:text-xs border p-4 rounded-xl font-sans ${theme.bgForm}`} style={{ borderColor: theme.borderHex }}>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Raça</span>
              <span className="font-semibold">{dog.breed || "Pastor do Cáucaso"}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Origem</span>
              <span className="font-semibold">{dog.origin || "—"}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Peso</span>
              <span className="font-semibold">{dog.weight || "—"}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Idade</span>
              <span className="font-semibold">{dog.age || "—"}</span>
            </div>
          </div>

          <p className={`text-xs leading-relaxed min-h-[48px] font-sans ${theme.textMuted}`}>
            {dog.notes || dog.history || "Sem descrição disponível."}
          </p>
        </div>

        <div className="space-y-3 pt-3 border-t" style={{ borderColor: theme.borderHex }}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px]">
              <Check className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
              <span>Pedigree CBKC Incluso</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <Check className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
              <span>Linhagem Importada Selecionada</span>
            </div>
          </div>

          {dog.name.includes("[Espaço") ? (
            <div className="w-full text-center py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-dashed border-gray-300 rounded-lg">
              Espaço Reservado
            </div>
          ) : (
            <Link
              href={`https://wa.me/5511974992059?text=Olá!%20Gostaria%20de%20saber%20mais%20detalhes%20sobre%20o%20cão%20${dog.name}.`}
              target="_blank"
              className={`w-full border py-2.5 rounded-lg text-xs font-bold transition-all text-center block ${theme.primaryAccentText} bg-white hover:bg-gray-50`}
              style={{ borderColor: theme.borderHex }}
            >
              Consultar Detalhes
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
