import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/client-auth";
import { db } from "@/lib/db";

const VALID_RECOMMENDATIONS = ["advance", "reject", "maybe"] as const;

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Uautoriseret" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const recParam = searchParams.get("recommendation");
  const recFilter = VALID_RECOMMENDATIONS.includes(recParam as (typeof VALID_RECOMMENDATIONS)[number])
    ? recParam
    : null;
  const offset = (page - 1) * limit;

  const whereClause = recFilter ? "WHERE recommendation = ?" : "";

  try {
    const countResult = await db.execute({
      sql: `SELECT COUNT(*) as total FROM screening_log ${whereClause}`,
      args: recFilter ? [recFilter] : [],
    });

    const total = Number((countResult.rows[0] as Record<string, unknown>).total ?? 0);
    const pages = Math.max(1, Math.ceil(total / limit));

    const listResult = await db.execute({
      sql: `SELECT id, job_title, candidate_email, score, recommendation, summary, created_at
            FROM screening_log
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?`,
      args: recFilter ? [recFilter, limit, offset] : [limit, offset],
    });

    const screenings = listResult.rows.map((row) => ({
      id: row.id,
      job_title: row.job_title,
      candidate_email: row.candidate_email,
      score: row.score,
      recommendation: row.recommendation,
      summary: row.summary,
      created_at: row.created_at,
    }));

    return NextResponse.json({ screenings, total, pages });
  } catch (err) {
    console.error("[/api/admin/screenings] Databasefejl:", err);
    return NextResponse.json({ error: "Databasefejl" }, { status: 500 });
  }
}
