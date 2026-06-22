import { Metadata } from "next";
import { createClient } from "@/utils/supabase/client";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

// Fetch blog post helper
async function getPost(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Artigo não encontrado" };

  return {
    title: `${post.title} | Blog Canil Aura`,
    description: post.excerpt || `Leia sobre ${post.title} no blog oficial do Canil Aura, especialista em Pastor do Cáucaso.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);

  // Fallback data
  const fallbackPost = post || {
    title: "Como Cuidar de um Pastor do Cáucaso Filhote",
    slug: params.slug,
    content: "O Pastor do Cáucaso é uma raça gigante de guarda territorial. Quando filhotes, necessitam de alimentação super premium rica em cálcio e condroitina para as articulações, além de uma rotina firme de socialização desde a primeira semana de chegada à nova casa. Ensine comandos de foco e obediência desde cedo, e garanta que o cão tenha um espaço cercado seguro.",
    excerpt: "Dicas essenciais para criar um cão de guarda saudável.",
    tags: ["filhotes", "cuidados"],
    image_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600",
    created_at: new Date().toISOString()
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": fallbackPost.title,
    "image": [fallbackPost.image_url],
    "datePublished": fallbackPost.created_at,
    "author": {
      "@type": "Person",
      "name": "Criador do Canil Aura",
      "url": "https://canil-pastor-do-caucaso.vercel.app/sobre"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans flex flex-col justify-between">
        <PublicNavbar />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-8">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#C9A96E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o blog</span>
          </Link>

          {/* Post Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {fallbackPost.tags.map((tag: string, i: number) => (
                <span key={i} className="text-[10px] text-[#C9A96E] bg-[#C9A96E]/10 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{fallbackPost.title}</h1>
            
            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-gray-400 border-b border-[#2A2A2A] pb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(fallbackPost.created_at).toLocaleDateString("pt-BR")}</span>
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Por: Criador do Canil Aura</span>
              </span>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-[#2A2A2A] bg-gray-950">
            <img
              src={fallbackPost.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600"}
              alt={fallbackPost.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Post Content */}
          <article className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed space-y-6">
            {fallbackPost.content.split("\n\n").map((para: string, i: number) => (
              <p key={i}>{para}</p>
            ))}
          </article>
        </main>

        <PublicFooter />
        <WhatsAppButton />
      </div>
    </>
  );
}
