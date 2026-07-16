import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
import TrafficTracker from "@/components/TrafficTracker";
import { Shield, BookOpen, Star, AlertTriangle, Activity, Award } from "lucide-react";

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
        "name": "O Pastor do Cáucaso convive bem com outros animais?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Se for socializado desde filhote, pode conviver pacificamente com outros cães da casa e animais de estimação. No entanto, costuma ser intolerante com cães estranhos do mesmo sexo que invadam seu território."
        }
      },
      {
        "@type": "Question",
        "name": "Qual a expectativa de vida média?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A expectativa de vida varia de 10 a 12 anos, o que é excelente para um cão de porte gigante. Exemplares saudáveis, sem displasia e com alimentação adequada, costumam ser ativos e saudáveis até idades avançadas."
        }
      },
      {
        "@type": "Question",
        "name": "É um cão fácil de adestrar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Pastor do Cáucaso é muito inteligente, porém independente e obstinado. Ele necessita de um tutor firme, experiente e consistente. Não responde bem a métodos punitivos. O segredo está em estabelecer liderança com respeito e clareza — e entender que ele aprende o que quer, no seu próprio ritmo."
        }
      },
      {
        "@type": "Question",
        "name": "Essa raça pode ser de exposição E de guarda ao mesmo tempo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, e essa é a proposta de criadores sérios. Na Europa, criadores de renome não distinguem 'linha de trabalho' de 'linha de exposição' — um bom Cáucaso faz as duas coisas. A exposição prova estrutura, saúde e vitalidade; o instinto de guarda é genético e não se perde com o pedigree."
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
      <TrafficTracker path="/a-raca-pastor-do-caucaso" />

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
        <article className="space-y-10 text-sm text-gray-300">

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#D97457]" />
              <span>Origem e História da Raça</span>
            </h2>
            <p>
              Originário da cordilheira do Cáucaso, região que abrange países como Geórgia, Armênia, Azerbaijão e Rússia, o Pastor do Cáucaso (também conhecido como <i>Caucasian Ovcharka</i> ou <i>Kavkazskaya Ovcharka</i>) é uma das raças de cães de guarda mais antigas e rústicas do planeta. Por séculos, esses cães foram utilizados por pastores para proteger rebanhos contra predadores temíveis, como lobos e ursos, além de guardar propriedades rurais de invasores.
            </p>
            <p>
              Sua seleção natural priorizou animais de altíssima resistência física, tolerância a temperaturas congelantes e uma coragem indomável. Essa seleção resultou em um cão de estrutura óssea maciça, musculatura vigorosa e uma pelagem dupla densa. O exército soviético chegou a utilizar a raça para patrulhar bases e prisões, tamanha a imponência e coragem desses animais.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D97457]" />
              <span>Os Três Pilares de um Cáucaso de Excelência</span>
            </h2>
            <p>
              Criadores experientes que trabalham diretamente com linhagens importadas da Rússia, Romênia, Ucrânia e Espanha são unânimes: existem três requisitos inegociáveis para um exemplar de alta qualidade.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#1A1A1A] border border-[#D97457]/20 rounded-xl p-5 text-center space-y-2">
                <Shield className="w-6 h-6 text-[#D97457] mx-auto" />
                <h4 className="font-bold text-white text-sm">Temperamento</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">Equilibrado com a família, territorialista e explosivo com estranhos. Controlado, mas eficaz na guarda real.</p>
              </div>
              <div className="bg-[#1A1A1A] border border-[#D97457]/20 rounded-xl p-5 text-center space-y-2">
                <Star className="w-6 h-6 text-[#D97457] mx-auto" />
                <h4 className="font-bold text-white text-sm">Qualidade Genética</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">Linhagens selecionadas, laudos negativos de displasia e genealogia rastreável com pedigree CBKC/FCI.</p>
              </div>
              <div className="bg-[#1A1A1A] border border-[#D97457]/20 rounded-xl p-5 text-center space-y-2">
                <Activity className="w-6 h-6 text-[#D97457] mx-auto" />
                <h4 className="font-bold text-white text-sm">Estrutura</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">Ossatura robusta, peso proporcional, movimentação equilibrada e compatível com o padrão oficial da raça.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#D97457]" />
              <span>Temperamento e Instinto de Proteção</span>
            </h2>
            <p>
              O temperamento do Pastor do Cáucaso é marcado por dois extremos muito bem definidos: lealdade incondicional com sua família e uma desconfiança natural de estranhos. Em casa, é um cão calmo, dócil, extremamente apegado aos seus tutores e surpreendentemente protetor com crianças.
            </p>
            <div className="bg-[#1A1A1A] border-l-4 border-[#D97457] p-5 rounded-r-xl my-4">
              <p className="font-semibold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#D97457]" />
                <span>Nota Importante sobre a Guarda</span>
              </p>
              <p className="text-xs text-gray-400">
                O Pastor do Cáucaso não é um cão de guarda esportivo; seu instinto territorial é natural e ativo. Ele não precisa ser treinado para morder: seu discernimento de território é inato. A socialização precoce é obrigatória para que o cão aprenda a tolerar visitantes sob supervisão do tutor.
              </p>
            </div>
            <p>
              Uma característica impressionante é a <strong className="text-white">inteligência contextual</strong> do Cáucaso. O cão distingue facilmente quando está numa exposição (onde precisa se comportar) e quando está no seu território (onde exerce a guarda plena). Criadores relatam que o cão reconhece inclusive o tipo de guia — com uma guia fina de adestramento, já sabe que está em treino; com uma guia mais larga e confortável, entende que é hora de passear.
            </p>
            <p>
              Ele possui uma postura de guarda <strong className="text-white">calculada e econômica</strong>. Por conhecer o próprio tamanho e capacidade, o Cáucaso não gasta energia à toa. Geralmente se posiciona em locais estratégicos para monitorar o perímetro. Sua reação a invasões é imediata e feroz.
            </p>
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl space-y-2">
              <h4 className="text-sm font-bold text-white">⏳ Maturação Tardia: O Que Esperar do Filhote</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                O Pastor do Cáucaso fica completamente adulto somente <strong className="text-white">após os 2 anos de idade</strong>. Diferente de raças como o Malinois Belga, um filhote de Cáucaso com 3 a 4 meses é naturalmente calmo e observador — não vai buscar bola com entusiasmo nem demonstrar explosividade imediata. Jogue a bolinha para um filhote de Cáucaso e ele vai olhar para você como se perguntasse: &ldquo;o que você quer que eu faça?&rdquo; Isso é completamente normal. Não confunda tranquilidade com falta de potencial.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-[#D97457]" />
              <span>Porte Físico e Características</span>
            </h2>
            <p>
              O Pastor do Cáucaso é classificado como uma raça gigante de cães de guarda. Seguem as características principais de porte recomendadas pela FCI (Fédération Cynologique Internationale) padrão nº 328:
            </p>

            <div className="overflow-x-auto my-6 border border-[#2A2A2A] rounded-xl bg-[#1A1A1A]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2A2A2A] bg-[#222]">
                    <th className="p-3 font-bold text-white uppercase tracking-wider">Característica</th>
                    <th className="p-3 font-bold text-[#D97457] uppercase tracking-wider">Macho (Adulto)</th>
                    <th className="p-3 font-bold text-[#D97457] uppercase tracking-wider">Fêmea (Adulta)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A] text-gray-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Altura na Cernelha</td>
                    <td className="p-3">Mínimo 72 cm (Ideal 75–82 cm)</td>
                    <td className="p-3">Mínimo 67 cm (Ideal 70–75 cm)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Peso Corporal</td>
                    <td className="p-3">Mínimo 50 kg (Até 75–90 kg)</td>
                    <td className="p-3">Mínimo 45 kg (Até 60–75 kg)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Instinto de Guarda</td>
                    <td className="p-3" colSpan={2}>
                      <span className="text-[#D97457] font-semibold">Extremamente Ativo &amp; Territorial (Inato)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Expectativa de Vida</td>
                    <td className="p-3" colSpan={2}>10 a 12 anos (Excelente para porte gigante)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Controle de Displasia</td>
                    <td className="p-3" colSpan={2}>Obrigatório laudo radiográfico (HD- ou grau A/B) para acasalamento</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="list-disc pl-5 space-y-2.5 text-xs text-gray-400">
              <li><strong className="text-gray-200">Machos:</strong> Altura mínima de 72 cm na cernelha (idealmente entre 75 e 82 cm) e peso mínimo de 50 kg, frequentemente ultrapassando os 75 kg quando adultos. Exemplares excepcionais atingem 100 kg no auge.</li>
              <li><strong className="text-gray-200">Fêmeas:</strong> Altura mínima de 67 cm (idealmente entre 70 e 75 cm) e peso mínimo de 45 kg.</li>
              <li><strong className="text-gray-200">Cabeça:</strong> Extraordinariamente larga e massiva — exemplares adultos possuem uma cabeça facilmente maior do que uma bola de basquete. Uma das características mais marcantes e imponentes da raça.</li>
              <li><strong className="text-gray-200">Canal Nasal:</strong> Forte e largo, permitindo respiração eficiente. Essa característica permite que o cão suporte tanto o frio extremo das montanhas caucasianas quanto momentos de calor elevado com surpreendente conforto.</li>
              <li><strong className="text-gray-200">Pelagem:</strong> Dupla, muito espessa, com subpelo denso e lanoso. Três variedades: longa (com juba distinta no pescoço), média e curta.</li>
              <li><strong className="text-gray-200">Cores:</strong> Tons de cinza (do claro ao carvão), avermelhado, palha, branco e manchado. Máscara preta é comum e valorizada.</li>
            </ul>
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-white">Peso Não É Sinônimo de Qualidade</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                No mundo do Cáucaso existe um equívoco perigoso: &ldquo;quanto maior e mais pesado, melhor&rdquo;. Isso aconteceu tragicamente com o Mastim Tibetano, onde a seleção exagerada resultou em cães letárgicos e sem saúde. Um Cáucaso de qualidade deve mostrar <strong className="text-white">vitalidade, movimentação equilibrada e saúde</strong> — não apenas massa. O padrão da raça estabelece margens; o que se avalia é o conjunto completo.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D97457]" />
              <span>Exposição e Guarda: Não É Um Ou Outro</span>
            </h2>
            <p>
              No Brasil, existe um equívoco muito difundido: a ideia de que um cachorro de <em>&ldquo;linha de trabalho&rdquo;</em> e um de <em>&ldquo;linha de exposição&rdquo;</em> são categorias opostas e excludentes. Na Europa, onde a cinofilia tem raízes geracionais, criadores de renome simplesmente não reconhecem essa dicotomia.
            </p>
            <p>
              <strong className="text-white">Cáucaso é Cáucaso.</strong> A exposição não é vaidade — é uma prova técnica conduzida por especialistas que avalia estrutura, saúde, dentição, angulações, movimentação e vitalidade do cão. Um campeão de exposição comprova que seu corpo é compatível com o padrão da raça. Esse mesmo cão, ao chegar no seu território, exerce a guarda com naturalidade — porque o instinto territorial é genético, não treinado.
            </p>
            <p>
              O que alguns criadores chamam de &ldquo;linha de trabalho&rdquo; é, com frequência, apenas uma justificativa para cães com pouca estrutura e fora do padrão. Um Cáucaso de qualidade genuína tem estrutura para exposição <em>e</em> temperamento para guarda real. Esses dois atributos não apenas coexistem — eles se complementam.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D97457]" />
              <span>Cuidados e Saúde Essenciais</span>
            </h2>
            <p>
              Devido ao seu tamanho massivo, o Pastor do Cáucaso tem propensão a problemas articulares comuns em raças gigantes, com destaque para a <strong>Displasia Coxofemoral</strong> e a <strong>Displasia de Cotovelo</strong>. A melhor prevenção é adquirir filhotes de criadores que realizam o controle radiográfico das matrizes e padreadores antes de qualquer acasalamento.
            </p>
            <p>
              O <strong>Hipotiroidismo</strong> é outra condição a se atentar: é um agravo que pode ser transmitido geneticamente na raça. Criadores responsáveis monitoram a saúde tireoidiana dos seus reprodutores como parte do protocolo de seleção genética.
            </p>
            <p>
              Além disso, a alimentação de alta qualidade super premium durante o primeiro ano de vida é crucial para apoiar o crescimento rápido da estrutura óssea sem sobrecarga. Escovações semanais são necessárias para remover pelos mortos, principalmente nas épocas de muda.
            </p>
          </section>

        </article>

        {/* FAQs */}
        <section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-[#2A2A2A] pb-3">Perguntas Frequentes</h3>
          
          <div className="space-y-5 text-xs">
            <div className="space-y-1.5">
              <h5 className="font-bold text-white">1. O Pastor do Cáucaso é dócil com a família?</h5>
              <p className="text-gray-400">
                Sim. É extremamente leal, protetor e carinhoso com os membros da sua família — inclusive com crianças e idosos. Cães bem criados convivem pacificamente com todos da casa e são explosivos apenas com pessoas de fora do seu círculo de confiança.
              </p>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-bold text-white">2. O Pastor do Cáucaso convive bem com outros animais?</h5>
              <p className="text-gray-400">
                Se for socializado desde filhote, pode conviver pacificamente com outros cães da casa e animais de estimação. No entanto, costuma ser intolerante com cães estranhos do mesmo sexo que invadam seu território.
              </p>
            </div>
            
            <div className="space-y-1.5">
              <h5 className="font-bold text-white">3. Qual a expectativa de vida média?</h5>
              <p className="text-gray-400">
                A expectativa de vida varia de 10 a 12 anos, o que é excelente para um cão de porte gigante. Exemplares saudáveis, sem displasia e com alimentação adequada, costumam ser ativos e saudáveis até idades avançadas.
              </p>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-bold text-white">4. É um cão fácil de adestrar?</h5>
              <p className="text-gray-400">
                O Pastor do Cáucaso é muito inteligente, porém independente e obstinado. Ele necessita de um tutor firme, experiente e consistente. Não responde bem a métodos punitivos. O segredo está em estabelecer liderança com respeito e clareza — e entender que ele aprende o que quer, quando quer, no seu próprio ritmo.
              </p>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-bold text-white">5. Essa raça pode ser de exposição E de guarda ao mesmo tempo?</h5>
              <p className="text-gray-400">
                Sim, e essa é a proposta de criadores sérios. Na Europa, criadores de renome não distinguem &ldquo;linha de trabalho&rdquo; de &ldquo;linha de exposição&rdquo; — um bom Cáucaso faz as duas coisas. A exposição prova estrutura, saúde e vitalidade; o instinto de guarda é genético e não se perde com o pedigree.
              </p>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-bold text-white">6. Essa raça pode viver em apartamento?</h5>
              <p className="text-gray-400">
                Não. Devido ao porte gigante e ao instinto territorial ativo, o Pastor do Cáucaso precisa de espaço amplo — chácaras, sítios ou casas com pátios grandes — para exercer seu papel de guardião e se movimentar com conforto.
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
