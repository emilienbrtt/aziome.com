// /app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AGENTS } from "../../../config";

export async function POST(req: NextRequest) {
  try {
    const { message, agent, threadId, history, context } = (await req.json()) as {
      message: string;
      agent: keyof typeof AGENTS;
      threadId?: string | null;
      history?: { role: "user" | "assistant"; content: string }[];
      context?: string; // optionnel (facts côté page)
    };

    if (!message || !agent || !AGENTS[agent]) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const cfg = AGENTS[agent];
    const newThreadId = threadId ?? crypto.randomUUID();
    const trimmed = Array.isArray(history) ? history.slice(-8) : [];

    const sys = `${cfg.system}\n\nFaits spécifiques à ${cfg.name}:\n${cfg.profile}`;
    const messages = [
      { role: "system", content: sys },
      ...(context ? [{ role: "system", content: `Contexte de page:\n${context}` }] : []),
      ...trimmed,
      { role: "user", content: message },
    ];

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({ model: "gpt-4o-mini", temperature: 0.3, messages }),
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
