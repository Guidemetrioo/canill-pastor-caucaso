import { Message } from "whatsapp-web.js";
import { getSupabase } from "./db";

// State structure for incoming chats in memory
interface ChatSession {
  step: "WELCOME" | "PUPPY_GENDER" | "PUPPY_PURPOSE" | "DOG_EXPERIENCE" | "LEAD_CITY" | "STUD_PEDIGREE" | "CONVERSATIONAL";
  leadId: number;
  answers: {
    service_type?: string;
    puppy_gender?: string;
    puppy_purpose?: string;
    dog_experience?: string;
    lead_city?: string;
    stud_pedigree?: string;
  };
}

const activeSessions = new Map<string, ChatSession>();

async function getOrCreateLead(phone: string, name: string): Promise<any> {
  const cleanPhone = phone.replace(/\D/g, "");
  const supabase = getSupabase();

  try {
    const { data: existingLead, error } = await supabase
      .from("leads")
      .select("*")
      .eq("phone", cleanPhone)
      .maybeSingle();

    if (existingLead) return existingLead;

    const { data: newLead, error: insertError } = await supabase
      .from("leads")
      .insert({
        name,
        phone: cleanPhone,
        status: "Novo",
        origin: "WhatsApp",
        auto_respond: true,
        data_qualificado: {},
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return newLead;
  } catch (err) {
    console.error("Erro ao buscar/criar lead no Supabase:", err);
    return { id: 999, phone: cleanPhone, name, auto_respond: true, status: "Novo" };
  }
}

async function updateLeadData(leadId: number, status: string, dataQualificado: any, step: string) {
  try {
    const supabase = getSupabase();
    await supabase
      .from("leads")
      .update({
        status,
        data_qualificado: dataQualificado,
        current_step: step
      })
      .eq("id", leadId);
  } catch (err) {
    console.error("Erro ao atualizar lead no Supabase:", err);
  }
}

export async function handleIncomingMessage(msg: Message, client: any) {
  const from = msg.from;
  const body = msg.body.trim();
  const cleanPhone = from.split("@")[0];
  const chat = await msg.getChat();
  const contact = await msg.getContact();
  const contactName = chat.name || contact.pushname || contact.name || "Interessado Canil";

  // 1. Get or create lead
  const lead = await getOrCreateLead(cleanPhone, contactName);

  // 2. Check if auto response is disabled for this lead
  if (lead.auto_respond === false) {
    console.log(`ℹ️ [Chatbot] Auto-resposta desativada para o lead ${lead.name} (${cleanPhone}). Ignorando.`);
    return;
  }

  // 3. Setup / restore session state
  let session = activeSessions.get(from);
  if (!session) {
    session = {
      step: (lead.current_step as any) || "WELCOME",
      leadId: lead.id,
      answers: lead.data_qualificado || {},
    };
    activeSessions.set(from, session);
  }

  const resetSession = async (message: string) => {
    session!.step = "WELCOME";
    session!.answers = {};
    activeSessions.set(from, session!);
    await updateLeadData(lead.id, "Novo", {}, "WELCOME");
    await msg.reply(message);
  };

  // Sair/Restart Command
  if (body.toLowerCase() === "sair" || body.toLowerCase() === "cancelar" || body.toLowerCase() === "menu") {
    await resetSession(
      "Atendimento reiniciado. 🐕\nComo posso ajudar você hoje?\n\n1️⃣ Quero comprar um filhote\n2️⃣ Quero contratar serviço de monta/cobertura\n3️⃣ Quero saber sobre hospedagem/creche\n4️⃣ Quero saber sobre adestramento\n5️⃣ Outras dúvidas / falar com o criador"
    );
    return;
  }

  // State Machine
  switch (session.step) {
    case "WELCOME": {
      if (body === "1") {
        session.step = "PUPPY_GENDER";
        session.answers.service_type = "Compra de Filhote";
        activeSessions.set(from, session);
        await updateLeadData(lead.id, "Qualificando", session.answers, "PUPPY_GENDER");
        await msg.reply(
          "Legal! Ficamos felizes com seu interesse em nossos cães. Para te indicar os filhotes ideais, você prefere macho ou fêmea?\n\n1️⃣ Macho\n2️⃣ Fêmea\n3️⃣ Sem preferência"
        );
      } else if (body === "2") {
        session.step = "STUD_PEDIGREE";
        session.answers.service_type = "Serviço de Cobertura";
        activeSessions.set(from, session);
        await updateLeadData(lead.id, "Qualificando", session.answers, "STUD_PEDIGREE");
        await msg.reply(
          "Excelente. Para o serviço de monta/cobertura, sua fêmea possui pedigree CBKC/FCI e exames negativos de displasia?\n\n1️⃣ Sim, possui tudo\n2️⃣ Possui apenas pedigree\n3️⃣ Não possui registro"
        );
      } else if (body === "3") {
        session.step = "CONVERSATIONAL";
        session.answers.service_type = "Hospedagem";
        activeSessions.set(from, session);
        await updateLeadData(lead.id, "Interessado", session.answers, "CONVERSATIONAL");
        await msg.reply(
          "Entendido! Oferecemos hospedagem canina com diárias a R$ 80, piquetes amplos individuais de 150m² e boxes climatizados.\n\nPara agendar uma reserva ou tirar dúvidas sobre vacinas exigidas, responda abaixo ou pergunte livremente."
        );
      } else if (body === "4") {
        session.step = "CONVERSATIONAL";
        session.answers.service_type = "Adestramento";
        activeSessions.set(from, session);
        await updateLeadData(lead.id, "Interessado", session.answers, "CONVERSATIONAL");
        await msg.reply(
          "Legal! Nossos adestradores são especialistas em comportamento de cães de guarda e grande porte.\n\nOferecemos obediência básica urbana, socialização e correção comportamental. Como posso ajudar com os treinos?"
        );
      } else if (body === "5") {
        session.step = "CONVERSATIONAL";
        activeSessions.set(from, session);
        await updateLeadData(lead.id, "Interessado", session.answers, "CONVERSATIONAL");
        await msg.reply(
          "Perfeito! Deixei seu chat sinalizado para o criador assumir. Você pode mandar sua dúvida por aqui que te responderemos em breve!"
        );
      } else {
        await msg.reply(
          `Olá, ${contactName}! Seja bem-vindo ao Canil Aura (Pastor do Cáucaso). 🐕\nComo posso ajudar você hoje? Digite o número correspondente:\n\n1️⃣ Quero comprar um filhote\n2️⃣ Quero contratar serviço de monta/cobertura\n3️⃣ Quero saber sobre hospedagem/creche\n4️⃣ Quero saber sobre adestramento\n5️⃣ Outras dúvidas / falar com o criador`
        );
      }
      break;
    }

    case "PUPPY_GENDER": {
      let gender = "";
      if (body === "1") gender = "Macho";
      else if (body === "2") gender = "Fêmea";
      else if (body === "3") gender = "Sem preferência";
      else {
        await msg.reply("Opção inválida. Digite 1 para Macho, 2 para Fêmea ou 3 para Sem preferência:");
        return;
      }

      session.answers.puppy_gender = gender;
      session.step = "PUPPY_PURPOSE";
      activeSessions.set(from, session);
      await updateLeadData(lead.id, "Qualificando", session.answers, "PUPPY_PURPOSE");
      await msg.reply(
        "Qual será a finalidade principal do cão?\n\n1️⃣ Companhia da família\n2️⃣ Guarda / Proteção de propriedade\n3️⃣ Exposição ou reprodução futura"
      );
      break;
    }

    case "PUPPY_PURPOSE": {
      let purpose = "";
      if (body === "1") purpose = "Companhia";
      else if (body === "2") purpose = "Guarda";
      else if (body === "3") purpose = "Exposição/Reprodução";
      else {
        await msg.reply("Opção inválida. Digite 1 para Companhia, 2 para Guarda ou 3 para Exposição:");
        return;
      }

      session.answers.puppy_purpose = purpose;
      session.step = "DOG_EXPERIENCE";
      activeSessions.set(from, session);
      await updateLeadData(lead.id, "Qualificando", session.answers, "DOG_EXPERIENCE");
      await msg.reply(
        "Você já possui experiência prévia com cães de grande porte ou de guarda?\n\n1️⃣ Sim, já tive cão grande/guarda\n2️⃣ Não, seria meu primeiro cão gigante"
      );
      break;
    }

    case "DOG_EXPERIENCE": {
      let exp = "";
      if (body === "1") exp = "Sim";
      else if (body === "2") exp = "Não";
      else {
        await msg.reply("Opção inválida. Responda 1 para Sim ou 2 para Não:");
        return;
      }

      session.answers.dog_experience = exp;
      session.step = "LEAD_CITY";
      activeSessions.set(from, session);
      await updateLeadData(lead.id, "Qualificando", session.answers, "LEAD_CITY");
      await msg.reply("Por fim, digite a sua cidade e estado para podermos calcular a logística de entrega ou agendar uma visita (ex: São Paulo - SP):");
      break;
    }

    case "LEAD_CITY": {
      if (body.length < 3) {
        await msg.reply("Por favor, digite a sua cidade e estado:");
        return;
      }

      session.answers.lead_city = body;
      session.step = "CONVERSATIONAL";
      activeSessions.set(from, session);
      await updateLeadData(lead.id, "Interessado", session.answers, "CONVERSATIONAL");

      // Notify finalization
      await msg.reply(
        `Obrigado pelas informações! 👍\nVocê foi qualificado com sucesso. Nossos filhotes custam a partir de R$ 6.000,00.\n\nAgora você pode conversar livremente por aqui. Digite perguntas como:\n- "Preços"\n- "Localização do canil"\n- "Filhotes disponíveis"\n- "Agendar visita"`
      );
      break;
    }

    case "STUD_PEDIGREE": {
      let reg = "";
      if (body === "1") reg = "Sim, possui pedigree e exames";
      else if (body === "2") reg = "Possui apenas pedigree";
      else if (body === "3") reg = "Não possui registro";
      else {
        await msg.reply("Opção inválida. Selecione 1, 2 ou 3:");
        return;
      }

      session.answers.stud_pedigree = reg;
      session.step = "CONVERSATIONAL";
      activeSessions.set(from, session);
      await updateLeadData(lead.id, "Interessado", session.answers, "CONVERSATIONAL");

      await msg.reply(
        `Registrado! Nossos padreadores importados da Rússia (como Kahn da Aura) estão disponíveis para monta por R$ 3.500,00.\n\nVocê pode tirar suas dúvidas por aqui enviando qualquer mensagem. Se quiser agendar, basta avisar.`
      );
      break;
    }

    case "CONVERSATIONAL": {
      const query = body.toLowerCase();

      // Conversational responses
      if (query.includes("preço") || query.includes("preco") || query.includes("valor") || query.includes("quanto custa")) {
        await msg.reply(
          "Nossos filhotes de Pastor do Cáucaso têm preços a partir de R$ 6.000,00 (machos) e R$ 6.500,00 (fêmeas), com pedigree CBKC e vacinação inclusa. O serviço de monta custa R$ 3.500,00 e a hospedagem R$ 80/diária."
        );
      } else if (query.includes("localizacao") || query.includes("onde fica") || query.includes("endereço") || query.includes("endereco") || query.includes("cidade")) {
        await msg.reply(
          "Nosso canil fica localizado na Rodovia Raposo Tavares, Km 50, em São Roque - SP. As visitas devem ser agendadas previamente."
        );
      } else if (query.includes("filhote") || query.includes("disponiveis") || query.includes("disponível") || query.includes("ninhada")) {
        try {
          const supabase = getSupabase();
          const { data: filhotes } = await supabase
            .from("filhotes")
            .select("name, price, gender")
            .eq("status", "Disponível");

          if (filhotes && filhotes.length > 0) {
            let reply = "🐾 *Filhotes Disponíveis no Momento:* \n\n";
            filhotes.forEach((f: any) => {
              reply += `• *${f.name}* (${f.gender === "macho" ? "Macho" : "Fêmea"}) - R$ ${f.price.toLocaleString("pt-BR")}\n`;
            });
            reply += "\nSe quiser reservar ou agendar uma visita para vê-los, basta digitar 'Agendar visita'.";
            await msg.reply(reply);
          } else {
            await msg.reply("No momento, não temos filhotes a pronta entrega, mas podemos incluir você na lista de espera para o cio da Sasha previsto para os próximos meses. Deseja entrar na lista?");
          }
        } catch {
          await msg.reply("Temos filhotes machos (Thor) por R$ 6.000,00 e fêmeas (Athena) por R$ 6.500,00 disponíveis no canil. Quer agendar uma visita?");
        }
      } else if (query.includes("visita") || query.includes("agendar") || query.includes("conhecer") || query.includes("visitar")) {
        await msg.reply(
          "Claro! Será um prazer receber você para conhecer nossos cães e filhotes. Nossas visitas são agendadas de Terça a Sábado das 09h às 17h.\n\nQual o melhor dia e horário para você?"
        );
        // Elevate status to negotiation
        await updateLeadData(lead.id, "Em Negociação", session.answers, "CONVERSATIONAL");
      } else if (query.includes("humano") || query.includes("falar com criador") || query.includes("atendente") || query.includes("ajuda")) {
        await msg.reply("Certo, sinalizei ao criador do canil. Ele falará com você diretamente nesta conversa em breve!");
        // Suspend responses
        const supabase = getSupabase();
        await supabase.from("leads").update({ auto_respond: false, status: "Em Negociação" }).eq("id", lead.id);
      } else {
        await msg.reply(
          "Interessante! Não compreendi completamente a pergunta. Se quiser agendar uma visita para ver os cães, saber sobre preços ou falar diretamente com o criador (humano), digite abaixo."
        );
      }
      break;
    }
  }
}
