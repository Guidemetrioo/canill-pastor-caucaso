import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Filhotes de Pastor do Cáucaso à Venda | Canil Vale da Kubera",
  description: "Filhotes selecionados de Pastor do Cáucaso (Kavkazskaya Ovcharka) com pedigree CBKC e controle rigoroso de displasia. Veja ninhadas disponíveis.",
  keywords: [
    "venda filhote pastor do caucaso",
    "pastor do caucaso preco",
    "filhotes de caucaso sp",
    "canil valedakubera filhotes",
    "filhote de pastor do caucaso",
    "pastor do caucaso filhote sp"
  ],
  alternates: {
    canonical: "https://canil-pastor-do-caucaso.vercel.app/filhotes",
  },
  openGraph: {
    title: "Filhotes de Pastor do Cáucaso à Venda | Canil Vale da Kubera",
    description: "Filhotes selecionados de Pastor do Cáucaso (Kavkazskaya Ovcharka) com pedigree CBKC e controle rigoroso de displasia. Veja ninhadas disponíveis.",
    url: "https://canil-pastor-do-caucaso.vercel.app/filhotes",
    siteName: "Canil Vale da Kubera",
    images: [
      {
        url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400",
        width: 400,
        height: 300,
        alt: "Filhote de Pastor do Cáucaso",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default async function Page() {
  redirect("/plantel");
}
