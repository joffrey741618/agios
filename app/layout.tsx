import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agios — Récupère les frais bancaires prélevés à tort",
  description:
    "Commissions d'intervention, frais de rejet, options inutiles : repère les frais abusifs sur ton relevé et réclame-les à ta banque.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
