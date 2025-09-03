// app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ← évite les surprises avec Edge

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const message: string = body?.message;

    // Gardes-fous : on renvoie des erreurs CLAIRES côté client
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message vide ou invalide." },
        { status: 400 }
      );
    }

    const assistantId = process.env.AZIOME_ASSISTANT_ID;
    if (!assistantId || !assistantId.startsWith("asst_")) {
      return NextResponse.json(
        { error: "AZIOME_ASSISTANT_ID manquant ou invalide." },
        { status: 500 }
      );
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante." },
        { status: 500 }
      );
    }

    // 1) Créer le thread avec le message utilisateur
    const thread = await openai.beta.threads.create({
      messages: [{ role: "user", content: message }],
    });

    // 2) Lancer un run de TON assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    // 3) Poll jusqu’à complétion (max ~16s)
    let replyText = "";
    for (let i = 0; i < 20; i++) {
      const current = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );

      if (current.status === "completed") {
        // 4) Récupérer le dernier message assistant
        const msgs = await openai.beta.threads.messages.list(thread.id, {
          order: "desc",
          limit: 5,
        });

        const assistantMsg = msgs.data.find((m) => m.role === "assistant");
        if (assistantMsg) {
          for (const part of assistantMsg.content) {
            if (part.type === "text") {
              replyText += part.text.value;
            }
          }
        }
        break;
      }

      if (
        current.status === "failed" ||
        current.status === "cancelled" ||
        current.status === "expired"
      ) {
        return NextResponse.json(
          { reply: "L’assistant a échoué à générer une réponse." },
          { status: 200 }
        );
      }

      // petite attente avant de re-checker
      await new Promise((r) => setTimeout(r, 800));
    }

    // Sécurité : si rien récupéré, on renvoie quelque chose
    if (!replyText) {
      replyText =
        "Je n’ai pas pu récupérer la réponse. Réessaie ou envoie-nous un email à aziomeagency@gmail.com.";
    }

    return NextResponse.json({ reply: replyText });
  } catch (err: any) {
    console.error("API /api/chat error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Erreur serveur." },
      { status: 500 }
    );
  }
}
