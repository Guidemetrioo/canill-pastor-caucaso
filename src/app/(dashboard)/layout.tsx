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
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const { activeTheme, setActiveTheme, activeFont, setActiveFont, themes } = useAura();
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
      `}} />

      <div className="min-h-screen bg-salon-bg flex">
        {/* Navigation sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content viewport */}
        <div className="flex-1 md:pl-64 flex flex-col min-w-0">
          <Header onMenuOpen={() => setSidebarOpen(true)} />
          <main className="flex-1 p-6 pb-24 md:pb-6 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Bottom navigation for mobile devices */}
        <BottomNavigation onMenuOpen={() => setSidebarOpen(true)} />
      </div>

      {/* Floating Theme Selector (same interface as main site) */}
      <div className="fixed bottom-20 md:bottom-6 left-6 z-50 font-sans">
        <button
          onClick={() => setIsSelectorOpen(!isSelectorOpen)}
          className="flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all border text-white font-bold hover:scale-105 active:scale-95"
          style={{ backgroundColor: t.accentHex, borderColor: t.borderHex }}
        >
          <Palette className="w-5 h-5 text-white" />
          <span className="text-xs hidden sm:inline">Paletas de Cores</span>
        </button>

        {isSelectorOpen && (
          <div className="absolute bottom-16 left-0 w-72 bg-white border border-gray-200 shadow-2xl rounded-2xl p-4 space-y-4 text-black animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h4 className="text-xs font-bold font-comfortaa uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-gray-500" />
                <span>Escolher Paleta</span>
              </h4>
              <button 
                onClick={() => setIsSelectorOpen(false)}
                className="text-gray-400 hover:text-black text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {(Object.keys(themes) as ThemeName[]).map((key) => {
                const themeItem = themes[key];
                const isSelected = activeTheme === key;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTheme(key);
                      if (window.innerWidth < 640) setIsSelectorOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col gap-1.5 ${
                      isSelected 
                        ? "border-black bg-gray-50 font-bold" 
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[11px]">{themeItem.name}</span>
                      {isSelected && <span className="text-[10px] text-green-600">✔</span>}
                    </div>

                    <div className="flex gap-1.5 items-center">
                      <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: themeItem.bgHex }} title="Fundo" />
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: themeItem.accentHex }} title="Destaque Principal" />
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: themeItem.secondaryAccentHex }} title="Destaque Secundário" />
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: themeItem.cardBgHex }} title="Cards" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-3">
              <h4 className="text-[10px] font-bold font-comfortaa uppercase tracking-wider text-gray-500">
                Fonte dos Títulos
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveFont("megrim")}
                  className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                    activeFont === "megrim"
                      ? "border-black bg-gray-50 text-black"
                      : "border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
                  style={{ fontFamily: "'Megrim', cursive" }}
                >
                  Megrim
                </button>
                <button
                  onClick={() => setActiveFont("comfortaa")}
                  className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                    activeFont === "comfortaa"
                      ? "border-black bg-gray-50 text-black"
                      : "border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
                  style={{ fontFamily: "'Comfortaa', sans-serif" }}
                >
                  Comfortaa
                </button>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed font-sans pt-1 border-t border-gray-100">
              * Escolha uma opção para alternar as cores ou fontes do painel em tempo real!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
