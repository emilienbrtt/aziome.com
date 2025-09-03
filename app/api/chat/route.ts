// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { openai } from "@/lib/openai";

// Si tu as besoin du runtime Node:
// export const runtime = "nodejs"; // (optionnel, selon ta config)

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json<{ message?: string }>();
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message vide." }, { status: 400 });
    }

    const assistantId = process.env.AZIOME_ASSISTANT_ID;
    if (!assistantId) {
      return NextResponse.json(
        { error: "AZIOME_ASSISTANT_ID manquant (Vercel -> Environment Variables)." },
        { status: 500 }
      );
    }

    // 1) Récupérer ou créer un "thread" par visiteur (via cookie HTTP-only)
    const jar = cookies();
    let threadId = jar.get("aziome_thread")?.value;

    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      // Cookie 30 jours, httpOnly
      jar.set("aziome_thread", threadId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    // 2) Ajouter le message de l’utilisateur au thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    // 3) Lancer le run et attendre la fin
    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
      // Si tu veux surcharger le modèle ici : model: "gpt-5" (sinon celui de l'assistant)
      // Si tes PDF sont attachés à l’assistant, rien à ajouter ici.
    });

    // 4) Gérer les états (tool_outputs, requires_action, etc.)
    if (run.status !== "completed") {
      // Erreur/transitoire : on renvoie un message “propre”
      return NextResponse.json(
        {
          reply:
            "Désolé, je n'arrive pas à répondre pour le moment. Réessaye dans un instant.",
          status: run.status,
        },
        { status: 200 }
      );
    }

    // 5) Récupérer le dernier message ASSISTANT du thread
    const list = await openai.beta.threads.messages.list(threadId, {
      order: "desc",
      limit: 10,
    });

    const assistantMsg = list.data.find(
      (m) => m.role === "assistant" && m.content && m.content.length > 0
    );

    // Plusieurs formats possibles → on prend le texte si présent, sinon on concatène brut
    let reply = "…";
    if (assistantMsg?.content) {
      const parts = assistantMsg.content
        .map((c: any) => {
          // Nouveau SDK: bloc "text" avec "value"
          if (c.type === "text" && c.text?.value) return c.text.value;
          // Ancien format: content[0].text?
          if (c.type === "output_text" && c.text) return c.text;
          // par sécurité
          return "";
        })
        .filter(Boolean);

      if (parts.length > 0) reply = parts.join("\n\n");
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err: any) {
    console.error("[/api/chat] ERR:", err?.message || err);
    // Message générique côté client
    return NextResponse.json(
      {
        reply:
          "Désolé, je n'arrive pas à répondre pour le moment. Réessaye dans un instant.",
        error: err?.message ?? "unknown_error",
      },
      { status: 200 }
    );
  }
}
