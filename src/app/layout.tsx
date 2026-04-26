import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AISelect — AI-drevet CV-screening",
  description: "Screen kandidater hurtigere og mere præcist med AI.",
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
