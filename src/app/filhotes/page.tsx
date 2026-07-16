import type { Metadata } from "next";
import FilhotesClientPage from "@/components/FilhotesClientPage";
import { createClient } from "@/utils/supabase/client";

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
  let itemListSchema: any = null;
  try {
    const supabase = createClient();
    const { data: filhotes } = await supabase
      .from("filhotes")
      .select("id, name, gender, notes, avatar_url")
      .eq("status", "Disponível");

    if (filhotes && filhotes.length > 0) {
      itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Filhotes de Pastor do Cáucaso Disponíveis - Canil Vale da Kubera",
        "description": "Lista de filhotes de Pastor do Cáucaso (Kavkazskaya Ovcharka) atualmente disponíveis para reserva e venda.",
        "numberOfItems": filhotes.length,
        "itemListElement": filhotes.map((puppy, index) => {
          const genderSlug = puppy.gender === "macho" ? "macho" : "femea";
          return {
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://canil-pastor-do-caucaso.vercel.app/filhotes/filhote-${genderSlug}-pastor-do-caucaso-${puppy.id}`,
            "name": puppy.name,
            "description": puppy.notes || `Filhote de Pastor do Cáucaso (${puppy.gender === "macho" ? "Macho" : "Fêmea"}) disponível no Canil Vale da Kubera.`,
            "image": puppy.avatar_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400"
          };
        })
      };
    }
  } catch (err) {
    console.error("Error generating filhotes JSON-LD:", err);
  }

  return (
    <>
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <FilhotesClientPage />
    </>
  );
}
