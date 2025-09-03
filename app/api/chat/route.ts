// /app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // pour être sûr d'être en runtime Node et pas Edge

type Msg = { role: "user" | "assistant"; content: string };

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Vercel > Environment Variables
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages = (body?.messages ?? []) as Msg[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { reply: "Message vide." },
        { status: 200 }
      );
    }

    // On transforme l'historique en texte pour l'assistant (qui garde ainsi le contexte)
    const transcript = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const assistantId = process.env.AZIOME_ASSISTANT_ID;

    // 1) Chemin principal : utiliser TON assistant (fichiers + instructions)
    if (assistantId) {
      const r = await client.responses.create({
        assistant_id: assistantId,
        input: transcript, // tout l'historique, pas seulement le dernier message
      });

      const reply = (r as any).output_text ?? "";
      return NextResponse.json({ reply }, { status: 200 });
    }

    // 2) Fallback : modèle de chat standard (si pas d'assistant configuré)
    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages, // ici on peut passer le tableau tel quel
    });

    const reply = r.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply }, { status: 200 });
  } catch (err: any) {
    // On renvoie l'erreur DANS la réponse (status 200) pour éviter le "Désolé…"
    const msg =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Erreur côté serveur.";
    console.error("API /api/chat error:", msg);
    return NextResponse.json(
      { reply: `⚠️ Erreur côté serveur: ${msg}` },
      { status: 200 }
    );
  }
}
