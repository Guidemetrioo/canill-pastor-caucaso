"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Shield } from "lucide-react";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#2A2A2A]/40" 
        : "bg-transparent border-b border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Canil Vale da Kubera" className="w-10 h-10 object-contain rounded-lg border border-white/20 shadow-md bg-black" />
            <div>
              <span className="font-megrim font-bold tracking-wider text-xl block leading-none text-white">VALE DA KUBERA</span>
              <span className="text-[9px] tracking-widest text-[#0F6B2E] font-comfortaa font-bold uppercase">Canil de Pastor do Cáucaso</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-comfortaa font-bold text-gray-300 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="bg-[#B24F18] hover:bg-[#964213] text-white px-4 py-2 rounded-lg text-sm font-comfortaa font-bold transition-all shadow-md"
            >
              Painel Admin
            </Link>
            <div className="border-l border-gray-700/30 pl-4 h-10 flex items-center">
              <img src="/logo.png" alt="Logo Canil Vale da Kubera" className="w-10 h-10 object-contain rounded-lg shadow-md border border-gray-800" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <img src="/logo.png" alt="Logo Canil Vale da Kubera" className="w-9 h-9 object-contain rounded-lg border border-gray-800" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300 transition-colors focus:outline-none"
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
              className="block px-3 py-2.5 rounded-lg text-base font-comfortaa font-bold text-gray-300 hover:text-[#0F6B2E] hover:bg-[#0F0F0F] transition-all"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="block text-center mt-4 bg-[#B24F18] text-white px-3 py-2.5 rounded-lg text-base font-comfortaa font-bold transition-all"
          >
            Painel Admin
          </Link>
        </div>
      )}
    </nav>
  );
}
