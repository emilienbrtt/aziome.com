"use client";

import Orb from "./Orb";
import Button from "./Button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
      <Orb />
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1]"
        >
          <span className="gold-text">Automatisez vos tâches avec l'IA.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.6 } }}
          className="mt-6 text-lg text-muted"
        >
          Aziome déploie des agents qui automatisent certaines tâches de votre business. Ils sont disponibles 24h/24h, 7/7j et sans interruption.
        </motion.p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* CTA principal */}
          <Button href="#contact" variant="primary" className="sm:min-w-[280px]">
            Demander une démo
          </Button>

          {/* CTA secondaire : même largeur + scroll vers #solutions */}
          <Button
            variant="secondary"
            className="sm:min-w-[280px]"
            onClick={() =>
              document
                .getElementById("solutions")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            Découvrir nos agents IA
          </Button>
        </div>

        <div className="mt-12 text-sm text-muted flex items-center justify-center gap-6 opacity-80">
          <span>Compatible avec vos outils</span>
          <span className="h-1 w-1 rounded-full bg-muted inline-block" />
          <span>Shopify · Gmail · Notion · WhatsApp</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted text-xs">▼</div>
    </section>
  );
}
