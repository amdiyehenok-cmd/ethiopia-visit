import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatBot } from "@/components/chat/ChatBot";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { VoiceTourGuide } from "@/components/widgets/VoiceTourGuide";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Ethiopia Visit — Luxury Ethiopian Tourism & AI Travel Guide",
    template: "%s | Ethiopia Visit",
  },
  description:
    "Discover Ethiopia: curated luxury hotels, AI-powered itineraries, Lalibela rock churches, Simien Mountains, Danakil Depression, Ethiopian festivals, and Habesha AI — your 24/7 local guide.",
  keywords: [
    "Ethiopia travel", "Lalibela", "Simien Mountains", "Addis Ababa hotels",
    "Ethiopian festivals", "AI trip planner", "Ethiopia tourism", "Danakil Depression",
    "Omo Valley", "Ethiopian culture", "Habesha guide",
  ],
  authors: [{ name: "Ethiopia Visit" }],
  openGraph: {
    title: "Ethiopia Visit — Luxury Ethiopian Tourism",
    description: "Cinematic luxury travel to Ethiopia — hotels, culture, AI-powered planning, and local guides.",
    url: "https://ethiopia-visit.vercel.app",
    siteName: "Ethiopia Visit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Lalibela Rock-Hewn Churches, Ethiopia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethiopia Visit",
    description: "Luxury travel platform for Ethiopia — AI guides, curated hotels, and culture.",
    images: ["https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html
      lang="en" data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${jakarta.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        {/* AdSense — loaded as a plain script tag, NOT through next/script with data-nscript */}
        {adsClient && adsClient !== "ca-pub-" && (
          // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex min-h-screen flex-col bg-obsidian text-ivory">
        <ClientProviders>
          <CursorGlow />
          <Navbar />
          <main className="relative flex-1">{children}</main>
          <Footer />
          <ChatBot />
          <VoiceTourGuide />
        </ClientProviders>
        {/* Analytics — add your Google Analytics ID here */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
