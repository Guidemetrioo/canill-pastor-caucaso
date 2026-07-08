import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Load environment variables
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      
      const parts = trimmed.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let val = parts.slice(1).join("=").trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
    console.log("✅ Variáveis de ambiente de .env.local carregadas.");
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Credenciais do Supabase ausentes em .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  console.log("🌱 Iniciando semeadura do banco de dados para Canil Vale da Kubera...");

  // 1. Clean old data from core tables to avoid conflicts
  console.log("🧹 Limpando dados antigos...");
  await supabase.from("filhotes").delete().neq("id", 0);
  await supabase.from("ninhadas").delete().neq("id", 0);
  await supabase.from("matrizes_machos").delete().neq("id", 0);
  await supabase.from("services").delete().neq("id", 0);

  // 2. Insert Matrizes and Padreadores
  console.log("🐕 Inserindo plantel real (Nero, Thara, Symion, Vasilísia, Ozzy, etc.)...");
  const { data: dogs, error: dogsErr } = await supabase.from("matrizes_machos").insert([
    {
      id: 1,
      name: "Symion da Kubera",
      gender: "macho",
      birthdate: "2021-04-12",
      pedigree_url: "#",
      registry: "CBKC-12345",
      status: "disponível",
      breed_price: 3500.00,
      notes: "Importado da Rússia (Canil Baraik Azskaz). Gigante de 100kg com excelente estrutura e guarda implacável.",
      avatar_url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=400"
    },
    {
      id: 2,
      name: "Vasilísia da Kubera",
      gender: "fêmea",
      birthdate: "2022-01-20",
      pedigree_url: "#",
      registry: "CBKC-54321",
      status: "disponível",
      notes: "Importada da Rússia. Fêmea de temperamento explosivo, excelente guardiã e dominante.",
      avatar_url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400"
    },
    {
      id: 3,
      name: "Nero da Kubera",
      gender: "macho",
      birthdate: "2020-08-15",
      pedigree_url: "#",
      registry: "CBKC-22341",
      status: "disponível",
      breed_price: 3500.00,
      notes: "Importado da Ucrânia. Reprodutor de grande porte, temperamento equilibrado e excelente pigmentação.",
      avatar_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400"
    },
    {
      id: 4,
      name: "Thara da Kubera",
      gender: "fêmea",
      birthdate: "2021-11-03",
      pedigree_url: "#",
      registry: "CBKC-22342",
      status: "disponível",
      notes: "Importada da Romênia. Matriz de excelente temperamento de proteção e instinto maternal impecável.",
      avatar_url: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=400"
    },
    {
      id: 5,
      name: "Ozzy da Kubera",
      gender: "macho",
      birthdate: "2022-05-19",
      pedigree_url: "#",
      registry: "CBKC-22343",
      status: "disponível",
      breed_price: 3500.00,
      notes: "Importado da Espanha. Reprodutor jovem de excelente movimentação e estrutura compacta.",
      avatar_url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400"
    },
    {
      id: 6,
      name: "Vênus da Kubera",
      gender: "fêmea",
      birthdate: "2022-09-12",
      pedigree_url: "#",
      registry: "CBKC-22344",
      status: "disponível",
      notes: "Importada da Rússia. Fêmea de altíssima qualidade genética e excelente ossatura.",
      avatar_url: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=400"
    }
  ]).select();

  if (dogsErr) {
    console.error("❌ Erro ao inserir cães:", dogsErr.message);
  } else {
    console.log(`✅ ${dogs.length} cães inseridos com sucesso.`);
  }

  // 3. Insert Litters (Ninhadas)
  console.log("📅 Inserindo ninhadas...");
  const { data: litters, error: littersErr } = await supabase.from("ninhadas").insert([
    {
      id: 1,
      mother_id: 2, // Vasilísia
      father_id: 1, // Symion
      birth_date: "2026-04-15",
      puppy_count_male: 3,
      puppy_count_female: 4,
      status: "Nascida",
      notes: "Excelente ninhada de Vasilísia e Symion. Filhotes fortes com excelente ossatura."
    }
  ]).select();

  if (littersErr) {
    console.error("❌ Erro ao inserir ninhadas:", littersErr.message);
  } else {
    console.log(`✅ ${litters.length} ninhadas inseridas.`);
  }

  // 4. Insert Puppies (Filhotes)
  console.log("🐾 Inserindo filhotes disponíveis...");
  const { data: puppies, error: puppiesErr } = await supabase.from("filhotes").insert([
    {
      id: 1,
      litter_id: 1,
      name: "Buran da Kubera",
      gender: "macho",
      status: "Disponível",
      price: 6000.00,
      notes: "Filhote cinza imponente, ativo e com excelente instinto de atenção.",
      avatar_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400",
      photos: ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400"],
      health_records: [{ type: "vacina", name: "1ª Dose V10", date: "2026-05-30", status: "Aplicado" }],
      weight_history: [{ date: "2026-04-15", weight: 0.8 }, { date: "2026-05-15", weight: 4.2 }]
    },
    {
      id: 2,
      litter_id: 1,
      name: "Aurora da Kubera",
      gender: "fêmea",
      status: "Disponível",
      price: 6500.00,
      notes: "Fêmea cinza carvão, extremamente esperta e ativa no ambiente.",
      avatar_url: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=400",
      photos: ["https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=400"],
      health_records: [{ type: "vacina", name: "1ª Dose V10", date: "2026-05-30", status: "Aplicado" }],
      weight_history: [{ date: "2026-04-15", weight: 0.75 }, { date: "2026-05-15", weight: 3.9 }]
    }
  ]).select();

  if (puppiesErr) {
    console.error("❌ Erro ao inserir filhotes:", puppiesErr.message);
  } else {
    console.log(`✅ ${puppies.length} filhotes inseridos.`);
  }

  // 5. Insert Services
  console.log("🛠️ Inserindo serviços...");
  const { data: services, error: servicesErr } = await supabase.from("services").insert([
    {
      id: 1,
      name: "Serviço de Monta (Symion da Kubera)",
      category: "cobertura",
      price: 3500.00,
      description: "Cobertura artificial ou natural assistida com nosso reprodutor russo Symion."
    },
    {
      id: 2,
      name: "Hospedagem Canina Diária",
      category: "hospedagem",
      price: 80.00,
      description: "Hospedagem em boxes amplos e piquetes individuais de 150m² em Itatiba - SP."
    },
    {
      id: 3,
      name: "Adestramento Avançado para Guarda",
      category: "adestramento",
      price: 1200.00,
      description: "Treino de obediência e guarda territorial para cães de grande porte."
    }
  ]).select();

  if (servicesErr) {
    console.error("❌ Erro ao inserir serviços:", servicesErr.message);
  } else {
    console.log(`✅ ${services.length} serviços inseridos.`);
  }

  // 6. Update WhatsApp Configuration (with Vale da Kubera & Itatiba info)
  console.log("📱 Atualizando configuração do WhatsApp...");
  const { error: configErr } = await supabase.from("whatsapp_config").upsert({
    id: 1,
    status: "disconnected",
    reminder_hours: 24,
    enable_reminders: true,
    enable_confirmations: true,
    enable_responses: true,
    qualification_questions: [
      {
        id: "service_type",
        question: "Olá! Seja bem-vindo ao Canil Vale da Kubera (Pastor do Cáucaso). 🐕\nComo posso ajudar você hoje? Digite o número correspondente:\n\n1️⃣ Informações sobre a raça\n2️⃣ Filhotes\n3️⃣ Nossos cachorros\n4️⃣ Agendar uma visita\n5️⃣ Outras dúvidas / falar com o tutor"
      }
    ],
    message_templates: {
      visita: "Olá, *{nome}*! Passando para lembrar da sua visita agendada ao *Canil Vale da Kubera* amanhã ({data}) às *{hora}h*.\n\n📍 *Endereço:* Itatiba - SP.\n\nConfirmado? Esperamos você! 🐾",
      adestramento: "Olá, *{nome}*! Passando para lembrar da sessão de adestramento do seu cão agendada para amanhã ({data}) às *{hora}h*.\n\nAté logo! 🎓",
      hospedagem: "Olá, *{nome}*! Passando para lembrar do check-in/check-out de hospedagem de seu cão agendado para amanhã ({data}) às *{hora}h*.\n\nTe aguardamos! 🏡",
      confirmacao: "Olá, *{nome}*! Seu agendamento no *Canil Vale da Kubera* foi confirmado com sucesso! 🎉\n\n📅 *Data:* {data}\n⏰ *Horário:* {hora}h\n📝 *Atividade:* {atividade}\n\nTe aguardamos! 🐾"
    }
  }, { onConflict: "id" });

  if (configErr) {
    console.error("❌ Erro ao atualizar whatsapp_config:", configErr.message);
  } else {
    console.log("✅ whatsapp_config atualizada com dados reais da Vale da Kubera.");
  }

  console.log("🎉 Semeadura concluída com sucesso!");
}

runSeed().catch(err => {
  console.error("❌ Ocorreu um erro no script de semente:", err);
  process.exit(1);
});
