import "./globals.css";

const SITE_URL = "https://kashmiri-eval.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KashmirAI Research — Kashmiri Language NLP & Machine Translation",
    template: "%s | KashmirAI Research",
  },
  description:
    "Kashmir's pioneering NLP research platform. Advancing Kashmiri→English machine translation through LLM fine-tuning, parallel corpus construction, and human evaluation — by Faizan Ayoub.",
  keywords: [
    "Kashmiri language",
    "Kashmiri NLP",
    "Kashmiri machine translation",
    "Kashmiri English translation",
    "low-resource NLP",
    "LLM fine-tuning",
    "Kashmiri AI",
    "KashmirAI",
    "NLP research Kashmir",
    "Perso-Arabic script NLP",
    "Kashmiri language technology",
    "Faizan Ayoub",
  ],
  authors: [{ name: "Faizan Ayoub", url: SITE_URL }],
  creator: "Faizan Ayoub",
  publisher: "KashmirAI Research",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "KashmirAI Research",
    title: "KashmirAI Research — Kashmiri Language NLP & Machine Translation",
    description:
      "Kashmir's pioneering NLP research platform for Kashmiri→English machine translation research.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KashmirAI Research — Kashmiri Language NLP",
    description:
      "Kashmir's pioneering NLP research platform. Advancing Kashmiri→English machine translation through LLM fine-tuning.",
    creator: "@ayoub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ResearchProject",
      name: "KashmirAI — Low-Resource Neural Machine Translation for Kashmiri",
      description:
        "Researching LLM-based machine translation for Kashmiri, with parallel corpus construction and human evaluation from native speakers.",
      url: SITE_URL,
      founder: {
        "@type": "Person",
        name: "Faizan Ayoub",
        url: `${SITE_URL}/about`,
      },
      about: [
        { "@type": "Thing", name: "Kashmiri Language" },
        { "@type": "Thing", name: "Machine Translation" },
        { "@type": "Thing", name: "Natural Language Processing" },
        { "@type": "Thing", name: "Large Language Models" },
      ],
    },
    {
      "@type": "WebSite",
      name: "KashmirAI Research",
      url: SITE_URL,
      description:
        "Kashmir's pioneering NLP research platform for Kashmiri language machine translation.",
      publisher: {
        "@type": "Person",
        name: "Faizan Ayoub",
      },
    },
    {
      "@type": "Person",
      name: "Faizan Ayoub",
      url: `${SITE_URL}/about`,
      jobTitle: "AI Researcher",
      knowsAbout: [
        "Natural Language Processing",
        "Machine Translation",
        "Low-Resource Languages",
        "Kashmiri Language",
        "Large Language Models",
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
