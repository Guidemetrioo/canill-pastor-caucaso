"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import { Shield, Plus, FileText, CheckCircle, Clock, Heart, Award } from "lucide-react";

export default function AnimaisPage() {
  const { animals, addAnimal, updateAnimal } = useAura();
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    gender: "macho" as const,
    birthdate: "",
    pedigree_url: "",
    registry: "",
    status: "disponível" as const,
    breed_price: 3000,
    avatar_url: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAnimal({
      name: form.name,
      gender: form.gender,
      birthdate: form.birthdate || undefined,
      pedigree_url: form.pedigree_url || undefined,
      registry: form.registry || undefined,
      status: form.status,
      breed_price: form.breed_price,
      avatar_url: form.avatar_url || undefined,
      notes: form.notes || undefined
    });
    setShowAddModal(false);
    setForm({
      name: "",
      gender: "macho",
      birthdate: "",
      pedigree_url: "",
      registry: "",
      status: "disponível",
      breed_price: 3000,
      avatar_url: "",
      notes: ""
    });
  };

  const handleUpdateStatus = async (id: number, nextStatus: any) => {
    await updateAnimal(id, { status: nextStatus });
  };

  const activeAnimal = animals.find(a => a.id === selectedAnimalId) || animals[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Matrizes &amp; Machos</h2>
          <p className="text-salon-text-secondary text-sm">
            Gerencie o plantel de matrizes e reprodutores padreadores do canil, controlando pedigrees e exames radiográficos.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-hover text-salon-bg font-bold px-4 py-2 rounded-salon text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Cadastrar Cão</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#D97457]">Plantel de Reprodutores</h3>
          
          <div className="space-y-2">
            {animals.map((a) => {
              const isSelected = activeAnimal?.id === a.id;

              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAnimalId(a.id)}
                  className={`w-full text-left p-5 border rounded-salon transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                    isSelected
                      ? "bg-salon-surface border-primary shadow-[0_4px_15px_rgba(201,169,110,0.08)]"
                      : "bg-salon-surface border-salon-border hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${
                      isSelected ? "bg-primary/20 border-primary text-primary" : "bg-salon-bg border-salon-border text-salon-text-secondary"
                    }`}>
                      {a.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-salon-text-primary">{a.name}</h4>
                      <p className={`text-[8px] font-bold uppercase ${a.gender === "macho" ? "text-blue-400" : "text-pink-400"}`}>
                        {a.gender}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-[#2A2A2A] pt-2 text-[10px] text-gray-400 flex justify-between">
                    <span>Status: {a.status}</span>
                    {a.gender === "macho" && a.breed_price ? <span>Cobertura: R$ {a.breed_price}</span> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detail View */}
        <div className="lg:col-span-2 bg-salon-surface border border-salon-border rounded-salon p-6 space-y-6">
          {activeAnimal ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
                <div>
                  <h3 className="text-base font-bold">{activeAnimal.name}</h3>
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full ${
                    activeAnimal.gender === "macho" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                  }`}>
                    {activeAnimal.gender}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-[9px] font-bold text-salon-text-secondary uppercase">Status Reprodutivo:</label>
                  <select
                    value={activeAnimal.status}
                    onChange={(e) => handleUpdateStatus(activeAnimal.id, e.target.value as any)}
                    className="bg-salon-bg border border-salon-border text-white text-xs p-1.5 rounded focus:outline-none"
                  >
                    <option value="disponível">Disponível / Ativo</option>
                    <option value="em_repouso">Em repouso</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-salon-bg/30 border border-salon-border rounded-salon p-5 space-y-4 text-xs">
                  <h4 className="text-xs font-bold text-salon-text-secondary uppercase tracking-wider flex items-center gap-1.5 border-b border-[#2A2A2A] pb-2">
                    <Award className="w-4.5 h-4.5 text-primary" /> Ficha Genealógica
                  </h4>
                  <div className="space-y-3 font-semibold text-gray-300">
                    <div className="flex justify-between">
                      <span>Registro CBKC:</span>
                      <span className="text-white">{activeAnimal.registry || "Não informado"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data de Nasc.:</span>
                      <span className="text-white">
                        {activeAnimal.birthdate ? new Date(activeAnimal.birthdate).toLocaleDateString("pt-BR") : "Não informada"}
                      </span>
                    </div>
                    {activeAnimal.gender === "macho" && (
                      <div className="flex justify-between">
                        <span>Valor do Serviço Monta:</span>
                        <span className="text-primary">{activeAnimal.breed_price ? `R$ ${activeAnimal.breed_price.toLocaleString("pt-BR")}` : "Sob consulta"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-salon-bg/30 border border-salon-border rounded-salon p-5 space-y-4 text-xs flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-salon-text-secondary uppercase tracking-wider flex items-center gap-1.5 border-b border-[#2A2A2A] pb-2">
                    <FileText className="w-4.5 h-4.5 text-primary" /> Observações de Manejo
                  </h4>
                  <p className="text-gray-400 leading-relaxed italic flex-1">
                    {activeAnimal.notes || "Nenhuma observação cadastrada."}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-xs text-salon-text-secondary">
              Cadastre reprodutores para gerenciar a ficha do plantel.
            </div>
          )}
        </div>

      </div>

      {/* Modal Add Animal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold">Cadastrar Reprodutor / Matriz</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Nome do Cão</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    placeholder="Ex: Kahn da Aura..."
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Gênero</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value as any }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  >
                    <option value="macho">Macho (Padreador)</option>
                    <option value="fêmea">Fêmea (Matriz)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Data Nascimento</label>
                  <input
                    type="date"
                    value={form.birthdate}
                    onChange={(e) => setForm(prev => ({ ...prev, birthdate: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Registro (CBKC)</label>
                  <input
                    type="text"
                    value={form.registry}
                    onChange={(e) => setForm(prev => ({ ...prev, registry: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    placeholder="Ex: CBKC-12345"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Preço Monta (R$)</label>
                  <input
                    type="number"
                    value={form.breed_price}
                    onChange={(e) => setForm(prev => ({ ...prev, breed_price: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Foto Perfil (Upload ou URL)</label>
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setForm(prev => ({ ...prev, avatar_url: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-salon-bg border border-salon-border p-1.5 rounded-lg text-white text-xs file:bg-primary file:text-salon-bg file:border-none file:px-2 file:py-1 file:rounded file:cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.avatar_url}
                      onChange={(e) => setForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                      className="w-full bg-salon-bg border border-salon-border p-2 rounded-lg text-white text-[10px]"
                      placeholder="Ou cole a URL da foto..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Notas de Saúde / Pedigree</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white resize-none"
                  placeholder="Ex: Laudo displasia isento, importado da Rússia..."
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
