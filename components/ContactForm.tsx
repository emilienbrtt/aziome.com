'use client';
import { useForm } from "react-hook-form";
import Button from "./Button";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { contactSchema, type ContactValues } from "@/lib/validations";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  // on garde RHF + Zod (validation côté client)
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<ContactValues>();

  const onSubmit = async (values: ContactValues) => {
    // anti-bot (honeypot)
    if (values.honey) return;

    // Validation Zod manuelle
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => {
        const field = i.path[0] as keyof ContactValues;
        // @ts-ignore
        setError(field, { message: i.message });
      });
      return;
    }

    // 🔁 ENVOI VERS VOTRE MAIL via FormSubmit (aucun backend nécessaire)
    try {
      const res = await fetch("https://formsubmit.co/ajax/aziomeagency@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          // options FormSubmit
          _subject: "Demande de démo — Aziome",
          _template: "table",
          _captcha: "false",
          // champs envoyés
          name: parsed.data.name,
          email: parsed.data.email,
          website: parsed.data.website, // ton champ "Site / Outil principal"
          message: parsed.data.message,
        }),
      });

      if (res.ok) {
        setSent(true);
        track?.("form_submit_success");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.message || "Erreur d’envoi. Réessayez ou écrivez-nous : aziomeagency@gmail.com");
      }
    } catch (e) {
      alert("Problème réseau. Réessayez ou écrivez-nous : aziomeagency@gmail.com");
    }
  };

  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Demander une démo</h2>

      {sent ? (
        <div className="glass p-6 rounded-2xl">
          Merci ! Votre demande a bien été envoyée. (Pensez à vérifier vos emails :
          nous revenons vers vous rapidement.)
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="glass p-6 rounded-2xl grid gap-4">
          <input
            placeholder="Nom"
            className="bg-transparent border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3"
            {...register("name")}
          />
          {errors.name && <p className="text-sm text-red-400">{String(errors.name.message)}</p>}

          <input
            placeholder="Email"
            type="email"
            className="bg-transparent border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3"
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-400">{String(errors.email.message)}</p>}

          <input
            placeholder="Site / Outil principal"
            className="bg-transparent border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3"
            {...register("website")}
          />

          <textarea
            placeholder="Votre message"
            rows={5}
            className="bg-transparent border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3"
            {...register("message")}
          />
          {errors.message && <p className="text-sm text-red-400">{String(errors.message.message)}</p>}

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-[color:var(--gold-1)]" {...register("consent")} />
            J’accepte la politique de confidentialité
          </label>
          {errors.consent && <p className="text-sm text-red-400">{String(errors.consent.message)}</p>}

          {/* Honeypot anti-bot */}
          <input type="text" className="hidden" aria-hidden {...register("honey")} />

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full">
              {isSubmitting ? "Envoi..." : "Envoyer ma demande"}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
