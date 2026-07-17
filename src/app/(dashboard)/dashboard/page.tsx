"use client";

import { useEffect, useState } from "react";
import { useAura } from "@/context/AuraContext";
import {
  Shield,
  Calendar,
  Users,
  AlertTriangle,
  Gift,
  Clock,
  Sparkles,
  DollarSign,
  CheckCircle2,
  Inbox,
  Flame,
  Home,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const {
    clients,
    leads,
    animals,
    ninhadas,
    filhotes,
    agendaEvents,
    financialEntries,
  } = useAura();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Calculations for KPIs
  // Monthly Revenue (total Entradas)
  const monthlyRevenue = financialEntries
    .filter((entry) => entry.type === "Entrada")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // New active leads (Novo + Qualificando)
  const activeLeadsCount = leads.filter(
    (lead) => lead.status === "Novo" || lead.status === "Qualificando"
  ).length;

  // Active dogs count
  const activeDogsCount = animals.length;

  // Available puppies
  const availablePuppiesCount = filhotes.filter(
    (f) => f.status === "Disponível"
  ).length;

  // 2. Data for Revenue Chart by Category
  const getRevenueByCategory = (cat: string) => {
    return financialEntries
      .filter((e) => e.type === "Entrada" && e.category === cat)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const chartData = [
    { name: "Filhotes", faturamento: getRevenueByCategory("Venda Filhote") || 6000 },
    { name: "Cobertura", faturamento: getRevenueByCategory("Cobertura") || 3500 },
  ];

  // 3. Upcoming events (next 5 days) - only visits
  const upcomingEvents = [...agendaEvents]
    .filter((e) => e.type === "visita" && e.status !== "Concluído" && e.status !== "Cancelado")
    .sort((a, b) => a.datetime.localeCompare(b.datetime))
    .slice(0, 5);

  // 4. Alerts Panel
  // A. Vaccination alert (puppies with pending vaccines)
  const pendingVaccines = filhotes.filter((f) =>
    f.health_records.some((r) => r.type === "vacina" && r.status === "Pendente")
  );

  // B. Due / Overdue alerts (visits today)
  const todayStr = new Date().toISOString().split("T")[0];
  const todayVisits = agendaEvents.filter(
    (e) => e.type === "visita" && e.datetime.startsWith(todayStr) && e.status === "Agendado"
  );

  // C. Low stock alert simulation (e.g. feed inventory low - simulated)
  const feedStockLow = true;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Geral</h2>
        <p className="text-salon-text-secondary text-sm">
          Acompanhe o desempenho e a saúde operacional do canil em tempo real.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Faturamento */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 flex justify-between items-center">
          <div className="space-y-2">
            <span className="text-xs text-salon-text-secondary font-medium uppercase tracking-wider">
              Faturamento Consolidado
            </span>
            <h3 className="text-2xl font-bold text-salon-text-primary">
              R$ {monthlyRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-salon-text-secondary">Entradas acumuladas no mês</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Active Leads */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 flex justify-between items-center">
          <div className="space-y-2">
            <span className="text-xs text-salon-text-secondary font-medium uppercase tracking-wider">
              Leads Ativos (Funil)
            </span>
            <h3 className="text-2xl font-bold text-salon-text-primary">
              {activeLeadsCount}
            </h3>
            <p className="text-[10px] text-salon-text-secondary">
              Novos ou em qualificação pelo bot
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Boarders */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 flex justify-between items-center">
          <div className="space-y-2">
            <span className="text-xs text-salon-text-secondary font-medium uppercase tracking-wider">
              Cães do Plantel
            </span>
            <h3 className="text-2xl font-bold text-salon-text-primary">
              {activeDogsCount}
            </h3>
            <p className="text-[10px] text-salon-text-secondary">Matrizes e Padreadores ativos</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-salon-success/10 border border-salon-success/20 flex items-center justify-center text-salon-success">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Available Puppies */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 flex justify-between items-center">
          <div className="space-y-2">
            <span className="text-xs text-salon-text-secondary font-medium uppercase tracking-wider">
              Filhotes Disponíveis
            </span>
            <h3 className="text-2xl font-bold text-salon-text-primary">
              {availablePuppiesCount}
            </h3>
            <p className="text-[10px] text-salon-text-secondary">Prontos para comercialização</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Central Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: Revenue by Category */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-4">
          <div>
            <h4 className="text-base font-bold">Receitas por Categoria</h4>
            <p className="text-xs text-salon-text-secondary">Gráfico demonstrativo por canal de serviço</p>
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "12px" }}
                    labelStyle={{ color: "#F5F5F5", fontWeight: "bold", fontSize: 12 }}
                    itemStyle={{ color: "#D97457", fontSize: 12 }}
                    formatter={(value: any) => [`R$ ${value}`, "Receita"]}
                  />
                  <Bar dataKey="faturamento" fill="#D97457" radius={[4, 4, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-salon-bg animate-pulse rounded-lg flex items-center justify-center text-xs text-salon-text-secondary">
                Carregando gráfico...
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Next Events / Agenda */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-base font-bold">Próximos Compromissos</h4>
              <p className="text-xs text-salon-text-secondary">Visitas e tarefas agendadas ordenadas</p>
            </div>
            <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase">
              {upcomingEvents.length} Pendentes
            </span>
          </div>

          <div className="flex-1 space-y-3.5 mt-4 overflow-y-auto max-h-64 pr-1">
            {upcomingEvents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-salon-success opacity-85" />
                <p className="text-xs font-semibold text-salon-text-primary">Tudo concluído!</p>
                <p className="text-[10px] text-salon-text-secondary">Nenhum compromisso agendado para os próximos dias.</p>
              </div>
            ) : (
              upcomingEvents.map((evt) => {
                const time = new Date(evt.datetime).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div
                    key={evt.id}
                    className="p-3 bg-salon-bg/40 border border-salon-border/60 rounded-lg flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-primary bg-primary/5 border border-primary/20 p-2 rounded-lg shrink-0">
                        {time}
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-salon-text-primary">{evt.title}</h5>
                        <p className="text-[10px] text-salon-text-secondary mt-0.5">
                          {evt.description || "Sem descrição"} &bull; {evt.type}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0 ${
                        evt.status === "Confirmado"
                          ? "bg-salon-success/15 text-salon-success border border-salon-success/20"
                          : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Alerts Panel */}
      <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-4">
        <div>
          <h4 className="text-base font-bold">Painel de Alertas Operacionais</h4>
          <p className="text-xs text-salon-text-secondary">Notificações e atenções necessárias na gestão</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Alert 1: Feed Stock */}
          {feedStockLow && (
            <div className="bg-salon-error/10 border border-salon-error/25 text-salon-error text-xs rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-salon-error" />
              <div>
                <p className="font-bold">Estoque de Ração</p>
                <p className="text-[10px] text-salon-text-secondary mt-1">
                  Alerta: Estoque de Ração de Filhotes abaixo de 30kg. Providenciar compra.
                </p>
              </div>
            </div>
          )}

          {/* Alert 2: Visitas Hoje */}
          {todayVisits.length > 0 ? (
            <div className="bg-salon-alert/10 border border-salon-alert/25 text-salon-alert text-xs rounded-lg p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 shrink-0 mt-0.5 text-salon-alert" />
              <div>
                <p className="font-bold">Visitas Hoje</p>
                <p className="text-[10px] text-salon-text-secondary mt-1">
                  Atenção: Você tem {todayVisits.length} visita(s) agendada(s) para hoje. Verifique a agenda.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-salon-bg/40 border border-salon-border/60 text-xs rounded-lg p-4 flex items-start gap-3 opacity-60">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-salon-success" />
              <div>
                <p className="font-bold text-salon-text-primary">Visitas de Hoje</p>
                <p className="text-[10px] text-salon-text-secondary mt-1">Nenhuma visita pendente para hoje.</p>
              </div>
            </div>
          )}

          {/* Alert 3: Pending Vaccines */}
          {pendingVaccines.length > 0 ? (
            <div className="bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs rounded-lg p-4 flex items-start gap-3">
              <Gift className="w-5 h-5 shrink-0 mt-0.5 text-blue-400" />
              <div>
                <p className="font-bold">Vacinas Pendentes</p>
                <p className="text-[10px] text-salon-text-secondary mt-1">
                  Existem {pendingVaccines.length} filhote(s) com vacinas/vermífugos pendentes na linha do tempo.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-salon-bg/40 border border-salon-border/60 text-xs rounded-lg p-4 flex items-start gap-3 opacity-60">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-salon-success" />
              <div>
                <p className="font-bold text-salon-text-primary">Vacinação</p>
                <p className="text-[10px] text-salon-text-secondary mt-1">Todos os filhotes estão com vacinas em dia.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
