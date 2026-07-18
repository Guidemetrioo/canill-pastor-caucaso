"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useAura, ThemeName } from "@/context/AuraContext";
import { Palette } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { activeTheme, activeFont, themes } = useAura();
  const t = themes[activeTheme];

  return (
    <>
      {/* Inject Dynamic Theme Styles Globally for the Admin Area */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Megrim&family=Comfortaa:wght@400;700&display=swap');
        
        .font-comfortaa, .font-megrim, h1, h2, h3, h4, h5, h6, .font-sans, span, p, a, button, input, select, textarea, div, label, td, th {
          font-family: ${activeFont === 'megrim' ? "'Megrim', cursive" : "'Comfortaa', sans-serif"} !important;
          letter-spacing: ${activeFont === 'megrim' ? "0.04em" : "normal"};
        }

        /* Background Overrides */
        body,
        .bg-salon-bg,
        div.min-h-screen.bg-salon-bg,
        .bg-black\\/60 {
          background-color: ${t.bgHex} !important;
          color: ${t.textMain.replace('text-[', '').replace(']', '')} !important;
          transition: background-color 0.5s ease, color 0.5s ease;
        }

        /* Card/Surface Overrides */
        .bg-salon-surface,
        div.bg-salon-surface,
        aside.bg-salon-surface,
        header.bg-salon-surface,
        .bg-gray-900,
        .bg-zinc-900,
        .bg-neutral-900,
        .bg-black\\/40 {
          background-color: ${t.cardBgHex} !important;
          border-color: ${t.borderHex} !important;
          color: ${t.textMain.replace('text-[', '').replace(']', '')} !important;
        }

        /* Text Color Overrides */
        .text-salon-text-primary,
        .text-white,
        h1, h2, h3, h4, h5, h6,
        span.font-bold,
        p.font-semibold,
        th {
          color: ${t.textMain.replace('text-[', '').replace(']', '')} !important;
        }

        .text-salon-text-secondary,
        .text-gray-400,
        .text-gray-500,
        p,
        td,
        label {
          color: ${t.textMuted.replace('text-[', '').replace(']', '')} !important;
        }

        /* Active/hover sidebar links & buttons */
        .hover\\:bg-white\\/5:hover,
        .hover\\:bg-gray-800:hover,
        .hover\\:bg-gray-100:hover,
        .bg-white\\/10,
        a.bg-[#D97457]\\/10,
        a.text-[#D97457] {
          background-color: ${t.tagBg.replace('bg-[', '').replace(']', '')} !important;
          color: ${t.accentHex} !important;
        }

        /* Primary Buttons & Icons */
        .bg-primary,
        .bg-\\[\\#D97457\\],
        button.bg-primary,
        a.bg-primary,
        .bg-salon-success {
          background-color: ${t.accentHex} !important;
          color: #ffffff !important;
        }

        .text-primary,
        .text-\\[\\#D97457\\],
        .text-primary svg,
        .text-\\[\\#D97457\\] svg {
          color: ${t.accentHex} !important;
        }

        /* Borders */
        .border-salon-border,
        .border-gray-800,
        .border-zinc-800,
        .border-white\\/10 {
          border-color: ${t.borderHex} !important;
        }

        /* Input fields and selects */
        input, select, textarea {
          background-color: ${t.bgForm.replace('bg-[', '').replace(']', '')} !important;
          border-color: ${t.borderHex} !important;
          color: ${t.textMain.replace('text-[', '').replace(']', '')} !important;
        }

        /* Force Admin Header Text and Icons to be White for Contrast */
        header, 
        header *, 
        header span, 
        header h1, 
        header p, 
        header button,
        header a {
          color: #ffffff !important;
        }
      `}} />

      <div className="min-h-screen bg-salon-bg flex">
        {/* Navigation sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          collapsed={isSidebarCollapsed}
          onToggleCollapsed={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main content viewport */}
        <div className={`flex-1 ${isSidebarCollapsed ? "md:pl-20" : "md:pl-64"} flex flex-col min-w-0 transition-all duration-300`}>
          <Header onMenuOpen={() => setSidebarOpen(true)} />
          <main className="flex-1 p-6 pb-24 md:pb-6 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Bottom navigation for mobile devices */}
        <BottomNavigation onMenuOpen={() => setSidebarOpen(true)} />
      </div>
    </>
  );
}
