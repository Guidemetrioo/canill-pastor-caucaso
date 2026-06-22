import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://canil-pastor-do-caucaso.vercel.app";

  // Static routes
  const staticRoutes = [
    "",
    "/sobre",
    "/filhotes",
    "/a-raca-pastor-do-caucaso",
    "/servicos/cobertura",
    "/servicos/adestramento",
    "/servicos/hospedagem",
    "/blog",
    "/galeria",
    "/contato",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch puppies from Supabase
  let puppyRoutes: any[] = [];
  try {
    const supabase = createClient();
    const { data: filhotes } = await supabase
      .from("filhotes")
      .select("id, gender")
      .eq("status", "Disponível");

    if (filhotes) {
      puppyRoutes = filhotes.map((puppy) => {
        const genderSlug = puppy.gender === "macho" ? "macho" : "femea";
        return {
          url: `${baseUrl}/filhotes/filhote-${genderSlug}-pastor-do-caucaso-${puppy.id}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      });
    }
  } catch (err) {
    console.error("Error generating sitemap puppy routes:", err);
  }

  // Fetch blog posts from Supabase
  let blogRoutes: any[] = [];
  try {
    const supabase = createClient();
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("published", true);

    if (posts) {
      blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error("Error generating sitemap blog routes:", err);
  }

  return [...staticRoutes, ...puppyRoutes, ...blogRoutes];
}
