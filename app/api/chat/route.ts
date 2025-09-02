import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const assistantId =
      process.env.AZIOME_ASSISTANT_ID ??
      process.env.AZIA_ASSISTANT_ID ??             // ancien nom sans tiret
      process.env["Azia-ASSISTANT-ID"];            // ancien nom avec tiret

    if (!assistantId) {
      return NextResponse.json(
        { error: "AZIOME_ASSISTANT_ID introuvable" },
        { status: 500 }
      );
    }

    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message ?? "",
    });

    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    while (!["completed", "failed", "expired", "cancelled"].includes(run.status)) {
      await new Promise((r) => setTimeout(r, 800));
      run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    if (run.status !== "completed") {
      return NextResponse.json({ error: `Run status: ${run.status}` }, { status: 500 });
    }

    const list = await openai.beta.threads.messages.list(thread.id, { order: "desc", limit: 1 });
    const answer =
      list.data?.[0]?.content?.[0]?.type === "text"
        ? list.data[0].content[0].text.value
        : "Je n’ai pas pu formuler de réponse pour le moment.";

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("/api/chat error:", err?.message || err);
    return NextResponse.json({ error: "server_error", detail: err?.message || "unknown" }, { status: 500 });
  }
}
