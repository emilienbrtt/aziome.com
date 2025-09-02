// app/api/chat/route.ts
import { NextResponse } from "next/server";
// si l'alias "@/lib/..." marche, garde cette ligne
import { openai } from "@/lib/openai";
// si ça ne compile pas, commente la ligne au-dessus et décommente celle-ci :
// import { openai } from "../../../lib/openai";

export const runtime = "nodejs"; // important pour éviter Edge/Fetch dans OpenAI

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Le champ 'messages' doit être un tableau." },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Tu es **Aziome Assistant**, conseiller IA d’Aziome. Tu réponds en français, avec des réponses claires, brèves et utiles.",
        },
        ...messages,
      ],
      temperature: 0.3,
    });

    const reply = completion.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
