"use client";

import { useEffect, useState } from "react";
import { useAura } from "@/context/AuraContext";
import { 
  Settings, 
  Save, 
  AlertCircle, 
  RefreshCw, 
  Smartphone, 
  CheckCircle2, 
  Play, 
  Square, 
  Loader, 
  Send,
  MessageSquare,
  Shield,
  HelpCircle,
  Hash,
  XCircle,
  Copy,
  Info
} from "lucide-react";

// WhatsApp Markdown parser to render bold, italic and strikethrough in simulated chat bubble
function parseWhatsAppMarkdown(text: string) {
  if (!text) return "";
  let parsed = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Replace *bold* with <strong>
  parsed = parsed.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
  // Replace _italic_ with <em>
  parsed = parsed.replace(/_(.*?)_/g, "<em>$1</em>");
  // Replace ~strikethrough~ with <del>
  parsed = parsed.replace(/~(.*?)~/g, "<del>$1</del>");
  // Replace newlines with <br />
  parsed = parsed.replace(/\n/g, "<br />");
  
  return parsed;
}

// Simulated Phone Preview Component
function WhatsAppPreview({ title, templateText, type }: { title: string; templateText: string; type: string }) {
  // Determine mock variables based on type
  let mockNome = "Guilherme Mota";
  let mockData = "23/06";
  let mockHora = "14:00";
  let mockAtividade = "Visita Técnica ao Canil";

  if (type === "adestramento") {
    mockNome = "Carlos Eduardo";
    mockAtividade = "Adestramento de Obediência";
  } else if (type === "hospedagem") {
    mockNome = "Aline Silva";
    mockAtividade = "Check-in de Hospedagem (Creche)";
  } else if (type === "confirmacao") {
    mockNome = "Bruno Souza";
    mockAtividade = "Visita de Comprador (Thor)";
  }

  const previewText = (templateText || "")
    .replace(/{nome}/g, mockNome)
    .replace(/{data}/g, mockData)
    .replace(/{hora}/g, mockHora)
    .replace(/{atividade}/g, mockAtividade);

  return (
    <div className="bg-[#0b141a] rounded-xl border border-salon-border/90 overflow-hidden shadow-2xl max-w-sm w-full mx-auto font-sans flex flex-col h-[280px]">
      {/* Header bar */}
      <div className="bg-[#202c33] p-3 flex items-center gap-3 border-b border-salon-border/20 shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#D97457] flex items-center justify-center text-[#0F0F0F] font-bold text-xs shrink-0">
          CA
        </div>
        <div className="leading-tight">
          <div className="text-white font-semibold text-[11px]">{title}</div>
          <div className="text-[#8696a0] text-[9px]">online</div>
        </div>
      </div>
      
      {/* Chat messages background list */}
      <div className="p-3 flex-1 flex flex-col justify-end bg-slate-900/40 relative overflow-y-auto" style={{ 
        backgroundImage: "radial-gradient(#202c33 0.5px, transparent 0.5px), radial-gradient(#202c33 0.5px, #0b141a 0.5px)", 
        backgroundSize: "20px 20px", 
        backgroundPosition: "0 0, 10px 10px" 
      }}>
        <div className="flex justify-end w-full">
          <div className="bg-[#005c4b] text-white text-xs p-3 rounded-2xl rounded-tr-none max-w-[85%] relative shadow-md">
            <p 
              className="whitespace-pre-wrap break-words leading-relaxed text-[10px]"
              dangerouslySetInnerHTML={{ __html: parseWhatsAppMarkdown(previewText || "Nenhum texto inserido ainda.") }}
            />
            <div className="flex items-center justify-end gap-1 mt-1 text-[8px] text-[#ffffffb3] text-right">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-[#53bdeb] font-bold">✓✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfiguracoesPage() {
  const { whatsappConfig, updateWhatsappConfig, refreshAllData } = useAura();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [botRunning, setBotRunning] = useState(false);
  const [botLoading, setBotLoading] = useState(false);
  const [botPid, setBotPid] = useState<number | null>(null);
  
  // Tabs for messages editing: 'visita' | 'adestramento' | 'hospedagem' | 'confirmacao'
  const [activeTab, setActiveTab] = useState<"visita" | "adestramento" | "hospedagem" | "confirmacao">("visita");

  const [form, setForm] = useState({
    reminder_hours: 24,
    enable_reminders: true,
    enable_confirmations: true,
    enable_responses: true,
    questions_json: "[]",
    template_visita: "",
    template_adestramento: "",
    template_hospedagem: "",
    template_confirmacao: ""
  });

  // Sync form state when whatsappConfig loads
  useEffect(() => {
    if (whatsappConfig) {
      setForm({
        reminder_hours: whatsappConfig.reminder_hours ?? 24,
        enable_reminders: whatsappConfig.enable_reminders !== false,
        enable_confirmations: whatsappConfig.enable_confirmations !== false,
        enable_responses: whatsappConfig.enable_responses !== false,
        questions_json: JSON.stringify(whatsappConfig.qualification_questions || [], null, 2),
        template_visita: whatsappConfig.message_templates?.visita ?? "",
        template_adestramento: whatsappConfig.message_templates?.adestramento ?? "",
        template_hospedagem: whatsappConfig.message_templates?.hospedagem ?? "",
        template_confirmacao: whatsappConfig.message_templates?.confirmacao ?? ""
      });
    }
  }, [whatsappConfig]);

  // Check if bot process is running on mount and periodically
  const checkBotStatus = async () => {
    try {
      const res = await fetch("/api/bot");
      const data = await res.json();
      setBotRunning(data.running);
      setBotPid(data.pid || null);
    } catch (err) {
      console.error("Erro ao checar status do processo do bot:", err);
    }
  };

  useEffect(() => {
    checkBotStatus();
    const interval = setInterval(() => {
      checkBotStatus();
      // Periodically refresh Supabase config data so we get QR codes in real-time
      refreshAllData().catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartBot = async () => {
    setBotLoading(true);
    try {
      const res = await fetch("/api/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" })
      });
      const data = await res.json();
      if (data.success) {
        setBotRunning(true);
      } else {
        alert(data.message || "Erro ao iniciar o robô.");
      }
    } catch (err) {
      alert("Falha na requisição ao iniciar o robô.");
    } finally {
      setBotLoading(false);
      checkBotStatus();
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Tem certeza que deseja desconectar este número de WhatsApp? Isso removerá a sessão atual e exigirá um novo QR Code.")) {
      return;
    }
    setBotLoading(true);
    try {
      // 1. Signal logout in db
      await updateWhatsappConfig({ status: "disconnect_requested" });
      
      // 2. Wait a moment and forcefully kill the process so it re-initializes clean next time
      setTimeout(async () => {
        try {
          await fetch("/api/bot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "stop" })
          });
        } catch (e) {}
        checkBotStatus();
        refreshAllData();
        setBotLoading(false);
      }, 3500);
      
    } catch (err) {
      alert("Falha ao solicitar desconexão.");
      setBotLoading(false);
    }
  };

  const handleStopBot = async () => {
    setBotLoading(true);
    try {
      const res = await fetch("/api/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop" })
      });
      const data = await res.json();
      if (data.success) {
        setBotRunning(false);
        setBotPid(null);
      } else {
        alert(data.message || "Erro ao parar o robô.");
      }
    } catch (err) {
      alert("Falha na requisição ao parar o robô.");
    } finally {
      setBotLoading(false);
      checkBotStatus();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const parsedQuestions = JSON.parse(form.questions_json);
      await updateWhatsappConfig({
        reminder_hours: form.reminder_hours,
        enable_reminders: form.enable_reminders,
        enable_confirmations: form.enable_confirmations,
        enable_responses: form.enable_responses,
        qualification_questions: parsedQuestions,
        message_templates: {
          visita: form.template_visita,
          adestramento: form.template_adestramento,
          hospedagem: form.template_hospedagem,
          confirmacao: form.template_confirmacao
        }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      alert("Erro ao salvar: JSON de perguntas inválido.");
    } finally {
      setLoading(false);
    }
  };

  const insertTag = (fieldName: keyof typeof form, tag: string) => {
    setForm(prev => ({
      ...prev,
      [fieldName]: (prev[fieldName] as string) + tag
    }));
  };

  // Determine current wizard status
  const getConnectionStep = () => {
    const status = whatsappConfig?.status || "disconnected";
    
    if (status === "connected") return "connected";
    if (botRunning && status === "qr_ready") return "qr_ready";
    if (botRunning && (status === "connecting" || status === "disconnected")) return "connecting";
    return "disconnected";
  };

  const step = getConnectionStep();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#D97457]" />
          <span>Configurações do Robô WhatsApp</span>
        </h2>
        <p className="text-salon-text-secondary text-xs mt-1">
          Gerencie a conexão com o WhatsApp de verdade, visualize o QR Code e personalize as mensagens automáticas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Intuitve Connection Card */}
        <div className="space-y-6">
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-6 flex flex-col justify-between min-h-[420px] shadow-lg relative overflow-hidden">
            
            {/* Elegant header */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D97457] border-b border-[#2A2A2A] pb-2 flex items-center justify-between">
                <span>Painel de Conexão</span>
                {step === "connected" && (
                  <span className="w-2.5 h-2.5 rounded-full bg-salon-success animate-pulse" />
                )}
              </h3>
            </div>

            {/* Wizards state rendering */}
            <div className="flex-1 flex flex-col justify-center py-4 space-y-4">
              
              {/* STATE 1: DISCONNECTED */}
              {step === "disconnected" && (
                <div className="text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-16 h-16 rounded-full bg-salon-border flex items-center justify-center mx-auto border border-salon-border/60">
                    <Smartphone className="w-8 h-8 text-salon-text-secondary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">Pronto para Conectar</h4>
                    <p className="text-[10px] text-salon-text-secondary leading-relaxed px-4">
                      Sincronize o sistema do canil com seu celular para enviar notificações automáticas de lembretes e agendamentos.
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleStartBot}
                    disabled={botLoading}
                    className="w-full bg-[#D97457] hover:bg-[#C25F43] active:scale-[0.98] text-[#0F0F0F] text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(201,169,110,0.2)] disabled:opacity-50 mt-4"
                  >
                    {botLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>🔌 Conectar Número de Verdade</span>
                    )}
                  </button>
                </div>
              )}

              {/* STATE 2: CONNECTING */}
              {step === "connecting" && (
                <div className="text-center space-y-5 animate-in fade-in duration-200">
                  <div className="w-16 h-16 rounded-full bg-salon-border flex items-center justify-center mx-auto border border-[#D97457]/20 relative">
                    <Loader className="w-8 h-8 text-[#D97457] animate-spin" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-white">Inicializando o Robô...</h4>
                    <p className="text-[10px] text-salon-text-secondary leading-relaxed px-3">
                      Abrindo canal seguro no servidor local. Isso levará alguns segundos. O QR Code aparecerá automaticamente aqui.
                    </p>
                  </div>
                  <div className="w-full bg-salon-border h-1 rounded-full overflow-hidden">
                    <div className="bg-[#D97457] h-full w-2/3 rounded-full animate-[shimmer_1.5s_infinite]" />
                  </div>

                  <button
                    type="button"
                    onClick={handleStopBot}
                    disabled={botLoading}
                    className="text-salon-error text-[10px] font-bold hover:underline transition-all mt-2"
                  >
                    Cancelar inicialização
                  </button>
                </div>
              )}

              {/* STATE 3: QR READY */}
              {step === "qr_ready" && whatsappConfig?.qr_code && (
                <div className="text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="inline-block p-3 bg-white rounded-xl shadow-2xl border-2 border-[#D97457]">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(whatsappConfig.qr_code)}`}
                      alt="WhatsApp Web QR Code"
                      className="w-40 h-40"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#D97457] uppercase tracking-wider">Escaneie o QR Code</h4>
                    <p className="text-[9px] text-salon-text-secondary px-2 leading-relaxed">
                      Abra o WhatsApp no celular, vá em <strong className="text-white">Aparelhos Conectados</strong>, toque em <strong className="text-white">Conectar Aparelho</strong> e escaneie o código.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStopBot}
                    disabled={botLoading}
                    className="w-full bg-salon-error/10 border border-salon-error/30 text-salon-error hover:bg-salon-error/20 text-xs font-bold py-2 rounded-lg transition-all mt-2"
                  >
                    Cancelar Pareamento
                  </button>
                </div>
              )}

              {/* STATE 4: CONNECTED */}
              {step === "connected" && (
                <div className="text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-16 h-16 rounded-full bg-salon-success/10 border border-salon-success/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-salon-success animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">Conexão Estabelecida!</h4>
                    <p className="text-[10px] text-salon-text-secondary leading-relaxed px-4">
                      O robô está conectado com o número de verdade e rodando normalmente em segundo plano.
                    </p>
                  </div>

                  <div className="bg-salon-bg/60 border border-salon-border rounded-xl p-3 text-[10px] text-left space-y-2 max-w-[240px] mx-auto">
                    <div className="flex justify-between">
                      <span className="text-salon-text-secondary">Status:</span>
                      <span className="font-semibold text-salon-success">Ativo &amp; Monitorando</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-salon-text-secondary">Número:</span>
                      <span className="font-bold text-white">{whatsappConfig?.phone || "Conectado"}</span>
                    </div>
                    {botPid && (
                      <div className="flex justify-between">
                        <span className="text-salon-text-secondary">ID Processo:</span>
                        <span className="font-mono text-white">PID {botPid}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleDisconnect}
                    disabled={botLoading}
                    className="w-full bg-salon-error/15 border border-salon-error/30 text-salon-error hover:bg-salon-error/25 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all mt-4"
                  >
                    Desconectar WhatsApp
                  </button>
                </div>
              )}

            </div>

            {/* Sync trigger button */}
            <div className="pt-4 border-t border-[#2A2A2A] flex justify-between items-center text-[10px]">
              <span className="text-salon-text-secondary flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-salon-text-secondary" />
                Conexão criptografada
              </span>
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  await checkBotStatus();
                  await refreshAllData();
                  setLoading(false);
                }}
                className="text-[#D97457] hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                Atualizar Sincronização
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Dynamic Parameters & Templates with Live Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-6 shadow-lg">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D97457] flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Customização de Mensagens &amp; Lembretes</span>
              </h3>
              
              {/* Saving success notification banner */}
              {success && (
                <div className="bg-salon-success/15 border border-salon-success/35 text-salon-success text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Configurações salvas!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs">
              
              {/* Status toggles & setup */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-salon-text-secondary font-medium text-[10px] uppercase tracking-wider">
                      Antecedência de envio dos Lembretes
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={form.reminder_hours}
                        onChange={(e) => setForm(prev => ({ ...prev, reminder_hours: parseInt(e.target.value) || 24 }))}
                        className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white font-medium focus:outline-none focus:border-[#D97457]"
                      />
                      <span className="absolute right-3 top-2.5 text-salon-text-secondary text-[10px]">horas antes</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className={`p-3 rounded-lg border ${form.enable_reminders ? 'border-[#D97457]/40 bg-[#D97457]/5' : 'border-salon-border bg-salon-bg/40'} transition-all`}>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.enable_reminders}
                        onChange={(e) => setForm(prev => ({ ...prev, enable_reminders: e.target.checked }))}
                        className="mt-0.5 w-4.5 h-4.5 rounded bg-salon-bg border-salon-border focus:ring-0 text-[#D97457]"
                      />
                      <div className="space-y-0.5 leading-tight">
                        <span className="text-white font-semibold text-[10px]">Enviar Lembretes</span>
                        <p className="text-[9px] text-salon-text-secondary">Notificações automáticas antes do evento.</p>
                      </div>
                    </label>
                  </div>

                  <div className={`p-3 rounded-lg border ${form.enable_confirmations ? 'border-[#D97457]/40 bg-[#D97457]/5' : 'border-salon-border bg-salon-bg/40'} transition-all`}>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.enable_confirmations}
                        onChange={(e) => setForm(prev => ({ ...prev, enable_confirmations: e.target.checked }))}
                        className="mt-0.5 w-4.5 h-4.5 rounded bg-salon-bg border-salon-border focus:ring-0 text-[#D97457]"
                      />
                      <div className="space-y-0.5 leading-tight">
                        <span className="text-white font-semibold text-[10px]">Confirmação Direta</span>
                        <p className="text-[9px] text-salon-text-secondary">Mensagem enviada no ato do agendamento.</p>
                      </div>
                    </label>
                  </div>

                  <div className={`p-3 rounded-lg border ${form.enable_responses ? 'border-[#D97457]/40 bg-[#D97457]/5' : 'border-salon-border bg-salon-bg/40'} transition-all`}>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.enable_responses}
                        onChange={(e) => setForm(prev => ({ ...prev, enable_responses: e.target.checked }))}
                        className="mt-0.5 w-4.5 h-4.5 rounded bg-salon-bg border-salon-border focus:ring-0 text-[#D97457]"
                      />
                      <div className="space-y-0.5 leading-tight">
                        <span className="text-white font-semibold text-[10px]">Chatbot Qualificador</span>
                        <p className="text-[9px] text-salon-text-secondary">Auto-respostas inteligentes de triagem.</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Message Templates Section */}
              <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
                <div>
                  <h4 className="text-[10px] font-bold text-[#D97457] uppercase tracking-wider">Modelos de Lembretes &amp; Confirmações</h4>
                  <p className="text-[10px] text-salon-text-secondary mt-0.5">
                    Selecione o modelo desejado para editar e veja o resultado final no celular de demonstração.
                  </p>
                </div>

                {/* Tabs selection header */}
                <div className="flex flex-wrap gap-1 bg-salon-bg/80 p-1 rounded-lg border border-salon-border">
                  <button
                    type="button"
                    onClick={() => setActiveTab("visita")}
                    className={`flex-1 min-w-[90px] py-2 px-3 text-[10px] font-bold rounded-md transition-all text-center ${activeTab === "visita" ? "bg-[#D97457] text-[#0F0F0F]" : "text-salon-text-secondary hover:text-white"}`}
                  >
                    Lembrete Visita
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("confirmacao")}
                    className={`flex-1 min-w-[90px] py-2 px-3 text-[10px] font-bold rounded-md transition-all text-center ${activeTab === "confirmacao" ? "bg-[#D97457] text-[#0F0F0F]" : "text-salon-text-secondary hover:text-white"}`}
                  >
                    Confirmação Imediata
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("adestramento")}
                    className={`flex-1 min-w-[90px] py-2 px-3 text-[10px] font-bold rounded-md transition-all text-center ${activeTab === "adestramento" ? "bg-[#D97457] text-[#0F0F0F]" : "text-salon-text-secondary hover:text-white"}`}
                  >
                    Lembrete Adestramento
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("hospedagem")}
                    className={`flex-1 min-w-[90px] py-2 px-3 text-[10px] font-bold rounded-md transition-all text-center ${activeTab === "hospedagem" ? "bg-[#D97457] text-[#0F0F0F]" : "text-salon-text-secondary hover:text-white"}`}
                  >
                    Lembrete Hospedagem
                  </button>
                </div>

                {/* Edit form side by side with live preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Left Column of editing */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-semibold text-xs">
                          {activeTab === "visita" && "Mensagem de Lembrete de Visitas"}
                          {activeTab === "adestramento" && "Mensagem de Lembrete de Adestramento"}
                          {activeTab === "hospedagem" && "Mensagem de Lembrete de Hospedagem"}
                          {activeTab === "confirmacao" && "Mensagem de Confirmação Automática"}
                        </label>
                        <span className="text-[9px] text-[#D97457] font-medium bg-[#D97457]/5 px-2 py-0.5 rounded border border-[#D97457]/20">
                          {activeTab === "confirmacao" ? "No ato do agendamento" : `Enviado ${form.reminder_hours}h antes`}
                        </span>
                      </div>

                      {/* Editing Textarea */}
                      {activeTab === "visita" && (
                        <textarea
                          value={form.template_visita}
                          onChange={(e) => setForm(prev => ({ ...prev, template_visita: e.target.value }))}
                          rows={6}
                          className="w-full bg-[#0F0F0F] border border-salon-border text-white p-3 rounded-lg focus:outline-none focus:border-[#D97457] text-xs leading-relaxed transition-all resize-none"
                          placeholder="Olá, {nome}... Escreva o template..."
                        />
                      )}
                      {activeTab === "adestramento" && (
                        <textarea
                          value={form.template_adestramento}
                          onChange={(e) => setForm(prev => ({ ...prev, template_adestramento: e.target.value }))}
                          rows={6}
                          className="w-full bg-[#0F0F0F] border border-salon-border text-white p-3 rounded-lg focus:outline-none focus:border-[#D97457] text-xs leading-relaxed transition-all resize-none"
                          placeholder="Olá, {nome}... Escreva o template..."
                        />
                      )}
                      {activeTab === "hospedagem" && (
                        <textarea
                          value={form.template_hospedagem}
                          onChange={(e) => setForm(prev => ({ ...prev, template_hospedagem: e.target.value }))}
                          rows={6}
                          className="w-full bg-[#0F0F0F] border border-salon-border text-white p-3 rounded-lg focus:outline-none focus:border-[#D97457] text-xs leading-relaxed transition-all resize-none"
                          placeholder="Olá, {nome}... Escreva o template..."
                        />
                      )}
                      {activeTab === "confirmacao" && (
                        <textarea
                          value={form.template_confirmacao}
                          onChange={(e) => setForm(prev => ({ ...prev, template_confirmacao: e.target.value }))}
                          rows={6}
                          className="w-full bg-[#0F0F0F] border border-salon-border text-white p-3 rounded-lg focus:outline-none focus:border-[#D97457] text-xs leading-relaxed transition-all resize-none"
                          placeholder="Olá, {nome}... Escreva o template..."
                        />
                      )}
                    </div>

                    {/* Tag Helper Area */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-salon-text-secondary block font-medium">
                        Tags dinâmicas (clique para inserir no fim da mensagem):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => insertTag(
                            activeTab === "visita" ? "template_visita" :
                            activeTab === "adestramento" ? "template_adestramento" :
                            activeTab === "hospedagem" ? "template_hospedagem" : "template_confirmacao",
                            "{nome}"
                          )}
                          className="px-2 py-1 bg-salon-bg hover:bg-salon-border border border-salon-border hover:border-salon-text-secondary text-salon-text-primary rounded text-[9px] font-mono transition-all flex items-center gap-1"
                        >
                          <Hash className="w-2.5 h-2.5 text-[#D97457]" />
                          <span>{"{nome}"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertTag(
                            activeTab === "visita" ? "template_visita" :
                            activeTab === "adestramento" ? "template_adestramento" :
                            activeTab === "hospedagem" ? "template_hospedagem" : "template_confirmacao",
                            "{data}"
                          )}
                          className="px-2 py-1 bg-salon-bg hover:bg-salon-border border border-salon-border hover:border-salon-text-secondary text-salon-text-primary rounded text-[9px] font-mono transition-all flex items-center gap-1"
                        >
                          <Hash className="w-2.5 h-2.5 text-[#D97457]" />
                          <span>{"{data}"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertTag(
                            activeTab === "visita" ? "template_visita" :
                            activeTab === "adestramento" ? "template_adestramento" :
                            activeTab === "hospedagem" ? "template_hospedagem" : "template_confirmacao",
                            "{hora}"
                          )}
                          className="px-2 py-1 bg-salon-bg hover:bg-salon-border border border-salon-border hover:border-salon-text-secondary text-salon-text-primary rounded text-[9px] font-mono transition-all flex items-center gap-1"
                        >
                          <Hash className="w-2.5 h-2.5 text-[#D97457]" />
                          <span>{"{hora}"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertTag(
                            activeTab === "visita" ? "template_visita" :
                            activeTab === "adestramento" ? "template_adestramento" :
                            activeTab === "hospedagem" ? "template_hospedagem" : "template_confirmacao",
                            "{atividade}"
                          )}
                          className="px-2 py-1 bg-salon-bg hover:bg-salon-border border border-salon-border hover:border-salon-text-secondary text-salon-text-primary rounded text-[9px] font-mono transition-all flex items-center gap-1"
                        >
                          <Hash className="w-2.5 h-2.5 text-[#D97457]" />
                          <span>{"{atividade}"}</span>
                        </button>
                      </div>
                      
                      <div className="bg-[#0F0F0F]/60 border border-salon-border/55 rounded-lg p-2.5 text-[9px] text-salon-text-secondary leading-relaxed flex gap-2">
                        <Info className="w-4 h-4 text-[#D97457] shrink-0 mt-0.5" />
                        <span>
                          Você pode usar formatações nativas do WhatsApp como <strong className="text-white">*texto em negrito*</strong>, <em className="text-white">_texto em itálico_</em> ou <del className="text-white">~tachado~</del>.
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column of Live Preview */}
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-[10px] text-salon-text-secondary font-semibold uppercase tracking-wider mb-2.5 self-start">
                      📱 Pré-visualização em tempo real:
                    </span>
                    
                    {activeTab === "visita" && (
                      <WhatsAppPreview title="Lembrete de Visita" templateText={form.template_visita} type="visita" />
                    )}
                    {activeTab === "adestramento" && (
                      <WhatsAppPreview title="Lembrete de Adestramento" templateText={form.template_adestramento} type="adestramento" />
                    )}
                    {activeTab === "hospedagem" && (
                      <WhatsAppPreview title="Lembrete de Hospedagem" templateText={form.template_hospedagem} type="hospedagem" />
                    )}
                    {activeTab === "confirmacao" && (
                      <WhatsAppPreview title="Confirmação de Agendamento" templateText={form.template_confirmacao} type="confirmacao" />
                    )}
                  </div>

                </div>
              </div>

              {/* Chatbot JSON block */}
              <div className="space-y-2 pt-4 border-t border-[#2A2A2A]">
                <div className="flex justify-between items-center">
                  <label className="text-salon-text-secondary font-medium text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <span>Script de Perguntas do Chatbot (JSON)</span>
                  </label>
                  <span className="text-[9px] text-salon-text-secondary font-mono">Estrutura avançada</span>
                </div>
                <textarea
                  value={form.questions_json}
                  onChange={(e) => setForm(prev => ({ ...prev, questions_json: e.target.value }))}
                  rows={4}
                  className="w-full bg-[#0F0F0F] border border-salon-border text-salon-text-primary font-mono text-[9px] p-3 rounded-lg focus:outline-none focus:border-[#D97457] resize-y"
                />
              </div>

              {/* Main Form Save action */}
              <div className="pt-2 border-t border-[#2A2A2A]">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#D97457] hover:bg-[#C25F43] active:scale-[0.98] text-[#0F0F0F] font-bold px-6 py-2.5 rounded-salon flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)] disabled:opacity-50 text-xs"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Salvar Configurações</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
