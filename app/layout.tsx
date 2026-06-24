import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { auth } from "@/lib/auth";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AllBlack Sports — Camisas Tailandesas",
  description:
    "A melhor loja de camisas tailandesas de Grajaú-MA. Qualidade, variedade e personalização.",
  openGraph: {
    title: "AllBlack Sports",
    description: "Camisas tailandesas premium em Grajaú-MA",
    locale: "pt_BR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html
      lang="pt-BR"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <div
          id="loader-bg"
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0a0a0a',
            zIndex: 9998,
          }}
        />
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
