import { getSupabase } from "./db";
import { Client as WhatsAppClient } from "whatsapp-web.js";

// Helper to format clean phone to whatsapp format resolving the Brazilian 9th digit JID issues
async function getWhatsappJid(client: WhatsAppClient, phone: string): Promise<string> {
  let clean = phone.replace(/\D/g, "");
  // Add Brazilian country code 55 if not present
  if (clean.length === 11 && !clean.startsWith("55")) {
    clean = "55" + clean;
  }
  
  try {
    const numberId = await client.getNumberId(clean);
    if (numberId) {
      return numberId._serialized;
    }
  } catch (err) {
    console.warn(`[WhatsApp] Erro ao buscar ID do número ${clean} no WhatsApp, usando formato padrão.`, err);
  }

  // Fallback to standard formatting
  if (!clean.endsWith("@c.us")) {
    clean = clean + "@c.us";
  }
  return clean;
}

// Helper to get local time of a specific timezone represented as a UTC Date object
function getLocalAsUtc(date: Date, timeZone: string): Date {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23"
  });
  
  const parts = formatter.formatToParts(date);
  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = parseInt(part.value, 10);
    }
  }
  
  return new Date(Date.UTC(map.year, map.month - 1, map.day, map.hour, map.minute, map.second));
}

export async function checkAndSendReminders(client: WhatsAppClient) {
  console.log("⏰ [Lembrete] Verificando atividades da agenda no banco de dados...");
  
  try {
    const supabase = getSupabase();
    if (!supabase) return;
    
    // Fetch WhatsApp config dynamically from Supabase
    let reminderHours = 24;
    let enableReminders = true;
    
    try {
      const { data: config, error: configErr } = await supabase
        .from("whatsapp_config")
        .select("enable_reminders, reminder_hours")
        .eq("id", 1)
        .maybeSingle();
        
      if (!configErr && config) {
        enableReminders = config.enable_reminders !== false;
        reminderHours = config.reminder_hours ?? 24;
      }
    } catch (dbErr) {
      // Fallback
    }

    if (!enableReminders) {
      console.log("ℹ️ [Lembrete] Lembretes automáticos desativados nas configurações.");
      return;
    }
    
    const now = getLocalAsUtc(new Date(), "America/Sao_Paulo");
    
    // Check events scheduled around reminderHours from now (+/- 15 minutes window)
    const minTime = new Date(now.getTime() + (reminderHours * 60 - 15) * 60 * 1000).toISOString();
    const maxTime = new Date(now.getTime() + (reminderHours * 60 + 15) * 60 * 1000).toISOString();
    
    const { data: agendaEvents, error } = await supabase
      .from("agenda")
      .select("*")
      .gte("datetime", minTime)
      .lte("datetime", maxTime)
      .eq("reminder_sent", false)
      .in("status", ["Agendado", "Confirmado"]);
       
    if (error) throw error;
    
    if (!agendaEvents || agendaEvents.length === 0) {
      console.log("ℹ️ [Lembrete] Nenhum evento de agenda pendente nas próximas horas.");
      return;
    }
    
    console.log(`🔍 [Lembrete] Encontrado(s) ${agendaEvents.length} compromisso(s) para enviar lembrete.`);
    
    for (const evt of agendaEvents) {
      try {
        let recipientName = "";
        let recipientPhone = "";
        
        // Retrieve recipient contact info
        if (evt.client_id) {
          const { data: clientData } = await supabase
            .from("clients")
            .select("name, phone")
            .eq("id", evt.client_id)
            .maybeSingle();
          if (clientData) {
            recipientName = clientData.name;
            recipientPhone = clientData.phone;
          }
        } else if (evt.lead_id) {
          const { data: leadData } = await supabase
            .from("leads")
            .select("name, phone")
            .eq("id", evt.lead_id)
            .maybeSingle();
          if (leadData) {
            recipientName = leadData.name;
            recipientPhone = leadData.phone;
          }
        }
        
        if (!recipientPhone) {
          console.warn(`⚠️ [Lembrete] Compromisso ${evt.id} não possui contato vinculado.`);
          continue;
        }
        
        const apptDate = new Date(evt.datetime);
        const hours = String(apptDate.getUTCHours()).padStart(2, "0");
        const minutes = String(apptDate.getUTCMinutes()).padStart(2, "0");
        const timeStr = `${hours}:${minutes}`;
        const dateStr = `${String(apptDate.getUTCDate()).padStart(2, "0")}/${String(apptDate.getUTCMonth() + 1).padStart(2, "0")}`;
        
        // Define personalized message by event type
        let messageText = "";
        if (evt.type === "visita") {
          messageText = `Olá, *${recipientName}*! Passando para lembrar da sua visita agendada ao *Canil de Pastor do Cáucaso* amanhã (${dateStr}) às *${timeStr}h*.\n\n📍 *Endereço:* Rodovia Raposo Tavares, Km 50, São Roque - SP.\n\nConfirmado? Esperamos você! 🐾`;
        } else if (evt.type === "adestramento") {
          messageText = `Olá, *${recipientName}*! Passando para lembrar da sessão de adestramento do seu cão agendada para amanhã (${dateStr}) às *${timeStr}h*.\n\nAté logo! 🎓`;
        } else if (evt.type === "hospedagem") {
          messageText = `Olá, *${recipientName}*! Passando para lembrar do check-in/check-out de hospedagem de seu cão agendado para amanhã (${dateStr}) às *${timeStr}h*.\n\nTe aguardamos! 🏡`;
        } else {
          messageText = `Olá, *${recipientName}*! Passando para lembrar que você tem o compromisso *"${evt.title}"* agendado conosco amanhã (${dateStr}) às *${timeStr}h*.`;
        }
        
        const wppNumber = await getWhatsappJid(client, recipientPhone);
        
        console.log(`📱 [Lembrete] Enviando lembrete de WhatsApp para ${recipientName} (${wppNumber})...`);
        await client.sendMessage(wppNumber, messageText);
        
        await supabase
          .from("agenda")
          .update({ reminder_sent: true })
          .eq("id", evt.id);
          
      } catch (apptErr) {
        console.error(`❌ [Lembrete] Erro ao disparar lembrete para evento ${evt.id}:`, apptErr);
      }
    }
  } catch (err: any) {
    console.error("❌ [Lembrete] Erro ao consultar ou processar lembretes no Supabase:", err.message || err);
  }
}

export async function checkAndSendNewConfirmations(client: WhatsAppClient) {
  try {
    const supabase = getSupabase();
    if (!supabase) return;
    
    // Check if confirmations are enabled dynamically from Supabase
    let enableConfirmations = true;
    try {
      const { data: config, error: configErr } = await supabase
        .from("whatsapp_config")
        .select("enable_confirmations")
        .eq("id", 1)
        .maybeSingle();
        
      if (!configErr && config) {
        enableConfirmations = config.enable_confirmations !== false;
      }
    } catch (dbErr) {
      // Fallback
    }

    if (!enableConfirmations) {
      return;
    }
    
    // Fetch newly scheduled agenda events that have status = 'Agendado'
    const { data: events, error } = await supabase
      .from("agenda")
      .select("*")
      .eq("status", "Agendado")
      .eq("reminder_sent", false); // using reminder_sent flag to track new confirmations
      
    if (error) throw error;
    
    if (!events || events.length === 0) {
      return;
    }
    
    for (const evt of events) {
      try {
        let recipientName = "";
        let recipientPhone = "";
        
        if (evt.client_id) {
          const { data: clientData } = await supabase
            .from("clients")
            .select("name, phone")
            .eq("id", evt.client_id)
            .maybeSingle();
          if (clientData) {
            recipientName = clientData.name;
            recipientPhone = clientData.phone;
          }
        } else if (evt.lead_id) {
          const { data: leadData } = await supabase
            .from("leads")
            .select("name, phone")
            .eq("id", evt.lead_id)
            .maybeSingle();
          if (leadData) {
            recipientName = leadData.name;
            recipientPhone = leadData.phone;
          }
        }
        
        if (!recipientPhone) continue;
        
        const apptDate = new Date(evt.datetime);
        const day = String(apptDate.getUTCDate()).padStart(2, "0");
        const month = String(apptDate.getUTCMonth() + 1).padStart(2, "0");
        const dateStr = `${day}/${month}/${apptDate.getUTCFullYear()}`;
        const hours = String(apptDate.getUTCHours()).padStart(2, "0");
        const minutes = String(apptDate.getUTCMinutes()).padStart(2, "0");
        const timeStr = `${hours}:${minutes}`;
        
        let messageText = `Olá, *${recipientName}*! Seu agendamento no *Canil de Pastor do Cáucaso* foi confirmado com sucesso! 🎉\n\n` +
          `📅 *Data:* ${dateStr}\n` +
          `⏰ *Horário:* ${timeStr}h\n` +
          `📝 *Atividade:* ${evt.title}\n\n` +
          `Te aguardamos! 🐾`;
          
        const wppNumber = await getWhatsappJid(client, recipientPhone);
        
        console.log(`📱 [Confirmação] Enviando mensagem de confirmação para ${recipientName}...`);
        await client.sendMessage(wppNumber, messageText);
        
        await supabase
          .from("agenda")
          .update({ status: "Confirmado" })
          .eq("id", evt.id);
          
      } catch (apptErr) {
        console.error(`❌ [Confirmação] Erro ao disparar confirmação para agendamento ${evt.id}:`, apptErr);
      }
    }
  } catch (err) {
    // Fail silently
  }
}

export function startReminderLoop(client: WhatsAppClient) {
  console.log("⏳ [Lembrete] Loop de verificação de agendamentos ativado (checagem a cada 1 hora).");
  console.log("⏳ [Confirmação] Loop de verificação de novas marcações ativado (checagem a cada 10 segundos).");
  
  setTimeout(() => {
    checkAndSendReminders(client).catch(err => console.error("Erro na verificação de lembretes inicial:", err));
    checkAndSendNewConfirmations(client).catch(err => console.error("Erro na verificação de confirmações inicial:", err));
  }, 5000);
  
  // Checking reminders hourly is sufficient for 24h headstart notifications
  setInterval(() => {
    checkAndSendReminders(client).catch(err => console.error("Erro na verificação periódica de lembretes:", err));
  }, 60 * 60 * 1000); 

  // Checking new entries every 10s
  setInterval(() => {
    checkAndSendNewConfirmations(client).catch(err => console.error("Erro na verificação periódica de novas marcações:", err));
  }, 10 * 1000);
}
