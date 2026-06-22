import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans flex flex-col justify-between">
      <PublicNavbar />
      
      <main className="max-w-xl mx-auto px-4 py-24 text-center space-y-6 flex-1 flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-full flex items-center justify-center text-[#C9A96E]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">404 - Página Não Encontrada</h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
          A página ou o filhote que você está procurando não existe ou foi removido.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#C9A96E] hover:bg-[#B8965C] text-[#0F0F0F] font-bold px-6 py-3 rounded-lg text-xs transition-all"
        >
          Voltar para o Início
        </Link>
      </main>

      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
