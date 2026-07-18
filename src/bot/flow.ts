import { Message } from "whatsapp-web.js";
import { getSupabase } from "./db";

// State structure for incoming chats in memory
interface ChatSession {
  step: "WELCOME" | "VISIT_DATE" | "VISIT_TIME" | "CONVERSATIONAL";
  leadId: number;
  answers: {
    service_type?: string;
    puppy_gender?: string;
    puppy_purpose?: string;
    dog_experience?: string;
    lead_city?: string;
    stud_pedigree?: string;
    visit_date?: string;
    visit_time?: string;
  };
}

const activeSessions = new Map<string, ChatSession>();

// Parse natural language date & time strings into a valid JavaScript Date object
function parseDateTime(dateStr: string, timeStr: string): Date {
  const now = new Date();
  let targetYear = now.getFullYear();
  let targetMonth = now.getMonth();
  let targetDay = now.getDate();
  let targetHour = 14;
  let targetMin = 0;

  // 1. Parse timeStr (e.g. "14:00", "14h", "10:30")
  const timeMatch = timeStr.match(/(\d{1,2})[h:]?(\d{2})?/i);
  if (timeMatch) {
    targetHour = parseInt(timeMatch[1]);
    if (timeMatch[2]) {
      targetMin = parseInt(timeMatch[2]);
    }
  }

  // 2. Parse dateStr (e.g. "23/06", "23/06/2026", "sabado", "sábado")
  const dateParts = dateStr.match(/(\d{1,2})\/(\d{1,2})\/?(\d{4})?/);
  if (dateParts) {
    targetDay = parseInt(dateParts[1]);
    targetMonth = parseInt(dateParts[2]) - 1; // 0-indexed month
    if (dateParts[3]) {
      targetYear = parseInt(dateParts[3]);
    }
  } else {
    // Check for day of the week strings
    const weekdayMap: { [key: string]: number } = {
      domingo: 0, dom: 0,
      segunda: 1, seg: 1,
      terca: 2, ter: 2, terça: 2,
      quarta: 3, qua: 3,
      quinta: 4, qui: 4,
      sexta: 5, sex: 5,
      sabado: 6, sab: 6, sábado: 6
    };
    
    const cleanDate = dateStr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let targetDayOfWeek = -1;
    for (const key in weekdayMap) {
      if (cleanDate.includes(key)) {
        targetDayOfWeek = weekdayMap[key];
        break;
      }
    }

    if (targetDayOfWeek !== -1) {
      const currentDayOfWeek = now.getDay();
      let daysToAdd = targetDayOfWeek - currentDayOfWeek;
      if (daysToAdd <= 0) {
        daysToAdd += 7; // next week
      }
      const futureDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      targetDay = futureDate.getDate();
      targetMonth = futureDate.getMonth();
      targetYear = futureDate.getFullYear();
    }
  }

  return new Date(targetYear, targetMonth, targetDay, targetHour, targetMin);
}

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
  let contactName = "Interessado Canil";
  try {
    const chat = await msg.getChat();
    if (chat && chat.name) contactName = chat.name;
  } catch (chatErr: any) {
    console.warn("⚠️ [Chatbot Flow] Falha ao obter chat (getChat):", chatErr.message || chatErr);
  }

  try {
    const contact = await msg.getContact();
    if (contact && contactName === "Interessado Canil") {
      contactName = contact.pushname || contact.name || "Interessado Canil";
    }
  } catch (contactErr: any) {
    console.warn("⚠️ [Chatbot Flow] Falha ao obter contato (getContact):", contactErr.message || contactErr);
  }

  const supabase = getSupabase();

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
    let stepFromDb: any = lead.current_step;
    const validSteps = ["WELCOME", "VISIT_DATE", "VISIT_TIME", "CONVERSATIONAL"];
    if (!validSteps.includes(stepFromDb)) {
      stepFromDb = "WELCOME";
    }
    session = {
      step: stepFromDb || "WELCOME",
      leadId: lead.id,
      answers: lead.data_qualificado || {},
    };
    activeSessions.set(from, session);
  }

  // Fetch dynamic welcome menu from database if configured
  let welcomeText = `Olá, ${contactName}! Seja bem-vindo ao Canil Vale da Kubera (Pastor do Cáucaso). 🐕\nComo posso ajudar você hoje? Digite o número correspondente:\n\n1️⃣ Informações sobre a raça\n2️⃣ Filhotes\n3️⃣ Nossos cachorros\n4️⃣ Agendar uma visita\n5️⃣ Outras dúvidas / falar com o tutor`;

  try {
    const { data: config } = await supabase
      .from("whatsapp_config")
      .select("qualification_questions")
      .eq("id", 1)
      .maybeSingle();
    if (config && Array.isArray(config.qualification_questions)) {
      const welcomeQ = config.qualification_questions.find((item: any) => item.id === "service_type");
      if (welcomeQ) welcomeText = welcomeQ.question;
    }
  } catch (err) {
    console.error("Erro ao buscar qualification_questions de whatsapp_config:", err);
  }

  const resetSession = async (message: string) => {
    session!.step = "WELCOME";
    session!.answers = {};
    activeSessions.set(from, session!);
    await updateLeadData(lead.id, "Novo", {}, "WELCOME");
    await msg.reply(message);
  };

  // Cancel/Restart Commands
  if (body.toLowerCase() === "sair" || body.toLowerCase() === "cancelar" || body.toLowerCase() === "menu") {
    await resetSession(welcomeText);
    return;
  }

  // State Machine
  switch (session.step) {
    case "WELCOME": {
      if (body === "1") {
        const breedText = `a raça Pastor do Cáucaso é uma raça primitiva, originalmente dos montes do Caucaso que abrange o sul da Rússia, Armênia, Azerbaijão, Geórgia e Turquia. Por fazerem parte do grupo molosso, junto com os mastins, Fila brasileiro e etc, possuem um porte gigante. São cães de trabalho, para segurança, por possuir características de dominância e territorialidade extrema, não se assustam com barulhos altos, e dificilmente latem, apenas quando veem algo fora do normal.

Introduzidos na federação da cinofilia internacional em 1920, porém há relatos de cães que fizeram parte da criação da raça antes de Cristo. Os czares da Rússia utilizavam muito esta raça para guarda de prisões, um costume na qual continua até hoje. Fizeram a defesa do muro de Berlim por muitos anos, após sua queda ficaram sem utilização então as famílias da Alemanha adotaram-os.

O pastor do Cáucaso é uma raça de trabalho, para guarda. Possui um temperamento forte e uma grande dominância em seu espaço e próximo a sua família. É necessário a implementação na vida do filhote desde cedo com aqueles que serão de seu convívio, como familiares, empregados ou outros animais, pois depois de adulto, não tolerará nenhum desconhecido em seu território! Não distingue entre idade, sexo ou cor, apenas quem é de sua família e quem não é.

Com os donos e aqueles que acompanharam o crescimento do cão, ele será extremamente fiel e companheiro, amam a presença de seus donos. Não são cães que gostam de brincar com bolinhas e brinquedos, gostam de caminhar e explorar territórios, depois tendem a descansar próximo ao seu dono.

Essa raça possui um subpelo que regula a temperatura corporal, o protegendo tanto do frio, quanto do calor. Possui uma cana nasal e boca larga, o que facilita ainda mais a regulação. Isso não reduz a importância de prover ao cão um local arejado fora do sol com água fresca a vontade. Por estes motivos não é recomendável raspar o pelo do cão em épocas mais quentes, pois isso só atrapharia sua regulação da temperatura corporal.`;
        
        await msg.reply(breedText);
      } 
      else if (body === "2") {
        const filhotesText = `No momento não temos filhotes disponíveis, porém temos uma ninhada prevista para Novembro. Caso queira conhecer nossos cães adultos e matrizes, digite *3* ou selecione a opção correspondente.`;
        
        await msg.reply(filhotesText);
      } 
      else if (body === "3") {
        try {
          const { data: dogs } = await supabase
            .from("matrizes_machos")
            .select("name, gender")
            .eq("status", "disponível");

          let dogsText = "🐾 *Nossos Cães Adultos e Matrizes:* \n\n";
          if (dogs && dogs.length > 0) {
            dogs.forEach((d: any) => {
              dogsText += `• *${d.name}* (${d.gender === "macho" ? "Macho" : "Fêmea"})\n`;
            });
            dogsText += "\n";
          } else {
            dogsText += "• Symion da Kubera (Macho)\n• Vasilísia da Kubera (Fêmea)\n• Nero da Kubera (Macho)\n• Thara da Kubera (Fêmea)\n\n";
          }
          dogsText += `Você também pode ver fotos e detalhes da nossa criação na página de filhotes do nosso site:\nhttps://canill-vale-da-kureba-mc8fse3vm-h2wnjznr7j-8776s-projects.vercel.app/filhotes`;
          await msg.reply(dogsText);
        } catch (err) {
          await msg.reply(
            `🐾 *Nossos Cães Adultos e Matrizes:* \n• Symion da Kubera (Macho)\n• Vasilísia da Kubera (Fêmea)\n• Nero da Kubera (Macho)\n• Thara da Kubera (Fêmea)\n\nConheça mais e veja fotos no nosso site: https://canill-vale-da-kureba-mc8fse3vm-h2wnjznr7j-8776s-projects.vercel.app/filhotes`
          );
        }
      } 
      else if (body === "4") {
        const visitaText = `Claro! Será um prazer receber você para conhecer nossos cães e filhotes. Nossas visitas ocorrem todos os dias, das 08h às 10h30 (apenas 1 visita por dia, sob agendamento prévio).\n\nPor favor, digite a *data* desejada para a sua visita (Ex: *23/06* ou *Sábado*):`;
        
        session.step = "VISIT_DATE";
        activeSessions.set(from, session);
        await updateLeadData(lead.id, "Em Negociação", session.answers, "VISIT_DATE");
        await msg.reply(visitaText);
      } 
      else if (body === "5") {
        const tutorText = `Certo! Sinalizei ao criador/tutor do canil. Ele está a sua espera e responderá diretamente nesta conversa em breve! 🐕`;
        
        session.step = "CONVERSATIONAL";
        activeSessions.set(from, session);
        // Disable auto_respond for this lead
        await supabase
          .from("leads")
          .update({ auto_respond: false, status: "Em Negociação", current_step: "CONVERSATIONAL" })
          .eq("id", lead.id);
          
        await msg.reply(tutorText);
      } 
      else {
        const query = body.toLowerCase();
        if (query.includes("preço") || query.includes("preco") || query.includes("valor") || query.includes("quanto custa")) {
          await msg.reply(
            "Para informações sobre valores dos nossos cães, serviços de monta e hospedagem, fale diretamente com o criador. O atendimento é personalizado."
          );
        } else if (query.includes("localizacao") || query.includes("onde fica") || query.includes("endereço") || query.includes("endereco") || query.includes("cidade")) {
          await msg.reply(
            "Nosso canil fica localizado em Itatiba - SP. As visitas devem ser agendadas previamente."
          );
        } else if (query.includes("filhote") || query.includes("disponiveis") || query.includes("disponível") || query.includes("ninhada")) {
          await msg.reply("No momento não temos filhotes disponíveis, porém temos uma ninhada prevista para Novembro. Caso queira conhecer nossos cães adultos e matrizes, digite *3*.");
        } else if (query.includes("visita") || query.includes("agendar") || query.includes("conhecer") || query.includes("visitar")) {
          await msg.reply(
            "Nossas visitas ocorrem todos os dias das 08h às 10h30. Por favor, nos informe qual o melhor dia e horário para você agendar!"
          );
        } else {
          await msg.reply(welcomeText);
        }
      }
      break;
    }

    case "VISIT_DATE": {
      session.answers.visit_date = body;
      
      // Parse the date to find the target day
      const targetDate = parseDateTime(body, "12:00");
      
      // Default slots: Every day, 08h to 10:30
      let availableSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30"];
      
      try {
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch booked events on that date
        const { data: booked } = await supabase
          .from("agenda")
          .select("datetime")
          .gte("datetime", startOfDay.toISOString())
          .lte("datetime", endOfDay.toISOString())
          .neq("status", "Cancelado");

        if (booked && booked.length > 0) {
          // If there is already a visit scheduled for this day, block the whole day (1 visit per day limit)
          availableSlots = [];
        }
      } catch (err) {
        console.error("Erro ao buscar horários ocupados no banco:", err);
      }

      if (availableSlots.length === 0) {
        await msg.reply("Desculpe, todos os horários de visita para este dia já estão preenchidos. Por favor, informe outra data:");
        return;
      }

      session.step = "VISIT_TIME";
      activeSessions.set(from, session);
      await updateLeadData(lead.id, "Em Negociação", session.answers, "VISIT_TIME");

      const formattedSlots = availableSlots.map(s => `• *${s}*`).join("\n");
      await msg.reply(`Perfeito! Para o dia solicitado, temos estes horários disponíveis:\n\n${formattedSlots}\n\nPor favor, digite o horário desejado (Ex: *14:00*):`);
      break;
    }

    case "VISIT_TIME": {
      session.answers.visit_time = body;
      const visitDateStr = session.answers.visit_date || "";
      const visitTimeStr = body;
      
      const parsedDate = parseDateTime(visitDateStr, visitTimeStr);
      
      // Save appointment in public.agenda table
      try {
        await supabase.from("agenda").insert({
          type: "visita",
          title: `Visita de ${contactName}`,
          description: `Agendado via WhatsApp. Contato: ${cleanPhone}`,
          datetime: parsedDate.toISOString(),
          lead_id: lead.id,
          status: "Agendado"
        });
      } catch (err) {
        console.error("Erro ao registrar agendamento no Supabase:", err);
      }

      // Update lead to Visita Agendada
      await updateLeadData(lead.id, "Visita Agendada", session.answers, "CONVERSATIONAL");
      session.step = "CONVERSATIONAL";
      activeSessions.set(from, session);

      // Fetch message template from config
      let confirmationText = `Olá, *{nome}*! Seu agendamento no *Canil Vale da Kubera* foi confirmado com sucesso! 🎉\n\n📅 *Data:* {data}\n⏰ *Horário:* {hora}h\n📝 *Atividade:* {atividade}\n\nTe aguardamos! 🐾`;
      try {
        const { data: config } = await supabase
          .from("whatsapp_config")
          .select("message_templates")
          .eq("id", 1)
          .maybeSingle();
        if (config && config.message_templates && config.message_templates.confirmacao) {
          confirmationText = config.message_templates.confirmacao;
        }
      } catch (err) {
        console.error("Erro ao carregar template de confirmacao:", err);
      }

      const finalMsg = confirmationText
        .replace(/{nome}/g, contactName)
        .replace(/{data}/g, visitDateStr)
        .replace(/{hora}/g, visitTimeStr)
        .replace(/{atividade}/g, "Visita Técnica ao Canil");

      await msg.reply(finalMsg);
      break;
    }

    case "CONVERSATIONAL": {
      const query = body.toLowerCase();
      
      if (query === "menu" || query === "sair" || query === "cancelar") {
        await resetSession(welcomeText);
        return;
      }

      if (query.includes("preço") || query.includes("preco") || query.includes("valor") || query.includes("quanto custa")) {
        await msg.reply(
          "Para informações sobre valores dos nossos cães, serviços de monta e hospedagem, fale diretamente com o criador. O atendimento é personalizado."
        );
      } else if (query.includes("localizacao") || query.includes("onde fica") || query.includes("endereço") || query.includes("endereco") || query.includes("cidade")) {
        await msg.reply(
          "Nosso canil fica localizado em Itatiba - SP. As visitas devem ser agendadas previamente."
        );
      } else if (query.includes("filhote") || query.includes("disponiveis") || query.includes("disponível") || query.includes("ninhada")) {
        await msg.reply("No momento não temos filhotes disponíveis, porém temos uma ninhada prevista para Novembro. Caso queira conhecer nossos cães adultos e matrizes, digite *3*.");
      } else if (query.includes("visita") || query.includes("agendar") || query.includes("conhecer") || query.includes("visitar")) {
        await msg.reply(
          "Nossas visitas ocorrem de Terça a Sábado das 09h às 17h. Por favor, nos informe qual o melhor dia e horário para você agendar!"
        );
      } else {
        await msg.reply("Entendido! Anotei a sua mensagem e o tutor do canil entrará em contato com você em breve por aqui. Se quiser voltar ao menu de opções principal, digite *menu*.");
      }
      break;
    }
  }
}
