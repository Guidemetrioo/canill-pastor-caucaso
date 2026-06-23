import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
import { Shield, BookOpen, Star, AlertTriangle, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Tudo Sobre a Raça Pastor do Cáucaso | Guia Completo Canil Vale da Kubera",
  description: "Entenda o temperamento, cuidados, porte, alimentação e expectativa de vida do cão Pastor do Cáucaso. O guardião territorial definitivo.",
  keywords: ["pastor do caucaso temperamento", "pastor do caucaso tamanho", "cuidados pastor do caucaso", "pastor do caucaso guarda"],
};

export default function RacaPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "O Pastor do Cáucaso é dócil com a família?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim. É um cão extremamente leal, protetor e carinhoso com os membros da sua família, incluindo crianças com as quais foi criado, porém é desconfiado e territorial com estranhos."
        }
      },
      {
        "@type": "Question",
        "name": "Qual o tamanho e peso médio da raça?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Os machos medem a partir de 72 cm na cernelha e pesam acima de 50 kg (muitos chegam a 75 kg). As fêmeas medem a partir de 67 cm e pesam acima de 45 kg."
        }
      },
      {
        "@type": "Question",
        "name": "Essa raça pode viver em apartamento?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Não. Devido ao seu porte gigante e instinto de guarda territorial ativo, o Pastor do Cáucaso necessita de espaço amplo (chácaras, sítios ou casas com pátios grandes) para se movimentar e cumprir seu papel protetor."
        }
      }
    ]
  };

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans">
      <PublicNavbar />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 leading-relaxed">
        
        {/* Intro */}
        <div className="space-y-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97457]/10 border border-[#D97457]/20 text-[#D97457] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guia Oficial da Raça</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            O Gigante Guardião: <br />
            <span className="text-[#D97457]">Pastor do Cáucaso</span>
          </h1>
          <p className="text-gray-400 text-xs italic">
            Publicado pelo Canil Vale da Kubera &bull; Tempo de leitura: ~6 min
          </p>
        </div>

        <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-xl">
          <img
            src="/dogs/nero_4.jpg"
            alt="Pastor do Cáucaso - Canil Vale da Kubera"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
            <p className="text-xs text-white font-semibold">Canil Vale da Kubera &bull; Pastor do Cáucaso Legítimo</p>
          </div>
        </div>

        {/* Content Body */}
        <article className="space-y-8 text-sm text-gray-300">
          
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#D97457]" />
              <span>Origem e História da Raça</span>
            </h2>
            <p>
              Originário da cordilheira do Cáucaso, região que abrange países como Geórgia, Armênia, Azerbaijão e Rússia, o Pastor do Cáucaso (também conhecido como <i>Caucasian Ovcharka</i> ou <i>Kavkazskaya Ovcharka</i>) é uma das raças de cães de guarda mais antigas e rústicas do planeta. Por séculos, esses cães foram utilizados por pastores para proteger rebanhos contra predadores temíveis, como lobos e ursos, além de guardar propriedades rurais de invasores.
            </p>
            <p>
              Sua seleção natural priorizou animais de altíssima resistência física, tolerância a temperaturas congelantes e uma coragem indomável. Essa seleção resultou em um cão de estrutura óssea maciça, musculatura vigorosa e uma pelagem dupla densa, capaz de suportar as condições climáticas mais adversas das montanhas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#D97457]" />
              <span>Temperamento e Instinto de Proteção</span>
            </h2>
            <p>
              O temperamento do Pastor do Cáucaso é marcado por dois extremos muito bem definidos: lealdade incondicional com sua família e uma desconfiança natural de estranhos. Em casa, é um cão calmo, dócil, extremamente apegado aos seus tutores e surpreendentemente protetor com crianças. É um gigante gentil na presença das pessoas que ama.
            </p>
            <div className="bg-[#1A1A1A] border-l-4 border-[#D97457] p-5 rounded-r-xl my-6">
              <p className="font-semibold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4.5 h-4.5 text-[#D97457]" />
                <span>Nota Importante sobre a Guarda</span>
              </p>
              <p className="text-xs text-gray-400">
                O Pastor do Cáucaso não é um cão de guarda esportivo; seu instinto territorial é natural e ativo. Ele não precisa ser treinado para morder ou atacar: seu discernimento de território é inato. Por isso, a socialização precoce é obrigatória para que o cão aprenda a tolerar visitantes sob a supervisão do tutor.
              </p>
            </div>
            <p>
              Ele possui uma postura de guarda calma e observadora. Geralmente se posiciona em locais altos onde pode monitorar todo o perímetro. Sua reação a invasões é imediata e feroz, tornando-o o guardião residencial definitivo contra qualquer tipo de ameaça.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-[#D97457]" />
              <span>Porte Físico e Características</span>
            </h2>
            <p>
              O Pastor do Cáucaso é classificado como uma raça gigante de cães de guarda. Seguem as características principais de porte:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-gray-400">
              <li><strong>Machos:</strong> Altura na cernelha mínima de 72 cm (idealmente entre 75 cm e 82 cm) e peso mínimo de 50 kg, frequentemente ultrapassando os 75 kg quando adultos.</li>
              <li><strong>Fêmeas:</strong> Altura na cernelha mínima de 67 cm (idealmente entre 70 cm e 75 cm) e peso mínimo de 45 kg.</li>
              <li><strong>Pelagem:</strong> Dupla, muito espessa, com subpelo denso e lanoso. Existem três variedades de comprimento de pelo: longo (com juba distinta no pescoço), médio e curto.</li>
              <li><strong>Cores:</strong> Vários tons de cinza (do claro ao escuro carvão), avermelhado, palha, branco e manchado. Máscara preta é comum e valorizada.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D97457]" />
              <span>Cuidados e Saúde Essenciais</span>
            </h2>
            <p>
              Devido ao seu tamanho massivo, o Pastor do Cáucaso tem propensão a problemas articulares comuns em raças gigantes, com destaque para a <strong>Displasia Coxofemoral</strong> e a <strong>Displasia de Cotovelo</strong>. A melhor prevenção é adquirir filhotes de criadores que realizam o controle radiográfico das matrizes e padreadores.
            </p>
            <p>
              Além disso, a alimentação de alta qualidade super premium durante o primeiro ano de vida é crucial para apoiar o crescimento rápido da estrutura óssea sem sobrecarga. Escovações semanais são necessárias para remover pelos mortos, principalmente durante as épocas de muda na primavera e no outono.
            </p>
          </section>

        </article>

        {/* FAQs */}
        <section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-[#2A2A2A] pb-3">Perguntas Frequentes</h3>
          
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <h5 className="font-bold text-white">1. O Pastor do Cáucaso convive bem com outros animais?</h5>
              <p className="text-gray-400">
                Se for socializado desde filhote, pode conviver pacificamente com outros cães da casa e animais de estimação. No entanto, costuma ser intolerante com cães estranhos do mesmo sexo que invadam seu território.
              </p>
            </div>
            
            <div className="space-y-1.5">
              <h5 className="font-bold text-white">2. Qual a expectativa de vida média?</h5>
              <p className="text-gray-400">
                A expectativa de vida média da raça varia de 10 a 12 anos, o que é excelente para um cão de porte gigante.
              </p>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-bold text-white">3. É um cão fácil de adestrar?</h5>
              <p className="text-gray-400">
                O Pastor do Cáucaso é inteligente, mas muito independente e obstinado. Ele necessita de um tutor firme, experiente e consistente que estabeleça liderança de forma tranquila e respeitosa. Não responde bem a métodos de adestramento punitivos.
              </p>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
      <SocialFloatingButtons />
    </div>
  );
}
