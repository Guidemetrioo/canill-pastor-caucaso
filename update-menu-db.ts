import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

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
  }
}

loadEnv();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const newQuestions = [
    {
      id: "service_type",
      question: "Olá! Seja bem-vindo ao Canil Vale da Kubera (Pastor do Cáucaso). 🐕\nComo posso ajudar você hoje? Digite o número correspondente:\n\n1️⃣ Informações sobre a raça\n2️⃣ Filhotes\n3️⃣ Nossos cachorros\n4️⃣ Agendar uma visita\n5️⃣ Outras dúvidas / falar com o tutor"
    }
  ];

  const { error } = await supabase
    .from("whatsapp_config")
    .update({ qualification_questions: newQuestions })
    .eq("id", 1);

  if (error) {
    console.error("❌ Erro ao atualizar no Supabase:", error);
  } else {
    console.log("✅ Sucesso! Perguntas de qualificação atualizadas no Supabase.");
  }
}

run();
