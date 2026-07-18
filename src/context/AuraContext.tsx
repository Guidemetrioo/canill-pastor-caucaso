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

export interface TrafficEvent {
  id: number;
  event_type: string;
  page_path: string;
  session_id: string;
  device_type: string;
  referrer?: string;
  created_at: string;
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
  trafficEvents: TrafficEvent[];

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
  trackEvent: (eventType: string, pagePath?: string, referrer?: string) => Promise<void>;
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
  const [trafficEvents, setTrafficEvents] = useState<TrafficEvent[]>([]);

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
    setClients([]);

    // 2. Leads
    setLeads([]);

    // 3. Animals (Real plantel of Vale da Kubera without breed prices)
    setAnimals([
      { id: 1, name: "Symion da Kubera", gender: "macho", birthdate: "2020-01-01", pedigree_url: "#", registry: "CBKC-12345", status: "disponível", notes: "Macho de grande estrutura e temperamento exemplar. Reprodutor do plantel Vale da Kubera.", avatar_url: "/dogs/symeon_1.jpg" },
      { id: 2, name: "Nero da Kubera", gender: "macho", birthdate: "2020-08-15", pedigree_url: "#", registry: "CBKC-22341", status: "disponível", notes: "Macho de grande porte com temperamento explosivo e ossatura extremamente robusta.", avatar_url: "/dogs/nero_new_1.jpg" },
      { id: 3, name: "Apolo da Kubera", gender: "macho", birthdate: "2021-03-10", pedigree_url: "#", registry: "CBKC-22344", status: "disponível", notes: "Macho imponente do plantel, com excelente conformação e instinto de guarda apurado.", avatar_url: "/dogs/apolo_1.jpg" },
      { id: 4, name: "Orham da Kubera", gender: "macho", birthdate: "2021-06-20", pedigree_url: "#", registry: "CBKC-22345", status: "disponível", notes: "Macho de linhagem selecionada, estrutura compacta e pelagem densa característica da raça.", avatar_url: "/dogs/orham_1.jpg" },
      { id: 5, name: "Putin da Kubera", gender: "macho", birthdate: "2021-09-05", pedigree_url: "#", registry: "CBKC-22346", status: "disponível", notes: "Macho de temperamento forte e presença imponente. Representante da linhagem de guarda do canil.", avatar_url: "/dogs/putin_1.jpg" },
      { id: 6, name: "Burham Vale da Kubera", gender: "macho", birthdate: "2022-01-15", pedigree_url: "#", registry: "CBKC-22347", status: "disponível", notes: "Macho jovem de excelente potencial, com estrutura sólida e movimento harmônico.", avatar_url: "/dogs/buran_1.jpg" }
    ]);

    // 4. Ninhadas
    setNinhadas([]);

    // 5. Filhotes / Cães do Plantel
    setFilhotes([]);

    // 6. Services (with 0 price)
    setServices([
      { id: 1, name: "Serviço de Monta (Symion da Kubera)", category: "cobertura", price: 0, description: "Serviço de monta com contrato e garantia de gestação." },
      { id: 2, name: "Hospedagem Canina Diária", category: "hospedagem", price: 0, description: "Hospedagem com recreação, alimentação inclusa ou trazida pelo tutor." },
      { id: 3, name: "Pacote de Adestramento Básico", category: "adestramento", price: 0, description: "Treinamento de obediência urbana (10 sessões)." }
    ]);

    // 7. AgendaEvents
    setAgendaEvents([]);

    // 8. Hospedagens
    setHospedagens([]);

    // 9. Adestramentos
    setAdestramentos([]);

    // 10. Financial Entries
    setFinancialEntries([]);

    // 11. Blog Posts
    setBlogPosts([]);

    // 12. WhatsApp Config
    setWhatsappConfig({
      id: 1,
      status: "disconnected",
      phone: "+5511974992059",
      reminder_hours: 24,
      enable_reminders: true,
      enable_confirmations: true,
      enable_responses: true,
      qualification_questions: [
        { id: "service_type", question: "Olá! Como posso ajudar você hoje?" }
      ],
      message_templates: {
        visita: "Olá, *{nome}*! Passando para lembrar da sua visita agendada ao *Canil Vale da Kubera* amanhã ({data}) às *{hora}h*.\n\n*Endereço:* Itatiba - SP.\n\nConfirmado? Esperamos você!",
        adestramento: "Olá, *{nome}*! Passando para lembrar da sessão de adestramento do seu cão agendada para amanhã ({data}) às *{hora}h*.\n\nAté logo!",
        hospedagem: "Olá, *{nome}*! Passando para lembrar do check-in/check-out de hospedagem de seu cão agendado para amanhã ({data}) às *{hora}h*.\n\nTe aguardamos!",
        confirmacao: "Olá, *{nome}*! Seu agendamento no *Canil Vale da Kubera* foi confirmado com sucesso!\n\n*Data:* {data}\n*Horário:* {hora}h\n*Atividade:* {atividade}\n\nTe aguardamos!"
      }
    });

    setNotifications([]);
  };

  const generateMockTraffic = () => {
    setTrafficEvents([]);
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

      const { data: dbTraffic, error: trafficErr } = await supabase.from("traffic_events").select("*").order("created_at", { ascending: false });
      if (dbTraffic && dbTraffic.length > 0) {
        setTrafficEvents(dbTraffic);
      } else {
        generateMockTraffic();
      }

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

  const trackEvent = async (eventType: string, pagePath?: string, referrer?: string) => {
    let sessionId = "";
    if (typeof window !== "undefined") {
      sessionId = localStorage.getItem("aura_session_id") || "";
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("aura_session_id", sessionId);
      }
    }
    
    let deviceType = "desktop";
    if (typeof window !== "undefined" && window.navigator) {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes("mobi") || ua.includes("android") || ua.includes("iphone")) {
        deviceType = "mobile";
      } else if (ua.includes("tablet") || ua.includes("ipad")) {
        deviceType = "tablet";
      }
    }

    const pathVal = pagePath || (typeof window !== "undefined" ? window.location.pathname : "/");
    const refVal = referrer || (typeof document !== "undefined" ? document.referrer : "direct") || "direct";

    if (!isSupabaseConfigured()) {
      console.log(`[Traffic Mock] Tracked ${eventType} on ${pathVal}`);
      const mockEvent: TrafficEvent = {
        id: trafficEvents.length > 0 ? Math.max(...trafficEvents.map(e => e.id)) + 1 : 1,
        event_type: eventType,
        page_path: pathVal,
        session_id: sessionId,
        device_type: deviceType,
        referrer: refVal,
        created_at: new Date().toISOString()
      };
      setTrafficEvents(prev => [mockEvent, ...prev]);
      return;
    }

    try {
      const { data, error } = await supabase.from("traffic_events").insert({
        event_type: eventType,
        page_path: pathVal,
        session_id: sessionId,
        device_type: deviceType,
        referrer: refVal
      }).select();
      
      if (data && data[0]) {
        setTrafficEvents(prev => [data[0], ...prev]);
      }
    } catch (err) {
      console.error("Error tracking event in Supabase:", err);
    }
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
        refreshAllData,
        trafficEvents,
        trackEvent
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
