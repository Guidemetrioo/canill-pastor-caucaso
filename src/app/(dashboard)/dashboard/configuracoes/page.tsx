"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import { Settings, Save, AlertCircle, RefreshCw, Smartphone, Key, CheckCircle2 } from "lucide-react";

export default function ConfiguracoesPage() {
  const { whatsappConfig, updateWhatsappConfig } = useAura();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    reminder_hours: whatsappConfig?.reminder_hours ?? 24,
    enable_reminders: whatsappConfig?.enable_reminders ?? true,
    enable_confirmations: whatsappConfig?.enable_confirmations ?? true,
    enable_responses: whatsappConfig?.enable_responses ?? true,
    questions_json: whatsappConfig ? JSON.stringify(whatsappConfig.qualification_questions, null, 2) : "[]"
  });

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
        qualification_questions: parsedQuestions
      });
      setSuccess(true);
    } catch (err) {
      alert("Erro ao salvar: JSON de perguntas inválido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações do Robô WhatsApp</h2>
        <p className="text-salon-text-secondary text-sm">
          Gerencie o comportamento do chatbot de qualificação e notificações automáticas de visitas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection status card */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A96E] border-b border-[#2A2A2A] pb-2">
            Status da Conexão
          </h3>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center text-green-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-salon-text-primary">WhatsApp Conectado</h4>
              <p className="text-[10px] text-salon-text-secondary mt-0.5">Sincronização ativa no Supabase</p>
            </div>
          </div>

          <div className="bg-salon-bg/40 border border-salon-border/60 rounded-xl p-4 text-xs text-gray-400 space-y-3">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-salon-success font-bold">Conectado</span>
            </div>
            <div className="flex justify-between">
              <span>Número bot:</span>
              <span className="font-semibold text-white">+55 (11) 99876-5432</span>
            </div>
          </div>

          <button
            onClick={() => {
              alert("Bot já está conectado!");
            }}
            className="w-full bg-salon-bg border border-salon-border text-salon-text-primary text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-salon-bg/85 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recarregar Conexão</span>
          </button>
        </div>

        {/* Setting parameters form */}
        <div className="lg:col-span-2 bg-salon-surface border border-salon-border rounded-salon p-6 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A96E] border-b border-[#2A2A2A] pb-2">
            Parâmetros do Sistema
          </h3>

          {success && (
            <div className="bg-salon-success/10 border border-salon-success/30 text-salon-success text-xs rounded-lg p-3.5 flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5" />
              <span>Configurações salvas e aplicadas com sucesso.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-gray-400 font-medium">Antecedência lembrete de visita (horas)</label>
                <input
                  type="number"
                  value={form.reminder_hours}
                  onChange={(e) => setForm(prev => ({ ...prev, reminder_hours: parseInt(e.target.value) || 24 }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enable_reminders"
                  checked={form.enable_reminders}
                  onChange={(e) => setForm(prev => ({ ...prev, enable_reminders: e.target.checked }))}
                  className="w-4 h-4 rounded bg-salon-bg border-salon-border focus:ring-0 text-primary"
                />
                <label htmlFor="enable_reminders" className="text-gray-300 font-medium cursor-pointer">
                  Disparar lembrete automático de visita de comprador
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enable_confirmations"
                  checked={form.enable_confirmations}
                  onChange={(e) => setForm(prev => ({ ...prev, enable_confirmations: e.target.checked }))}
                  className="w-4 h-4 rounded bg-salon-bg border-salon-border focus:ring-0 text-primary"
                />
                <label htmlFor="enable_confirmations" className="text-gray-300 font-medium cursor-pointer">
                  Confirmar visitas automaticamente pelo WhatsApp no momento do agendamento
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enable_responses"
                  checked={form.enable_responses}
                  onChange={(e) => setForm(prev => ({ ...prev, enable_responses: e.target.checked }))}
                  className="w-4 h-4 rounded bg-salon-bg border-salon-border focus:ring-0 text-primary"
                />
                <label htmlFor="enable_responses" className="text-gray-300 font-medium cursor-pointer">
                  Ativar robô chatbot de qualificação (auto-respostas)
                </label>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-gray-400 font-medium">Script de Qualificação (Perguntas em JSON)</label>
                <span className="text-[10px] text-gray-500">Formato: array de objetos</span>
              </div>
              <textarea
                value={form.questions_json}
                onChange={(e) => setForm(prev => ({ ...prev, questions_json: e.target.value }))}
                rows={10}
                className="w-full bg-salon-bg border border-salon-border text-salon-text-primary font-mono text-[10px] p-3 rounded-lg focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-hover text-salon-bg font-bold px-6 py-2.5 rounded-salon flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)] disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4.5 h-4.5" />
                )}
                <span>Salvar Configurações</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
