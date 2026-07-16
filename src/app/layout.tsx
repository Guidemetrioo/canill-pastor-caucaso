import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuraProvider } from "@/context/AuraContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://canil-pastor-do-caucaso.vercel.app"),
  title: {
    default: "Canil Vale da Kubera | Pastor do Cáucaso",
    template: "%s | Canil Vale da Kubera",
  },
  description: "Canil especializado em Pastor do Cáucaso com padrão de exposição. Genética importada da Rússia, Ucrânia, Romênia e Espanha. Estrutura e saúde comprovadas.",
  keywords: [
    "canil pastor do caucaso",
    "pastor do caucaso sao paulo",
    "filhote de pastor do caucaso",
    "valedakubera",
    "canil vale da kubera",
    "criador pastor do caucaso",
    "cão de guarda gigante",
    "pastor do caucaso sp"
  ],
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
