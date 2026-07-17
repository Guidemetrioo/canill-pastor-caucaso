"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  LayoutDashboard,
  MessageSquare,
  Network,
  Shield,
  CalendarDays,
  Home,
  Award,
  Users,
  DollarSign,
  Settings,
  LogOut,
  X,
  BarChart3,
  Heart,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const sidebarItems = [
  { href: "/dashboard", label: "Dashboard Geral", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Central de Leads", icon: MessageSquare },
  { href: "/dashboard/ninhadas", label: "Ninhadas & Filhotes", icon: Network },
  { href: "/dashboard/animais", label: "Matrizes & Machos", icon: Shield },
  { href: "/dashboard/agenda-canina", label: "Agenda Canina", icon: Heart },
  { href: "/dashboard/agenda", label: "Agenda de Visitas", icon: CalendarDays },
  { href: "/dashboard/clientes", label: "Clientes / Tutores", icon: Users },
  { href: "/dashboard/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/dashboard/trafego", label: "Controle de Tráfego", icon: BarChart3 },
  { href: "/dashboard/configuracoes", label: "Configurações Bot", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    // Clear mock session
    document.cookie = "aura-mock-session=; Max-Age=0; path=/";
    localStorage.removeItem("aura-mock-role");
    localStorage.removeItem("aura-mock-name");

    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const content = (
    <div className="h-full flex flex-col bg-salon-surface border-r border-salon-border/80 w-64 text-salon-text-primary p-6">
      {/* Brand Logo */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <img 
            src="/logo.png" 
            alt="Logo Vale da Kubera" 
            className="w-10 h-10 object-contain rounded-lg border border-gray-200/50 shadow-sm"
            style={{ filter: "invert(1)" }}
          />
          <div>
            <h2 className="font-bold tracking-wider text-xs leading-none font-comfortaa">VALE DA KUBERA</h2>
            <p className="text-[8px] tracking-widest text-[#D97457] font-semibold uppercase mt-1">
              Canil Pastor do Cáucaso
            </p>
          </div>
        </Link>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="md:hidden text-salon-text-secondary hover:text-salon-text-primary transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 -mr-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-salon text-sm font-medium transition-all group ${
                isActive
                  ? "bg-primary text-salon-bg shadow-[0_4px_12px_rgba(201,169,110,0.15)] font-semibold"
                  : "text-salon-text-secondary hover:text-salon-text-primary hover:bg-salon-bg"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                  isActive ? "text-salon-bg" : "text-salon-text-secondary group-hover:text-primary"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="pt-6 border-t border-salon-border/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-salon text-sm font-medium text-salon-text-secondary hover:text-salon-error hover:bg-salon-error/10 transition-all group"
        >
          <LogOut className="w-5 h-5 text-salon-text-secondary group-hover:text-salon-error transition-colors" />
          <span>Sair da Conta</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:block fixed inset-y-0 left-0 z-20 w-64 h-full">
        {content}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        {/* Drawer panel */}
        <aside
          className={`absolute inset-y-0 left-0 w-64 shadow-2xl transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {content}
        </aside>
      </div>
    </>
  );
}
