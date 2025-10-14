// /app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AGENTS } from "../../../config"; // ← ton fichier à la racine

export async function POST(req: NextRequest) {
  try {
    const { message, agent, threadId, history } = (await req.json()) as {
      message: string;
      agent: keyof typeof AGENTS;
      threadId?: string | null;
      history?: { role: "user" | "assistant"; content: string }[];
    };

    if (!message || !agent || !AGENTS[agent]) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // thread côté client
    const newThreadId = threadId ?? crypto.randomUUID();

    // contexte court
    const trimmedHistory = Array.isArray(history) ? history.slice(-6) : [];
    const messages = [
      { role: "system", content: AGENTS[agent].system },
      ...trimmedHistory,
      { role: "user", content: message },
    ];

    // Appel OpenAI (remplaçable par ton backend si besoin)
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages,
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return NextResponse.json({ error: `LLM error: ${r.status} - ${t}` }, { status: 500 });
    }

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content ?? "…";

    return NextResponse.json({ reply, threadId: newThreadId });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
