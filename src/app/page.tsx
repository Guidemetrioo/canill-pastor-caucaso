import type { Metadata } from "next";
import LandingPageClient from "@/components/LandingPageClient";

// 1. Server-Side Metadata for Search Engines (SEO)
export const metadata: Metadata = {
  title: "Canil Vale da Kubera | Pastor do Cáucaso",
  description:
    "Canil especializado em Pastor do Cáucaso com padrão de exposição. Genética importada da Rússia, Ucrânia, Romênia e Espanha. Estrutura e saúde comprovadas.",
  keywords: [
    "canil pastor do caucaso",
    "pastor do caucaso sao paulo",
    "filhote de pastor do caucaso",
    "valedakubera",
    "canil vale da kubera",
    "criador pastor do caucaso",
    "cão de guarda gigante",
    "pastor do caucaso sp"
  ],
  alternates: {
    canonical: "https://canil-pastor-do-caucaso.vercel.app/",
  },
  openGraph: {
    title: "Canil Vale da Kubera | Pastor do Cáucaso",
    description:
      "Canil especializado em Pastor do Cáucaso com padrão de exposição. Genética importada da Rússia, Ucrânia, Romênia e Espanha. Estrutura e saúde comprovadas.",
    url: "https://canil-pastor-do-caucaso.vercel.app/",
    siteName: "Canil Vale da Kubera",
    images: [
      {
        url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800",
        width: 800,
        height: 600,
        alt: "Pastor do Cáucaso Vale da Kubera",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function Home() {
  // 2. Structured Data (JSON-LD) for Local SEO & Rich Snippets
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Canil Vale da Kubera",
    "description": "O Canil Vale da Kubera é especializado na criação do Pastor do Cáucaso (Kavkazskaya Ovcharka), com plantel formado por linhagens importadas da Rússia, Ucrânia, Romênia e Espanha. Nosso trabalho é guiado por três pilares: genética de qualidade, estrutura compatível com o padrão da raça e temperamento equilibrado.",
    "knowsAbout": ["Pastor do Cáucaso", "Kavkazskaya Ovcharka", "Criação de Cães", "Cinofilia", "Cão de Guarda", "CBKC", "FCI"],
    "image": "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800",
    "logo": "https://canil-pastor-do-caucaso.vercel.app/logo.png",
    "@id": "https://canil-pastor-do-caucaso.vercel.app/#kennel",
    "url": "https://canil-pastor-do-caucaso.vercel.app/",
    "telephone": "+5511974992059",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Itatiba",
      "addressLocality": "Itatiba",
      "addressRegion": "SP",
      "postalCode": "13250-000",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -23.0039,
      "longitude": -46.8524
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/valedakubera/",
      "https://web.facebook.com/valedakuberacanil",
      "https://linktr.ee/acasadospeludos"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Como funciona a reserva de filhotes de Pastor do Cáucaso?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nossos filhotes de Pastor do Cáucaso são reservados sob lista de espera e análise de perfil do tutor. Entre em contato conosco via WhatsApp para consultar ninhadas disponíveis e planejadas."
        }
      },
      {
        "@type": "Question",
        "name": "Os cães possuem pedigree e exames de displasia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Todos os nossos exemplares possuem pedigree CBKC/FCI oficial. Nossas matrizes e padreadores possuem laudos radiográficos negativos para displasia coxofemoral antes de acasalar."
        }
      },
      {
        "@type": "Question",
        "name": "Onde fica localizado o Canil Vale da Kubera?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nosso canil fica localizado em Itatiba - SP. As visitas devem ser agendadas previamente via WhatsApp para a segurança do canil."
        }
      },
      {
        "@type": "Question",
        "name": "Qual é o valor médio de um filhote de Pastor do Cáucaso?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Os valores dos filhotes variam de acordo com a seleção e linhagem. Machos começam a partir de R$ 6.000,00 e fêmeas a partir de R$ 6.500,00, inclusos pedigree, microchip, vacinas V10 importadas e vermifugação."
        }
      }
    ]
  };

  return (
    <>
      {/* Visual H1 specifically styled for SEO crawler hierarchy */}
      <h1 className="sr-only">Canil Vale da Kubera | Cão Pastor do Cáucaso em Itatiba - SP</h1>

      {/* Injecting Local Business JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Injecting FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Interactive UI Page component */}
      <LandingPageClient />
    </>
  );
}
