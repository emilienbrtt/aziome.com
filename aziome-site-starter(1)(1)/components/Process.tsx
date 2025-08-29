import { motion } from "framer-motion";

const steps = [
  { title: "Onboarding clair", desc: "FAQ métier, accès outils, périmètre & règles." },
  { title: "Déploiement", desc: "Templates d’agents ajustés à vos cas d’usage." },
  { title: "Pilotage & amélioration", desc: "Suivi, logs, ajustements, reporting." }
];

export default function Process() {
  return (
    <section id="process" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Simple. Sur vos outils. Sous contrôle.</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="text-sm text-muted mb-2">Étape {i+1}</div>
            <h3 className="text-xl font-semibold">{s.title}</h3>
            <p className="text-muted mt-2">{s.desc}</p>
          </motion.div>
        ))}
      </div>
      <p className="text-sm text-muted mt-6">Aziome est pensé “Human‑in‑the‑Loop” : vous gardez la main.</p>
    </section>
  );
}
