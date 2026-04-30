import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UI Component Customization Platform",
  description:
    "Base architecture for a multi-tenant SaaS platform that generates branded UI kits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_36%),linear-gradient(180deg,#0b1120_0%,#0f172a_40%,#111827_100%)] text-slate-100">
        {children}
      </body>
    </html>
  );
}
