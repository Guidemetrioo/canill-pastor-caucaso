import Link from "next/link";
import { Shield, Phone, Mail, MapPin } from "lucide-react";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] border-t border-[#2A2A2A] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-full flex items-center justify-center text-[#C9A96E]">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold tracking-wider text-white text-lg leading-none">VALE DA KUBERA</span>
            </Link>
            <p className="text-xs leading-relaxed">
              Criação selecionada e responsável de cães Pastor do Cáucaso. Excelência em temperamento, porte físico e saúde certificada.
            </p>
          </div>

          {/* Col 2: Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/sobre" className="hover:text-[#C9A96E] transition-colors">O Canil</Link></li>
              <li><Link href="/filhotes" className="hover:text-[#C9A96E] transition-colors">Filhotes Disponíveis</Link></li>
              <li><Link href="/a-raca-pastor-do-caucaso" className="hover:text-[#C9A96E] transition-colors">A Raça</Link></li>
              <li><Link href="/galeria" className="hover:text-[#C9A96E] transition-colors">Galeria de Fotos</Link></li>
              <li><Link href="/blog" className="hover:text-[#C9A96E] transition-colors">Blog &amp; Dicas</Link></li>
            </ul>
          </div>

          {/* Col 3: Serviços */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Serviços</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/servicos/cobertura" className="hover:text-[#C9A96E] transition-colors">Cobertura / Monta</Link></li>
              <li><Link href="/servicos/adestramento" className="hover:text-[#C9A96E] transition-colors">Adestramento Canino</Link></li>
              <li><Link href="/servicos/hospedagem" className="hover:text-[#C9A96E] transition-colors">Creche &amp; Hotel</Link></li>
            </ul>
          </div>

          {/* Col 4: Contato (Consistent NAP) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contato (NAP)</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-[#C9A96E] mt-0.5" />
                <span>
                  <strong>Endereço:</strong> Itatiba - SP, CEP 13250-000
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C9A96E]" />
                <span><strong>Telefone:</strong> +55 (11) 99876-5432</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C9A96E]" />
                <span><strong>E-mail:</strong> canilvaledakubera@gmail.com</span>
              </li>
            </ul>
            <div className="pt-2 text-xs">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A96E] hover:underline"
              >
                Ver no Google Maps (Google Business Profile)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#2A2A2A] text-center text-[10px] space-y-1">
          <p>&copy; {currentYear} Canil Vale da Kubera Pastor do Cáucaso. Todos os direitos reservados. Registrado no CBKC / FCI.</p>
          <p className="opacity-50">Desenvolvido com foco em SEO técnico e performance.</p>
        </div>
      </div>
    </footer>
  );
}
