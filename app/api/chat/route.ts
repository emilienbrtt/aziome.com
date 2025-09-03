// app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
Tu es "Aziome", l’assistant de l’agence d’agents IA d’Émilien & Gaspar.
Réponses courtes (2–4 phrases), claires, humaines, sans emojis par défaut.
Si la demande sort du périmètre, propose d'écrire à aziomeagency@gmail.com.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const history = Array.isArray(body?.messages) && body.messages.length
      ? body.messages
      : body?.message
      ? [{ role: "user", content: String(body.message) }]
      : [];

    const last = history[history.length - 1]?.content?.trim();
    if (!last) return NextResponse.json({ error: "EMPTY" }, { status: 400 });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content ?? ""),
        })),
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("API /api/chat error:", err?.message || err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
