"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import { Award, Plus, CheckCircle, Trophy, BookOpen } from "lucide-react";

export default function AdestramentoPage() {
  const { adestramentos, clients, addAdestramento, incrementAdestramentoSession } = useAura();
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    client_id: "",
    dog_name: "",
    plan_name: "Obediência Básica",
    sessions_total: 10,
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_id || !form.dog_name) return;

    await addAdestramento({
      client_id: parseInt(form.client_id),
      dog_name: form.dog_name,
      plan_name: form.plan_name,
      sessions_total: form.sessions_total,
      sessions_completed: 0,
      status: "Ativo",
      notes: form.notes || undefined
    });

    setShowAddModal(false);
    setForm({
      client_id: "",
      dog_name: "",
      plan_name: "Obediência Básica",
      sessions_total: 10,
      notes: ""
    });
  };

  const handleIncrement = async (id: number) => {
    await incrementAdestramentoSession(id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Adestramento Canino</h2>
          <p className="text-salon-text-secondary text-sm">
            Gerencie planos de adestramento contratados, registre aulas ministradas e acompanhe a evolução do cão.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-hover text-salon-bg font-bold px-4 py-2 rounded-salon text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Contratar Plano</span>
        </button>
      </div>

      <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-salon-border/60">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D97457]" />
            <span>Alunos Ativos</span>
          </h3>
        </div>

        <div className="space-y-4">
          {adestramentos.length === 0 ? (
            <p className="text-center py-8 text-xs text-salon-text-secondary">Nenhum cão em adestramento ativo.</p>
          ) : (
            adestramentos.map((ad) => {
              const client = clients.find((c) => c.id === ad.client_id);
              const progressPercent = Math.min(100, Math.round((ad.sessions_completed / ad.sessions_total) * 100));

              return (
                <div
                  key={ad.id}
                  className="p-5 bg-salon-bg/40 border border-salon-border/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-500 transition-all"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-sm font-bold text-salon-text-primary">
                        🎓 {ad.dog_name}
                      </h4>
                      <span className="text-[10px] bg-salon-border text-salon-text-secondary px-2 py-0.5 rounded-full">
                        Tutor: {client?.name || "Não identificado"}
                      </span>
                      <span
                        className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          ad.status === "Concluído"
                            ? "bg-salon-success/15 text-salon-success border border-salon-success/20"
                            : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {ad.status}
                      </span>
                    </div>

                    {ad.notes && <p className="text-xs text-salon-text-secondary">{ad.notes}</p>}

                    {/* Progress Bar */}
                    <div className="space-y-1.5 max-w-sm">
                      <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                        <span>Aulas executadas</span>
                        <span>{ad.sessions_completed} / {ad.sessions_total} ({progressPercent}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-salon-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {ad.status === "Ativo" && (
                      <button
                        onClick={() => handleIncrement(ad.id)}
                        className="bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] hover:bg-[#D97457] hover:text-[#0F0F0F] px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Presença / Aula +1</span>
                      </button>
                    )}
                    {ad.status === "Concluído" && (
                      <span className="text-xs text-salon-success font-bold flex items-center gap-1">
                        <Trophy className="w-4.5 h-4.5" />
                        <span>Treinamento Finalizado</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Add Training */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold">Contratar Plano de Adestramento</h3>
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
                    placeholder="Mar Marley..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Plano Contratado</label>
                  <input
                    type="text"
                    value={form.plan_name}
                    onChange={(e) => setForm(prev => ({ ...prev, plan_name: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Total de Aulas</label>
                  <input
                    type="number"
                    value={form.sessions_total}
                    onChange={(e) => setForm(prev => ({ ...prev, sessions_total: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Comentários / Foco do Treino</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white resize-none"
                  placeholder="Ex: Modificação de comportamento agressivo em guias, reatividade..."
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
