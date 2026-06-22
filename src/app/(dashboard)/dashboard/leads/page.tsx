"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, Smartphone, User, MessageSquare, Check, CheckCheck, Loader2, Sparkles, AlertCircle, ToggleLeft, ToggleRight, Tag as TagIcon, FileText } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAura, Lead } from "@/context/AuraContext";
import Link from "next/link";

interface Message {
  id: number;
  chat_jid: string;
  contact_name: string;
  body: string;
  from_me: boolean;
  status: "pending" | "sent" | "failed" | "received";
  created_at: string;
}

interface ChatListItem {
  chat_jid: string;
  contact_name: string;
  lastMessage: string;
  lastMessageTime: string;
}

export default function LeadsPage() {
  const { leads, updateLeadStatus, updateLeadAutoRespond, updateLeadNotes } = useAura();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selectedJid, setSelectedJid] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [botConnected, setBotConnected] = useState<boolean | null>(null);
  const [dbError, setDbError] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Sidebar note edits
  const [notesText, setNotesText] = useState("");
  const [tagInput, setTagInput] = useState("");

  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Get active selected lead details
  const activeLead = leads.find(l => {
    if (!selectedJid) return false;
    const cleanJid = selectedJid.split("@")[0];
    return l.phone === cleanJid;
  });

  useEffect(() => {
    if (activeLead) {
      setNotesText(activeLead.notes || "");
    }
  }, [selectedJid, activeLead]);

  // 1. Fetch system status
  const checkBotStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("whatsapp_config")
        .select("status")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        if (error.message.includes("does not exist")) setDbError(true);
        return;
      }
      setBotConnected(data?.status === "connected");
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Fetch messages
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("whatsapp_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        if (error.message.includes("does not exist")) setDbError(true);
        return;
      }

      if (data) {
        setDbError(false);
        setMessages(data);
        
        const chatMap: Record<string, ChatListItem> = {};
        data.forEach((msg: Message) => {
          const formattedTime = new Date(msg.created_at).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
          });
          
          chatMap[msg.chat_jid] = {
            chat_jid: msg.chat_jid,
            contact_name: msg.contact_name || "Cliente WhatsApp",
            lastMessage: msg.body,
            lastMessageTime: formattedTime
          };
        });

        const sortedChats = Object.values(chatMap).reverse();
        setChatList(sortedChats);

        if (!selectedJid && sortedChats.length > 0) {
          setSelectedJid(sortedChats[0].chat_jid);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkBotStatus();
    fetchMessages();

    const interval = setInterval(() => {
      checkBotStatus();
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedJid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedJid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedJid) return;

    setSending(true);
    const activeChat = chatList.find(c => c.chat_jid === selectedJid);
    const contactName = activeChat?.contact_name || "Cliente WhatsApp";
    const bodyToSend = inputText;
    setInputText("");

    try {
      // If admin intervenes manually, we disable auto response automatically!
      if (activeLead && activeLead.auto_respond) {
        await updateLeadAutoRespond(activeLead.id, false);
      }

      const { error } = await supabase
        .from("whatsapp_messages")
        .insert({
          chat_jid: selectedJid,
          contact_name: contactName,
          body: bodyToSend,
          from_me: true,
          status: "pending",
          created_at: new Date().toISOString()
        });

      if (error) {
        alert("Erro ao enviar mensagem: " + error.message);
      } else {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeLead) return;
    await updateLeadNotes(activeLead.id, notesText, activeLead.tags);
    alert("Notas salvas com sucesso!");
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead || !tagInput.trim()) return;
    const currentTags = activeLead.tags || [];
    if (!currentTags.includes(tagInput.trim())) {
      const nextTags = [...currentTags, tagInput.trim()];
      await updateLeadNotes(activeLead.id, activeLead.notes || "", nextTags);
    }
    setTagInput("");
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!activeLead) return;
    const nextTags = (activeLead.tags || []).filter(t => t !== tagToRemove);
    await updateLeadNotes(activeLead.id, activeLead.notes || "", nextTags);
  };

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "pending": return <span>⏳</span>;
      case "sent": return <Check className="w-3.5 h-3.5 text-salon-text-secondary" />;
      case "received": return null;
      case "failed": return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      default: return <CheckCheck className="w-3.5 h-3.5 text-primary" />;
    }
  };

  const filteredChats = chatList.filter(chat => 
    chat.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.chat_jid.replace(/\D/g, "").includes(searchQuery)
  );

  const activeMessages = messages.filter(msg => msg.chat_jid === selectedJid);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 animate-in fade-in duration-500">
      
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-salon-surface border border-salon-border rounded-salon px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Central de Leads (Inbox)</h2>
            <p className="text-[10px] text-salon-text-secondary">Qualificação inteligente em tempo real</p>
          </div>
        </div>

        {/* Status Bot */}
        <div className="flex items-center gap-2">
          {botConnected === true ? (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Robô Conectado
            </span>
          ) : (
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Robô Offline
            </span>
          )}
        </div>
      </div>

      {dbError ? (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-salon p-6 text-center space-y-3 flex-1 flex flex-col items-center justify-center text-salon-text-primary">
          <AlertCircle className="w-12 h-12 text-rose-400" />
          <h3 className="text-sm font-bold">Estrutura não criada</h3>
          <p className="text-xs text-rose-200/80 max-w-md">
            Execute a migration SQL para liberar o controle e histórico de leads.
          </p>
        </div>
      ) : chatList.length === 0 ? (
        <div className="bg-salon-surface border border-salon-border rounded-salon p-12 text-center space-y-4 flex-1 flex flex-col items-center justify-center">
          <Smartphone className="w-16 h-16 text-salon-text-secondary/40" />
          <h3 className="text-sm font-bold">Aguardando novos leads...</h3>
        </div>
      ) : (
        <div className="flex-1 min-h-0 bg-salon-surface border border-salon-border rounded-salon flex overflow-hidden text-salon-text-primary">
          
          {/* Chat List (Left) */}
          <div className="w-72 border-r border-salon-border/80 flex flex-col bg-salon-surface">
            <div className="p-4 border-b border-salon-border/50 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-salon-text-secondary absolute left-3 top-3" />
                <input 
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-salon-bg border border-salon-border rounded-salon text-xs focus:outline-none focus:border-primary text-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-salon-border/30">
              {filteredChats.map((chat) => {
                const isSelected = selectedJid === chat.chat_jid;
                const associatedLead = leads.find(l => l.phone === chat.chat_jid.split("@")[0]);

                return (
                  <button
                    key={chat.chat_jid}
                    onClick={() => setSelectedJid(chat.chat_jid)}
                    className={`w-full p-4 flex gap-3 text-left transition-all ${
                      isSelected ? "bg-salon-bg border-l-2 border-primary" : "hover:bg-salon-bg/40"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xs uppercase border border-primary/20">
                      {chat.contact_name.slice(0, 2)}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold truncate">{chat.contact_name}</h4>
                        <span className="text-[8px] text-salon-text-secondary">{chat.lastMessageTime}</span>
                      </div>
                      
                      <p className="text-[10px] text-salon-text-secondary truncate">{chat.lastMessage}</p>
                      {associatedLead && (
                        <span className="inline-block text-[8px] bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.25 rounded font-bold uppercase">
                          {associatedLead.status}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversation (Center) */}
          <div className="flex-1 flex flex-col bg-salon-bg/30">
            {selectedJid ? (
              <>
                <div className="px-6 py-4 border-b border-salon-border/50 shrink-0 bg-salon-surface flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-xs font-bold">{chatList.find(c => c.chat_jid === selectedJid)?.contact_name}</h3>
                      <p className="text-[8px] text-salon-text-secondary font-mono">{selectedJid.split("@")[0]}</p>
                    </div>
                  </div>

                  {/* Auto respond toggle */}
                  {activeLead && (
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-gray-400 font-semibold">Resposta Automática:</span>
                      <button
                        onClick={() => updateLeadAutoRespond(activeLead.id, !activeLead.auto_respond)}
                        className="text-primary hover:opacity-80 transition-all"
                      >
                        {activeLead.auto_respond ? (
                          <ToggleRight className="w-6 h-6 text-primary" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-500" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {activeMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from_me ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-salon px-4 py-2 text-xs leading-relaxed space-y-1 ${
                        msg.from_me ? "bg-primary text-salon-bg font-medium rounded-tr-none" : "bg-salon-surface text-salon-text-primary rounded-tl-none border border-salon-border/80"
                      }`}>
                        <p className="break-words">{msg.body}</p>
                        <div className="flex justify-end items-center gap-1 text-[8px] opacity-80">
                          <span>{new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                          {msg.from_me && getStatusIcon(msg.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-salon-border/50 shrink-0 bg-salon-surface flex gap-3 items-center">
                  <input 
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={sending}
                    placeholder="Digite a resposta..."
                    className="flex-1 px-4 py-3 bg-salon-bg border border-salon-border rounded-salon text-xs focus:outline-none focus:border-primary text-white"
                  />
                  <button type="submit" disabled={sending || !inputText.trim()} className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-salon-bg p-3 rounded-salon flex items-center justify-center">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-salon-text-secondary space-y-2">
                <MessageSquare className="w-12 h-12 opacity-30" />
                <p className="text-xs">Selecione uma conversa</p>
              </div>
            )}
          </div>

          {/* Qualification Details (Right) */}
          <div className="w-80 border-l border-salon-border/80 bg-salon-surface p-6 overflow-y-auto space-y-6 shrink-0">
            {activeLead ? (
              <div className="space-y-6 text-xs animate-in fade-in duration-200">
                <div className="border-b border-[#2A2A2A] pb-4 space-y-2">
                  <h3 className="font-bold text-sm">Ficha do Lead</h3>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase text-gray-500 font-bold">Etapa do Funil</label>
                    <select
                      value={activeLead.status}
                      onChange={(e) => updateLeadStatus(activeLead.id, e.target.value as any)}
                      className="bg-salon-bg border border-salon-border text-white text-[11px] p-2 rounded-lg"
                    >
                      <option value="Novo">Novo</option>
                      <option value="Qualificando">Qualificando</option>
                      <option value="Interessado">Interessado</option>
                      <option value="Visita Agendada">Visita Agendada</option>
                      <option value="Em Negociação">Em Negociação</option>
                      <option value="Vendido">Vendido</option>
                      <option value="Perdido">Perdido</option>
                    </select>
                  </div>
                </div>

                {/* Qualification properties */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[#C9A96E] uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Respostas da Qualificação
                  </h4>
                  
                  <div className="bg-salon-bg/40 border border-salon-border/60 rounded-xl p-4 space-y-3">
                    <div>
                      <span className="block text-[9px] text-gray-500 uppercase font-bold">Interesse</span>
                      <span className="font-bold text-white text-[11px]">
                        {activeLead.data_qualificado?.service_type || "Compra de Filhote"}
                      </span>
                    </div>

                    {activeLead.data_qualificado?.puppy_gender && (
                      <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold">Preferência Gênero</span>
                        <span className="font-semibold text-white text-[11px]">
                          {activeLead.data_qualificado.puppy_gender}
                        </span>
                      </div>
                    )}

                    {activeLead.data_qualificado?.puppy_purpose && (
                      <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold">Finalidade do Cão</span>
                        <span className="font-semibold text-white text-[11px]">
                          {activeLead.data_qualificado.puppy_purpose}
                        </span>
                      </div>
                    )}

                    {activeLead.data_qualificado?.dog_experience && (
                      <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold">Experiência Guarda</span>
                        <span className="font-semibold text-white text-[11px]">
                          {activeLead.data_qualificado.dog_experience}
                        </span>
                      </div>
                    )}

                    {activeLead.data_qualificado?.lead_city && (
                      <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold">Cidade</span>
                        <span className="font-semibold text-white text-[11px]">
                          {activeLead.data_qualificado.lead_city}
                        </span>
                      </div>
                    )}

                    {activeLead.data_qualificado?.has_pedigree && (
                      <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold">Fêmea com Pedigree?</span>
                        <span className="font-semibold text-white text-[11px]">
                          {activeLead.data_qualificado.has_pedigree}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags section */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                    <TagIcon className="w-4 h-4" /> Tags do Lead
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeLead.tags || []).map((tag, i) => (
                      <span key={i} className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                        <span>{tag}</span>
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-400 font-extrabold ml-1">×</button>
                      </span>
                    ))}
                  </div>
                  <form onSubmit={handleAddTag} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nova tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="bg-salon-bg border border-salon-border text-white text-[11px] p-2 rounded-lg flex-1 focus:outline-none"
                    />
                    <button type="submit" className="bg-[#C9A96E] hover:bg-[#B8965C] text-[#0F0F0F] font-bold px-3 rounded-lg text-[10px]">Add</button>
                  </form>
                </div>

                {/* Notes section */}
                <div className="space-y-2 pt-2 border-t border-[#2A2A2A]">
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Observações Internas
                  </h4>
                  <textarea
                    rows={4}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Ex: Quer parcelar no Pix..."
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white resize-none text-[11px] focus:outline-none"
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="w-full bg-primary hover:bg-primary-hover text-salon-bg font-bold py-2 rounded-lg text-[11px]"
                  >
                    Salvar Observações
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center text-xs pt-12">Selecione uma conversa para ver a qualificação.</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
