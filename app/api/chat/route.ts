// app/api/chat/route.ts
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ reply: "Message vide." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // 1) Client + vars d'environnement
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const assistantId = process.env.AZIOME_ASSISTANT_ID;
    if (!assistantId) throw new Error("AZIOME_ASSISTANT_ID manquant");

    // 2) Thread + message utilisateur
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    // 3) Run l'assistant (avec tes fichiers/knowledge)
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    // 4) Poll jusqu'à completion
    let runStatus = run;
    const started = Date.now();
    while (runStatus.status !== "completed") {
      if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
        throw new Error(`Run ${runStatus.status}`);
      }
      // timeout simple 45s
      if (Date.now() - started > 45_000) {
        throw new Error("Timeout");
      }
      await new Promise((r) => setTimeout(r, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // 5) Récupérer la dernière réponse
    const msgs = await openai.beta.threads.messages.list(thread.id, { limit: 1 });
    const last = msgs.data[0];
    let reply = "";

    const firstPart = last?.content?.[0];
    if (firstPart?.type === "text") {
      reply = firstPart.text?.value ?? "";
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    // On renvoie quand même 200 avec un texte de secours
    return new Response(
      JSON.stringify({
        reply:
          "Désolé, je n’arrive pas à répondre pour le moment. Réessaie dans un instant.",
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  }
}
