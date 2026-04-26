"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/screen");
        return;
      }

      if (res.status === 429) {
        setError("For mange forsøg. Prøv igen om 15 minutter.");
      } else {
        setError("Forkert adgangskode");
      }
    } catch {
      setError("Netværksfejl. Prøv igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A1628",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#0f1e35",
          border: "1px solid #1e3a5f",
          borderRadius: 8,
          padding: "2.5rem",
          width: "100%",
          maxWidth: 380,
        }}
      >
        <h1
          style={{
            color: "#00D4FF",
            fontSize: 22,
            marginBottom: "0.25rem",
            textAlign: "center",
          }}
        >
          AISelect Admin
        </h1>
        <p
          style={{
            color: "#8ba3c0",
            fontSize: 14,
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Log ind for at fortsætte
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                color: "#c9d8e8",
                fontSize: 14,
                marginBottom: 6,
              }}
            >
              Adgangskode
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#0A1628",
                border: "1px solid #1e3a5f",
                borderRadius: 4,
                color: "#e8f0f8",
                fontSize: 16,
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.625rem 0.75rem",
                background: "#3b0a0a",
                border: "1px solid #7f1d1d",
                borderRadius: 4,
                color: "#fca5a5",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: "100%",
              padding: "11px",
              background: loading || !password ? "#1e3a5f" : "#0A1628",
              color: loading || !password ? "#4a7fa5" : "#00D4FF",
              border: "1px solid #00D4FF",
              borderRadius: 4,
              fontSize: 16,
              fontWeight: "bold",
              cursor: loading || !password ? "not-allowed" : "pointer",
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "Logger ind…" : "Log ind"}
          </button>
        </form>
      </div>
    </main>
  );
}
