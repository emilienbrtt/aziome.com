// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, threadId } = await req.json();

    if (!process.env.OPENAI_API_KEY || !process.env.AZIOME_ASSISTANT_ID) {
      return NextResponse.json(
        { reply: "Configuration serveur incomplète." },
        { status: 500 }
      );
    }

    // On prend juste le dernier message utilisateur
    const last = messages?.[messages.length - 1];
    const userText = typeof last?.content === "string" ? last.content : "";

    // 1) Créer ou réutiliser un thread
    let tid = (threadId as string) || null;
    if (!tid) {
      const t = await client.beta.threads.create();
      tid = t.id;
    }

    // 2) Ajouter le message utilisateur dans le thread
    await client.beta.threads.messages.create(tid!, {
      role: "user",
      content: userText,
    });

    // 3) Lancer le run de ton assistant
    const run = await client.beta.threads.runs.create(tid!, {
      assistant_id: process.env.AZIOME_ASSISTANT_ID!,
    });

    // 4) Attendre la fin du run (petit polling)
    let status = run.status;
    while (
      status !== "completed" &&
      status !== "requires_action" &&
      status !== "failed" &&
      status !== "cancelled" &&
      status !== "expired"
    ) {
      await new Promise((r) => setTimeout(r, 800));
      const r2 = await client.beta.threads.runs.retrieve(tid!, run.id);
      status = r2.status;
    }

    if (status !== "completed") {
      return NextResponse.json(
        {
          reply:
            "Désolé, je n’arrive pas à répondre pour le moment. Réessaie dans un instant.",
          threadId: tid,
        },
        { status: 200 }
      );
    }

    // 5) Récupérer le dernier message assistant de ce run
    const list = await client.beta.threads.messages.list(tid!, { limit: 20 });
    const fromThisRun =
      list.data.find((m) => m.role === "assistant" && m.run_id === run.id) ??
      list.data.find((m) => m.role === "assistant");

    let reply = "";
    if (fromThisRun) {
      reply = fromThisRun.content
        .map((c: any) => (c.type === "text" ? c.text.value : ""))
        .join("\n")
        .trim();
    }

    return NextResponse.json({ reply, threadId: tid });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        reply:
          "Désolé, je n’arrive pas à répondre pour le moment. Réessaie dans un instant.",
      },
      { status: 200 }
    );
  }
}
