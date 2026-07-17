"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import { Plus, Clock, User, Heart, ShieldAlert, CheckCircle2, Pill, Syringe } from "lucide-react";

type TabType = "vacina" | "vermifugo" | "cio";

export default function AgendaCaninaPage() {
  const { agendaEvents, animals, filhotes, addAgendaEvent, updateAgendaEventStatus } = useAura();
  const [activeTab, setActiveTab] = useState<TabType>("vacina");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDogFilter, setSelectedDogFilter] = useState<string>("all");

  const [form, setForm] = useState({
    dogName: "",
    title: "",
    description: "",
    datetime: "",
    status: "Agendado" as const
  });

  // Combine adult dogs and puppies for dropdowns
  const allDogs = [
    ...animals.map((a) => ({ id: `adult-${a.id}`, name: a.name })),
    ...filhotes.map((f) => ({ id: `puppy-${f.id}`, name: f.name }))
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let dbType: "vacina" | "vermifugacao" | "cobertura" = "vacina";
    let finalTitle = form.title;

    if (activeTab === "vermifugo") {
      dbType = "vermifugacao";
    } else if (activeTab === "cio") {
      dbType = "cobertura";
      finalTitle = `Cio: ${form.title}`;
    }

    await addAgendaEvent({
      type: dbType,
      title: finalTitle,
      description: form.description || undefined,
      datetime: new Date(form.datetime).toISOString(),
      assigned_to: form.dogName || undefined, // Store dog name in assigned_to field
      status: form.status
    });

    setShowAddModal(false);
    setForm({
      dogName: "",
      title: "",
      description: "",
      datetime: "",
      status: "Agendado"
    });
  };

  const handleStatusChange = async (id: number, nextStatus: any) => {
    await updateAgendaEventStatus(id, nextStatus);
  };

  // Filter events based on active tab and dog filter
  const getFilteredEvents = () => {
    let events = [];

    if (activeTab === "vacina") {
      events = agendaEvents.filter((e) => e.type === "vacina");
    } else if (activeTab === "vermifugo") {
      events = agendaEvents.filter((e) => e.type === "vermifugacao");
    } else {
      events = agendaEvents.filter((e) => e.type === "cobertura" && e.title.startsWith("Cio:"));
    }

    if (selectedDogFilter !== "all") {
      events = events.filter((e) => e.assigned_to === selectedDogFilter);
    }

    return events.sort((a, b) => a.datetime.localeCompare(b.datetime));
  };

  const filteredEvents = getFilteredEvents();

  const getTabColor = (tab: TabType) => {
    switch (tab) {
      case "vacina":
        return "text-red-400 border-red-500 bg-red-500/5";
      case "vermifugo":
        return "text-blue-400 border-blue-500 bg-blue-500/5";
      case "cio":
        return "text-pink-400 border-pink-500 bg-pink-500/5";
    }
  };

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case "vacina":
        return <Syringe className="w-4 h-4" />;
      case "vermifugo":
        return <Pill className="w-4 h-4" />;
      case "cio":
        return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agenda Canina</h2>
          <p className="text-salon-text-secondary text-sm">
            Controle de vacinas, vermífugos e ciclos de cio do seu plantel.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-hover text-salon-bg font-bold px-4 py-2 rounded-salon text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Agendar Atendimento</span>
        </button>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-salon-border pb-4">
        {/* Tab Buttons */}
        <div className="flex gap-2">
          {(["vacina", "vermifugo", "cio"] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === "vacina" ? "Vacinas" : tab === "vermifugo" ? "Vermífugos" : "Ciclos de Cio";
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${
                  isActive
                    ? getTabColor(tab)
                    : "border-transparent text-salon-text-secondary hover:text-salon-text-primary hover:bg-salon-bg"
                }`}
              >
                {getTabIcon(tab)}
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Dog Filter */}
        <div className="flex items-center gap-2 text-xs">
          <label className="text-salon-text-secondary whitespace-nowrap">Filtrar por Cão:</label>
          <select
            value={selectedDogFilter}
            onChange={(e) => setSelectedDogFilter(e.target.value)}
            className="bg-salon-surface border border-salon-border text-salon-text-primary p-2 rounded-lg focus:outline-none"
          >
            <option value="all">Todos os Cães</option>
            {allDogs.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-salon-surface border border-salon-border rounded-salon p-6">
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-salon-text-secondary mx-auto opacity-70" />
              <p className="text-xs font-semibold text-salon-text-primary">Tudo em dia!</p>
              <p className="text-[10px] text-salon-text-secondary">Nenhum evento registrado nessa categoria.</p>
            </div>
          ) : (
            filteredEvents.map((evt) => {
              const eventTime = new Date(evt.datetime).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              // Clean display title for Cio
              const displayTitle = evt.title.startsWith("Cio:") ? evt.title.replace("Cio:", "").trim() : evt.title;

              return (
                <div
                  key={evt.id}
                  className="p-5 bg-salon-bg/40 border border-salon-border/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-500 transition-all"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shrink-0 mt-0.5 ${getTabColor(activeTab)}`}>
                      {activeTab}
                    </span>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-salon-text-primary">
                        {displayTitle} {evt.assigned_to && <span className="text-primary font-normal">({evt.assigned_to})</span>}
                      </h4>
                      {evt.description && <p className="text-xs text-salon-text-secondary">{evt.description}</p>}
                      
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 pt-1.5">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#D97457]" />
                          <span>{eventTime}</span>
                        </span>
                        {evt.assigned_to && (
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#D97457]" />
                            <span>Cão: {evt.assigned_to}</span>
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
                      <option value="Concluído">Aplicado / Concluído</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Add Health Event */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              {getTabIcon(activeTab)}
              <span>Agendar {activeTab === "vacina" ? "Vacina" : activeTab === "vermifugo" ? "Vermífugo" : "Cio"}</span>
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Selecionar Cão / Filhote</label>
                <select
                  value={form.dogName}
                  onChange={(e) => setForm((prev) => ({ ...prev, dogName: e.target.value }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  required
                >
                  <option value="">Selecione...</option>
                  {allDogs.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Data e Hora</label>
                  <input
                    type="datetime-local"
                    value={form.datetime}
                    onChange={(e) => setForm((prev) => ({ ...prev, datetime: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Status Inicial</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  >
                    <option value="Agendado">Agendado / Planejado</option>
                    <option value="Concluído">Aplicado / Concluído</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">
                  {activeTab === "vacina"
                    ? "Nome da Vacina (Ex: V10, Antirrábica)"
                    : activeTab === "vermifugo"
                    ? "Nome do Vermífugo (Ex: Drontal, Chemital)"
                    : "Identificação do Cio (Ex: Início de Ciclo)"}
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  placeholder="Digite o título..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Observações / Dosagem</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white resize-none"
                  placeholder="Ex: 1ª dose, 2.5ml, observações adicionais..."
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
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
