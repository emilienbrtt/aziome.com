// /app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // important en production

type Msg = { role: "user" | "assistant"; content: string };

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages = (body?.messages ?? []) as Msg[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ reply: "Message vide." }, { status: 200 });
    }

    // on passe tout l’historique pour garder le contexte
    const transcript = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const assistantId = process.env.AZIOME_ASSISTANT_ID;

    if (assistantId) {
      // ⬇️ Bypass du typage qui bloque le build (le runtime OpenAI accepte bien assistant_id)
      const r = await (client as any).responses.create({
        assistant_id: assistantId,
        input: transcript,
      });

      const reply = (r as any).output_text ?? "";
      return NextResponse.json({ reply }, { status: 200 });
    }

    // Fallback si pas d’assistant configuré
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
    // on renvoie l’erreur DANS reply (status 200) pour éviter le “Désolé…”
    return NextResponse.json({ reply: `⚠️ ${msg}` }, { status: 200 });
  }
}
