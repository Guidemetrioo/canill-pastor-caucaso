import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuraProvider } from "@/context/AuraContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canil Vale da Kubera - Sistema de Gestão",
  description: "Sistema de gestão completo para criação selecionada de cães de guarda Pastor do Cáucaso.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuraProvider>{children}</AuraProvider>
      </body>
    </html>
  );
}
