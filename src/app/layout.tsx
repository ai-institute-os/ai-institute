import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AISelect — AI-implementering til din virksomhed",
  description: "Implementér AI i din virksomhed baseret på din AIScore-rapport. Konkrete løsninger skræddersyet til dine processer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body style={{ margin: 0, padding: 0, fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
