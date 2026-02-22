import "./globals.css";

export const metadata = {
  title: "KashmirAI Eval — Human Translation Evaluation",
  description: "Human evaluation platform for Kashmiri→English machine translation research",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
