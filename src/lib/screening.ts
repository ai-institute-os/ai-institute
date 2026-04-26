import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export interface ScreeningResult {
  score: number; // 0–100
  recommendation: "advance" | "reject" | "maybe";
  summary: string;
  strengths: string[];
  concerns: string[];
  biasWarning?: string;
}

const SYSTEM_PROMPT = `Du er en professionel, upartisk rekrutteringsassistent. Du screener CV'er objektivt baseret på jobkrav.

Vigtige principper:
- Vurder KUN faglige kvalifikationer og erfaring — ALDRIG navn, køn, alder, nationalitet eller etnicitet
- Vær konkret og specifik i begrundelser
- Score 0-100: 70+ = "advance", 40-69 = "maybe", <40 = "reject"
- Flag eksplicit hvis du ikke kan vurdere objektivt pga. manglende information

Returnér ALTID valid JSON med tool_use.`;

export async function screenCandidate(
  jobDescription: string,
  cvText: string,
  jobTitle: string
): Promise<ScreeningResult> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" }, // cache system prompt across calls
      },
    ],
    tools: [
      {
        name: "submit_screening_result",
        description: "Submit the structured screening result",
        input_schema: {
          type: "object" as const,
          properties: {
            score: { type: "number", description: "0-100 match score" },
            recommendation: {
              type: "string",
              enum: ["advance", "reject", "maybe"],
            },
            summary: { type: "string", description: "2-3 sentence summary" },
            strengths: {
              type: "array",
              items: { type: "string" },
              description: "Top 3 strengths",
            },
            concerns: {
              type: "array",
              items: { type: "string" },
              description: "Top concerns or gaps",
            },
            biasWarning: {
              type: "string",
              description: "Flag if objective assessment was difficult",
            },
          },
          required: ["score", "recommendation", "summary", "strengths", "concerns"],
        },
      },
    ],
    tool_choice: { type: "auto" },
    messages: [
      {
        role: "user",
        content: `Stilling: ${jobTitle}\n\nJOBBESKRIVELSE:\n${jobDescription}\n\nCV:\n${cvText}`,
      },
    ],
  });

  const toolUse = response.content.find((c) => c.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Screening returnerede ikke et struktureret resultat");
  }

  return toolUse.input as ScreeningResult;
}
