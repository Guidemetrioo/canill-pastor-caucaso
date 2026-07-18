"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import { 
  Plus, Clock, User, Heart, ShieldAlert, CheckCircle2, Pill, Syringe,
  Calendar, ChevronLeft, ChevronRight, CheckSquare, Trash2, CalendarDays, List 
} from "lucide-react";

type TabType = "todos" | "vacina" | "vermifugo" | "cio" | "tarefa";

export default function AgendaCaninaPage() {
  const { 
    agendaEvents, 
    animals, 
    filhotes, 
    addAgendaEvent, 
    updateAgendaEventStatus, 
    deleteAgendaEvent 
  } = useAura();
  
  const [activeTab, setActiveTab] = useState<TabType>("todos");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDogFilter, setSelectedDogFilter] = useState<string>("all");
  
  // Calendar States
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [form, setForm] = useState({
    type: "vacina" as Exclude<TabType, "todos">,
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

    if (form.type === "vermifugo") {
      dbType = "vermifugacao";
    } else if (form.type === "cio") {
      dbType = "cobertura";
      finalTitle = `Cio: ${form.title}`;
    } else if (form.type === "tarefa") {
      dbType = "cobertura";
      finalTitle = `Tarefa: ${form.title}`;
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
      type: activeTab === "todos" ? "vacina" : activeTab,
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

  const handleOpenAddModalForDate = (date: Date) => {
    const yearStr = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, "0");
    const dayStr = String(date.getDate()).padStart(2, "0");
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    
    setForm({
      type: activeTab === "todos" ? "vacina" : activeTab,
      dogName: "",
      title: "",
      description: "",
      datetime: `${yearStr}-${monthStr}-${dayStr}T${hours}:${minutes}`,
      status: "Agendado"
    });
    setShowAddModal(true);
  };

  // Filter events based on active tab and dog filter
  const getFilteredEvents = () => {
    let events = [];

    if (activeTab === "todos") {
      events = agendaEvents.filter((e) => 
        e.type === "vacina" || 
        e.type === "vermifugacao" || 
        (e.type === "cobertura" && (e.title.startsWith("Cio:") || e.title.startsWith("Tarefa:")))
      );
    } else if (activeTab === "vacina") {
      events = agendaEvents.filter((e) => e.type === "vacina");
    } else if (activeTab === "vermifugo") {
      events = agendaEvents.filter((e) => e.type === "vermifugacao");
    } else if (activeTab === "cio") {
      events = agendaEvents.filter((e) => e.type === "cobertura" && e.title.startsWith("Cio:"));
    } else {
      events = agendaEvents.filter((e) => e.type === "cobertura" && e.title.startsWith("Tarefa:"));
    }

    if (selectedDogFilter !== "all") {
      events = events.filter((e) => e.assigned_to === selectedDogFilter);
    }

    return events.sort((a, b) => a.datetime.localeCompare(b.datetime));
  };

  const filteredEvents = getFilteredEvents();

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Prev month days padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i)
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i)
    });
  }

  // Next month days padding to make 42 grid cells
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i)
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (date: Date) => {
    return agendaEvents.filter((event) => {
      const eventDate = new Date(event.datetime);
      const matchesDate = 
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate();
      
      let matchesCategory = false;
      if (activeTab === "todos") {
        matchesCategory = 
          event.type === "vacina" || 
          event.type === "vermifugacao" || 
          (event.type === "cobertura" && (event.title.startsWith("Cio:") || event.title.startsWith("Tarefa:")));
      } else if (activeTab === "vacina") {
        matchesCategory = event.type === "vacina";
      } else if (activeTab === "vermifugo") {
        matchesCategory = event.type === "vermifugacao";
      } else if (activeTab === "cio") {
        matchesCategory = event.type === "cobertura" && event.title.startsWith("Cio:");
      } else if (activeTab === "tarefa") {
        matchesCategory = event.type === "cobertura" && event.title.startsWith("Tarefa:");
      }

      const matchesDog = selectedDogFilter === "all" || event.assigned_to === selectedDogFilter;

      return matchesDate && matchesCategory && matchesDog;
    });
  };

  const getEventTypesForDate = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    return {
      hasVacina: dayEvents.some(e => e.type === "vacina"),
      hasVermifugo: dayEvents.some(e => e.type === "vermifugacao"),
      hasCio: dayEvents.some(e => e.type === "cobertura" && e.title.startsWith("Cio:")),
      hasTarefa: dayEvents.some(e => e.type === "cobertura" && e.title.startsWith("Tarefa:"))
    };
  };

  const selectedDayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const getTabColor = (tab: TabType) => {
    switch (tab) {
      case "todos":
        return "text-primary border-primary bg-primary/5";
      case "vacina":
        return "text-red-400 border-red-500 bg-red-500/5";
      case "vermifugo":
        return "text-blue-400 border-blue-500 bg-blue-500/5";
      case "cio":
        return "text-pink-400 border-pink-500 bg-pink-500/5";
      case "tarefa":
        return "text-amber-400 border-amber-500 bg-amber-500/5";
    }
  };

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case "todos":
        return <CalendarDays className="w-4 h-4" />;
      case "vacina":
        return <Syringe className="w-4 h-4" />;
      case "vermifugo":
        return <Pill className="w-4 h-4" />;
      case "cio":
        return <Heart className="w-4 h-4" />;
      case "tarefa":
        return <CheckSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Toggle View */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agenda Canina</h2>
          <p className="text-salon-text-secondary text-sm">
            Controle de vacinas, vermífugos, ciclos de cio e tarefas do seu plantel.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="bg-salon-surface border border-salon-border rounded-lg p-0.5 flex">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "calendar"
                  ? "bg-primary text-salon-bg"
                  : "text-salon-text-secondary hover:text-salon-text-primary"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendário</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "list"
                  ? "bg-primary text-salon-bg"
                  : "text-salon-text-secondary hover:text-salon-text-primary"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Listas</span>
            </button>
          </div>

          <button
            onClick={() => {
              setForm({
                type: activeTab === "todos" ? "vacina" : activeTab,
                dogName: "",
                title: "",
                description: "",
                datetime: "",
                status: "Agendado"
              });
              setShowAddModal(true);
            }}
            className="bg-primary hover:bg-primary-hover text-salon-bg font-bold px-4 py-2 rounded-salon text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)] ml-auto sm:ml-0"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Agendar Compromisso</span>
          </button>
        </div>
      </div>

      {/* Global Category Tabs and Filters (Always Above) */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-salon-border pb-4">
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {(["todos", "vacina", "vermifugo", "cio", "tarefa"] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === "todos"
              ? "Todos"
              : tab === "vacina" 
              ? "Vacinas" 
              : tab === "vermifugo" 
              ? "Vermífugos" 
              : tab === "cio" 
              ? "Ciclos de Cio" 
              : "Tarefas";
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  // Update default form type if not on "todos"
                  if (tab !== "todos") {
                    setForm((prev) => ({ ...prev, type: tab }));
                  }
                }}
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

      {/* View Mode Component Switch */}
      {viewMode === "calendar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Calendar Grid (2/3) */}
          <div className="lg:col-span-2 bg-salon-surface border border-salon-border rounded-salon p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2 text-salon-text-primary">
                <CalendarDays className="w-5 h-5 text-[#D97457]" />
                <span>{monthNames[month]} de {year}</span>
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 border border-salon-border rounded-lg hover:bg-salon-bg hover:text-white transition-all text-salon-text-secondary"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 border border-salon-border rounded-lg hover:bg-salon-bg hover:text-white transition-all text-salon-text-secondary"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-salon-text-secondary uppercase tracking-wider">
              {weekDays.map((d) => (
                <div key={d} className="py-2">{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((cell, idx) => {
                const dayEvents = getEventsForDate(cell.date);
                const hasEvents = dayEvents.length > 0;
                
                const isSelected = selectedDate && 
                  selectedDate.getFullYear() === cell.date.getFullYear() &&
                  selectedDate.getMonth() === cell.date.getMonth() &&
                  selectedDate.getDate() === cell.date.getDate();
                
                const today = new Date();
                const isToday = today.getFullYear() === cell.date.getFullYear() &&
                  today.getMonth() === cell.date.getMonth() &&
                  today.getDate() === cell.date.getDate();

                const { hasVacina, hasVermifugo, hasCio, hasTarefa } = getEventTypesForDate(cell.date);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(cell.date)}
                    className={`min-h-[75px] p-2 flex flex-col justify-between items-start rounded-lg border text-left transition-all ${
                      cell.isCurrentMonth 
                        ? "text-salon-text-primary" 
                        : "text-salon-text-secondary opacity-40 hover:opacity-75"
                    } ${
                      isSelected 
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : isToday 
                        ? "border-primary/40 bg-primary/5"
                        : "border-salon-border hover:border-gray-500 bg-salon-bg/20"
                    }`}
                  >
                    <span className={`text-xs font-bold ${isToday ? "text-primary bg-primary/10 px-1.5 py-0.5 rounded" : ""}`}>
                      {cell.day}
                    </span>

                    {/* Event Dots */}
                    {hasEvents && (
                      <div className="flex flex-wrap gap-1 mt-2 w-full">
                        {hasVacina && (
                          <span className="w-2 h-2 rounded-full bg-red-500" title="Vacina" />
                        )}
                        {hasVermifugo && (
                          <span className="w-2 h-2 rounded-full bg-blue-500" title="Vermífugo" />
                        )}
                        {hasCio && (
                          <span className="w-2 h-2 rounded-full bg-pink-500" title="Cio" />
                        )}
                        {hasTarefa && (
                          <span className="w-2 h-2 rounded-full bg-amber-500" title="Tarefa" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Colors Legend */}
            <div className="flex flex-wrap gap-4 text-[10px] text-salon-text-secondary border-t border-salon-border/50 pt-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Vacinas</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Vermífugos</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                <span>Ciclos de Cio</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Tarefas do Dono</span>
              </span>
            </div>
          </div>

          {/* Details Panel (1/3) */}
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 flex flex-col justify-between min-h-[480px]">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-salon-border/60">
                <h3 className="text-sm font-bold text-salon-text-primary">
                  {selectedDate ? (
                    <>Compromissos - {selectedDate.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}</>
                  ) : (
                    <>Selecione uma data</>
                  )}
                </h3>
                {selectedDate && (
                  <button
                    onClick={() => handleOpenAddModalForDate(selectedDate)}
                    className="text-primary hover:text-primary-light text-[10px] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {selectedDayEvents.length === 0 ? (
                  <div className="text-center py-12 text-salon-text-secondary text-xs space-y-2">
                    <CheckCircle2 className="w-8 h-8 mx-auto opacity-40 text-salon-success" />
                    <p className="font-semibold text-salon-text-primary">Tudo em dia!</p>
                    <p className="text-[10px]">Nenhum compromisso para esta data.</p>
                  </div>
                ) : (
                  selectedDayEvents.map((evt) => {
                    const eventTime = new Date(evt.datetime).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit"
                    });

                    let categoryColor = "text-red-400 border-red-500/20 bg-red-500/5";
                    let categoryLabel = "Vacina";
                    if (evt.type === "vermifugacao") {
                      categoryColor = "text-blue-400 border-blue-500/20 bg-blue-500/5";
                      categoryLabel = "Vermífugo";
                    } else if (evt.type === "cobertura") {
                      if (evt.title.startsWith("Cio:")) {
                        categoryColor = "text-pink-400 border-pink-500/20 bg-pink-500/5";
                        categoryLabel = "Cio";
                      } else {
                        categoryColor = "text-amber-400 border-amber-500/20 bg-amber-500/5";
                        categoryLabel = "Tarefa";
                      }
                    }

                    const displayTitle = evt.title.startsWith("Cio:") 
                      ? evt.title.replace("Cio:", "").trim() 
                      : evt.title.startsWith("Tarefa:") 
                      ? evt.title.replace("Tarefa:", "").trim() 
                      : evt.title;

                    return (
                      <div
                        key={evt.id}
                        className="p-3 bg-salon-bg/40 border border-salon-border/60 rounded-xl space-y-2 hover:border-gray-500 transition-all text-xs"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${categoryColor}`}>
                            {categoryLabel}
                          </span>
                          <div className="flex items-center gap-1">
                            <select
                              value={evt.status}
                              onChange={(e) => handleStatusChange(evt.id, e.target.value as any)}
                              className="bg-salon-bg border border-salon-border text-salon-text-primary text-[10px] p-1 rounded focus:outline-none"
                            >
                              <option value="Agendado">Agendado</option>
                              <option value="Confirmado">Confirmado</option>
                              <option value="Concluído">Concluído</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                            <button
                              onClick={() => {
                                if (confirm("Tem certeza que deseja remover este compromisso?")) {
                                  deleteAgendaEvent(evt.id);
                                }
                              }}
                              className="text-salon-text-secondary hover:text-red-400 p-1 rounded transition-colors"
                              title="Remover compromisso"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-salon-text-primary">
                            {displayTitle} {evt.assigned_to && <span className="text-primary font-normal">({evt.assigned_to})</span>}
                          </h4>
                          {evt.description && <p className="text-[10px] text-salon-text-secondary mt-0.5">{evt.description}</p>}
                        </div>

                        <div className="flex items-center gap-3 text-[9px] text-gray-400 pt-1 border-t border-salon-border/40">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#D97457]" />
                            <span>{eventTime}h</span>
                          </span>
                          {evt.assigned_to && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-[#D97457]" />
                              <span>Cão: {evt.assigned_to}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            {selectedDate && (
              <button
                onClick={() => handleOpenAddModalForDate(selectedDate)}
                className="mt-4 w-full bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] text-xs font-bold py-2.5 rounded-lg text-center transition-all"
              >
                Agendar neste dia
              </button>
            )}
          </div>
        </div>
      ) : (
        /* List view mode */
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

                // Determine active category label & color based on event for "todos"
                let categoryColor = getTabColor(activeTab);
                let categoryLabel = activeTab === "todos" ? "" : activeTab;
                
                if (activeTab === "todos") {
                  if (evt.type === "vacina") {
                    categoryColor = getTabColor("vacina");
                    categoryLabel = "vacina";
                  } else if (evt.type === "vermifugacao") {
                    categoryColor = getTabColor("vermifugo");
                    categoryLabel = "vermifugo";
                  } else if (evt.type === "cobertura") {
                    if (evt.title.startsWith("Cio:")) {
                      categoryColor = getTabColor("cio");
                      categoryLabel = "cio";
                    } else {
                      categoryColor = getTabColor("tarefa");
                      categoryLabel = "tarefa";
                    }
                  }
                }

                const displayTitle = evt.title.startsWith("Cio:") 
                  ? evt.title.replace("Cio:", "").trim() 
                  : evt.title.startsWith("Tarefa:") 
                  ? evt.title.replace("Tarefa:", "").trim() 
                  : evt.title;

                return (
                  <div
                    key={evt.id}
                    className="p-5 bg-salon-bg/40 border border-salon-border/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-500 transition-all"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shrink-0 mt-0.5 ${categoryColor}`}>
                        {categoryLabel}
                      </span>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-salon-text-primary">
                          {displayTitle} {evt.assigned_to && <span className="text-primary font-normal">({evt.assigned_to})</span>}
                        </h4>
                        {evt.description && <p className="text-xs text-salon-text-secondary">{evt.description}</p>}
                        
                        <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 pt-1.5">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
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
                      <button
                        onClick={() => {
                          if (confirm("Tem certeza que deseja remover este compromisso?")) {
                            deleteAgendaEvent(evt.id);
                          }
                        }}
                        className="text-salon-text-secondary hover:text-red-400 p-1.5 rounded transition-colors"
                        title="Remover compromisso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal Add Health Event / Task */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              {getTabIcon(form.type)}
              <span>
                Agendar {
                  form.type === "vacina" 
                    ? "Vacina" 
                    : form.type === "vermifugo" 
                    ? "Vermífugo" 
                    : form.type === "cio" 
                    ? "Cio" 
                    : "Tarefa"
                }
              </span>
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Event Type selection in form */}
              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Categoria</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as Exclude<TabType, "todos"> }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                >
                  <option value="vacina">Vacina</option>
                  <option value="vermifugo">Vermífugo</option>
                  <option value="cio">Ciclo de Cio</option>
                  <option value="tarefa">Tarefa do Proprietário</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">
                  Selecionar Cão / Filhote {form.type !== "tarefa" && <span className="text-red-400">*</span>}
                </label>
                <select
                  value={form.dogName}
                  onChange={(e) => setForm((prev) => ({ ...prev, dogName: e.target.value }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  required={form.type !== "tarefa"}
                >
                  <option value="">{form.type === "tarefa" ? "Geral / Nenhum Cão" : "Selecione..."}</option>
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
                  {form.type === "vacina"
                    ? "Nome da Vacina (Ex: V10, Antirrábica)"
                    : form.type === "vermifugo"
                    ? "Nome do Vermífugo (Ex: Drontal, Chemital)"
                    : form.type === "cio"
                    ? "Identificação do Cio (Ex: Início de Ciclo)"
                    : "Nome da Tarefa (Ex: Limpar canil, Comprar ração)"}
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  placeholder={
                    form.type === "vacina"
                      ? "Digite o nome da vacina..."
                      : form.type === "vermifugo"
                      ? "Digite o nome do vermífugo..."
                      : form.type === "cio"
                      ? "Ex: Início do sangramento..."
                      : "Ex: Comprar saco de ração..."
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">
                  {form.type === "tarefa" ? "Detalhes da Tarefa" : "Observações / Dosagem"}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white resize-none"
                  placeholder={
                    form.type === "tarefa"
                      ? "Ex: Trazer 2 sacos de ração filhote do distribuidor..."
                      : "Ex: 1ª dose, 2.5ml, observações adicionais..."
                  }
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
