import type { Metadata } from "next";
import BlogClientPage from "@/components/BlogClientPage";
import { createClient } from "@/utils/supabase/client";

export const metadata: Metadata = {
  title: "Blog & Notícias | Canil Vale da Kubera",
  description: "Aprenda tudo sobre o adestramento, temperamento, alimentação e cuidados de saúde do Pastor do Cáucaso com especialistas na raça.",
  keywords: [
    "blog pastor do caucaso",
    "dicas adestramento pastor do caucaso",
    "alimentacao pastor do caucaso",
    "cuidados pastor do caucaso",
    "canil valedakubera blog"
  ],
  alternates: {
    canonical: "https://canil-pastor-do-caucaso.vercel.app/blog",
  },
  openGraph: {
    title: "Blog & Notícias | Canil Vale da Kubera",
    description: "Aprenda tudo sobre o adestramento, temperamento, alimentação e cuidados de saúde do Pastor do Cáucaso com especialistas na raça.",
    url: "https://canil-pastor-do-caucaso.vercel.app/blog",
    siteName: "Canil Vale da Kubera",
    images: [
      {
        url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400",
        width: 400,
        height: 300,
        alt: "Artigos sobre Pastor do Cáucaso",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default async function Page() {
  let blogSchema: any = null;
  try {
    const supabase = createClient();
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("id, title, excerpt, created_at, slug, image_url")
      .eq("published", true);

    if (posts && posts.length > 0) {
      blogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Blog do Canil Vale da Kubera",
        "description": "Artigos informativos e notícias sobre a raça Pastor do Cáucaso (Kavkazskaya Ovcharka).",
        "publisher": {
          "@type": "Organization",
          "name": "Canil Vale da Kubera",
          "logo": {
            "@type": "ImageObject",
            "url": "https://canil-pastor-do-caucaso.vercel.app/logo.png"
          }
        },
        "blogPost": posts.map((post) => ({
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt || "",
          "datePublished": post.created_at,
          "url": `https://canil-pastor-do-caucaso.vercel.app/blog/${post.slug}`,
          "image": post.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400"
        }))
      };
    }
  } catch (err) {
    console.error("Error generating blog JSON-LD:", err);
  }

  return (
    <>
      {blogSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
      )}
      <BlogClientPage />
    </>
  );
}
