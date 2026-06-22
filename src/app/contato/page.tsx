import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato e Agendamentos | Canil Pastor do Cáucaso Vale da Kubera",
  description: "Fale com o criador. Agende uma visita guiada para ver os filhotes de Pastor do Cáucaso em nossa chácara em Itatiba - SP.",
  keywords: ["contato canil causo", "agendar visita pastor do caucaso", "telefone criador causo", "whatsapp canil valedakubera"],
};

export default function ContatoPage() {
  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Intro */}
        <section className="space-y-4 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Fale Conosco</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Contato &amp; <span className="text-[#D97457]">Visitas</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Estamos prontos para atender você e sua família. Utilize nossos canais de contato ou preencha o formulário abaixo.
          </p>
        </section>

        {/* Contact Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Details Column */}
          <div className="space-y-8">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 space-y-6">
              <h3 className="text-lg font-bold text-white">Informações Consistentes (NAP)</h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#D97457] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Endereço</h5>
                    <p className="text-gray-400 mt-1">Itatiba - SP, CEP 13250-000</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#D97457] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Telefone / WhatsApp</h5>
                    <p className="text-gray-400 mt-1">+55 (11) 99876-5432</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#D97457] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">E-mail de Contato</h5>
                    <p className="text-gray-400 mt-1">canilvaledakubera@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-64 rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-xl">
              <iframe
                title="Mapa Contato Canil Vale da Kubera"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14686.082725893302!2d-46.85244584346001!3d-23.00392931168172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cec205c6d3df37%3A0xb35a09282365a6b5!2sItatiba%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1672322300000!5md2"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>

          {/* Form Column */}
          <ContactForm />

        </section>

      </main>

      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
