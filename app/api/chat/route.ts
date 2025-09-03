// app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Récupère des messages quels que soient les formats envoyés par le front
function extractMessages(body: any): Msg[] {
  if (Array.isArray(body?.messages)) {
    const arr = body.messages
      .filter((m: any) => m && typeof m.content === "string" && m.content.trim())
      .map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content.trim(),
      }));
    if (arr.length) return arr;
  }

  const single =
    (typeof body?.message === "string" && body.message) ||
    (typeof body?.question === "string" && body.question) ||
    (typeof body?.input === "string" && body.input);

  if (typeof single === "string" && single.trim()) {
    return [{ role: "user", content: single.trim() }];
  }

  return [];
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages = extractMessages(body);

    if (!messages.length) {
      return NextResponse.json(
        { reply: "Je n’ai pas reçu la question (payload vide)." },
        { status: 200 }
      );
    }

    // On compacte l’historique côté front en un texte pour l’assistant
    const transcript = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const assistantId = process.env.AZIOME_ASSISTANT_ID;

    if (assistantId) {
      // -------- Assistants v2 : threads / runs --------
      // 1) Créer un thread
      const thread = await client.beta.threads.create();

      // 2) Ajouter le message utilisateur
      await client.beta.threads.messages.create(thread.id, {
        role: "user",
        content: transcript,
      });

      // 3) Lancer le run
      let run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      });

      // 4) Polling jusqu'à completion
      while (
        run.status === "queued" ||
        run.status === "in_progress" ||
        run.status === "requires_action"
      ) {
        await new Promise((r) => setTimeout(r, 800));
        run = await client.beta.threads.runs.retrieve(thread.id, run.id);
      }

      if (run.status === "completed") {
        const msgs = await client.beta.threads.messages.list(thread.id, { limit: 10 });

        // On prend la première réponse assistant
        const assistantMsg = msgs.data.find((m) => m.role === "assistant");
        const text =
          assistantMsg?.content
            ?.map((block: any) =>
              block.type === "text" ? block.text?.value ?? "" : ""
            )
            .join("\n")
            .trim() ?? "";

        return NextResponse.json({ reply: text || "…" }, { status: 200 });
      } else {
        // S’il y a une erreur de run, on retombe sur un fallback
        const detail = run.last_error?.message || `run status: ${run.status}`;
        console.error("Assistant run error:", detail);
      }
      // -------- fin Assistants v2 --------
    }

    // Fallback simple si pas d’assistant : Chat Completions
    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });
    const reply = r.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply }, { status: 200 });
  } catch (err: any) {
    const msg =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Erreur côté serveur.";
    console.error("/api/chat error:", msg);
    return NextResponse.json({ reply: `⚠️ ${msg}` }, { status: 200 });
  }
}
