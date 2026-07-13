"use client";
// Vercel trigger comment: reposicionar logo VK e ajustar opacidade do agendamento

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import { useAura } from "@/context/AuraContext";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeTheme, activeFont, themes } = useAura();
  const t = themes[activeTheme];

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/sobre", label: "O Canil" },
    { href: "/filhotes", label: "Filhotes" },
    { href: "/a-raca-pastor-do-caucaso", label: "A Raça" },
    { href: "/servicos/cobertura", label: "Coberturas" },
    { href: "/blog", label: "Blog" },
    { href: "/galeria", label: "Galeria" },
    { href: "/contato", label: "Contato" },
  ];

  return (
    <>
      {/* Inject Dynamic Theme Styles Globally for all public pages */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Megrim&family=Comfortaa:wght@400;700&display=swap');
        
        .font-comfortaa, .font-megrim, h1, h2, h3, h4, h5, h6 {
          font-family: ${activeFont === 'megrim' ? "'Megrim', cursive" : "'Comfortaa', sans-serif"} !important;
          letter-spacing: ${activeFont === 'megrim' ? "0.04em" : "normal"};
        }

        /* Override main dark backgrounds */
        body, 
        .min-h-screen, 
        div.bg-\\[\\#0F0F0F\\] {
          background-color: ${t.bgHex} !important;
          color: ${t.textMain.replace('text-[', '').replace(']', '')} !important;
          transition: background-color 0.5s ease, color 0.5s ease;
        }

        /* General text contrast */
        p, li, td, th {
          color: ${t.textMuted.replace('text-[', '').replace(']', '')} !important;
        }
        
        /* Strong text and headers */
        strong, span.font-bold, p.font-semibold, div.font-extrabold {
          color: ${t.textMain.replace('text-[', '').replace(']', '')} !important;
        }

        /* Text Color Overrides for light backgrounds (forcing white text to brand accent colors) */
        h1:not(#hero-banner *):not(#agendar *),
        h2:not(#hero-banner *):not(#agendar *),
        h3:not(#hero-banner *):not(#agendar *),
        h4:not(#hero-banner *):not(#agendar *),
        h5:not(#hero-banner *):not(#agendar *),
        h6:not(#hero-banner *):not(#agendar *),
        .text-white:not(#hero-banner *):not(#agendar *):not(.whatsapp-theme-button *):not(#youtube-floating-button *):not(#instagram-floating-button *):not(#whatsapp-floating-button *):not(#youtube-floating-button):not(#instagram-floating-button):not(#whatsapp-floating-button) {
          color: ${t.accentHex} !important;
        }

        /* Input fields and selects for forms on public pages */
        input:not(#hero-banner *):not(#agendar *), 
        select:not(#hero-banner *):not(#agendar *), 
        textarea:not(#hero-banner *):not(#agendar *) {
          background-color: ${t.bgForm.replace('bg-[', '').replace(']', '')} !important;
          border-color: ${t.borderHex} !important;
          color: ${t.textMain.replace('text-[', '').replace(']', '')} !important;
        }

        /* Card and container background overrides */
        div.bg-\\[\\#1A1A1A\\], 
        section.bg-\\[\\#1A1A1A\\],
        div.bg-black\\/60,
        .card-theme {
          background-color: ${t.cardBgHex} !important;
          border-color: ${t.borderHex} !important;
          color: ${t.textMain.replace('text-[', '').replace(']', '')} !important;
        }

        /* Border overrides */
        .border-\\[\\#2A2A2A\\], 
        div.border-\\[\\#2A2A2A\\],
        .border-gray-800 {
          border-color: ${t.borderHex} !important;
        }

        /* Icon and tag styling */
        svg {
          color: ${t.accentHex} !important;
        }
        span.bg-\\[\\#D97457\\]\\/10,
        span.text-\\[\\#D97457\\] {
          background-color: ${t.tagBg.replace('bg-[', '').replace(']', '')} !important;
          color: ${t.accentHex} !important;
        }

        /* Active Tab Buttons overrides to ensure high contrast white text and icons */
        .active-tab-btn,
        .active-tab-btn * {
          color: #FFFFFF !important;
        }
        .active-tab-btn svg {
          color: #FFFFFF !important;
          stroke: #FFFFFF !important;
        }

        /* Force high contrast light text colors in dark video sections (Hero & Agendar) */
        #hero-banner p,
        #hero-banner h1,
        #hero-banner span:not([style]),
        #agendar h2,
        #agendar h4,
        #agendar label,
        #agendar p,
        #agendar span:not([style]),
        #agendar strong {
          color: #FFFFFF !important;
        }
        #hero-banner p,
        #agendar p.text-gray-400,
        #agendar span.text-gray-400,
        #agendar label.text-gray-300 {
          color: #D1D5DB !important;
        }

        /* Active Navigation Header custom styling */
        nav {
          background-color: ${t.bgHex}DD !important;
          border-color: ${t.borderHex} !important;
          backdrop-filter: blur(12px) !important;
        }
        nav span, nav a, nav button {
          color: ${t.textMain.replace('text-[', '').replace(']', '')} !important;
        }
        nav a:hover {
          color: ${t.accentHex} !important;
        }

        /* Footer styling */
        footer {
          background-color: ${activeTheme === 'eco-rustic' ? '#FAF8F5' : activeTheme === 'terracota-warmth' ? '#F4F5F2' : '#F3F5F2'} !important;
          border-color: ${t.borderHex} !important;
          color: ${t.textMain.replace('text-[', '').replace(']', '')} !important;
        }
        footer h3, footer h4, footer span, footer p, footer a {
          color: ${t.textMain.replace('text-[', '').replace(']', '')} !important;
        }
        footer a:hover {
          color: ${t.accentHex} !important;
        }

        /* Whatsapp theme button */
        .whatsapp-theme-button {
          background-color: ${t.secondaryAccentHex} !important;
        }
      `}} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-[#2A2A2A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo Vale da Kubera" 
              className="w-10 h-10 object-contain rounded-lg border border-gray-200/50 shadow-sm"
              style={{ filter: "invert(1)" }}
            />
            <div>
              <span className="font-bold tracking-wider text-xl block leading-none font-comfortaa">VALE DA KUBERA</span>
              <span className="text-[9px] tracking-widest text-[#D97457] font-semibold uppercase">Canil de Pastor do Cáucaso</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-300 hover:text-[#D97457] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(217,116,87,0.15)]"
            >
              Painel Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#1A1A1A] border-b border-[#2A2A2A] px-2 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-300 hover:text-[#D97457] hover:bg-[#0F0F0F] transition-all"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="block text-center mt-4 bg-[#D97457] text-[#0F0F0F] px-3 py-2.5 rounded-lg text-base font-semibold transition-all"
          >
            Painel Admin
          </Link>
        </div>
      )}
    </nav>
    </>
  );
}
