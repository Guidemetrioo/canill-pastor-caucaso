import type { Metadata } from "next";
import PlantelClientPage from "@/components/PlantelClientPage";

export const metadata: Metadata = {
  title: "Nossos Cães | Plantel Canil Vale da Kubera",
  description: "Conheça nosso plantel de Pastor do Cáucaso. Matrizes selecionadas e reprodutores importados com controle de displasia e pedigree oficial.",
  keywords: [
    "reprodutores pastor do caucaso",
    "matrizes pastor do caucaso",
    "plantel canino pastor do caucaso",
    "canil vale da kubera plantel",
    "pastor do caucaso pedigree cbkc"
  ],
  alternates: {
    canonical: "https://canil-pastor-do-caucaso.vercel.app/plantel",
  },
};

export default function Page() {
  return <PlantelClientPage />;
}
