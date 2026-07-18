"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import { CalendarDays, Plus, Clock, User, BookOpen } from "lucide-react";

export default function AgendaPage() {
  const { agendaEvents, clients, leads, addAgendaEvent, updateAgendaEventStatus, addClient } = useAura();
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    datetime: "",
    client_id: "",
    lead_id: "",
    assigned_to: "",
    visitor_name: "",
    visitor_phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetClientId: number | undefined = form.client_id ? parseInt(form.client_id) : undefined;
    
    // Auto register client if visitor name is provided
    if (!targetClientId && form.visitor_name) {
      targetClientId = await addClient({
        name: form.visitor_name,
        phone: form.visitor_phone || "(Não informado)",
        email: "",
        city: "Itatiba - SP",
        notes: `Cadastrado automaticamente via agendamento de visita.`
      });
    }

    await addAgendaEvent({
      type: "visita",
      title: form.title || `Visita de ${form.visitor_name || "Cliente"}`,
      description: form.description || undefined,
      datetime: new Date(form.datetime).toISOString(),
      client_id: targetClientId,
      lead_id: form.lead_id ? parseInt(form.lead_id) : undefined,
      assigned_to: form.assigned_to || undefined,
      status: "Agendado"
    });

    setShowAddModal(false);
    setForm({
      title: "",
      description: "",
      datetime: "",
      client_id: "",
      lead_id: "",
      assigned_to: "",
      visitor_name: "",
      visitor_phone: ""
    });
  };

  const handleStatusChange = async (id: number, nextStatus: any) => {
    await updateAgendaEventStatus(id, nextStatus);
  };

  // Filter events to only show customer visits
  const visits = agendaEvents.filter((evt) => evt.type === "visita");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agenda de Visitas</h2>
          <p className="text-salon-text-secondary text-sm">
            Gerencie as visitas de clientes e interessados agendadas ao canil.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-hover text-salon-bg font-bold px-4 py-2 rounded-salon text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Agendar Visita</span>
        </button>
      </div>

      <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-salon-border/60">
          <h3 className="text-base font-bold flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#D97457]" />
            <span>Visitas Agendadas</span>
          </h3>
        </div>

        <div className="space-y-4">
          {visits.length === 0 ? (
            <p className="text-center py-8 text-xs text-salon-text-secondary">Nenhuma visita agendada recentemente.</p>
          ) : (
            visits.map((evt) => {
              const client = clients.find((c) => c.id === evt.client_id);
              const lead = leads.find((l) => l.id === evt.lead_id);
              const eventTime = new Date(evt.datetime).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div
                  key={evt.id}
                  className="p-5 bg-salon-bg/40 border border-salon-border/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-500 transition-all"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shrink-0 mt-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Visita
                    </span>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-salon-text-primary">{evt.title}</h4>
                      {evt.description && <p className="text-xs text-salon-text-secondary">{evt.description}</p>}
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 pt-1.5">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#D97457]" />
                          <span>{eventTime}</span>
                        </span>
                        {(client || lead) && (
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#D97457]" />
                            <span>Tutor: {client ? client.name : lead?.name}</span>
                          </span>
                        )}
                        {evt.assigned_to && (
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#D97457]" />
                            <span>Atendido por: {evt.assigned_to}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-[10px] font-bold text-salon-text-secondary uppercase">Status:</label>
                    <select
                      value={evt.status}
                      onChange={(e) => handleStatusChange(evt.id, e.target.value as any)}
                      className="bg-salon-bg border border-salon-border text-salon-text-primary text-xs p-1.5 rounded focus:outline-none"
                    >
                      <option value="Agendado">Agendado</option>
                      <option value="Confirmado">Confirmado</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Add Event */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold">Agendar Nova Visita</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Data e Hora</label>
                <input
                  type="datetime-local"
                  value={form.datetime}
                  onChange={(e) => setForm(prev => ({ ...prev, datetime: e.target.value }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Título do Agendamento</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  placeholder="Ex: Visita de Guilherme para conhecer o Canil..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Descrição / Observações</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white resize-none"
                  placeholder="Notas adicionais sobre a visita..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Vincular Cliente Existente</label>
                  <select
                    value={form.client_id}
                    onChange={(e) => setForm(prev => ({ ...prev, client_id: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  >
                    <option value="">Nenhum...</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Vincular Lead</label>
                  <select
                    value={form.lead_id}
                    onChange={(e) => setForm(prev => ({ ...prev, lead_id: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  >
                    <option value="">Nenhum...</option>
                    {leads.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="border-t border-[#2A2A2A] my-3 pt-3 space-y-3">
                <h4 className="text-[10px] font-bold text-[#D97457] uppercase tracking-wider">Novo Visitante (Cadastro Automático)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-400 font-medium">Nome do Visitante</label>
                    <input
                      type="text"
                      value={form.visitor_name}
                      onChange={(e) => setForm(prev => ({ ...prev, visitor_name: e.target.value }))}
                      className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-400 font-medium">Telefone/WhatsApp</label>
                    <input
                      type="text"
                      value={form.visitor_phone}
                      onChange={(e) => setForm(prev => ({ ...prev, visitor_phone: e.target.value }))}
                      className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                      placeholder="Ex: (11) 99999-9999"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-gray-500 italic">Preencha estes campos se for um novo visitante para cadastrar como cliente automaticamente.</p>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Atendente Atribuído</label>
                <input
                  type="text"
                  value={form.assigned_to}
                  onChange={(e) => setForm(prev => ({ ...prev, assigned_to: e.target.value }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  placeholder="Ex: Fábio..."
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-salon-bg border border-salon-border text-salon-text-primary py-2.5 rounded-lg font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] py-2.5 rounded-lg font-bold"
                >
                  Agendar Visita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
