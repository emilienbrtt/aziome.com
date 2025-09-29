'use client';
import { motion } from "framer-motion";

const steps = [
  {
    title: "Onboarding (≈45 min)",
    bullets: [
      "Définir l’objectif, les règles et les réponses clés, ensemble.",
      "Connecter l’essentiel : e-mail, calendrier, boutique ou autre."
    ]
  },
  {
    title: "Essais & réglages",
    bullets: [
      "L’agent traite vos cas concrets en direct.",
      "Ajustements immédiats jusqu’à validation."
    ]
  },
  {
    title: "Mise en ligne & suivi",
    bullets: [
      "Activation progressive, transfert vers humain à tout moment.",
      "Mises à jour continues et modifications sur demande."
    ]
  }
];

export default function Process() {
  return (
    <section id="process" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">
        Mise en service de votre agent IA en 3 étapes
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            // wrapper pour l'effet
            className="group relative"
          >
            {/* Carte + ombrage doré fort au hover */}
            <div
              className="
                relative glass rounded-2xl p-6
                transition-[transform,box-shadow] duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_0_90px_rgba(212,175,55,0.35)]
                overflow-hidden
              "
            >
              {/* Halo doré animé (ne gêne pas les clics) */}
              <span
                aria-hidden="true"
                className="
                  pointer-events-none absolute -inset-1
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-500
                  bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(212,175,55,0.28),transparent_70%)]
                  blur-2xl
                "
              />
              {/* Bordure douce qui s'illumine */}
              <span
                aria-hidden="true"
                className="
                  pointer-events-none absolute inset-0 rounded-2xl
                  ring-0 group-hover:ring-2 ring-[rgba(212,175,55,0.28)]
                  transition-all duration-300
                "
              />

              <div className="relative">
                <div className="text-sm text-muted mb-2">Étape {i + 1}</div>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <ul className="text-muted mt-2 list-disc pl-5 space-y-1">
                  {s.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-muted mt-6">
        Aziome est pensé “Human-in-the-Loop” : vous gardez la main.
      </p>
    </section>
  );
}
