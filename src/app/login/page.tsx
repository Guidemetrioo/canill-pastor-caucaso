"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAura } from "@/context/AuraContext";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { activeTheme, themes } = useAura();
  const t = themes[activeTheme];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Bypassing check for local presentation
    if (
      (email === "admin@aura.com" && password === "admin") ||
      (email === "profissional@aura.com" && password === "senha")
    ) {
      document.cookie = "aura-mock-session=true; path=/";
      localStorage.setItem("aura-mock-role", email === "admin@aura.com" ? "admin" : "professional");
      localStorage.setItem("aura-mock-name", email === "admin@aura.com" ? "Administrador Aura" : "Barbeiro 2");
      router.push("/dashboard");
      router.refresh();
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(
          signInError.message === "Invalid login credentials"
            ? "Credenciais inválidas. Use para testar: admin@aura.com / admin"
            : signInError.message
        );
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      // Connect fallback bypass
      document.cookie = "aura-mock-session=true; path=/";
      localStorage.setItem("aura-mock-role", "admin");
      localStorage.setItem("aura-mock-name", "Administrador Aura");
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <main 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all duration-300"
      style={{ backgroundColor: t.bgHex }}
    >
      {/* Decorative background shapes matching theme accent */}
      <div 
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-300" 
        style={{ backgroundColor: `${t.accentHex}10` }} 
      />
      <div 
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-300" 
        style={{ backgroundColor: `${t.accentHex}10` }} 
      />

      <div 
        className="w-full max-w-md border rounded-2xl p-8 shadow-xl relative z-10 backdrop-blur-md transition-all duration-300"
        style={{ 
          backgroundColor: t.cardBgHex || '#FFFFFF',
          borderColor: 'rgba(0,0,0,0.08)'
        }}
      >
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/logo.png" 
            alt="Logo Vale da Kubera" 
            className="w-16 h-16 object-contain rounded-xl border border-gray-200/50 shadow-sm mb-4 bg-white p-1"
          />
          <h1 className={`text-2xl font-bold tracking-wider font-comfortaa ${t.textMain}`}>
            VALE DA KUBERA
          </h1>
          <p className={`text-xs tracking-widest font-bold mt-1 uppercase ${t.tagText}`}>
            Canil de Pastor do Cáucaso
          </p>
          <p className={`text-sm mt-3 text-center ${t.textMuted}`}>
            Entre para gerenciar seus agendamentos e serviços
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4 flex items-start gap-3 font-sans">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <label className={`block text-xs font-semibold ${t.textMain}`}>
              E-mail
            </label>
            <div className="relative">
              <span className={`absolute inset-y-0 left-0 pl-3 flex items-center ${t.textMuted}`}>
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@aura.com"
                className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-xl placeholder-gray-400 focus:outline-none transition-all text-xs font-sans ${t.textMain}`}
                style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                onFocus={(e) => {
                  e.target.style.borderColor = t.accentHex;
                  e.target.style.boxShadow = `0 0 0 2px ${t.accentHex}15`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.1)';
                  e.target.style.boxShadow = 'none';
                }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className={`block text-xs font-semibold ${t.textMain}`}>
              Senha
            </label>
            <div className="relative">
              <span className={`absolute inset-y-0 left-0 pl-3 flex items-center ${t.textMuted}`}>
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border rounded-xl placeholder-gray-400 focus:outline-none transition-all text-xs font-sans ${t.textMain}`}
                style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                onFocus={(e) => {
                  e.target.style.borderColor = t.accentHex;
                  e.target.style.boxShadow = `0 0 0 2px ${t.accentHex}15`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.1)';
                  e.target.style.boxShadow = 'none';
                }}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-white font-bold rounded-xl transition-all shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-sans active:scale-95 text-xs"
            style={{ backgroundColor: t.accentHex }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Entrar no Sistema"
            )}
          </button>
        </form>

        {/* Footer info */}
        <div 
          className="mt-8 pt-6 border-t text-center text-xs space-y-1"
          style={{ borderColor: 'rgba(0,0,0,0.06)' }}
        >
          <p className={`${t.textMain} font-semibold`}>Acesso restrito para colaboradores</p>
          <p className={`${t.textMuted} text-[10px]`}>
            Administrador &bull; Profissional
          </p>
        </div>
      </div>
    </main>
  );
}
