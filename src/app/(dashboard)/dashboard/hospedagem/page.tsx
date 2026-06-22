"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import { Home, Plus, Calendar, User, DollarSign } from "lucide-react";

export default function HospedagemPage() {
  const { hospedagens, clients, addHospedagem, updateHospedagemStatus } = useAura();
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    client_id: "",
    dog_name: "",
    entry_date: "",
    exit_date: "",
    daily_rate: 80,
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_id || !form.entry_date || !form.exit_date) return;

    // Calculate total amount
    const entry = new Date(form.entry_date);
    const exit = new Date(form.exit_date);
    const diffTime = Math.abs(exit.getTime() - entry.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const total = diffDays * form.daily_rate;

    await addHospedagem({
      client_id: parseInt(form.client_id),
      dog_name: form.dog_name,
      entry_date: entry.toISOString(),
      exit_date: exit.toISOString(),
      daily_rate: form.daily_rate,
      total_amount: total,
      status: "Reservado",
      notes: form.notes || undefined
    });

    setShowAddModal(false);
    setForm({
      client_id: "",
      dog_name: "",
      entry_date: "",
      exit_date: "",
      daily_rate: 80,
      notes: ""
    });
  };

  const handleStatusChange = async (id: number, nextStatus: any) => {
    await updateHospedagemStatus(id, nextStatus);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hospedagem e Creche Canina</h2>
          <p className="text-salon-text-secondary text-sm">
            Acompanhe a ocupação do hotel canino, calcule estadias e controle diárias de hóspedes.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-hover text-salon-bg font-bold px-4 py-2 rounded-salon text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Fazer Check-in</span>
        </button>
      </div>

      <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-salon-border/60">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Home className="w-5 h-5 text-[#C9A96E]" />
            <span>Lista de Hóspedes</span>
          </h3>
        </div>

        <div className="space-y-4">
          {hospedagens.length === 0 ? (
            <p className="text-center py-8 text-xs text-salon-text-secondary">Nenhum cão hospedado no momento.</p>
          ) : (
            hospedagens.map((h) => {
              const client = clients.find((c) => c.id === h.client_id);
              const entry = new Date(h.entry_date).toLocaleDateString("pt-BR");
              const exit = new Date(h.exit_date).toLocaleDateString("pt-BR");

              return (
                <div
                  key={h.id}
                  className="p-5 bg-salon-bg/40 border border-salon-border/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-500 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-sm font-bold text-salon-text-primary">
                        🐕 {h.dog_name}
                      </h4>
                      <span className="text-[10px] bg-salon-border text-salon-text-secondary px-2 py-0.5 rounded-full">
                        Tutor: {client?.name || "Não identificado"}
                      </span>
                    </div>

                    {h.notes && <p className="text-xs text-salon-text-secondary">{h.notes}</p>}

                    <div className="flex flex-wrap items-center gap-6 text-[10px] text-gray-400 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#C9A96E]" />
                        <span>Entrada: {entry} &bull; Saída: {exit}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-[#C9A96E]" />
                        <span>Valor: R$ {h.total_amount.toLocaleString("pt-BR")} (Diária: R$ {h.daily_rate})</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-[10px] font-bold text-salon-text-secondary uppercase">Status:</label>
                    <select
                      value={h.status}
                      onChange={(e) => handleStatusChange(h.id, e.target.value as any)}
                      className="bg-salon-bg border border-salon-border text-salon-text-primary text-xs p-1.5 rounded focus:outline-none"
                    >
                      <option value="Reservado">Reservado</option>
                      <option value="Hospedado">Hospedado</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Add Guest */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold">Fazer Check-in de Hóspede</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Tutor (Cliente)</label>
                  <select
                    value={form.client_id}
                    onChange={(e) => setForm(prev => ({ ...prev, client_id: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    required
                  >
                    <option value="">Selecione...</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Nome do Cão</label>
                  <input
                    type="text"
                    value={form.dog_name}
                    onChange={(e) => setForm(prev => ({ ...prev, dog_name: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    placeholder="Ex: Marley..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Data Entrada</label>
                  <input
                    type="date"
                    value={form.entry_date}
                    onChange={(e) => setForm(prev => ({ ...prev, entry_date: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Data Saída</label>
                  <input
                    type="date"
                    value={form.exit_date}
                    onChange={(e) => setForm(prev => ({ ...prev, exit_date: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Valor da Diária (R$)</label>
                <input
                  type="number"
                  value={form.daily_rate}
                  onChange={(e) => setForm(prev => ({ ...prev, daily_rate: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Instruções Alimentares / Observações</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white resize-none"
                  placeholder="Ex: Ração especial 2x ao dia, medicação..."
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
                  className="flex-1 bg-[#C9A96E] hover:bg-[#B8965C] text-[#0F0F0F] py-2.5 rounded-lg font-bold"
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
