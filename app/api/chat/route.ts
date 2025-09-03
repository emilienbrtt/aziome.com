// /app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Petite fonction qui récupère proprement le message utilisateur,
// quel que soit le format envoyé par le front.
function extractMessages(body: any): Msg[] {
  // 1) Format attendu: { messages: [{role, content}, ...] }
  if (Array.isArray(body?.messages)) {
    const arr = body.messages
      .filter((m: any) => m && typeof m.content === "string" && m.content.trim())
      .map((m: any) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content.trim() }));
    if (arr.length) return arr;
  }

  // 2) Formats alternatifs: { message: "..." } / { question: "..." } / { input: "..." }
  const single =
    (typeof body?.message === "string" && body.message) ||
    (typeof body?.question === "string" && body.question) ||
    (typeof body?.input === "string" && body.input);

  if (typeof single === "string" && single.trim()) {
    return [{ role: "user", content: single.trim() }];
  }

  return [];
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages = extractMessages(body);

    if (!messages.length) {
      // On renvoie un message lisible (et pas une 500) pour que l’UI ne parte pas en “Désolé…”
      return NextResponse.json(
        { reply: "Je n’ai pas reçu la question (payload vide). Réessaie ou recharge la page." },
        { status: 200 }
      );
    }

    // On fabrique un transcript pour donner le contexte à l’assistant
    const transcript = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
    const assistantId = process.env.AZIOME_ASSISTANT_ID;

    if (assistantId) {
      // Bypass des types pour 'assistant_id' (OK au runtime, certains types du SDK sont en retard)
      const r = await (client as any).responses.create({
        assistant_id: assistantId,
        input: transcript,
      });
      const reply = (r as any).output_text ?? "";
      return NextResponse.json({ reply }, { status: 200 });
    }

    // Fallback sans assistant
    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });
    const reply = r.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply }, { status: 200 });
  } catch (err: any) {
    const msg =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Erreur côté serveur.";
    console.error("API /api/chat error:", msg);
    return NextResponse.json({ reply: `⚠️ ${msg}` }, { status: 200 });
  }
}
