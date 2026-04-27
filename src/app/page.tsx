const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/research-aiscore/30min";

export default function HomePage() {
  return (
    <main style={{ margin: 0, padding: 0, color: "#1e293b", fontFamily: "Arial, sans-serif" }}>
      {/* Hero */}
      <section
        style={{
          background: "#0A1628",
          color: "#fff",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#00D4FF",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontSize: "0.85rem",
            marginBottom: "16px",
          }}
        >
          AI Instituttet — AISelect
        </p>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: 800,
            margin: "0 0 24px",
            lineHeight: 1.15,
          }}
        >
          Implementér AI i din virksomhed
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#94a3b8",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          Konkret AI-implementering skræddersyet til din virksomheds AIScore-rapport. Vi bygger
          løsningerne — du høster resultaterne.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#00D4FF",
            color: "#0A1628",
            fontWeight: "bold",
            fontSize: "1.05rem",
            padding: "16px 40px",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Book et gratis afklaringsmøde
        </a>
      </section>

      {/* What is AISelect */}
      <section style={{ padding: "64px 24px", maxWidth: "760px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "16px", color: "#0A1628" }}>
          Hvad er AISelect?
        </h2>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#475569" }}>
          AISelect er AI Instituttets implementeringsprodukt. Baseret på din AIScore-rapport
          identificerer vi de konkrete AI-løsninger der giver størst effekt i netop din virksomhed —
          og vi implementerer dem med dit team. Ingen generiske råd. Kun målrettede løsninger.
        </p>
      </section>

      {/* How it works */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "40px",
              color: "#0A1628",
              textAlign: "center",
            }}
          >
            Sådan fungerer det
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "32px",
            }}
          >
            {[
              {
                step: "1",
                title: "Din AIScore-rapport",
                body: "Du modtager din rapport med scores på 6 AI-dimensioner og konkrete anbefalinger til hvad der skal prioriteres.",
              },
              {
                step: "2",
                title: "Gennemgang og plan",
                body: "Vi ringer og gennemgår rapporten. Sammen beslutter vi hvilke områder der implementeres først og hvad målene er.",
              },
              {
                step: "3",
                title: "Implementering",
                body: "Vi implementerer AI-løsningerne direkte i dine eksisterende systemer og processer — med løbende opfølgning.",
              },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  padding: "28px 24px",
                  boxShadow: "0 1px 4px rgba(0,0,0,.08)",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#0A1628",
                    color: "#00D4FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    marginBottom: "16px",
                  }}
                >
                  {step}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", margin: "0 0 8px", color: "#0A1628" }}>
                  {title}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section style={{ padding: "64px 24px", maxWidth: "760px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "32px", color: "#0A1628" }}>
          Hvad du får
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[
            "AI-automatisering af dine mest tidskrævende processer",
            "Prompt-bibliotek skræddersyet til dit teams arbejdsopgaver",
            "Integration med eksisterende systemer (CRM, ERP, mail, kalender)",
            "Månedlig opfølgning og optimering af de implementerede løsninger",
          ].map((item) => (
            <li
              key={item}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                marginBottom: "18px",
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "#1e293b",
              }}
            >
              <span style={{ color: "#00D4FF", fontWeight: "bold", fontSize: "1.2rem", marginTop: "1px" }}>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "#0A1628",
          color: "#fff",
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "16px" }}>
          Klar til at komme i gang?
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginBottom: "36px", maxWidth: "480px", margin: "0 auto 36px" }}>
          Book et gratis 30-minutters afklaringsmøde. Vi gennemgår din rapport og laver en konkret
          implementeringsplan.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#00D4FF",
            color: "#0A1628",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "18px 48px",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Book gratis afklaringsmøde
        </a>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#020c1b",
          color: "#475569",
          padding: "32px 24px",
          textAlign: "center",
          fontSize: "0.9rem",
        }}
      >
        <p style={{ margin: "0 0 6px" }}>
          <strong style={{ color: "#94a3b8" }}>AI Instituttet</strong>
        </p>
        <p style={{ margin: 0 }}>
          <a href="mailto:kontakt@aiinstituttet.dk" style={{ color: "#64748b", textDecoration: "none" }}>
            kontakt@aiinstituttet.dk
          </a>
        </p>
      </footer>
    </main>
  );
}
