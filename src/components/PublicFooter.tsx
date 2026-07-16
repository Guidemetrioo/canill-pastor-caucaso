import Link from "next/link";
import { Shield, Phone, Mail, MapPin } from "lucide-react";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#E9EAE7] border-t border-[#E2E8F0] text-[#222521] py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="font-bold tracking-wider text-[#222521] text-lg leading-none">VALE DA KUBERA</span>
            </Link>
            <p className="text-xs leading-relaxed text-[#555E54]">
              Canil especializado em Pastor do Cáucaso com padrão de exposição. Genética importada da Rússia, Ucrânia, Romênia e Espanha. Estrutura e saúde comprovadas.
            </p>
          </div>

          {/* Col 2: Links */}
          <div>
            <h4 className="text-sm font-semibold text-[#222521] uppercase tracking-wider mb-4 font-comfortaa">Links Rápidos</h4>
            <ul className="space-y-2 text-xs text-[#555E54]">
              <li><Link href="/sobre" className="hover:text-[#0F6B2E] transition-colors">O Canil</Link></li>
              <li><Link href="/filhotes" className="hover:text-[#0F6B2E] transition-colors">Filhotes Disponíveis</Link></li>
              <li><Link href="/a-raca-pastor-do-caucaso" className="hover:text-[#0F6B2E] transition-colors">A Raça</Link></li>
              <li><Link href="/galeria" className="hover:text-[#0F6B2E] transition-colors">Galeria de Fotos</Link></li>
              <li><Link href="/blog" className="hover:text-[#0F6B2E] transition-colors">Blog &amp; Dicas</Link></li>
            </ul>
          </div>

          {/* Col 3: Serviços */}
          <div>
            <h4 className="text-sm font-semibold text-[#222521] uppercase tracking-wider mb-4 font-comfortaa">Serviços</h4>
            <ul className="space-y-2 text-xs text-[#555E54]">
              <li><Link href="/servicos/hospedagem" className="hover:text-[#0F6B2E] transition-colors">Hospedagem &amp; Hotel</Link></li>
              <li><Link href="/servicos/adestramento" className="hover:text-[#0F6B2E] transition-colors">Adestramento Canino</Link></li>
            </ul>
          </div>

          {/* Col 4: Contato (Consistent NAP) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#222521] uppercase tracking-wider mb-4 font-comfortaa">Contato (NAP)</h4>
            <ul className="space-y-2.5 text-xs text-[#555E54]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-[#0F6B2E] mt-0.5" />
                <span>
                  <strong>Endereço:</strong> Itatiba - SP, CEP 13250-000
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0F6B2E]" />
                <span><strong>Telefone:</strong> +55 (11) 97499-2059</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0F6B2E]" />
                <span><strong>E-mail:</strong> canilvaledakubera@gmail.com</span>
              </li>
            </ul>
            <div className="pt-2 text-xs">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0F6B2E] hover:underline font-semibold"
              >
                Ver no Google Maps (Google Business Profile)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#E2E8F0] text-center text-[10px] text-[#555E54] space-y-2 flex flex-col items-center">
          <p>&copy; {currentYear} Canil Vale da Kubera Pastor do Cáucaso. Todos os direitos reservados. Registrado no CBKC / FCI.</p>
          <p className="opacity-75">Desenvolvido com foco em SEO técnico e performance.</p>
          <Link
            href="/login"
            className="mt-2 bg-[#B24F18]/10 hover:bg-[#B24F18]/25 text-[#B24F18] border border-[#B24F18]/30 px-3 py-1.5 rounded-md text-[10px] font-comfortaa font-bold transition-all shadow-sm"
          >
            Painel do Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
