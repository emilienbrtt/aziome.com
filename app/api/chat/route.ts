// app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // On accepte soit { message }, soit l'ancien { messages: [...] } (on prend le dernier)
    const message: string =
      body?.message ??
      (Array.isArray(body?.messages)
        ? String(body.messages.at(-1)?.content ?? "")
        : "");

    const incomingThreadId: string | undefined = body?.threadId;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "EMPTY" }, { status: 400 });
    }

    const assistantId = process.env.AZIOME_ASSISTANT_ID;
    if (!assistantId) {
      return NextResponse.json(
        { error: "AZIOME_ASSISTANT_ID missing" },
        { status: 500 }
      );
    }

    // 1) Thread : on réutilise celui fourni par le front, sinon on en crée un
    const threadId =
      incomingThreadId ??
      (await client.beta.threads.create({})).id;

    // 2) On ajoute le message utilisateur dans le thread
    await client.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    // 3) On lance le run et on attend la fin
    const run = await client.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
      // Si tu veux passer un "override" d'instructions ponctuel :
      // instructions: "..." 
    });

    if (run.status !== "completed") {
      // Cas d'erreurs ou d'actions requises (tools). On simplifie :
      return NextResponse.json(
        { error: `RUN_${run.status}`, threadId },
        { status: 500 }
      );
    }

    // 4) On lit le dernier message de l’assistant
    const messages = await client.beta.threads.messages.list(threadId, {
      order: "desc",
      limit: 1,
    });

    let reply = "";
    const first = messages.data?.[0];
    const content = first?.content?.[0];

    if (content?.type === "text") {
      reply = content.text?.value ?? "";
    } else {
      // Sécurité : si pas de text, on concatène tout ce qui est textuel
      reply =
        (first?.content || [])
          .filter((c: any) => c.type === "text")
          .map((c: any) => c.text?.value ?? "")
          .join("\n") ?? "";
    }

    return NextResponse.json({ reply, threadId });
  } catch (err: any) {
    console.error("API /api/chat (assistants) error:", err?.message || err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
