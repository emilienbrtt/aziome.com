// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { createOpenAI } from "@/lib/openai";

function getAssistantId() {
  return (
    process.env.AZIOME_ASSISTANT_ID ||
    (process.env as any)["Azia-ASSISTANT-ID"] // tolère ton ancien nom
  );
}

// Petit prompt système (très court) pour le mode fallback
const FALLBACK_SYSTEM = `
Tu es "Aziome", conseiller IA de l'agence Aziome.
Réponds en français, clair, concis (2–4 phrases), ton pro et humain.
Si la demande sort du périmètre (Aziome, agents IA, packs, ROI, onboarding, support), 
dis poliment que tu ne peux pas répondre et propose d’écrire à aziomeagency@gmail.com.
`;

// --- GET de diagnostic (pour vérifier la route/config)
export async function GET() {
  try {
    const assistantId = getAssistantId();
    const client = createOpenAI(); // lève si clé absente
    return NextResponse.json({
      ok: true,
      hasKey: true,
      hasAssistant: Boolean(assistantId),
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}

// --- POST principal: Assistant v2 ► sinon fallback modèle
export async function POST(req: Request) {
  const openai = createOpenAI();
  try {
    const { message } = await req.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message vide" }, { status: 400 });
    }

    // 1) On tente d'abord TON Assistant
    const assistantId = getAssistantId();
    if (assistantId) {
      try {
        // Thread
        const thread = await openai.beta.threads.create();

        // message user
        await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content: message,
        });

        // run
        let run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: assistantId,
        });

        // polling (25s max)
        const start = Date.now();
        while (["queued", "in_progress", "cancelling"].includes(run.status)) {
          if (Date.now() - start > 25000) {
            throw new Error("Timeout Assistant (25s).");
          }
          await new Promise((r) => setTimeout(r, 1000));
          run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        if (run.status === "completed") {
          const list = await openai.beta.threads.messages.list(thread.id, {
            limit: 10,
          });
          const assistantMsg = list.data.find((m) => m.role === "assistant");
          let text = "";
          if (assistantMsg?.content?.length) {
            for (const part of assistantMsg.content) {
              if (part.type === "text") text += part.text.value;
            }
          }
          if (text.trim()) {
            return NextResponse.json({ reply: text });
          }
          // pas de texte -> on bascule fallback
          throw new Error("Assistant: réponse vide");
        } else {
          // non complété -> on bascule fallback
          throw new Error(`Assistant status: ${run.status}`);
        }
      } catch (e) {
        // Assistant KO -> on passe en fallback
        // console.warn("Assistant KO, fallback modèle:", e);
      }
    }

    // 2) Fallback modèle (réponses “classiques”, comme avant mais cadrées)
    const completion = await openai.responses.create({
      model: "gpt-5-mini", // rapide/éco ; tu peux mettre "gpt-5"
      input: [
        { role: "system", content: FALLBACK_SYSTEM.trim() },
        { role: "user", content: message },
      ],
    });

    const output =
      completion.output_text ??
      completion.output?.[0]?.content?.[0]?.text ?? // selon versions
      "";

    if (!output.trim()) {
      throw new Error("Fallback: réponse vide");
    }
    return NextResponse.json({ reply: output });
  } catch (e: any) {
    // Dernier filet : retourne l'erreur au widget pour debug visuel
    return NextResponse.json(
      { error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
