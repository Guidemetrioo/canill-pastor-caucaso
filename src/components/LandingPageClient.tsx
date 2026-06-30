"use client";

import { useRef, useEffect, useState } from "react";
import { useAura } from "@/context/AuraContext";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
import Link from "next/link";
import { Shield, Check, Calendar, ArrowRight, Star, Heart, MapPin, Award, MessageCircle, Clock, Users } from "lucide-react";

export default function LandingPageClient() {
  const { filhotes } = useAura();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<"exposicao" | "guarda">("exposicao");
  const [activeDogGender, setActiveDogGender] = useState<"fêmea" | "macho">("fêmea");

  // Booking Form State
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("10:00");
  const [visitorName, setVisitorName] = useState("");
  const [visitError, setVisitError] = useState("");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
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

    const d = new Date(val + "T00:00:00");
    const day = d.getDay(); // 0 Sunday, 6 Saturday
    if (day === 0 || day === 6) {
      setVisitError("Visitas presenciais disponíveis apenas de Segunda a Sexta-feira.");
    } else {
      setVisitError("");
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDate) {
      setVisitError("Por favor, selecione uma data.");
      return;
    }
    const d = new Date(visitDate + "T00:00:00");
    const day = d.getDay();
    if (day === 0 || day === 6) {
      setVisitError("Visitas presenciais disponíveis apenas de Segunda a Sexta-feira.");
      return;
    }
    if (!visitorName.trim()) {
      setVisitError("Por favor, insira o seu nome.");
      return;
    }

    setVisitError("");
    const parts = visitDate.split("-");
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

    const text = `Olá! Gostaria de agendar uma visita ao Canil Vale da Kubera no dia ${formattedDate} às ${visitTime}. Meu nome é ${visitorName.trim()}.`;
    const url = `https://wa.me/5511974992059?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
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
      avatar_url: "/dogs/nero_4.jpg",
      photos: ["/dogs/nero_4.jpg", "/dogs/nero_5.jpg", "/dogs/nero_1.jpg", "/dogs/nero_2.jpg", "/dogs/nero_6.jpg", "/dogs/nero_7.jpg"],
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
      avatar_url: "/dogs/vasilisia_1.jpg",
      photos: ["/dogs/vasilisia_1.jpg", "/dogs/vasilisia_2.jpg", "/dogs/vasilisia_3.jpg"],
      breed: "Pastor do Cáucaso",
      age: "2 anos",
      origin: "Rússia",
      weight: "68kg",
      notes: "Fêmea robusta importada da Rússia. Temperamento equilibrado e excelente guardiã.",
      history: "Fêmea importada da Rússia. Estrutura robusta e temperamento equilibrado de guarda.",
    },
  ];

  // Use context data if loaded, otherwise use static dogs
  const baseDogs = filhotes.filter((f) => f.status === "Disponível").length > 0
    ? filhotes.filter((f) => f.status === "Disponível")
    : staticDogs;

  // Enrich data for known dogs to ensure fields (weight, age) are fully populated
  const allDogs = baseDogs.map(dog => {
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
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-20 font-sans">
      <PublicNavbar />

      {/* 1. Optimized Responsive Hero Banner */}
      <section className="relative w-full h-[80vh] md:h-[90vh] bg-black overflow-hidden border-b border-[#2A2A2A]">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center opacity-55"
            style={{ filter: "brightness(1.1) contrast(0.95)" }}
            poster="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800"
          >
            <source src="/banner-hero.mp4" type="video/mp4" />
          </video>
          {/* Gradients overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F]/90 via-[#0F0F0F]/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent z-10" />
        </div>
        
        {/* Decorative ambient light */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D97457]/5 rounded-full blur-3xl pointer-events-none z-10" />

        {/* Banner Text Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Criação Selecionada CBKC/FCI</span>
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-white">
              Canil <br />
              <span className="text-[#D97457]">Vale da Kubera</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              Criação especializada em Pastor do Cáucaso (Kavkazskaya Ovcharka) com padrão de exposição internacional, unindo estrutura premiada e instinto de guarda em um único cão.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#caes"
                className="bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] font-bold px-6 py-3.5 rounded-xl transition-all text-center text-xs shadow-[0_0_20px_rgba(217,116,87,0.25)] flex items-center justify-center gap-2"
              >
                <span>Ver Nossos Cães</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/sobre"
                className="bg-[#1A1A1A] border border-[#2A2A2A] text-white hover:bg-gray-900 font-bold px-6 py-3.5 rounded-xl transition-all text-center text-xs"
              >
                Conheça Nosso Trabalho
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Seção Sobre Nós */}
      <section className="py-20 bg-[#0F0F0F] border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-xs font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Sobre Nós</span>
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                O Canil <span className="text-[#D97457]">Vale da Kubera</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
                O Canil Vale da Kubera é fruto de uma dedicação absoluta à preservação, criação e aprimoramento da raça Pastor do Cáucaso no Brasil. Nosso trabalho é estruturado a partir de três pilares inegociáveis: saúde de ferro, conformação morfológica perfeita e o autêntico temperamento de guarda territorial.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans">
                Buscamos sempre unir a nobreza e rusticidade do padrão clássico europeu às necessidades de proteção e companheirismo das famílias brasileiras. Nossos cães são membros da nossa família e guardiões de nossa propriedade.
              </p>
            </div>
            <div className="lg:col-span-5 relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-xl">
              <img
                src="/dogs/canil_1.jpg"
                alt="Estrutura Canil Vale da Kubera"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-[#2A2A2A]">
                <p className="text-xs text-[#D97457] font-bold">10.000m² de Área Verde</p>
                <p className="text-[10px] text-gray-400">Estrutura projetada para o bem-estar animal</p>
              </div>
            </div>
          </div>

          {/* Cards dos Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#141414] border border-[#2A2A2A] p-8 rounded-2xl space-y-4 hover:border-[#D97457]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#D97457]/10 border border-[#D97457]/20 flex items-center justify-center text-[#D97457] group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">O Lugar</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-sans">
                Localizado em Itatiba - SP, o canil conta com uma chácara verde de mais de 10.000m² totalmente estruturada, com piquetes espaçosos, área de solário e maternidade climatizada, proporcionando espaço de sobra para exercícios e sociabilidade.
              </p>
            </div>

            <div className="bg-[#141414] border border-[#2A2A2A] p-8 rounded-2xl space-y-4 hover:border-[#D97457]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#D97457]/10 border border-[#D97457]/20 flex items-center justify-center text-[#D97457] group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Criação &amp; Cães</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-sans">
                Trabalhamos com matrizes e padreadores importados das linhagens europeias mais renomadas (Rússia, Ucrânia, Romênia e Espanha). Todos os nossos cães possuem controle radiográfico rígido de quadril (HD) e cotovelos livre de displasia.
              </p>
            </div>

            <div className="bg-[#141414] border border-[#2A2A2A] p-8 rounded-2xl space-y-4 hover:border-[#D97457]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#D97457]/10 border border-[#D97457]/20 flex items-center justify-center text-[#D97457] group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">A História</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-sans">
                Acumulamos mais de 8 anos de estudos cinófilos e prática com a raça. Fomos pioneiros na busca pelo equilíbrio perfeito: produzir cães aptos para as exigentes pistas de exposição sem perder a coragem territorial inerente ao Pastor do Cáucaso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Seção Agenda de Visita */}
      <section className="py-20 bg-[#121212]/30 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Visitas Presenciais</span>
            </span>
            <h2 className="text-3xl font-extrabold text-white">Agende sua Visita</h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
              Venha conhecer de perto nossa estrutura de 10.000m² e o temperamento dos nossos reprodutores. As visitas devem ser agendadas previamente de acordo com a nossa disponibilidade.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-[#161616] border border-[#2A2A2A] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Background glowing light */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#D97457]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Disponibilidade Info */}
              <div className="md:col-span-5 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white">Disponibilidade</h4>
                  <p className="text-xs text-gray-400 font-sans">Atendimento personalizado com os criadores.</p>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-[#D97457]/10 flex items-center justify-center text-[#D97457] shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Segunda a Sexta-feira</p>
                      <p className="text-gray-500 text-[10px]">Dias de visitação</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-[#D97457]/10 flex items-center justify-center text-[#D97457] shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">10:00 às 18:00</p>
                      <p className="text-gray-500 text-[10px]">Horários disponíveis</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-[10px] text-gray-400 font-sans leading-relaxed">
                  <strong>Aviso Importante:</strong> Para segurança do canil e bem-estar dos cães, não realizamos visitas sem agendamento prévio.
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleScheduleSubmit} className="md:col-span-7 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="visitor-name" className="text-xs text-gray-400 font-semibold block">Nome Completo</label>
                  <input
                    id="visitor-name"
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D97457] transition-all font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="visit-date" className="text-xs text-gray-400 font-semibold block">Data da Visita</label>
                    <input
                      id="visit-date"
                      type="date"
                      required
                      value={visitDate}
                      onChange={handleDateChange}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D97457] transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="visit-time" className="text-xs text-gray-400 font-semibold block">Horário</label>
                    <select
                      id="visit-time"
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D97457] transition-all font-sans"
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

                {visitError && (
                  <p className="text-xs text-red-500 font-semibold mt-1 font-sans">{visitError}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] font-bold py-3.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(217,116,87,0.25)]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Solicitar Agendamento via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Seção dos Cães (Separada por Abas: Machos e Fêmeas) */}
      <section id="caes" className="py-20 bg-[#121212]/50 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs text-[#D97457] font-bold uppercase tracking-wider">Plantel Canino</span>
              <h2 className="text-3xl font-extrabold">Nossos Cães</h2>
              <p className="text-gray-400 text-xs max-w-lg leading-relaxed font-sans">
                Conheça os exemplares importados e matrizes selecionadas de Pastor do Cáucaso do nosso canil.
              </p>
            </div>
            
            {/* Genders tabs selector */}
            <div className="flex items-center gap-3 bg-[#1A1A1A] p-1.5 rounded-xl border border-[#2A2A2A] self-start md:self-end">
              <button
                onClick={() => setActiveDogGender("fêmea")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeDogGender === "fêmea"
                    ? "bg-[#D97457] text-[#0F0F0F]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Fêmeas (Matrizes)
              </button>
              <button
                onClick={() => setActiveDogGender("macho")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeDogGender === "macho"
                    ? "bg-[#D97457] text-[#0F0F0F]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Machos (Padreadores)
              </button>
            </div>
          </div>

          {filteredDogs.length === 0 ? (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-10 text-center text-gray-400 text-xs font-sans">
              Nenhum cão ou filhote disponível nesta categoria no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {filteredDogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. A Raça & Criação (Existing Slider section) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs text-[#D97457] font-bold uppercase tracking-wider">A Raça &amp; Criação</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Padrão de Exposição <br />
              <span className="text-[#D97457]">com Funcionalidade</span>
            </h2>
            <p className="text-gray-400 text-xs max-w-2xl leading-relaxed font-sans">
              No Canil Vale da Kubera, unimos a beleza e o rigor morfológico exigidos pelas exposições internacionais ao instinto de proteção nato do Pastor do Cáucaso. Deslize para o lado ou selecione abaixo para ver os pilares de cada perfil.
            </p>
          </div>

          {/* Carousel Tabs/Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => handleTabClick("exposicao")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                activeTab === "exposicao"
                  ? "bg-[#D97457] border-[#D97457] text-[#0F0F0F] shadow-lg shadow-[#D97457]/15"
                  : "bg-[#1A1A1A] border-[#2A2A2A] text-gray-400 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Exposição</span>
            </button>
            <button
              onClick={() => handleTabClick("guarda")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                activeTab === "guarda"
                  ? "bg-[#D97457] border-[#D97457] text-[#0F0F0F] shadow-lg shadow-[#D97457]/15"
                  : "bg-[#1A1A1A] border-[#2A2A2A] text-gray-400 hover:text-white"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Guarda</span>
            </button>
          </div>
        </div>

        {/* Scrollable container with cards */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleContainerScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 no-scrollbar scroll-smooth pb-4"
        >
          {/* Card 1: Exposição */}
          <div className="w-full flex-shrink-0 snap-start grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#141414] border border-[#2A2A2A] p-6 sm:p-10 rounded-3xl shadow-xl font-sans">
            {/* Text column */}
            <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-[10px] font-bold uppercase tracking-wider">
                <Award className="w-3 h-3" />
                <span>Padrão Oficial Morfológico</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Cão de Exposição: Genética &amp; Beleza de Padrão Internacional
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Nossos exemplares de exposição são criados com base nas diretrizes oficiais da FCI/CBKC. Focamos no aprimoramento morfológico para produzir cães saudáveis, robustos e com conformação perfeita.
              </p>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-[#D97457] shrink-0 mt-0.5" />
                  <div>
                    <strong>Genética Importada Selecta:</strong> Linhagens exclusivas da Rússia, Romênia, Ucrânia e Espanha de alto rendimento morfológico.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-[#D97457] shrink-0 mt-0.5" />
                  <div>
                    <strong>Estrutura &amp; Tipicidade:</strong> Cabeça massiva, mordedura correta em tesoura, pelagem dupla extremamente densa e movimentação harmônica.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-[#D97457] shrink-0 mt-0.5" />
                  <div>
                    <strong>Laudos de Saúde Oficiais:</strong> Controle genético rígido com radiografias de quadril (HD-A/B) e cotovelos para eliminação de displasia.
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Image column */}
            <div className="lg:col-span-5 relative h-64 sm:h-80 md:h-[350px] w-full rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-2xl order-1 lg:order-2">
              <img
                src="/dogs/venus_1.jpg"
                alt="Pastor do Cáucaso padrão de exposição - Vênus"
                className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Card 2: Guarda */}
          <div className="w-full flex-shrink-0 snap-start grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#141414] border border-[#2A2A2A] p-6 sm:p-10 rounded-3xl shadow-xl font-sans">
            {/* Text column */}
            <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-[10px] font-bold uppercase tracking-wider">
                <Shield className="w-3 h-3" />
                <span>Instinto Territorial de Guarda</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Cão de Guarda: Proteção Inata, Equilibrada &amp; Incorruptível
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                O Pastor do Cáucaso possui um instinto de defesa nativo da raça. Ele atua de maneira vigilante e altamente territorial, sendo uma proteção real para fazendas, sítios e residências.
              </p>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-[#D97457] shrink-0 mt-0.5" />
                  <div>
                    <strong>Instinto Autônomo de Guarda:</strong> O Cáucaso dispensa treinamentos agressivos ou induções ao ataque; sua vigilância territorial é totalmente nata.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-[#D97457] shrink-0 mt-0.5" />
                  <div>
                    <strong>Temperamento Equilibrado:</strong> Alta lealdade e afeto com a família, enquanto se mantém como uma barreira inabalável contra ameaças externas.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-[#D97457] shrink-0 mt-0.5" />
                  <div>
                    <strong>Desenvolvimento e Maturação:</strong> Amadurecimento mental tardio. O potencial pleno de guarda territorial se consolida após os 2 anos de idade.
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Image column */}
            <div className="lg:col-span-5 relative h-64 sm:h-80 md:h-[350px] w-full rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-2xl order-1 lg:order-2">
              <img
                src="/dogs/nero_4.jpg"
                alt="Pastor do Cáucaso cão de guarda - Nero"
                className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator Dots */}
        <div className="flex justify-center gap-2 pt-2">
          <span
            onClick={() => handleTabClick("exposicao")}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              activeTab === "exposicao" ? "bg-[#D97457] w-6" : "bg-gray-700"
            }`}
          />
          <span
            onClick={() => handleTabClick("guarda")}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              activeTab === "guarda" ? "bg-[#D97457] w-6" : "bg-gray-700"
            }`}
          />
        </div>
      </section>

      {/* 6. Location / Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-[#2A2A2A]">
        <div className="space-y-6">
          <span className="text-xs text-[#D97457] font-bold uppercase tracking-wider">Localização</span>
          <h2 className="text-3xl font-extrabold">Venha nos visitar em Itatiba - SP</h2>
          <p className="text-gray-400 text-xs leading-relaxed font-sans">
            Nossas instalações ficam em uma chácara verde estruturada especificamente para o bem-estar e criação da raça Pastor do Cáucaso.
          </p>

          <div className="space-y-3.5 text-xs text-gray-300 font-sans">
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
              href={`https://wa.me/5511974992059?text=Olá!%20Gostaria%20de%20saber%20mais%20detalhes%20sobre%20o%20cão%20${dog.name}.`}
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
