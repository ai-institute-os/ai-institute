"use client";

import { Fragment, useEffect, useState, useCallback } from "react";

interface Screening {
  id: number;
  job_title: string | null;
  candidate_email: string | null;
  score: number;
  recommendation: "advance" | "reject" | "maybe";
  summary: string;
  created_at: string;
}

interface ApiResponse {
  screenings: Screening[];
  total: number;
  pages: number;
}

const REC_LABELS = {
  advance: { text: "Gå videre", color: "#22c55e" },
  maybe: { text: "Måske", color: "#f59e0b" },
  reject: { text: "Afvis", color: "#ef4444" },
} as const;

function scoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("da-DK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"" | "advance" | "reject" | "maybe">("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScreenings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (filter) params.set("recommendation", filter);
      const res = await fetch(`/api/admin/screenings?${params}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukendt fejl");
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchScreenings();
  }, [fetchScreenings]);

  const screenings = data?.screenings ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  const avgScore =
    screenings.length > 0
      ? Math.round(screenings.reduce((s, r) => s + r.score, 0) / screenings.length)
      : null;

  const pctAdvance =
    screenings.length > 0
      ? Math.round((screenings.filter((r) => r.recommendation === "advance").length / screenings.length) * 100)
      : null;

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#0A1628", marginBottom: "0.25rem" }}>Screening-historik</h1>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", marginTop: 0 }}>
        Alle gennemførte CV-screeninger
      </p>

      {/* Statistics header */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          { label: "Totalt screeninger", value: total },
          { label: "Gns. score (side)", value: avgScore !== null ? `${avgScore}/100` : "–" },
          { label: "% anbefalet videre", value: pctAdvance !== null ? `${pctAdvance}%` : "–" },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              flex: "1 1 200px",
              background: "#0A1628",
              color: "white",
              padding: "1rem 1.25rem",
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: "bold", color: "#00D4FF" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <label style={{ fontWeight: "bold", fontSize: 14 }}>Filter:</label>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as typeof filter);
            setPage(1);
          }}
          style={{
            padding: "6px 10px",
            border: "1px solid #ddd",
            borderRadius: 4,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <option value="">Alle</option>
          <option value="advance">Gå videre</option>
          <option value="maybe">Måske</option>
          <option value="reject">Afvis</option>
        </select>
        <button
          onClick={() => { setPage(1); fetchScreenings(); }}
          style={{
            background: "#0A1628",
            color: "#00D4FF",
            border: "none",
            borderRadius: 4,
            padding: "6px 16px",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Opdater
        </button>
      </div>

      {error && (
        <div style={{ padding: "0.75rem", background: "#fee2e2", borderRadius: 4, color: "#991b1b", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: "#6b7280", padding: "2rem 0", textAlign: "center" }}>Indlæser…</div>
      ) : screenings.length === 0 ? (
        <div style={{ color: "#6b7280", padding: "2rem 0", textAlign: "center" }}>
          Ingen screeninger fundet.
        </div>
      ) : (
        <>
          {/* Table */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#0A1628", color: "white" }}>
                  {["Job", "Kandidat", "Score", "Anbefaling", "Dato", "Detaljer"].map((h) => (
                    <th
                      key={h}
                      style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {screenings.map((s, idx) => (
                  <Fragment key={s.id}>
                    <tr
                      style={{
                        background: idx % 2 === 0 ? "white" : "#f9fafb",
                        borderTop: "1px solid #e5e7eb",
                        cursor: "pointer",
                      }}
                      onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                    >
                      <td style={{ padding: "10px 12px" }}>
                        {s.job_title ?? <em style={{ color: "#9ca3af" }}>Ikke angivet</em>}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#6b7280" }}>
                        {s.candidate_email ?? "–"}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            minWidth: 36,
                            padding: "2px 8px",
                            borderRadius: 12,
                            background: scoreColor(s.score),
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {s.score}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            padding: "2px 10px",
                            borderRadius: 12,
                            background: REC_LABELS[s.recommendation]?.color ?? "#6b7280",
                            color: "white",
                            fontSize: 13,
                          }}
                        >
                          {REC_LABELS[s.recommendation]?.text ?? s.recommendation}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#6b7280", whiteSpace: "nowrap" }}>
                        {formatDate(s.created_at)}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#00D4FF" }}>
                        {expandedId === s.id ? "▲ Luk" : "▼ Vis"}
                      </td>
                    </tr>
                    {expandedId === s.id && (
                      <tr style={{ background: "#f0f9ff" }}>
                        <td colSpan={6} style={{ padding: "1rem 1.25rem" }}>
                          <div style={{ fontWeight: "bold", marginBottom: 6, color: "#0A1628" }}>
                            Opsummering
                          </div>
                          <p style={{ margin: 0, color: "#374151", lineHeight: 1.6 }}>{s.summary}</p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", justifyContent: "center" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  padding: "6px 14px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                  background: page <= 1 ? "#f3f4f6" : "white",
                }}
              >
                ← Forrige
              </button>
              <span style={{ color: "#6b7280", fontSize: 14 }}>
                Side {page} af {pages}
              </span>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: "6px 14px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  cursor: page >= pages ? "not-allowed" : "pointer",
                  background: page >= pages ? "#f3f4f6" : "white",
                }}
              >
                Næste →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
