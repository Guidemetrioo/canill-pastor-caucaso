"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import { Network, Plus, Trash, Check, Scale, Calendar, Sparkles, DollarSign, Activity } from "lucide-react";

export default function NinhadasPage() {
  const { ninhadas, filhotes, animals, addNinhada, updateNinhada, addFilhote, updateFilhote } = useAura();
  const [selectedLitterId, setSelectedLitterId] = useState<number | null>(null);
  
  const [showAddLitterModal, setShowAddLitterModal] = useState(false);
  const [showAddPuppyModal, setShowAddPuppyModal] = useState(false);

  // Forms
  const [litterForm, setLitterForm] = useState({
    mother_id: "",
    father_id: "",
    birth_date: "",
    puppy_count_male: 0,
    puppy_count_female: 0,
    status: "Planejada" as const,
    notes: ""
  });

  const [puppyForm, setPuppyForm] = useState({
    name: "",
    gender: "macho" as const,
    price: 6000,
    status: "Disponível" as const,
    notes: "",
    avatar_url: ""
  });

  const handleAddLitter = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNinhada({
      mother_id: litterForm.mother_id ? parseInt(litterForm.mother_id) : undefined,
      father_id: litterForm.father_id ? parseInt(litterForm.father_id) : undefined,
      birth_date: litterForm.birth_date || undefined,
      puppy_count_male: litterForm.puppy_count_male,
      puppy_count_female: litterForm.puppy_count_female,
      status: litterForm.status,
      notes: litterForm.notes || undefined
    });
    setShowAddLitterModal(false);
    setLitterForm({
      mother_id: "",
      father_id: "",
      birth_date: "",
      puppy_count_male: 0,
      puppy_count_female: 0,
      status: "Planejada",
      notes: ""
    });
  };

  const handleAddPuppy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLitterId) return;
    await addFilhote({
      litter_id: selectedLitterId,
      name: puppyForm.name,
      gender: puppyForm.gender,
      price: puppyForm.price,
      status: puppyForm.status,
      notes: puppyForm.notes || undefined,
      avatar_url: puppyForm.avatar_url || undefined,
      photos: puppyForm.avatar_url ? [puppyForm.avatar_url] : [],
      health_records: [],
      weight_history: []
    });
    setShowAddPuppyModal(false);
    setPuppyForm({
      name: "",
      gender: "macho",
      price: 6000,
      status: "Disponível",
      notes: "",
      avatar_url: ""
    });
  };

  const handleUpdatePuppyStatus = async (id: number, nextStatus: any) => {
    await updateFilhote(id, { status: nextStatus });
  };

  const selectedLitter = ninhadas.find(n => n.id === selectedLitterId);
  const selectedLitterPuppies = filhotes.filter(f => f.litter_id === selectedLitterId);

  const mothers = animals.filter(a => a.gender === "fêmea");
  const fathers = animals.filter(a => a.gender === "macho");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Ninhadas &amp; Filhotes</h2>
          <p className="text-salon-text-secondary text-sm">
            Organize o ciclo reprodutivo do canil, o acompanhamento de saúde dos filhotes e seu status comercial.
          </p>
        </div>
        <button
          onClick={() => setShowAddLitterModal(true)}
          className="bg-primary hover:bg-primary-hover text-salon-bg font-bold px-4 py-2 rounded-salon text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Registrar Ninhada</span>
        </button>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Litters */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#D97457]">Ninhadas Cadastradas</h3>
          
          <div className="space-y-2">
            {ninhadas.length === 0 ? (
              <p className="text-xs text-salon-text-secondary py-8 text-center bg-salon-surface border border-salon-border rounded-salon">Nenhuma ninhada cadastrada.</p>
            ) : (
              ninhadas.map((litter) => {
                const mother = animals.find(a => a.id === litter.mother_id);
                const father = animals.find(a => a.id === litter.father_id);
                const isSelected = selectedLitterId === litter.id;

                return (
                  <button
                    key={litter.id}
                    onClick={() => setSelectedLitterId(litter.id)}
                    className={`w-full text-left p-5 border rounded-salon transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                      isSelected
                        ? "bg-salon-surface border-primary shadow-[0_4px_15px_rgba(201,169,110,0.08)]"
                        : "bg-salon-surface border-salon-border hover:border-gray-500"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase">
                        ID: #{litter.id} &bull; {litter.status}
                      </span>
                      {litter.birth_date && (
                        <span className="text-[9px] text-salon-text-secondary">
                          Nasc.: {new Date(litter.birth_date).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-salon-text-primary">Mãe: {mother?.name || "Desconhecida"}</p>
                      <p className="font-semibold text-salon-text-primary">Pai: {father?.name || "Desconhecido"}</p>
                    </div>

                    <div className="border-t border-[#2A2A2A] pt-2 text-[10px] text-gray-400 flex justify-between">
                      <span>M: {litter.puppy_count_male} filhotes</span>
                      <span>F: {litter.puppy_count_female} filhotes</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Puppies in Selected Litter */}
        <div className="lg:col-span-2 bg-salon-surface border border-salon-border rounded-salon p-6 space-y-6">
          {selectedLitter ? (
            <div className="space-y-6">
              
              {/* Active Litter Header */}
              <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
                <div>
                  <h3 className="text-base font-bold">Filhotes da Ninhada #{selectedLitter.id}</h3>
                  <p className="text-[10px] text-salon-text-secondary mt-0.5">{selectedLitter.notes || "Notas de ninhada padrão."}</p>
                </div>

                <button
                  onClick={() => setShowAddPuppyModal(true)}
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 px-3 py-1.5 rounded-salon text-[10px] font-bold uppercase tracking-wider transition-all"
                >
                  Adicionar Filhote
                </button>
              </div>

              {/* Puppy list */}
              <div className="space-y-4">
                {selectedLitterPuppies.length === 0 ? (
                  <p className="text-center py-12 text-xs text-salon-text-secondary">Nenhum filhote cadastrado nesta ninhada ainda.</p>
                ) : (
                  selectedLitterPuppies.map((pup) => (
                    <div
                      key={pup.id}
                      className="p-4 bg-salon-bg/40 border border-salon-border/60 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-500 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-900 overflow-hidden border border-salon-border">
                          <img
                            src={pup.avatar_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=100"}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-salon-text-primary">{pup.name}</h4>
                          <div className="flex gap-2 text-[8px] uppercase font-bold tracking-wider mt-1 text-gray-400">
                            <span className={pup.gender === "macho" ? "text-blue-400" : "text-pink-400"}>{pup.gender}</span>
                            <span>&bull;</span>
                            <span>{pup.price ? `R$ ${pup.price.toLocaleString("pt-BR")}` : "Sem valor"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status select */}
                      <div className="flex items-center gap-3">
                        <label className="text-[9px] font-bold text-salon-text-secondary uppercase">Comercial:</label>
                        <select
                          value={pup.status}
                          onChange={(e) => handleUpdatePuppyStatus(pup.id, e.target.value as any)}
                          className="bg-salon-bg border border-salon-border text-white text-xs p-1.5 rounded focus:outline-none"
                        >
                          <option value="Disponível">Disponível</option>
                          <option value="Reservado">Reservado</option>
                          <option value="Vendido">Vendido</option>
                          <option value="Canil">Canil (Matriz/Macho reserva)</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center p-12 text-salon-text-secondary space-y-2">
              <Network className="w-12 h-12 opacity-35" />
              <p className="text-xs">Selecione uma ninhada ao lado para gerenciar seus filhotes e ficha de saúde.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Litter */}
      {showAddLitterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold">Registrar Nova Ninhada</h3>
            <form onSubmit={handleAddLitter} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Mãe (Matriz)</label>
                  <select
                    value={litterForm.mother_id}
                    onChange={(e) => setLitterForm(prev => ({ ...prev, mother_id: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  >
                    <option value="">Selecione...</option>
                    {mothers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Pai (Padreador)</label>
                  <select
                    value={litterForm.father_id}
                    onChange={(e) => setLitterForm(prev => ({ ...prev, father_id: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  >
                    <option value="">Selecione...</option>
                    {fathers.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-gray-400 font-medium">Data de Nascimento</label>
                  <input
                    type="date"
                    value={litterForm.birth_date}
                    onChange={(e) => setLitterForm(prev => ({ ...prev, birth_date: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Etapa</label>
                  <select
                    value={litterForm.status}
                    onChange={(e) => setLitterForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  >
                    <option value="Planejada">Planejada</option>
                    <option value="Nascida">Nascida</option>
                    <option value="Desmamada">Desmamada</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Filhotes Machos</label>
                  <input
                    type="number"
                    value={litterForm.puppy_count_male}
                    onChange={(e) => setLitterForm(prev => ({ ...prev, puppy_count_male: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Filhotes Fêmeas</label>
                  <input
                    type="number"
                    value={litterForm.puppy_count_female}
                    onChange={(e) => setLitterForm(prev => ({ ...prev, puppy_count_female: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Observações</label>
                <textarea
                  value={litterForm.notes}
                  onChange={(e) => setLitterForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white resize-none"
                  placeholder="Ex: Linhagem excelente..."
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLitterModal(false)}
                  className="flex-1 bg-salon-bg border border-salon-border text-salon-text-primary py-2.5 rounded-lg font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] py-2.5 rounded-lg font-bold"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Puppy */}
      {showAddPuppyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold">Cadastrar Novo Filhote</h3>
            <form onSubmit={handleAddPuppy} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Nome / Identificação</label>
                  <input
                    type="text"
                    value={puppyForm.name}
                    onChange={(e) => setPuppyForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    placeholder="Ex: Thor..."
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Gênero</label>
                  <select
                    value={puppyForm.gender}
                    onChange={(e) => setPuppyForm(prev => ({ ...prev, gender: e.target.value as any }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  >
                    <option value="macho">Macho</option>
                    <option value="fêmea">Fêmea</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Preço (R$)</label>
                  <input
                    type="number"
                    value={puppyForm.price}
                    onChange={(e) => setPuppyForm(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Status Comercial</label>
                  <select
                    value={puppyForm.status}
                    onChange={(e) => setPuppyForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  >
                    <option value="Disponível">Disponível</option>
                    <option value="Reservado">Reservado</option>
                    <option value="Vendido">Vendido</option>
                    <option value="Canil">Retido no Canil</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Foto do Filhote (Upload ou URL)</label>
                <div className="flex flex-col gap-1.5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPuppyForm(prev => ({ ...prev, avatar_url: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full bg-salon-bg border border-salon-border p-1.5 rounded-lg text-white text-xs file:bg-primary file:text-salon-bg file:border-none file:px-2 file:py-1 file:rounded file:cursor-pointer"
                  />
                  <input
                    type="text"
                    value={puppyForm.avatar_url}
                    onChange={(e) => setPuppyForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white text-[10px]"
                    placeholder="Ou cole a URL da foto..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Notas / Características</label>
                <textarea
                  value={puppyForm.notes}
                  onChange={(e) => setPuppyForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white resize-none"
                  placeholder="Ex: Muito ativo, excelente porte..."
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPuppyModal(false)}
                  className="flex-1 bg-salon-bg border border-salon-border text-salon-text-primary py-2.5 rounded-lg font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] py-2.5 rounded-lg font-bold"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
