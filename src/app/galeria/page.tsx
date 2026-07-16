import type { Metadata } from "next";
import GaleriaClientPage from "@/components/GaleriaClientPage";

export const metadata: Metadata = {
  title: "Galeria de Fotos | Canil Vale da Kubera",
  description: "Veja fotos reais de nossos cães adultos de raça pura, reprodutores importados, instalações e filhotes em nosso Canil em Itatiba - SP.",
  keywords: [
    "fotos pastor do caucaso",
    "imagens canil pastor do caucaso",
    "reprodutores importados pastor do caucaso",
    "canil valedakubera fotos",
    "pastor do caucaso gigante fotos"
  ],
  alternates: {
    canonical: "https://canil-pastor-do-caucaso.vercel.app/galeria",
  },
  openGraph: {
    title: "Galeria de Fotos | Canil Vale da Kubera",
    description: "Veja fotos reais de nossos cães adultos de raça pura, reprodutores importados, instalações e filhotes em nosso Canil em Itatiba - SP.",
    url: "https://canil-pastor-do-caucaso.vercel.app/galeria",
    siteName: "Canil Vale da Kubera",
    images: [
      {
        url: "/dogs/nero_4.jpg",
        width: 800,
        height: 600,
        alt: "Nero - Pastor do Cáucaso Canil Vale da Kubera",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function Page() {
  return <GaleriaClientPage />;
}
