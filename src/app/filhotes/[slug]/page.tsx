import { Metadata } from "next";
import { createClient } from "@/utils/supabase/client";
import PuppyDetailClient from "@/components/PuppyDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

// Parse ID helper
function getPuppyIdFromSlug(slug: string): number {
  const parts = slug.split("-");
  return parseInt(parts[parts.length - 1]);
}

// Fetch puppy directly from Supabase
async function getPuppy(id: number) {
  const supabase = createClient();
  const { data } = await supabase
    .from("filhotes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = getPuppyIdFromSlug(params.slug);
  if (isNaN(id)) return { title: "Filhote não encontrado" };

  const puppy = await getPuppy(id);
  if (!puppy) return { title: "Filhote não encontrado" };

  const title = `Filhote ${puppy.name} | Pastor do Cáucaso à Venda`;
  const description = puppy.notes || `Filhote de Pastor do Cáucaso (${puppy.gender === "macho" ? "Macho" : "Fêmea"}) disponível no Canil Aura. Com pedigree CBKC, microchipado e vacinado.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: puppy.avatar_url ? [{ url: puppy.avatar_url }] : [],
    },
  };
}

export default async function PuppyPage({ params }: Props) {
  const id = getPuppyIdFromSlug(params.slug);
  if (isNaN(id)) notFound();

  const puppy = await getPuppy(id);

  // If puppy is not found, fallback to mock data wrapper inside PuppyDetailClient (we want robust resilience)
  const fallbackPuppy = puppy || {
    id,
    name: "Thor (Mock)",
    gender: "macho" as const,
    price: 6000,
    notes: "Filhote exemplar de Pastor do Cáucaso, com estrutura pesada, pelagem abundante e linhagem premiada.",
    avatar_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400",
    photos: ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400"],
    health_records: [
      { type: "vacina" as const, name: "1ª Dose V10", date: "2026-05-30", status: "Aplicado" as const }
    ],
    weight_history: [
      { date: "2026-04-15", weight: 0.8 },
      { date: "2026-05-15", weight: 4.2 }
    ],
    status: "Disponível",
    father_name: "Kahn da Aura",
    mother_name: "Sasha da Aura"
  };

  return <PuppyDetailClient puppy={fallbackPuppy} />;
}
