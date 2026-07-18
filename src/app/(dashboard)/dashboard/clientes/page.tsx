"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import { Users, Plus, Mail, Phone, MapPin, Tag } from "lucide-react";

export default function ClientesPage() {
  const { clients, filhotes, hospedagens, adestramentos, addClient } = useAura();
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addClient({
      name: form.name,
      phone: form.phone,
      email: form.email,
      city: form.city,
      notes: form.notes
    });
    setShowAddModal(false);
    setForm({ name: "", phone: "", email: "", city: "", notes: "" });
  };

  const getClientHistory = (clientId: number) => {
    const purchased = filhotes.filter((f) => f.status === "Vendido" && f.notes?.includes(clients.find(c => c.id === clientId)?.name || ""));
    const stays = hospedagens.filter((h) => h.client_id === clientId);
    const trainings = adestramentos.filter((t) => t.client_id === clientId);
    return { purchased, stays, trainings };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Clientes</h2>
          <p className="text-salon-text-secondary text-sm">
            Mantenha a ficha dos compradores de filhotes e contratantes de serviços organizada.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-hover text-salon-bg font-bold px-4 py-2 rounded-salon text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Cadastrar Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#D97457]">Clientes Ativos</h3>
          <div className="space-y-2">
            {clients.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedClient(c)}
                className={`w-full text-left p-4 rounded-salon border transition-all ${
                  selectedClient?.id === c.id
                    ? "bg-salon-surface border-primary"
                    : "bg-salon-surface border-salon-border hover:border-gray-500"
                }`}
              >
                <h4 className="text-xs font-bold text-salon-text-primary">{c.name}</h4>
                <p className="text-[10px] text-salon-text-secondary mt-1">{c.phone}</p>
                <p className="text-[10px] text-gray-400">{c.city}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-2 bg-salon-surface border border-salon-border rounded-salon p-6 space-y-6">
          {selectedClient ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-salon-border/60 pb-4">
                <h3 className="text-base font-bold">{selectedClient.name}</h3>
                <span className="text-[10px] text-[#D97457] font-semibold">Cliente Cadastrado</span>
              </div>

              {/* Personal Details */}
              <div className="space-y-3.5 text-xs text-gray-300 bg-salon-bg/40 border border-salon-border/60 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <Phone className="w-4.5 h-4.5 text-[#D97457] shrink-0" />
                  <span><strong>Celular:</strong> {selectedClient.phone}</span>
                </div>
                {selectedClient.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4.5 h-4.5 text-[#D97457] shrink-0" />
                    <span><strong>E-mail:</strong> {selectedClient.email}</span>
                  </div>
                )}
                {selectedClient.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4.5 h-4.5 text-[#D97457] shrink-0" />
                    <span><strong>Cidade:</strong> {selectedClient.city}</span>
                  </div>
                )}
              </div>

              {/* Purchase and service histories */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D97457]">Histórico de Contratações</h4>

                <div className="space-y-3 text-xs">
                  {/* Stays */}
                  <div className="bg-salon-bg/30 p-3 rounded-lg border border-salon-border/40">
                    <h5 className="font-bold text-salon-text-primary text-[11px] mb-1.5">Hospedagens ({getClientHistory(selectedClient.id).stays.length})</h5>
                    {getClientHistory(selectedClient.id).stays.length === 0 ? (
                      <p className="text-[10px] text-salon-text-secondary">Nenhuma hospedagem encontrada.</p>
                    ) : (
                      getClientHistory(selectedClient.id).stays.map((s) => (
                        <div key={s.id} className="text-[10px] flex justify-between text-gray-300 border-b border-[#2A2A2A] py-1 last:border-0">
                          <span>🐕 {s.dog_name} - {s.status}</span>
                          <span>Total: R$ {s.total_amount}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Trainings */}
                  <div className="bg-salon-bg/30 p-3 rounded-lg border border-salon-border/40">
                    <h5 className="font-bold text-salon-text-primary text-[11px] mb-1.5">Adestramentos ({getClientHistory(selectedClient.id).trainings.length})</h5>
                    {getClientHistory(selectedClient.id).trainings.length === 0 ? (
                      <p className="text-[10px] text-salon-text-secondary">Nenhum contrato de adestramento.</p>
                    ) : (
                      getClientHistory(selectedClient.id).trainings.map((t) => (
                        <div key={t.id} className="text-[10px] flex justify-between text-gray-300 border-b border-[#2A2A2A] py-1 last:border-0">
                          <span>🎓 {t.dog_name} ({t.plan_name})</span>
                          <span>{t.sessions_completed}/{t.sessions_total} Aulas</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Relationship notes */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-salon-text-primary">Observações Especiais</h4>
                <div className="bg-salon-bg/60 border border-salon-border/40 rounded-xl p-4 text-gray-300 leading-relaxed">
                  {selectedClient.notes || "Sem observações cadastradas."}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center p-6 text-salon-text-secondary space-y-3">
              <Users className="w-8 h-8 opacity-50" />
              <p className="text-xs">Selecione um cliente na barra lateral para carregar a ficha cadastral e histórico.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Client */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold">Cadastrar Novo Cliente</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Nome Completo</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  placeholder="Ex: Rodrigo Almeida..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Celular (WhatsApp)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    placeholder="Ex: (11) 97499-2059"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">E-mail</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    placeholder="Ex: rodrig@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Cidade / Estado</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  placeholder="Ex: São Paulo - SP"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Notas Especiais</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white resize-none"
                  placeholder="Ex: Possui preferência por ração premium, comprou filhote Thor..."
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
