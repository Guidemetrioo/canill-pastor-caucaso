"use client";
// Vercel trigger comment: reposicionar logo VK e ajustar opacidade do agendamento

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

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
  );
}
