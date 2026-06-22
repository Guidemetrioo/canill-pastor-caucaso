"use client";

import { useAura } from "@/context/AuraContext";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { BookOpen, ArrowRight, Tag } from "lucide-react";

export default function BlogPage() {
  const { blogPosts } = useAura();

  const publishedPosts = blogPosts.filter((post) => post.published);

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-24 font-sans flex flex-col justify-between">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-10">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Artigos &amp; Notícias</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Blog do <span className="text-[#C9A96E]">Canil Aura</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
            Dicas de adestramento, alimentação, cuidados com filhotes de grande porte e curiosidades sobre o Pastor do Cáucaso.
          </p>
        </div>

        {/* Posts Grid */}
        {publishedPosts.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-16 text-center text-gray-400 text-xs">
            Nenhum artigo publicado no momento. Volte em breve!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-[#C9A96E]/50 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div className="relative h-48 bg-gray-900 overflow-hidden">
                  <img
                    src={post.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] text-[#C9A96E] bg-[#C9A96E]/10 px-2 py-0.5 rounded font-semibold uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold group-hover:text-[#C9A96E] transition-colors leading-tight">{post.title}</h3>
                    <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed">
                      {post.excerpt || "Clique para ler o artigo completo sobre a raça Pastor do Cáucaso no blog do Canil Aura."}
                    </p>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A96E] hover:underline pt-4 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Ler Artigo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
