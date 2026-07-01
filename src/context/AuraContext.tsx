"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export type ThemeName = "eco-rustic" | "terracota-warmth" | "minimalista-organica";

export interface ThemeConfig {
  name: string;
  bg: string;
  cardBg: string;
  cardBorder: string;
  primaryAccent: string;
  primaryAccentHover: string;
  primaryAccentText: string;
  secondaryAccent: string;
  textMain: string;
  textMuted: string;
  tagBg: string;
  tagText: string;
  border: string;
  bgForm: string;
  accentHex: string;
  secondaryAccentHex: string;
  bgHex: string;
  borderHex: string;
  cardBgHex: string;
}

export const themesConfig: Record<ThemeName, ThemeConfig> = {
  "eco-rustic": {
    name: "Eco-Rustic (Verde + Terracota)",
    bg: "bg-[#F4F5F2]",
    cardBg: "bg-[#FFFFFF]",
    cardBorder: "border-[#E5E7EB] hover:border-[#0F6B2E]/30",
    primaryAccent: "bg-[#0F6B2E] text-white hover:bg-[#0D5B27]",
    primaryAccentHover: "hover:bg-[#0D5B27]",
    primaryAccentText: "text-[#0F6B2E]",
    secondaryAccent: "bg-[#B24F18] text-white hover:bg-[#964213]",
    textMain: "text-[#222521]",
    textMuted: "text-[#555E54]",
    tagBg: "bg-[#0F6B2E]/10 border-[#0F6B2E]/20",
    tagText: "text-[#0F6B2E]",
    border: "border-[#E2E8F0]",
    bgForm: "bg-[#F9FAFB]",
    accentHex: "#0F6B2E",
    secondaryAccentHex: "#B24F18",
    bgHex: "#F4F5F2",
    borderHex: "#E2E8F0",
    cardBgHex: "#FFFFFF"
  },
  "terracota-warmth": {
    name: "Terracota Warmth (Terracota + Verde)",
    bg: "bg-[#FAF8F5]",
    cardBg: "bg-[#FFFFFF]",
    cardBorder: "border-[#F3EFEA] hover:border-[#A84415]/30",
    primaryAccent: "bg-[#A84415] text-white hover:bg-[#8D3810]",
    primaryAccentHover: "hover:bg-[#8D3810]",
    primaryAccentText: "text-[#A84415]",
    secondaryAccent: "bg-[#135E2D] text-white hover:bg-[#0F4B23]",
    textMain: "text-[#26211E]",
    textMuted: "text-[#665B54]",
    tagBg: "bg-[#A84415]/10 border-[#A84415]/20",
    tagText: "text-[#A84415]",
    border: "border-[#EFEBE4]",
    bgForm: "bg-[#FAF9F7]",
    accentHex: "#A84415",
    secondaryAccentHex: "#135E2D",
    bgHex: "#FAF8F5",
    borderHex: "#EFEBE4",
    cardBgHex: "#FFFFFF"
  },
  "minimalista-organica": {
    name: "Minimalista Orgânica",
    bg: "bg-[#ECEFEA]",
    cardBg: "bg-[#FFFFFF]",
    cardBorder: "border-[#DDE2DB] hover:border-[#0E612B]/30",
    primaryAccent: "bg-[#0E612B] text-white hover:bg-[#0B4D22]",
    primaryAccentHover: "hover:bg-[#0B4D22]",
    primaryAccentText: "text-[#0E612B]",
    secondaryAccent: "bg-[#B04A1B] text-white hover:bg-[#913B14]",
    textMain: "text-[#1C1C1C]",
    textMuted: "text-[#555E54]",
    tagBg: "bg-[#0E612B]/10 border-[#0E612B]/20",
    tagText: "text-[#0E612B]",
    border: "border-[#DDE2DB]",
    bgForm: "bg-[#F3F5F2]",
    accentHex: "#0E612B",
    secondaryAccentHex: "#B04A1B",
    bgHex: "#ECEFEA",
    borderHex: "#DDE2DB",
    cardBgHex: "#FFFFFF"
  }
};

// Interfaces
export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  notes: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  status: "Novo" | "Qualificando" | "Interessado" | "Visita Agendada" | "Em Negociação" | "Vendido" | "Perdido";
  origin: string;
  data_qualificado: {
    service_type?: string;
    puppy_gender?: string;
    puppy_purpose?: string;
    dog_experience?: string;
    lead_city?: string;
    [key: string]: any;
  };
  current_step: string;
  auto_respond: boolean;
  tags: string[];
  notes?: string;
  created_at: string;
}

export interface Animal {
  id: number;
  name: string;
  gender: "macho" | "fêmea";
  birthdate?: string;
  pedigree_url?: string;
  registry?: string;
  status: "disponível" | "em_repouso" | "inativo";
  breed_price?: number;
  avatar_url?: string;
  notes?: string;
  created_at?: string;
}

export interface Ninhada {
  id: number;
  mother_id?: number;
  father_id?: number;
  birth_date?: string;
  puppy_count_male: number;
  puppy_count_female: number;
  status: "Planejada" | "Nascida" | "Desmamada";
  notes?: string;
  created_at?: string;
}

export interface Filhote {
  id: number;
  litter_id?: number;
  name: string;
  gender: "macho" | "fêmea";
  status: "Disponível" | "Reservado" | "Vendido" | "Canil";
  price: number;
  health_records: { type: "vacina" | "vermífugo" | "exame"; name: string; date: string; status: "Pendente" | "Aplicado" }[];
  weight_history: { date: string; weight: number }[];
  avatar_url?: string;
  photos: string[];
  notes?: string;
  created_at?: string;
  breed?: string;
  age?: string;
  origin?: string;
  weight?: string;
  history?: string;
}

export interface Service {
  id: number;
  name: string;
  category: "cobertura" | "adestramento" | "hospedagem";
  price: number;
  description?: string;
}

export interface AgendaEvent {
  id: number;
  type: "visita" | "cobertura" | "adestramento" | "hospedagem" | "vacina" | "vermifugacao";
  title: string;
  description?: string;
  datetime: string;
  lead_id?: number;
  client_id?: number;
  assigned_to?: string;
  status: "Agendado" | "Confirmado" | "Concluído" | "Cancelado";
  reminder_sent: boolean;
  created_at?: string;
}

export interface Hospedagem {
  id: number;
  client_id: number;
  dog_name: string;
  entry_date: string;
  exit_date: string;
  daily_rate: number;
  total_amount: number;
  status: "Reservado" | "Hospedado" | "Finalizado";
  notes?: string;
  created_at?: string;
}

export interface Adestramento {
  id: number;
  client_id: number;
  dog_name: string;
  plan_name: string;
  sessions_total: number;
  sessions_completed: number;
  status: "Ativo" | "Concluído" | "Pausado";
  notes?: string;
  created_at?: string;
}

export interface FinancialEntry {
  id: number;
  type: "Entrada" | "Saída";
  category: "Venda Filhote" | "Cobertura" | "Hospedagem" | "Adestramento" | "Ração" | "Veterinário" | "Vacinas" | "Manutenção" | "Marketing" | "Outro";
  amount: number;
  description: string;
  date: string;
  payment_method?: "Dinheiro" | "Pix" | "Crédito" | "Débito";
  reference_id?: number;
  created_at?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  excerpt?: string;
  image_url?: string;
  published: boolean;
  created_at?: string;
}

export interface Notification {
  id: number;
  type: "agendamento" | "estoque" | "aniversario" | "comissao" | "sistema";
  message: string;
  read: boolean;
  created_at: string;
}

export interface WhatsAppConfig {
  id: number;
  status: string;
  qr_code?: string;
  phone?: string;
  reminder_hours: number;
  enable_reminders: boolean;
  enable_confirmations: boolean;
  enable_responses: boolean;
  qualification_questions: { id: string; question: string }[];
  message_templates?: Record<string, string>;
  updated_at?: string;
}

interface AuraContextProps {
  clients: Client[];
  leads: Lead[];
  animals: Animal[];
  ninhadas: Ninhada[];
  filhotes: Filhote[];
  services: Service[];
  agendaEvents: AgendaEvent[];
  hospedagens: Hospedagem[];
  adestramentos: Adestramento[];
  financialEntries: FinancialEntry[];
  blogPosts: BlogPost[];
  notifications: Notification[];
  whatsappConfig: WhatsAppConfig | null;

  // Dynamic Theme & Font Selection
  activeTheme: ThemeName;
  setActiveTheme: (theme: ThemeName) => void;
  activeFont: "megrim" | "comfortaa";
  setActiveFont: (font: "megrim" | "comfortaa") => void;
  themes: Record<ThemeName, ThemeConfig>;

  // Actions
  addClient: (client: Omit<Client, "id">) => Promise<number>;
  updateClient: (id: number, data: Partial<Client>) => Promise<void>;
  addLead: (lead: Omit<Lead, "id" | "created_at">) => Promise<number>;
  updateLeadStatus: (id: number, status: Lead["status"]) => Promise<void>;
  updateLeadAutoRespond: (id: number, auto_respond: boolean) => Promise<void>;
  updateLeadNotes: (id: number, notes: string, tags?: string[]) => Promise<void>;
  addAnimal: (animal: Omit<Animal, "id">) => Promise<void>;
  updateAnimal: (id: number, data: Partial<Animal>) => Promise<void>;
  addNinhada: (ninhada: Omit<Ninhada, "id">) => Promise<void>;
  updateNinhada: (id: number, data: Partial<Ninhada>) => Promise<void>;
  addFilhote: (filhote: Omit<Filhote, "id">) => Promise<void>;
  updateFilhote: (id: number, data: Partial<Filhote>) => Promise<void>;
  addService: (service: Omit<Service, "id">) => Promise<void>;
  updateService: (id: number, service: Partial<Service>) => Promise<void>;
  addAgendaEvent: (event: Omit<AgendaEvent, "id" | "reminder_sent">) => Promise<void>;
  updateAgendaEventStatus: (id: number, status: AgendaEvent["status"]) => Promise<void>;
  addHospedagem: (hospedagem: Omit<Hospedagem, "id">) => Promise<void>;
  updateHospedagemStatus: (id: number, status: Hospedagem["status"]) => Promise<void>;
  addAdestramento: (adestramento: Omit<Adestramento, "id">) => Promise<void>;
  incrementAdestramentoSession: (id: number) => Promise<void>;
  addTransaction: (entry: Omit<FinancialEntry, "id">) => Promise<void>;
  addBlogPost: (post: Omit<BlogPost, "id">) => Promise<void>;
  updateBlogPost: (id: number, post: Partial<BlogPost>) => Promise<void>;
  updateWhatsappConfig: (data: Partial<WhatsAppConfig>) => Promise<void>;
  markNotificationRead: (id: number) => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const AuraContext = createContext<AuraContextProps | undefined>(undefined);

export function AuraProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  // States
  const [clients, setClients] = useState<Client[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [ninhadas, setNinhadas] = useState<Ninhada[]>([]);
  const [filhotes, setFilhotes] = useState<Filhote[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>([]);
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);
  const [adestramentos, setAdestramentos] = useState<Adestramento[]>([]);
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig | null>(null);

  // Dynamic Theme & Font Selection States
  const [activeTheme, setActiveTheme] = useState<ThemeName>("eco-rustic");
  const [activeFont, setActiveFont] = useState<"megrim" | "comfortaa">("megrim");

  const isSupabaseConfigured = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(
      url &&
      url !== "https://your-project.supabase.co" &&
      !url.includes("your-project") &&
      key &&
      !key.includes("placeholder")
    );
  };

  const loadLocalMockData = () => {
    // 1. Clients
    setClients([
      { id: 1, name: "Bruno Souza", phone: "(11) 98765-4321", email: "bruno.souza@gmail.com", city: "Itatiba - SP", notes: "Comprador do filhote Buran. Já possui experiência com cães gigantes." },
      { id: 2, name: "Carlos Eduardo Santos", phone: "(11) 97654-3210", email: "cadu.santos@outlook.com", city: "Itatiba - SP", notes: "Utiliza hospedagem mensal para adestramento de guarda." }
    ]);

    // 2. Leads
    setLeads([
      { id: 1, name: "Guilherme Mota", phone: "(11) 99999-8888", email: "gui@mota.com", status: "Visita Agendada", origin: "Instagram", data_qualificado: { service_type: "Compra de Filhote", puppy_gender: "Macho", puppy_purpose: "Guarda", dog_experience: "Sim, de porte grande", lead_city: "Itatiba - SP" }, current_step: "MENU", auto_respond: true, tags: ["cliente sério"], notes: "Quer visitar no sábado às 14h para ver os filhotes de Vasilísia.", created_at: new Date().toISOString() },
      { id: 2, name: "Aline Silva", phone: "(11) 98888-7777", status: "Novo", origin: "WhatsApp", data_qualificado: { service_type: "Compra de Filhote", puppy_gender: "Fêmea", puppy_purpose: "Companhia", dog_experience: "Não", lead_city: "Itatiba - SP" }, current_step: "MENU", auto_respond: true, tags: ["pesquisando"], notes: "Preocupada com temperamento e convivência com outros pets.", created_at: new Date().toISOString() }
    ]);

    // 3. Animals
    setAnimals([
      { id: 1, name: "Symion da Kubera", gender: "macho", birthdate: "2021-04-12", pedigree_url: "#", registry: "CBKC-12345", status: "disponível", breed_price: 3500.00, notes: "Importado da Rússia (Canil Baraik Azskaz). Gigante de 100kg com excelente estrutura e guarda implacável.", avatar_url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=400" },
      { id: 2, name: "Vasilísia da Kubera", gender: "fêmea", birthdate: "2022-01-20", pedigree_url: "#", registry: "CBKC-54321", status: "disponível", notes: "Importada da Rússia. Fêmea de temperamento explosivo, dominante e excelente guardiã.", avatar_url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400" },
      { id: 3, name: "Nero da Kubera", gender: "macho", birthdate: "2020-08-15", pedigree_url: "#", registry: "CBKC-22341", status: "disponível", breed_price: 3500.00, notes: "Importado da Ucrânia. Reprodutor de grande porte, temperamento equilibrado e excelente pigmentação.", avatar_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400" },
      { id: 4, name: "Thara da Kubera", gender: "fêmea", birthdate: "2021-11-03", pedigree_url: "#", registry: "CBKC-22342", status: "disponível", notes: "Importada da Romênia. Matriz de excelente temperamento de proteção e instinto maternal impecável.", avatar_url: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=400" },
      { id: 5, name: "Ozzy da Kubera", gender: "macho", birthdate: "2022-05-19", pedigree_url: "#", registry: "CBKC-22343", status: "disponível", breed_price: 3500.00, notes: "Importado da Espanha. Reprodutor jovem de excelente movimentação e estrutura compacta.", avatar_url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400" }
    ]);

    // 4. Ninhadas
    setNinhadas([
      { id: 1, mother_id: 2, father_id: 1, birth_date: "2026-04-15", puppy_count_male: 3, puppy_count_female: 4, status: "Nascida", notes: "Ninhada excelente. Todos os filhotes fortes e amamentando." }
    ]);

    // 5. Filhotes
    setFilhotes([
      {
        id: 1,
        name: "APOLO",
        gender: "macho",
        status: "Disponível",
        price: 0,
        health_records: [],
        weight_history: [],
        avatar_url: "/dogs/apolo_1.jpg",
        photos: ["/dogs/apolo_1.jpg", "/dogs/apolo_2.jpg", "/dogs/apolo_3.jpg", "/dogs/apolo_4.jpg", "/dogs/apolo_5.jpg"],
        breed: "Pastor do Cáucaso",
        age: "",
        origin: "Brasil",
        weight: "",
        notes: "Macho imponente do plantel Vale da Kubera. Excelente conformação e instinto de guarda apurado.",
        history: "Apolo é um exemplar de destaque do plantel, com estrutura robusta e temperamento de guarda exemplar."
      },
      {
        id: 2,
        name: "ORHAM",
        gender: "macho",
        status: "Disponível",
        price: 0,
        health_records: [],
        weight_history: [],
        avatar_url: "/dogs/orham_1.jpg",
        photos: ["/dogs/orham_1.jpg", "/dogs/orham_2.jpg", "/dogs/orham_3.jpg", "/dogs/orham_4.jpg"],
        breed: "Pastor do Cáucaso",
        age: "",
        origin: "Brasil",
        weight: "",
        notes: "Macho de linhagem selecionada, estrutura compacta e pelagem densa característica da raça.",
        history: "Orham representa a excelência genética do plantel Vale da Kubera, com conformação morfológica impecável."
      },
      {
        id: 3,
        name: "PUTIN",
        gender: "macho",
        status: "Disponível",
        price: 0,
        health_records: [],
        weight_history: [],
        avatar_url: "/dogs/putin_1.jpg",
        photos: ["/dogs/putin_1.jpg", "/dogs/putin_2.jpg", "/dogs/putin_3.jpg", "/dogs/putin_4.jpg"],
        breed: "Pastor do Cáucaso",
        age: "",
        origin: "Brasil",
        weight: "",
        notes: "Macho de temperamento forte e presença imponente. Representante da linhagem de guarda do canil.",
        history: "Putin é um cão de guarda nato, com presença intimidante e lealdade absoluta com sua família."
      },
      {
        id: 4,
        name: "BURHAM",
        gender: "macho",
        status: "Disponível",
        price: 0,
        health_records: [],
        weight_history: [],
        avatar_url: "/dogs/burham_1.jpg",
        photos: ["/dogs/burham_1.jpg", "/dogs/burham_2.jpg", "/dogs/burham_3.jpg", "/dogs/burham_4.jpg", "/dogs/burham_5.jpg", "/dogs/burham_6.jpg"],
        breed: "Pastor do Cáucaso",
        age: "",
        origin: "Brasil",
        weight: "",
        notes: "Macho jovem de excelente potencial, com estrutura sólida e movimento harmônico.",
        history: "Burham demonstra desde cedo o temperamento característico da raça: dócil com a família e vigilante com estranhos."
      },
      {
        id: 5,
        name: "SYMEON",
        gender: "macho",
        status: "Disponível",
        price: 0,
        health_records: [],
        weight_history: [],
        avatar_url: "/dogs/symeon_1.jpg",
        photos: ["/dogs/symeon_1.jpg", "/dogs/symeon_2.jpg", "/dogs/symeon_3.jpg", "/dogs/symeon_4.jpg", "/dogs/symeon_5.jpg"],
        breed: "Pastor do Cáucaso",
        age: "",
        origin: "Brasil",
        weight: "",
        notes: "Macho de grande estrutura e temperamento exemplar. Reprodutor principal do plantel Vale da Kubera.",
        history: "Symeon é o patriarca do plantel, com estrutura massiva e instinto de guarda territorial implacável."
      },
      {
        id: 6,
        name: "NERO",
        gender: "macho",
        status: "Disponível",
        price: 0,
        health_records: [],
        weight_history: [],
        avatar_url: "/dogs/nero_new_4.jpg",
        photos: ["/dogs/nero_new_4.jpg", "/dogs/nero_new_1.jpg", "/dogs/nero_new_2.jpg", "/dogs/nero_new_3.jpg"],
        breed: "Pastor do Cáucaso",
        age: "",
        origin: "Brasil",
        weight: "",
        notes: "Macho de grande porte com temperamento explosivo e ossatura extremamente robusta.",
        history: "Nero é um cão de guarda de alto nível com temperamento extremamente explosivo e focado, representando o melhor da raça."
      },
      {
        id: 7,
        name: "J-ARA",
        gender: "fêmea",
        status: "Disponível",
        price: 0,
        health_records: [],
        weight_history: [],
        avatar_url: "/dogs/jara_1.jpg",
        photos: ["/dogs/jara_1.jpg", "/dogs/jara_2.jpg"],
        breed: "Pastor do Cáucaso",
        age: "",
        origin: "Brasil",
        weight: "",
        notes: "Fêmea do plantel Vale da Kubera. Temperamento dócil com a família e instinto de guarda apurado.",
        history: "J-Ara é uma fêmea de destaque do plantel, com temperamento equilibrado e excelente instinto de guarda."
      },
      {
        id: 8,
        name: "PANDORA",
        gender: "fêmea",
        status: "Disponível",
        price: 0,
        health_records: [],
        weight_history: [],
        avatar_url: "/dogs/pandora_1.jpg",
        photos: ["/dogs/pandora_1.jpg", "/dogs/pandora_2.jpg", "/dogs/pandora_3.jpg"],
        breed: "Pastor do Cáucaso",
        age: "",
        origin: "Brasil",
        weight: "",
        notes: "Fêmea de excelente conformação morfológica e pelagem densa característica da raça.",
        history: "Pandora possui estrutura morfológica impecável e temperamento equilibrado, sendo uma das matrizes mais promissoras do canil."
      },
      {
        id: 9,
        name: "THARA",
        gender: "fêmea",
        status: "Disponível",
        price: 0,
        health_records: [],
        weight_history: [],
        avatar_url: "/dogs/thara_1.jpg",
        photos: ["/dogs/thara_1.jpg", "/dogs/thara_2.jpg"],
        breed: "Pastor do Cáucaso",
        age: "",
        origin: "Brasil",
        weight: "",
        notes: "Fêmea robusta com temperamento equilibrado e instinto maternal impecável.",
        history: "Thara é uma matriz de excelente temperamento de proteção e instinto maternal, gerando ninhadas de alta qualidade."
      },
      {
        id: 10,
        name: "VASILÍSIA",
        gender: "fêmea",
        status: "Disponível",
        price: 0,
        health_records: [],
        weight_history: [],
        avatar_url: "/dogs/vasilisia_new_1.jpg",
        photos: ["/dogs/vasilisia_new_1.jpg", "/dogs/vasilisia_new_2.jpg", "/dogs/vasilisia_new_3.jpg", "/dogs/vasilisia_new_4.jpg"],
        breed: "Pastor do Cáucaso",
        age: "",
        origin: "Brasil",
        weight: "",
        notes: "Fêmea de estrutura impressionante e presença marcante. Matriz de destaque do plantel Vale da Kubera.",
        history: "Vasilísia é uma fêmea de presença marcante, com estrutura robusta e temperamento domínio equilibrado."
      }
    ]);

    // 6. Services
    setServices([
      { id: 1, name: "Serviço de Monta (Symion da Kubera)", category: "cobertura", price: 3500.00, description: "Serviço de monta com contrato e garantia de gestação." },
      { id: 2, name: "Hospedagem Canina Diária", category: "hospedagem", price: 80.00, description: "Hospedagem com recreação, alimentação inclusa ou trazida pelo tutor." },
      { id: 3, name: "Pacote de Adestramento Básico", category: "adestramento", price: 1200.00, description: "Treinamento de obediência urbana (10 sessões)." }
    ]);

    // 7. AgendaEvents
    const today = new Date();
    setAgendaEvents([
      { id: 1, type: "visita", title: "Visita de Guilherme Mota", description: "Ver filhotes cinzas", datetime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0).toISOString(), lead_id: 1, status: "Agendado", reminder_sent: false },
      { id: 2, type: "adestramento", title: "Treino do cão Marley (Carlos)", description: "Treino de obediência e socialização", datetime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0).toISOString(), client_id: 2, assigned_to: "Criador Rafael", status: "Confirmado", reminder_sent: false }
    ]);

    // 8. Hospedagens
    setHospedagens([
      { id: 1, client_id: 2, dog_name: "Marley", entry_date: new Date(today.setDate(today.getDate() - 2)).toISOString(), exit_date: new Date(today.setDate(today.getDate() + 5)).toISOString(), daily_rate: 80, total_amount: 560, status: "Hospedado", notes: "Alimentação especial 2x ao dia. Muito brincalhão." }
    ]);

    // 9. Adestramentos
    setAdestramentos([
      { id: 1, client_id: 2, dog_name: "Marley", plan_name: "Adestramento Básico", sessions_total: 10, sessions_completed: 4, status: "Ativo", notes: "Já aprendeu os comandos senta e deita. Evoluindo bem." }
    ]);

    // 10. Financial Entries
    setFinancialEntries([
      { id: 1, type: "Entrada", category: "Venda Filhote", amount: 6000.00, description: "Venda Filhote Buran - Bruno Souza", date: new Date().toISOString(), payment_method: "Pix" },
      { id: 2, type: "Saída", category: "Ração", amount: 450.00, description: "Compra de Ração Super Premium 15kg", date: new Date().toISOString() }
    ]);

    // 11. Blog Posts
    setBlogPosts([
      { id: 1, title: "Quanto custa um Pastor do Cáucaso?", slug: "quanto-custa-um-pastor-do-caucaso", excerpt: "Saiba tudo sobre o preço e custos de manutenção da raça.", content: "Conteúdo substancial de mais de 800 palavras sobre custos de alimentação, vacinação, veterinário e pedigree CBKC para Pastor do Cáucaso.", tags: ["preço", "custos", "filhote"], published: true, image_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400" },
      { id: 2, title: "Pastor do Cáucaso é bom para apartamento?", slug: "pastor-do-caucaso-apartamento", excerpt: "Entenda por que essa raça gigante precisa de espaço.", content: "Explicação extensa sobre o porte físico, temperamento territorial, e necessidade de pátio grande para cães de guarda como o Pastor do Cáucaso.", tags: ["guia", "raça", "temperamento"], published: true, image_url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400" },
      {
        id: 3,
        title: "A Filosofia de Criação do Canil Vale da Kubera: Unindo Beleza e Guarda",
        slug: "filosofia-criacao-canil-vale-da-kubera",
        excerpt: "Entenda a nossa busca constante pelo equilíbrio perfeito entre a conformação física de pista de exposição e o autêntico temperamento de guarda.",
        content: "No Canil Vale da Kubera, estruturamos nossa filosofia de criação a partir da busca constante pela unificação de dois polos fundamentais: a beleza morfológica de pista e o temperamento de guarda real.\n\nO grande diferencial do nosso canil é entender que a cinofilia europeia tradicional enxerga o Pastor do Cáucaso como um cão completo. Rejeitamos a divisão polarizada: um cão bonito de pista de exposição também deve possuir o temperamento de guarda territorial intacto e funcional. Se o cão possui a estrutura anatômica correta, ele terá saúde, movimentação leve e a funcionalidade ideal para realizar o trabalho de proteção.\n\n### Os Três Pilares do Pastor do Cáucaso\nPara nós, um exemplar ideal da raça precisa combinar perfeitamente três requisitos inegociáveis:\n1. **Temperamento:** Cães territorialistas e destemidos com estranhos, mas extremamente equilibrados, dóceis e apegados com a sua família.\n2. **Qualidade Genética:** Seleção rígida com controle radiográfico para evitar problemas como a displasia coxofemoral e cotovelos.\n3. **Estrutura:** Anatomia vigorosa, ossatura maciça e movimentação correta.\n\n### Equilíbrio contra os Extremos (Peso e Tamanho)\nEvitamos o extremismo na criação. Ao contrário de outras raças gigantes que sofreram com a busca exagerada por peso excessivo (gerando cães letárgicos e doentes), o Pastor do Cáucaso deve manter sua agilidade e rusticidade. No auge, reprodutores como o romeno **Boran** chegam perto de 100 kg, mas mantêm movimentação leve, olhos limpos (sem pálpebras pendentes) e vitalidade extrema.\n\n### Destaques do Nosso Plantel\nNosso plantel conta com exemplares importados das principais linhagens de trabalho e exposição da Europa:\n- **Boran (Importado da Romênia):** Um exemplar com estrutura maravilhosa, vencedor de 2 *Best in Shows* na Europa antes de chegar ao Brasil.\n- **Afar (Importado da Rússia):** Cão de linhagem 100% funcional de trabalho, filho do lendário campeão russo Taras.\n- **Apolo (Importado da Espanha):** Um macho alto, ágil e com um instinto de ataque e proteção espetaculares.\n- **Putin e Nero:** Os reprodutores que representam a renovação constante da nossa genética.\n\n### Maturidade Tardia da Raça\nDiferentemente de raças de trabalho esportivo como o Pastor Belga Malinois (que com poucos meses já persegue brinquedos de forma ativa), o Pastor do Cáucaso tem uma maturação tardia. Um filhote de 3 a 4 meses pode parecer calmo e dócil. O cão atingirá sua maturidade física e mental de guarda de fato apenas após os 2 anos de idade.\n\nPara conferir essas informações em formato de vídeo e ver nosso plantel real em ação, assista ao documentário gravado em nosso canil em parceria com o canal Cinofilia Digital, disponível na seção de documentários do nosso site.",
        tags: ["criação", "exposição", "guarda", "linhagem"],
        published: true,
        image_url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=600"
      }
    ]);

    // 12. WhatsApp Config
    setWhatsappConfig({
      id: 1,
      status: "connected",
      phone: "+5511974992059",
      reminder_hours: 24,
      enable_reminders: true,
      enable_confirmations: true,
      enable_responses: true,
      qualification_questions: [
        { id: "service_type", question: "Olá! Como posso ajudar você hoje?" }
      ],
      message_templates: {
        visita: "Olá, *{nome}*! Passando para lembrar da sua visita agendada ao *Canil Vale da Kubera* amanhã ({data}) às *{hora}h*.\n\n📍 *Endereço:* Itatiba - SP.\n\nConfirmado? Esperamos você! 🐾",
        adestramento: "Olá, *{nome}*! Passando para lembrar da sessão de adestramento do seu cão agendada para amanhã ({data}) às *{hora}h*.\n\nAté logo! 🎓",
        hospedagem: "Olá, *{nome}*! Passando para lembrar do check-in/check-out de hospedagem de seu cão agendado para amanhã ({data}) às *{hora}h*.\n\nTe aguardamos! 🏡",
        confirmacao: "Olá, *{nome}*! Seu agendamento no *Canil Vale da Kubera* foi confirmado com sucesso! 🎉\n\n📅 *Data:* {data}\n⏰ *Horário:* {hora}h\n📝 *Atividade:* {atividade}\n\nTe aguardamos! 🐾"
      }
    });

    setNotifications([
      { id: 1, type: "sistema", message: "Sistema do Canil Vale da Kubera iniciado em modo local.", read: false, created_at: new Date().toISOString() }
    ]);
  };

  const fetchAllData = async () => {
    if (!isSupabaseConfigured()) {
      loadLocalMockData();
      return;
    }

    try {
      // Fetch data from Supabase
      const { data: dbClients } = await supabase.from("clients").select("*").order("name", { ascending: true });
      if (dbClients) setClients(dbClients);

      const { data: dbLeads } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (dbLeads) setLeads(dbLeads);

      const { data: dbAnimals } = await supabase.from("matrizes_machos").select("*").order("name", { ascending: true });
      if (dbAnimals) setAnimals(dbAnimals);

      const { data: dbLitters } = await supabase.from("ninhadas").select("*").order("birth_date", { ascending: false });
      if (dbLitters) setNinhadas(dbLitters);

      const { data: dbPuppies } = await supabase.from("filhotes").select("*").order("name", { ascending: true });
      if (dbPuppies) setFilhotes(dbPuppies);

      const { data: dbServices } = await supabase.from("services").select("*").order("id", { ascending: true });
      if (dbServices) setServices(dbServices);

      const { data: dbEvents } = await supabase.from("agenda").select("*").order("datetime", { ascending: false });
      if (dbEvents) setAgendaEvents(dbEvents);

      const { data: dbHospedagens } = await supabase.from("hospedagens").select("*").order("entry_date", { ascending: false });
      if (dbHospedagens) setHospedagens(dbHospedagens);

      const { data: dbAdestramentos } = await supabase.from("adestramentos").select("*").order("id", { ascending: true });
      if (dbAdestramentos) setAdestramentos(dbAdestramentos);

      const { data: dbFin } = await supabase.from("financial_entries").select("*").order("date", { ascending: false });
      if (dbFin) setFinancialEntries(dbFin);

      const { data: dbPosts } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (dbPosts) setBlogPosts(dbPosts);

      const { data: dbWpp } = await supabase.from("whatsapp_config").select("*").eq("id", 1).maybeSingle();
      if (dbWpp) setWhatsappConfig(dbWpp);

      const { data: dbNotifications } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
      if (dbNotifications) setNotifications(dbNotifications);

    } catch (e) {
      console.error("Error loading data from Supabase:", e);
      loadLocalMockData();
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addClient = async (client: Omit<Client, "id">) => {
    if (!isSupabaseConfigured()) {
      const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
      const newClient = { id: newId, ...client };
      setClients(prev => [...prev, newClient]);
      return newId;
    }
    const { data, error } = await supabase.from("clients").insert(client).select();
    if (data && data[0]) {
      setClients(prev => [...prev, data[0]]);
      return data[0].id;
    }
    return 0;
  };

  const updateClient = async (id: number, data: Partial<Client>) => {
    if (!isSupabaseConfigured()) {
      setClients(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
      return;
    }
    const { data: dbCl, error } = await supabase.from("clients").update(data).eq("id", id).select();
    if (dbCl && dbCl[0]) {
      setClients(prev => prev.map(c => (c.id === id ? dbCl[0] : c)));
    }
  };

  const addLead = async (lead: Omit<Lead, "id" | "created_at">) => {
    if (!isSupabaseConfigured()) {
      const newId = leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1;
      const newLead = { id: newId, ...lead, created_at: new Date().toISOString() } as Lead;
      setLeads(prev => [newLead, ...prev]);
      return newId;
    }
    const { data, error } = await supabase.from("leads").insert(lead).select();
    if (data && data[0]) {
      setLeads(prev => [data[0], ...prev]);
      return data[0].id;
    }
    return 0;
  };

  const updateLeadStatus = async (id: number, status: Lead["status"]) => {
    if (!isSupabaseConfigured()) {
      setLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
      return;
    }
    const { data, error } = await supabase.from("leads").update({ status }).eq("id", id).select();
    if (data && data[0]) {
      setLeads(prev => prev.map(l => (l.id === id ? data[0] : l)));
    }
  };

  const updateLeadAutoRespond = async (id: number, auto_respond: boolean) => {
    if (!isSupabaseConfigured()) {
      setLeads(prev => prev.map(l => (l.id === id ? { ...l, auto_respond } : l)));
      return;
    }
    const { data, error } = await supabase.from("leads").update({ auto_respond }).eq("id", id).select();
    if (data && data[0]) {
      setLeads(prev => prev.map(l => (l.id === id ? data[0] : l)));
    }
  };

  const updateLeadNotes = async (id: number, notes: string, tags?: string[]) => {
    const updateObj: any = { notes };
    if (tags !== undefined) updateObj.tags = tags;

    if (!isSupabaseConfigured()) {
      setLeads(prev => prev.map(l => (l.id === id ? { ...l, ...updateObj } : l)));
      return;
    }
    const { data, error } = await supabase.from("leads").update(updateObj).eq("id", id).select();
    if (data && data[0]) {
      setLeads(prev => prev.map(l => (l.id === id ? data[0] : l)));
    }
  };

  const addAnimal = async (animal: Omit<Animal, "id">) => {
    if (!isSupabaseConfigured()) {
      const newId = animals.length > 0 ? Math.max(...animals.map(a => a.id)) + 1 : 1;
      setAnimals(prev => [...prev, { id: newId, ...animal }]);
      return;
    }
    const { data, error } = await supabase.from("matrizes_machos").insert(animal).select();
    if (data && data[0]) {
      setAnimals(prev => [...prev, data[0]]);
    }
  };

  const updateAnimal = async (id: number, data: Partial<Animal>) => {
    if (!isSupabaseConfigured()) {
      setAnimals(prev => prev.map(a => (a.id === id ? { ...a, ...data } : a)));
      return;
    }
    const { data: dbAn, error } = await supabase.from("matrizes_machos").update(data).eq("id", id).select();
    if (dbAn && dbAn[0]) {
      setAnimals(prev => prev.map(a => (a.id === id ? dbAn[0] : a)));
    }
  };

  const addNinhada = async (ninhada: Omit<Ninhada, "id">) => {
    if (!isSupabaseConfigured()) {
      const newId = ninhadas.length > 0 ? Math.max(...ninhadas.map(n => n.id)) + 1 : 1;
      setNinhadas(prev => [...prev, { id: newId, ...ninhada }]);
      return;
    }
    const { data, error } = await supabase.from("ninhadas").insert(ninhada).select();
    if (data && data[0]) {
      setNinhadas(prev => [...prev, data[0]]);
    }
  };

  const updateNinhada = async (id: number, data: Partial<Ninhada>) => {
    if (!isSupabaseConfigured()) {
      setNinhadas(prev => prev.map(n => (n.id === id ? { ...n, ...data } : n)));
      return;
    }
    const { data: dbN, error } = await supabase.from("ninhadas").update(data).eq("id", id).select();
    if (dbN && dbN[0]) {
      setNinhadas(prev => prev.map(n => (n.id === id ? dbN[0] : n)));
    }
  };

  const addFilhote = async (filhote: Omit<Filhote, "id">) => {
    if (!isSupabaseConfigured()) {
      const newId = filhotes.length > 0 ? Math.max(...filhotes.map(f => f.id)) + 1 : 1;
      setFilhotes(prev => [...prev, { id: newId, ...filhote }]);
      return;
    }
    const { data, error } = await supabase.from("filhotes").insert(filhote).select();
    if (data && data[0]) {
      setFilhotes(prev => [...prev, data[0]]);
    }
  };

  const updateFilhote = async (id: number, data: Partial<Filhote>) => {
    if (!isSupabaseConfigured()) {
      setFilhotes(prev => prev.map(f => (f.id === id ? { ...f, ...data } : f)));
      return;
    }
    const { data: dbF, error } = await supabase.from("filhotes").update(data).eq("id", id).select();
    if (dbF && dbF[0]) {
      setFilhotes(prev => prev.map(f => (f.id === id ? dbF[0] : f)));
    }
  };

  const addService = async (service: Omit<Service, "id">) => {
    if (!isSupabaseConfigured()) {
      const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
      setServices(prev => [...prev, { id: newId, ...service }]);
      return;
    }
    const { data, error } = await supabase.from("services").insert(service).select();
    if (data && data[0]) {
      setServices(prev => [...prev, data[0]]);
    }
  };

  const updateService = async (id: number, service: Partial<Service>) => {
    if (!isSupabaseConfigured()) {
      setServices(prev => prev.map(s => (s.id === id ? { ...s, ...service } : s)));
      return;
    }
    const { data, error } = await supabase.from("services").update(service).eq("id", id).select();
    if (data && data[0]) {
      setServices(prev => prev.map(s => (s.id === id ? data[0] : s)));
    }
  };

  const addAgendaEvent = async (event: Omit<AgendaEvent, "id" | "reminder_sent">) => {
    if (!isSupabaseConfigured()) {
      const newId = agendaEvents.length > 0 ? Math.max(...agendaEvents.map(e => e.id)) + 1 : 1;
      setAgendaEvents(prev => [...prev, { id: newId, ...event, reminder_sent: false }]);
      return;
    }
    const { data, error } = await supabase.from("agenda").insert(event).select();
    if (data && data[0]) {
      setAgendaEvents(prev => [...prev, data[0]]);
    }
  };

  const updateAgendaEventStatus = async (id: number, status: AgendaEvent["status"]) => {
    if (!isSupabaseConfigured()) {
      setAgendaEvents(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));
      return;
    }
    const { data, error } = await supabase.from("agenda").update({ status }).eq("id", id).select();
    if (data && data[0]) {
      setAgendaEvents(prev => prev.map(e => (e.id === id ? data[0] : e)));
    }
  };

  const addHospedagem = async (hospedagem: Omit<Hospedagem, "id">) => {
    if (!isSupabaseConfigured()) {
      const newId = hospedagens.length > 0 ? Math.max(...hospedagens.map(h => h.id)) + 1 : 1;
      setHospedagens(prev => [...prev, { id: newId, ...hospedagem }]);
      
      // Auto register to financial
      addTransaction({
        type: "Entrada",
        category: "Hospedagem",
        amount: hospedagem.total_amount,
        description: `Hospedagem de ${hospedagem.dog_name}`,
        date: new Date().toISOString()
      });
      return;
    }
    const { data, error } = await supabase.from("hospedagens").insert(hospedagem).select();
    if (data && data[0]) {
      setHospedagens(prev => [...prev, data[0]]);
      addTransaction({
        type: "Entrada",
        category: "Hospedagem",
        amount: hospedagem.total_amount,
        description: `Hospedagem de ${hospedagem.dog_name}`,
        date: new Date().toISOString(),
        reference_id: data[0].id
      });
    }
  };

  const updateHospedagemStatus = async (id: number, status: Hospedagem["status"]) => {
    if (!isSupabaseConfigured()) {
      setHospedagens(prev => prev.map(h => (h.id === id ? { ...h, status } : h)));
      return;
    }
    const { data, error } = await supabase.from("hospedagens").update({ status }).eq("id", id).select();
    if (data && data[0]) {
      setHospedagens(prev => prev.map(h => (h.id === id ? data[0] : h)));
    }
  };

  const addAdestramento = async (adestramento: Omit<Adestramento, "id">) => {
    if (!isSupabaseConfigured()) {
      const newId = adestramentos.length > 0 ? Math.max(...adestramentos.map(a => a.id)) + 1 : 1;
      setAdestramentos(prev => [...prev, { id: newId, ...adestramento }]);
      
      addTransaction({
        type: "Entrada",
        category: "Adestramento",
        amount: 1200.00, // custom package price standard
        description: `Plano ${adestramento.plan_name} contratado para ${adestramento.dog_name}`,
        date: new Date().toISOString()
      });
      return;
    }
    const { data, error } = await supabase.from("adestramentos").insert(adestramento).select();
    if (data && data[0]) {
      setAdestramentos(prev => [...prev, data[0]]);
      addTransaction({
        type: "Entrada",
        category: "Adestramento",
        amount: 1200.00,
        description: `Plano ${adestramento.plan_name} contratado para ${adestramento.dog_name}`,
        date: new Date().toISOString(),
        reference_id: data[0].id
      });
    }
  };

  const incrementAdestramentoSession = async (id: number) => {
    const item = adestramentos.find(a => a.id === id);
    if (!item) return;
    const nextCompleted = Math.min(item.sessions_total, item.sessions_completed + 1);
    const nextStatus = nextCompleted === item.sessions_total ? "Concluído" : item.status;

    if (!isSupabaseConfigured()) {
      setAdestramentos(prev => prev.map(a => (a.id === id ? { ...a, sessions_completed: nextCompleted, status: nextStatus } : a)));
      return;
    }
    const { data, error } = await supabase
      .from("adestramentos")
      .update({ sessions_completed: nextCompleted, status: nextStatus })
      .eq("id", id)
      .select();

    if (data && data[0]) {
      setAdestramentos(prev => prev.map(a => (a.id === id ? data[0] : a)));
    }
  };

  const addTransaction = async (entry: Omit<FinancialEntry, "id">) => {
    if (!isSupabaseConfigured()) {
      const newId = financialEntries.length > 0 ? Math.max(...financialEntries.map(f => f.id)) + 1 : 1;
      setFinancialEntries(prev => [{ id: newId, ...entry }, ...prev]);
      return;
    }
    const { data, error } = await supabase.from("financial_entries").insert(entry).select();
    if (data && data[0]) {
      setFinancialEntries(prev => [data[0], ...prev]);
    }
  };

  const addBlogPost = async (post: Omit<BlogPost, "id">) => {
    if (!isSupabaseConfigured()) {
      const newId = blogPosts.length > 0 ? Math.max(...blogPosts.map(b => b.id)) + 1 : 1;
      setBlogPosts(prev => [{ id: newId, ...post }, ...prev]);
      return;
    }
    const { data, error } = await supabase.from("blog_posts").insert(post).select();
    if (data && data[0]) {
      setBlogPosts(prev => [data[0], ...prev]);
    }
  };

  const updateBlogPost = async (id: number, post: Partial<BlogPost>) => {
    if (!isSupabaseConfigured()) {
      setBlogPosts(prev => prev.map(b => (b.id === id ? { ...b, ...post } : b)));
      return;
    }
    const { data, error } = await supabase.from("blog_posts").update(post).eq("id", id).select();
    if (data && data[0]) {
      setBlogPosts(prev => prev.map(b => (b.id === id ? data[0] : b)));
    }
  };

  const updateWhatsappConfig = async (data: Partial<WhatsAppConfig>) => {
    if (!isSupabaseConfigured()) {
      setWhatsappConfig(prev => prev ? { ...prev, ...data } : null);
      return;
    }
    const { data: dbWpp, error } = await supabase.from("whatsapp_config").update(data).eq("id", 1).select();
    if (dbWpp && dbWpp[0]) {
      setWhatsappConfig(dbWpp[0]);
    }
  };

  const markNotificationRead = async (id: number) => {
    if (!isSupabaseConfigured()) {
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
      return;
    }
    const { data, error } = await supabase.from("notifications").update({ read: true }).eq("id", id).select();
    if (data && data[0]) {
      setNotifications(prev => prev.map(n => (n.id === id ? data[0] : n)));
    }
  };

  const refreshAllData = async () => {
    await fetchAllData();
  };

  return (
    <AuraContext.Provider
      value={{
        clients,
        leads,
        animals,
        ninhadas,
        filhotes,
        services,
        agendaEvents,
        hospedagens,
        adestramentos,
        financialEntries,
        blogPosts,
        notifications,
        whatsappConfig,
        activeTheme,
        setActiveTheme,
        activeFont,
        setActiveFont,
        themes: themesConfig,
        addClient,
        updateClient,
        addLead,
        updateLeadStatus,
        updateLeadAutoRespond,
        updateLeadNotes,
        addAnimal,
        updateAnimal,
        addNinhada,
        updateNinhada,
        addFilhote,
        updateFilhote,
        addService,
        updateService,
        addAgendaEvent,
        updateAgendaEventStatus,
        addHospedagem,
        updateHospedagemStatus,
        addAdestramento,
        incrementAdestramentoSession,
        addTransaction,
        addBlogPost,
        updateBlogPost,
        updateWhatsappConfig,
        markNotificationRead,
        refreshAllData
      }}
    >
      {children}
    </AuraContext.Provider>
  );
}

export function useAura() {
  const context = useContext(AuraContext);
  if (context === undefined) {
    throw new Error("useAura deve ser usado dentro de um AuraProvider");
  }
  return context;
}
