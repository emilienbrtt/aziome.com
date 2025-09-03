// app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";        // pas Edge -> évite les timeouts courts
export const dynamic = "force-dynamic"; // pour éviter le cache
export const maxDuration = 60;          // Vercel: jusqu'à 60 s si besoin

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // ❌ pas de générique ici
    const { message } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message vide." }, { status: 400 });
    }

    const assistantId = process.env.AZIOME_ASSISTANT_ID;
    if (!assistantId || !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Variables OPENAI_API_KEY ou AZIOME_ASSISTANT_ID manquantes." },
        { status: 500 }
      );
    }

    // 1) Créer un thread
    const thread = await client.beta.threads.create();

    // 2) Ajouter le message utilisateur
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    // 3) Lancer un run avec ton assistant
    const run = await client.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    // 4) Poll jusqu’à complétion (ou timeout)
    let status = run.status;
    let tries = 0;
    while (status === "queued" || status === "in_progress") {
      await new Promise((r) => setTimeout(r, 1200)); // 1.2 s
      const updated = await client.beta.threads.runs.retrieve(thread.id, run.id);
      status = updated.status;
      if (++tries > 45) break; // ~54 s max
    }

    if (status !== "completed") {
      // run cancelled / failed / expired…
      return NextResponse.json({
        reply:
          "Désolé, je n’arrive pas à répondre pour le moment. Réessaie dans un instant.",
      });
    }

    // 5) Récupérer le dernier message assistant
    const list = await client.beta.threads.messages.list(thread.id, { limit: 5 });
    const firstAssistant = list.data.find((m) => m.role === "assistant");

    // Les contenus d'un message assistant sont un tableau (texte, pièces jointes, etc.)
    let text = "";
    if (firstAssistant?.content?.length) {
      text = firstAssistant.content
        .map((c: any) => {
          // c.type === "text" => c.text.value
          if (c.type === "text" && c.text?.value) return c.text.value;
          return "";
        })
        .filter(Boolean)
        .join("\n")
        .trim();
    }

    return NextResponse.json({ reply: text || "…" });
  } catch (err) {
    console.error("[/api/chat] error:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
