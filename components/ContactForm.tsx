'use client';
import { useForm } from "react-hook-form";
import Button from "./Button";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { contactSchema, type ContactValues } from "@/lib/validations";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  // ⚠️ plus de zodResolver ici
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<ContactValues>();

  const onSubmit = async (values: ContactValues) => {
    // Validation avec Zod, mais sans resolver
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => {
        const field = i.path[0] as keyof ContactValues;
        // @ts-ignore
        setError(field, { message: i.message });
      });
      return;
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(parsed.data)
    });
    const data = await res.json();
    if (data.ok) {
      setSent(true);
      track("form_submit_success");
    } else {
      alert(data.error || "Erreur");
    }
  };

  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Demander une démo</h2>
      {sent ? (
        <div className="glass p-6 rounded-2xl">
          Merci ! Votre demande a bien été envoyée. Nous revenons vers vous rapidement.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="glass p-6 rounded-2xl grid gap-4">
          <input placeholder="Nom" className="bg-transparent border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3" {...register("name")} />
          {errors.name && <p className="text-sm text-red-400">{errors.name.message as string}</p>}

          <input placeholder="Email" className="bg-transparent border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3" {...register("email")} />
          {errors.email && <p className="text-sm text-red-400">{errors.email.message as string}</p>}

          <input placeholder="Site / Outil principal" className="bg-transparent border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3" {...register("website")} />

          <textarea placeholder="Votre message" rows={5} className="bg-transparent border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3" {...register("message")} />
          {errors.message && <p className="text-sm text-red-400">{errors.message.message as string}</p>}

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-[color:var(--gold-1)]" {...register("consent")} />
            J’accepte la politique de confidentialité
          </label>
          {errors.consent && <p className="text-sm text-red-400">{errors.consent.message as string}</p>}

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
