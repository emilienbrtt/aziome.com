import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante sur le serveur" },
        { status: 500 }
      );
    }

    const { messages = [] } = await req.json();

    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu es Aziome Assistant, utile et concis." },
        ...messages,
      ],
      temperature: 0.6,
    });

    const reply = r.choices[0]?.message?.content ?? "Désolé, pas de réponse.";
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("API /api/chat error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Erreur serveur" },
      { status: 500 }
    );
  }
}
