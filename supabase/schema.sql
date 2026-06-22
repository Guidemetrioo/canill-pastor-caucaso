-- Drop tables to rewrite them clean
DROP TABLE IF EXISTS public.whatsapp_messages CASCADE;
DROP TABLE IF EXISTS public.whatsapp_config CASCADE;
DROP TABLE IF EXISTS public.financial_entries CASCADE;
DROP TABLE IF EXISTS public.adestramentos CASCADE;
DROP TABLE IF EXISTS public.hospedagens CASCADE;
DROP TABLE IF EXISTS public.agenda CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.filhotes CASCADE;
DROP TABLE IF EXISTS public.ninhadas CASCADE;
DROP TABLE IF EXISTS public.matrizes_machos CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  role text not null check (role in ('admin', 'colaborador')) default 'colaborador',
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profiles." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Handle new user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, avatar_url)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'colaborador'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql security definer;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT DEFAULT 'Não especificado',
  notes TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.clients FOR DELETE USING (true);


-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  status TEXT CHECK (status in ('Novo', 'Qualificando', 'Interessado', 'Visita Agendada', 'Em Negociação', 'Vendido', 'Perdido')) DEFAULT 'Novo',
  origin TEXT DEFAULT 'WhatsApp',
  data_qualificado JSONB DEFAULT '{}'::jsonb,
  current_step TEXT DEFAULT 'MENU',
  auto_respond BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}'::text[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.leads FOR DELETE USING (true);


-- Matrizes e Machos table
CREATE TABLE IF NOT EXISTS public.matrizes_machos (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT CHECK (gender in ('macho', 'fêmea')) NOT NULL,
  birthdate DATE,
  pedigree_url TEXT,
  registry TEXT,
  status TEXT CHECK (status in ('disponível', 'em_repouso', 'inativo')) DEFAULT 'disponível',
  breed_price NUMERIC DEFAULT 0,
  avatar_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.matrizes_machos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.matrizes_machos FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON public.matrizes_machos FOR ALL USING (true);


-- Ninhadas table
CREATE TABLE IF NOT EXISTS public.ninhadas (
  id SERIAL PRIMARY KEY,
  mother_id INT REFERENCES public.matrizes_machos(id) ON DELETE SET NULL,
  father_id INT REFERENCES public.matrizes_machos(id) ON DELETE SET NULL,
  birth_date DATE,
  puppy_count_male INT DEFAULT 0,
  puppy_count_female INT DEFAULT 0,
  status TEXT CHECK (status in ('Planejada', 'Nascida', 'Desmamada')) DEFAULT 'Planejada',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ninhadas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.ninhadas FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON public.ninhadas FOR ALL USING (true);


-- Filhotes table
CREATE TABLE IF NOT EXISTS public.filhotes (
  id SERIAL PRIMARY KEY,
  litter_id INT REFERENCES public.ninhadas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT CHECK (gender in ('macho', 'fêmea')) NOT NULL,
  status TEXT CHECK (status in ('Disponível', 'Reservado', 'Vendido', 'Canil')) DEFAULT 'Disponível',
  price NUMERIC NOT NULL,
  health_records JSONB DEFAULT '[]'::jsonb,
  weight_history JSONB DEFAULT '[]'::jsonb,
  avatar_url TEXT,
  photos TEXT[] DEFAULT '{}'::text[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.filhotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.filhotes FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON public.filhotes FOR ALL USING (true);


-- Services table
CREATE TABLE IF NOT EXISTS public.services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT CHECK (category in ('cobertura', 'adestramento', 'hospedagem')) NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON public.services FOR ALL USING (true);


-- Agenda table
CREATE TABLE IF NOT EXISTS public.agenda (
  id SERIAL PRIMARY KEY,
  type TEXT CHECK (type in ('visita', 'cobertura', 'adestramento', 'hospedagem', 'vacina', 'vermifugacao')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  lead_id INT REFERENCES public.leads(id) ON DELETE CASCADE,
  client_id INT REFERENCES public.clients(id) ON DELETE CASCADE,
  assigned_to TEXT,
  status TEXT CHECK (status in ('Agendado', 'Confirmado', 'Concluído', 'Cancelado')) DEFAULT 'Agendado',
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.agenda FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON public.agenda FOR ALL USING (true);


-- Hospedagens table
CREATE TABLE IF NOT EXISTS public.hospedagens (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES public.clients(id) ON DELETE CASCADE,
  dog_name TEXT NOT NULL,
  entry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  exit_date TIMESTAMP WITH TIME ZONE NOT NULL,
  daily_rate NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT CHECK (status in ('Reservado', 'Hospedado', 'Finalizado')) DEFAULT 'Reservado',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.hospedagens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.hospedagens FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON public.hospedagens FOR ALL USING (true);


-- Adestramentos table
CREATE TABLE IF NOT EXISTS public.adestramentos (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES public.clients(id) ON DELETE CASCADE,
  dog_name TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  sessions_total INT NOT NULL,
  sessions_completed INT DEFAULT 0,
  status TEXT CHECK (status in ('Ativo', 'Concluído', 'Pausado')) DEFAULT 'Ativo',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.adestramentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.adestramentos FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON public.adestramentos FOR ALL USING (true);


-- Financial Entries table
CREATE TABLE IF NOT EXISTS public.financial_entries (
  id SERIAL PRIMARY KEY,
  type TEXT CHECK (type in ('Entrada', 'Saída')) NOT NULL,
  category TEXT CHECK (category in ('Venda Filhote', 'Cobertura', 'Hospedagem', 'Adestramento', 'Ração', 'Veterinário', 'Vacinas', 'Manutenção', 'Marketing', 'Outro')) NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_method TEXT CHECK (payment_method in ('Dinheiro', 'Pix', 'Crédito', 'Débito')),
  reference_id INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.financial_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.financial_entries FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON public.financial_entries FOR ALL USING (true);


-- Blog Posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}'::text[],
  excerpt TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON public.blog_posts FOR ALL USING (true);


-- WhatsApp Config table
CREATE TABLE IF NOT EXISTS public.whatsapp_config (
  id INT PRIMARY KEY DEFAULT 1,
  status TEXT DEFAULT 'disconnected',
  qr_code TEXT,
  phone TEXT,
  reminder_hours INT DEFAULT 24,
  enable_reminders BOOLEAN DEFAULT true,
  enable_confirmations BOOLEAN DEFAULT true,
  enable_responses BOOLEAN DEFAULT true,
  qualification_questions JSONB DEFAULT '[]'::jsonb,
  message_templates JSONB DEFAULT '{
    "visita": "Olá, *{nome}*! Passando para lembrar da sua visita agendada ao *Canil Vale da Kubera* amanhã ({data}) às *{hora}h*.\n\n📍 *Endereço:* Itatiba - SP.\n\nConfirmado? Esperamos você! 🐾",
    "adestramento": "Olá, *{nome}*! Passando para lembrar da sessão de adestramento do seu cão agendada para amanhã ({data}) às *{hora}h*.\n\nAté logo! 🎓",
    "hospedagem": "Olá, *{nome}*! Passando para lembrar do check-in/check-out de hospedagem de seu cão agendado para amanhã ({data}) às *{hora}h*.\n\nTe aguardamos! 🏡",
    "confirmacao": "Olá, *{nome}*! Seu agendamento no *Canil Vale da Kubera* foi confirmado com sucesso! 🎉\n\n📅 *Data:* {data}\n⏰ *Horário:* {hora}h\n📝 *Atividade:* {atividade}\n\nTe aguardamos! 🐾"
  }'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.whatsapp_config FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON public.whatsapp_config FOR ALL USING (true);

-- Populate initial configuration row
INSERT INTO public.whatsapp_config (id, status, reminder_hours, enable_reminders, enable_confirmations, enable_responses, qualification_questions, message_templates)
VALUES (1, 'disconnected', 24, true, true, true, '[
  {"id": "service_type", "question": "Olá! Seja bem-vindo ao Canil Vale da Kubera. Como podemos te ajudar hoje?\\n\\n1️⃣ Venda de Filhotes\\n2️⃣ Serviço de Cobertura / Monta\\n3️⃣ Hospedagem / Hotel Canino\\n4️⃣ Adestramento\\n5️⃣ Falar com o Criador (Rafael Avellar)"},
  {"id": "puppy_gender", "question": "Ótima escolha! Para ajudar você a encontrar o filhote ideal, qual gênero você prefere?\\n\\n1️⃣ Macho\\n2️⃣ Fêmea\\n3️⃣ Sem preferência"},
  {"id": "puppy_purpose", "question": "E qual será a principal finalidade do cão?\\n\\n1️⃣ Guarda Patrimonial\\n2️⃣ Companhia Familiar\\n3️⃣ Exposição ou Reprodução futura"},
  {"id": "dog_experience", "question": "Perfeito. Você já possui experiência prévia com cães de grande porte ou de guarda?\\n\\n1️⃣ Sim\\n2️⃣ Não"},
  {"id": "lead_city", "question": "Por fim, nos informe sua cidade e estado para que possamos calcular as condições de entrega ou agendar uma visita:"}
]'::jsonb, '{
  "visita": "Olá, *{nome}*! Passando para lembrar da sua visita agendada ao *Canil Vale da Kubera* amanhã ({data}) às *{hora}h*.\n\n📍 *Endereço:* Itatiba - SP.\n\nConfirmado? Esperamos você! 🐾",
  "adestramento": "Olá, *{nome}*! Passando para lembrar da sessão de adestramento do seu cão agendada para amanhã ({data}) às *{hora}h*.\n\nAté logo! 🎓",
  "hospedagem": "Olá, *{nome}*! Passando para lembrar do check-in/check-out de hospedagem de seu cão agendado para amanhã ({data}) às *{hora}h*.\n\nTe aguardamos! 🏡",
  "confirmacao": "Olá, *{nome}*! Seu agendamento no *Canil Vale da Kubera* foi confirmado com sucesso! 🎉\n\n📅 *Data:* {data}\n⏰ *Horário:* {hora}h\n📝 *Atividade:* {atividade}\n\nTe aguardamos! 🐾"
}'::jsonb)
ON CONFLICT (id) DO NOTHING;


-- WhatsApp Messages (Chat History)
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id SERIAL PRIMARY KEY,
  chat_jid TEXT NOT NULL,
  contact_name TEXT,
  body TEXT NOT NULL,
  from_me BOOLEAN DEFAULT false,
  status TEXT CHECK (status in ('pending', 'sent', 'failed', 'received')) DEFAULT 'received',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.whatsapp_messages FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON public.whatsapp_messages FOR ALL USING (true);
