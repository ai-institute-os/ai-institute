import { NextRequest, NextResponse } from "next/server";
import { screenCandidate } from "@/lib/screening";
import { isAdminAuthenticated } from "@/lib/client-auth";
import { db } from "@/lib/db";

// Input size limits to prevent DoS / cost-abuse (AII-904 QA fix)
const MAX_JOB_DESCRIPTION = 30_000; // ~5,000 words
const MAX_CV_TEXT = 40_000; // ~6,000 words
const MAX_JOB_TITLE = 200;

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Uautoriseret" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { jobDescription, cvText, jobTitle, candidateEmail } = body as Record<string, unknown>;

  if (
    typeof jobDescription !== "string" ||
    typeof cvText !== "string" ||
    !jobDescription.trim() ||
    !cvText.trim()
  ) {
    return NextResponse.json(
      { error: "jobDescription og cvText er påkrævet" },
      { status: 400 }
    );
  }

  // Max-length validation
  if (
    jobDescription.length > MAX_JOB_DESCRIPTION ||
    cvText.length > MAX_CV_TEXT ||
    (typeof jobTitle === "string" && jobTitle.length > MAX_JOB_TITLE)
  ) {
    return NextResponse.json(
      { error: "Input er for langt (max 30.000 / 40.000 / 200 tegn)" },
      { status: 400 }
    );
  }

  const title = typeof jobTitle === "string" ? jobTitle.trim() : "Ikke angivet";
  const startTime = Date.now();

  try {
    const result = await screenCandidate(jobDescription, cvText, title);

    // Log to screening_log table
    await db.execute({
      sql: `INSERT INTO screening_log
              (job_title, candidate_email, score, recommendation, summary, screening_ms)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        title,
        typeof candidateEmail === "string" ? candidateEmail : null,
        result.score,
        result.recommendation,
        result.summary,
        Date.now() - startTime,
      ],
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/screen] Screening fejlede:", err); // AII-903 fix
    const message = err instanceof Error ? err.message : "Ukendt fejl";
    return NextResponse.json(
      { error: `Screening fejlede: ${message}` },
      { status: 500 }
    );
  }
}
