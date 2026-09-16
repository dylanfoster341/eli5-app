import Anthropic from "@anthropic-ai/sdk";
import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";

const SYSTEM_PROMPT =
  "You explain things the way you'd explain them to a curious 5-year-old: " +
  "short sentences, simple everyday words, and concrete, relatable examples. " +
  "Avoid jargon. Keep the whole explanation to a few sentences.";

const MAX_QUESTION_LENGTH = 2000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const question =
    typeof (body as { question?: unknown })?.question === "string"
      ? (body as { question: string }).question.trim()
      : "";

  if (!question) {
    return Response.json({ error: "\"question\" is required." }, { status: 400 });
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return Response.json(
      { error: `"question" must be ${MAX_QUESTION_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: question }],
    });

    const answer = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return Response.json({ answer });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("Anthropic authentication error:", error.message);
      return Response.json(
        { error: "Server is misconfigured (invalid API key)." },
        { status: 500 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "Rate limited, please try again shortly." },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", error.status, error.message);
      return Response.json({ error: "Failed to get an explanation." }, { status: 502 });
    }

    console.error("Unexpected error calling Anthropic:", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
