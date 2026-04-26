"use client";

import { useState } from "react";

interface ScreeningResult {
  score: number;
  recommendation: "advance" | "reject" | "maybe";
  summary: string;
  strengths: string[];
  concerns: string[];
  biasWarning?: string;
}

const REC_LABELS = {
  advance: { text: "Gå videre", color: "#22c55e" },
  maybe: { text: "Måske", color: "#f59e0b" },
  reject: { text: "Afvis", color: "#ef4444" },
} as const;

export default function ScreenPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription, cvText }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukendt fejl");
    } finally {
      setLoading(false);
    }
  }

  const scoreColor =
    result?.score !== undefined
      ? result.score >= 70
        ? "#22c55e"
        : result.score >= 50
        ? "#f59e0b"
        : "#ef4444"
      : "#00D4FF";

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#0A1628" }}>CV Screening</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>
            Stillingsbetegnelse
          </label>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            maxLength={200}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4 }}
            placeholder="fx: Senior Marketing Manager"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>
            Jobopslag
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            maxLength={30000}
            rows={8}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4, resize: "vertical" }}
            placeholder="Paste jobopslaget her..."
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>
            CV
          </label>
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            maxLength={40000}
            rows={12}
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4, resize: "vertical" }}
            placeholder="Paste CV'et her..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !jobDescription.trim() || !cvText.trim()}
          style={{
            background: loading ? "#ccc" : "#0A1628",
            color: "#00D4FF",
            padding: "12px 32px",
            border: "none",
            borderRadius: 4,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Screener… (5-15 sek)" : "Screen CV"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#fee2e2", borderRadius: 4, color: "#991b1b" }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: "2rem", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
          {/* Score header */}
          <div style={{ background: "#0A1628", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              border: `4px solid ${scoreColor}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: "bold", color: scoreColor,
            }}>
              {result.score}
            </div>
            <div>
              <div style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                {result.score}/100
              </div>
              <span style={{
                background: REC_LABELS[result.recommendation].color,
                color: "white", padding: "4px 12px", borderRadius: 12, fontSize: 14,
              }}>
                {REC_LABELS[result.recommendation].text}
              </span>
            </div>
          </div>

          {/* Details */}
          <div style={{ padding: "1.5rem" }}>
            <p style={{ color: "#374151", marginBottom: "1rem" }}>{result.summary}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <h3 style={{ color: "#22c55e", marginBottom: 8 }}>Styrker</h3>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <h3 style={{ color: "#ef4444", marginBottom: 8 }}>Bekymringer</h3>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {result.concerns.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>

            {result.biasWarning && (
              <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#fef3c7", borderRadius: 4, color: "#92400e", fontSize: 14 }}>
                ⚠️ {result.biasWarning}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
