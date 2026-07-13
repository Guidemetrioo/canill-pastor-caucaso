"use client";

import { useEffect, useState } from "react";
import { useAura } from "@/context/AuraContext";
import {
  Eye,
  Users,
  Smartphone,
  Laptop,
  Tablet,
  TrendingUp,
  Activity,
  Calendar,
  MousePointerClick,
  Share2,
  Globe,
  ArrowRight,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function TrafficDashboardPage() {
  const { trafficEvents } = useAura();
  const [mounted, setMounted] = useState(false);
  const [daysFilter, setDaysFilter] = useState<7 | 15 | 30>(7);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter events based on selected period
  const getFilteredEvents = () => {
    const cutOffDate = new Date();
    cutOffDate.setDate(cutOffDate.getDate() - daysFilter);
    return trafficEvents.filter((event) => new Date(event.created_at) >= cutOffDate);
  };

  const filteredEvents = getFilteredEvents();

  // 1. Calculations for KPIs
  const totalViews = filteredEvents.filter((e) => e.event_type === "page_view").length;
  
  // Unique sessions
  const uniqueSessions = new Set(filteredEvents.map((e) => e.session_id));
  const totalVisitors = uniqueSessions.size;

  // Conversion actions (whatsapp clicks + booking clicks)
  const conversionEvents = filteredEvents.filter(
    (e) => e.event_type === "whatsapp_click" || e.event_type === "booking_click"
  );
  const totalConversions = conversionEvents.length;

  // Conversion Rate (Total conversions / Unique sessions)
  const conversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;

  // 2. Timeline chart data (Views and Visitors per day)
  const getTimelineData = () => {
    const dailyData: Record<string, { views: number; visitors: Set<string> }> = {};
    
    // Initialize days
    for (let i = daysFilter - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      dailyData[label] = { views: 0, visitors: new Set() };
    }

    filteredEvents.forEach((event) => {
      const eventDate = new Date(event.created_at);
      const label = eventDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      if (dailyData[label]) {
        if (event.event_type === "page_view") {
          dailyData[label].views++;
        }
        dailyData[label].visitors.add(event.session_id);
      }
    });

    return Object.entries(dailyData).map(([date, data]) => ({
      data: date,
      "Visualizações": data.views,
      "Visitantes Únicos": data.visitors.size,
    }));
  };

  const timelineData = getTimelineData();

  // 3. Conversions chart data
  const getConversionData = () => {
    const counts = {
      whatsapp: filteredEvents.filter((e) => e.event_type === "whatsapp_click").length,
      booking: filteredEvents.filter((e) => e.event_type === "booking_click").length,
      instagram: filteredEvents.filter((e) => e.event_type === "instagram_click").length,
      youtube: filteredEvents.filter((e) => e.event_type === "youtube_click").length,
    };

    return [
      { name: "WhatsApp", Cliques: counts.whatsapp, color: "#25D366" },
      { name: "Agendamentos", Cliques: counts.booking, color: "#D97457" },
      { name: "Instagram", Cliques: counts.instagram, color: "#E1306C" },
      { name: "YouTube", Cliques: counts.youtube, color: "#FF0000" },
    ];
  };

  const conversionData = getConversionData();

  // 4. Device Distribution Data
  const getDeviceData = () => {
    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    // We count unique visitors per device type
    const visitorDevices: Record<string, string> = {};
    
    filteredEvents.forEach((event) => {
      if (!visitorDevices[event.session_id]) {
        visitorDevices[event.session_id] = event.device_type;
      }
    });

    Object.values(visitorDevices).forEach((dev) => {
      if (dev === "mobile") devices.mobile++;
      else if (dev === "desktop") devices.desktop++;
      else if (dev === "tablet") devices.tablet++;
    });

    return [
      { name: "Celular", value: devices.mobile, icon: Smartphone, color: "#D97457" },
      { name: "Computador", value: devices.desktop, icon: Laptop, color: "#0F6B2E" },
      { name: "Tablet", value: devices.tablet, icon: Tablet, color: "#B24F18" },
    ].filter(item => item.value > 0);
  };

  const deviceData = getDeviceData();
  const COLORS = ["#D97457", "#0F6B2E", "#B24F18"];

  // 5. Top Pages data
  const getTopPages = () => {
    const pageCounts: Record<string, { name: string; path: string; count: number }> = {
      "/": { name: "Página Inicial (Home)", path: "/", count: 0 },
      "/filhotes": { name: "Listagem de Filhotes", path: "/filhotes", count: 0 },
      "/sobre": { name: "Quem Somos / História", path: "/sobre", count: 0 },
      "/a-raca-pastor-do-caucaso": { name: "Guia da Raça Cáucaso", path: "/a-raca-pastor-do-caucaso", count: 0 },
    };

    filteredEvents
      .filter((e) => e.event_type === "page_view")
      .forEach((event) => {
        if (pageCounts[event.page_path]) {
          pageCounts[event.page_path].count++;
        }
      });

    return Object.values(pageCounts).sort((a, b) => b.count - a.count);
  };

  const topPages = getTopPages();

  // 6. Top Referrers Data
  const getTopReferrers = () => {
    const referrers: Record<string, number> = {};
    // Count visitors per referrer
    const visitorReferrers: Record<string, string> = {};

    filteredEvents.forEach((event) => {
      if (!visitorReferrers[event.session_id]) {
        visitorReferrers[event.session_id] = event.referrer || "direct";
      }
    });

    Object.values(visitorReferrers).forEach((ref) => {
      let cleanRef = ref;
      if (ref.includes("instagram")) cleanRef = "Instagram";
      else if (ref.includes("google")) cleanRef = "Google (Busca)";
      else if (ref.includes("facebook") || ref.includes("fb")) cleanRef = "Facebook";
      else if (ref === "direct" || ref === "" || ref.includes("localhost")) cleanRef = "Acesso Direto";

      referrers[cleanRef] = (referrers[cleanRef] || 0) + 1;
    });

    return Object.entries(referrers)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  };

  const topReferrers = getTopReferrers();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-salon-text-primary">Controle de Tráfego</h2>
          <p className="text-salon-text-secondary text-sm">
            Monitore as visualizações de páginas, visitantes únicos e conversões no seu site público.
          </p>
        </div>

        {/* Period Filter Buttons */}
        <div className="flex bg-salon-bg border border-salon-border rounded-xl p-1 shrink-0">
          <button
            onClick={() => setDaysFilter(7)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              daysFilter === 7
                ? "bg-primary text-salon-bg font-bold"
                : "text-salon-text-secondary hover:text-salon-text-primary"
            }`}
          >
            Últimos 7 dias
          </button>
          <button
            onClick={() => setDaysFilter(15)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              daysFilter === 15
                ? "bg-primary text-salon-bg font-bold"
                : "text-salon-text-secondary hover:text-salon-text-primary"
            }`}
          >
            15 dias
          </button>
          <button
            onClick={() => setDaysFilter(30)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              daysFilter === 30
                ? "bg-primary text-salon-bg font-bold"
                : "text-salon-text-secondary hover:text-salon-text-primary"
            }`}
          >
            30 dias
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Visualizações */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs text-salon-text-secondary font-medium uppercase tracking-wider">
              Visualizações (Views)
            </span>
            <h3 className="text-3xl font-bold text-salon-text-primary">{totalViews}</h3>
            <p className="text-[10px] text-salon-text-secondary">Páginas carregadas no período</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Visitantes */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs text-salon-text-secondary font-medium uppercase tracking-wider">
              Visitantes Únicos
            </span>
            <h3 className="text-3xl font-bold text-salon-text-primary">{totalVisitors}</h3>
            <p className="text-[10px] text-salon-text-secondary">Sessões de visitantes no período</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Cliques de Conversão */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs text-salon-text-secondary font-medium uppercase tracking-wider">
              Cliques de Conversão
            </span>
            <h3 className="text-3xl font-bold text-salon-text-primary">{totalConversions}</h3>
            <p className="text-[10px] text-salon-text-secondary">Cliques em WhatsApp ou Agendamentos</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-salon-success/10 border border-salon-success/20 flex items-center justify-center text-salon-success">
            <MousePointerClick className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Taxa de Conversão */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs text-salon-text-secondary font-medium uppercase tracking-wider">
              Taxa de Conversão
            </span>
            <h3 className="text-3xl font-bold text-salon-text-primary">
              {conversionRate.toFixed(1)}%
            </h3>
            <p className="text-[10px] text-salon-text-secondary">Conversões por visitante único</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Graph (Timeline Views and Visitors) */}
      <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-4">
        <div>
          <h4 className="text-base font-bold text-salon-text-primary">Evolução Diária de Tráfego</h4>
          <p className="text-xs text-salon-text-secondary">Monitoramento diário de visualizações de páginas e visitantes únicos</p>
        </div>

        <div className="h-80 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97457" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#D97457" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F6B2E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0F6B2E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                <XAxis dataKey="data" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "12px" }}
                  labelStyle={{ color: "#F5F5F5", fontWeight: "bold", fontSize: 12 }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Area
                  type="monotone"
                  dataKey="Visualizações"
                  stroke="#D97457"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
                <Area
                  type="monotone"
                  dataKey="Visitantes Únicos"
                  stroke="#0F6B2E"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-salon-bg animate-pulse rounded-lg flex items-center justify-center text-xs text-salon-text-secondary">
              Carregando gráfico...
            </div>
          )}
        </div>
      </div>

      {/* Grid: Conversion Actions and Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversion Actions (Cliques) */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-4">
          <div>
            <h4 className="text-base font-bold text-salon-text-primary">Ações de Conversão & Links</h4>
            <p className="text-xs text-salon-text-secondary">Cliques consolidados em botões externos e agendamento interno</p>
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "12px" }}
                    labelStyle={{ color: "#F5F5F5", fontWeight: "bold", fontSize: 12 }}
                    itemStyle={{ color: "#D97457", fontSize: 12 }}
                    formatter={(value: any) => [`${value} cliques`, "Cliques"]}
                  />
                  <Bar dataKey="Cliques" radius={[4, 4, 0, 0]} barSize={40}>
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-salon-bg animate-pulse rounded-lg flex items-center justify-center text-xs text-salon-text-secondary">
                Carregando gráfico...
              </div>
            )}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-salon-text-primary">Distribuição de Dispositivos</h4>
            <p className="text-xs text-salon-text-secondary">Equipamento utilizado pelos visitantes únicos para acessar o canil</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 justify-center my-4">
            <div className="h-44 w-44 shrink-0 relative flex items-center justify-center">
              {mounted && deviceData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "12px" }}
                        itemStyle={{ fontSize: 12, color: "#FFF" }}
                        formatter={(value: any) => [`${value} sessões`, "Visitas"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center percentage label */}
                  <div className="absolute text-center flex flex-col items-center">
                    <span className="text-xs text-salon-text-secondary uppercase">Celular</span>
                    <span className="text-2xl font-bold text-[#D97457]">
                      {totalVisitors > 0
                        ? `${(
                            (deviceData.find((d) => d.name === "Celular")?.value || 0) /
                            totalVisitors *
                            100
                          ).toFixed(0)}%`
                        : "0%"}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-xs text-salon-text-secondary">Carregando gráfico...</div>
              )}
            </div>

            {/* Legends list */}
            <div className="space-y-4 w-full flex-1">
              {deviceData.map((item, index) => {
                const Icon = item.icon;
                const percentage = totalVisitors > 0 ? (item.value / totalVisitors) * 100 : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between gap-4 p-3 bg-salon-bg/40 border border-salon-border/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-salon-surface border border-salon-border" style={{ color: item.color }}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-salon-text-primary">{item.name}</span>
                        <p className="text-[10px] text-salon-text-secondary">{item.value} visitantes</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono" style={{ color: item.color }}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Top Pages and Traffic Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-4">
          <div>
            <h4 className="text-base font-bold text-salon-text-primary">Páginas Mais Visitadas</h4>
            <p className="text-xs text-salon-text-secondary">Ranking de visualizações de páginas no período selecionado</p>
          </div>

          <div className="space-y-3.5 mt-4">
            {topPages.map((page, i) => {
              const percentage = totalViews > 0 ? (page.count / totalViews) * 100 : 0;
              return (
                <div key={page.path} className="space-y-1.5 p-3 rounded-xl bg-salon-bg/40 border border-salon-border/40">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-salon-text-primary">{page.name}</span>
                        <span className="text-[9px] text-salon-text-secondary ml-2 font-mono">{page.path}</span>
                      </div>
                    </div>
                    <span className="font-bold text-salon-text-primary font-mono">{page.count} views</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-salon-bg border border-salon-border/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic Referrers */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-4">
          <div>
            <h4 className="text-base font-bold text-salon-text-primary">Origem do Tráfego (Referrers)</h4>
            <p className="text-xs text-salon-text-secondary">De onde os visitantes vieram para acessar o canil</p>
          </div>

          <div className="space-y-3.5 mt-4">
            {topReferrers.length === 0 ? (
              <div className="p-8 text-center text-xs text-salon-text-secondary bg-salon-bg/40 border border-salon-border/60 rounded-xl">
                Sem dados de referenciadores para o período.
              </div>
            ) : (
              topReferrers.map((ref, i) => {
                const percentage = totalVisitors > 0 ? (ref.count / totalVisitors) * 100 : 0;
                return (
                  <div key={ref.name} className="space-y-1.5 p-3 rounded-xl bg-salon-bg/40 border border-salon-border/40">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-salon-surface border border-salon-border text-salon-text-secondary">
                          {ref.name.includes("Acesso Direto") ? <Globe className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                        </div>
                        <span className="font-semibold text-salon-text-primary">{ref.name}</span>
                      </div>
                      <span className="font-bold text-salon-text-primary font-mono">{ref.count} visitantes</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-salon-bg border border-salon-border/60 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-salon-success h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
