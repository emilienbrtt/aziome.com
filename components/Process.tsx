'use client';
import { motion } from "framer-motion";

const steps = [
  {
    title: "Cadrage & branchement (≈45 min)",
    desc: "Nous définissons l’objectif et les règles, puis connectons l’essentiel : e-mail, calendrier, boutique ou autre."
  },
  {
    title: "Essais réels & réglages",
    desc: "Vous voyez l’agent sur des cas concrets ; nous ajustons immédiatement jusqu’à votre validation."
  },
  {
    title: "Mise en ligne & suivi",
    desc: "Activation progressive, transfert vers un humain à tout moment. Mises à jour continues et modifications possibles quand vous le souhaitez."
  }
];

export default function Process() {
  return (
    <section id="process" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Opérationnel en 5 jours.</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="text-sm text-muted mb-2">Étape {i + 1}</div>
            <h3 className="text-xl font-semibold">{s.title}</h3>
            <p className="text-muted mt-2">{s.desc}</p>
          </motion.div>
        ))}
      </div>
      <p className="text-sm text-muted mt-6">Aziome est pensé “Human-in-the-Loop” : vous gardez la main.</p>
    </section>
  );
}
