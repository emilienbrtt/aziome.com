// /app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, threadId } = (await req.json()) as {
      message?: string;
      threadId?: string | null;
    };

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message vide." },
        { status: 400 }
      );
    }

    const assistantId = process.env.AZIOME_ASSISTANT_ID;
    if (!assistantId) {
      return NextResponse.json(
        { error: "AZIOME_ASSISTANT_ID manquant" },
        { status: 500 }
      );
    }

    // 1) Thread: réutilise si fourni, sinon crée
    const thread =
      threadId
        ? { id: threadId }
        : await openai.beta.threads.create();

    // 2) Ajoute le message user au thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message.trim(),
    });

    // 3) Lance le run de l’assistant et attend la fin
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistantId,
    });

    if (run.status !== "completed") {
      // (queued, in_progress, cancelled, failed, etc.)
      return NextResponse.json(
        {
          reply:
            "Désolé, je n’arrive pas à répondre pour le moment. Réessaie dans un instant.",
          threadId: thread.id,
          status: run.status,
        },
        { status: 200 }
      );
    }

    // 4) Récupère le dernier message assistant
    const list = await openai.beta.threads.messages.list(thread.id, {
      order: "desc",
      limit: 5,
    });

    const firstAssistantMsg = list.data.find(m => m.role === "assistant");
    let reply = "";

    if (firstAssistantMsg?.content?.length) {
      const c0 = firstAssistantMsg.content[0];
      // Selon le SDK, la réponse peut être "text" ou "output_text"
      if ((c0 as any).type === "text") {
        reply = (c0 as any).text?.value ?? "";
      } else if ((c0 as any).type === "output_text") {
        reply = (c0 as any).output_text ?? "";
      }
    }

    return NextResponse.json({ reply, threadId: thread.id });
  } catch (e: any) {
    console.error("API /api/chat error:", e);
    return NextResponse.json(
      {
        error: e?.message ?? "Erreur serveur",
        reply:
          "Désolé, je n’arrive pas à répondre pour le moment. Réessaie dans un instant.",
      },
      { status: 200 }
    );
  }
}
