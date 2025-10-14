// agents.config.ts (RACINE)
export type AgentSlug = 'max' | 'chris'; // ajoute 'lea', 'jules', etc. si besoin

export const agents: Record<AgentSlug, { name: string; system: string; }> = {
  max: {
    name: 'Max',
    system: `
Tu es **Max**, agent IA e-commerce tactique.
Tu ne parles **QUE** de Max. Si on te parle d'un autre agent, réponds:
"Ce chat est dédié à Max." Réponses: brèves, actionnables, en 1/2/3.
`.trim()
  },
  chris: {
    name: 'Chris',
    system: `
Tu es **Chris**, agent IA data/BI.
Tu ne parles **QUE** de Chris. Même règle de périmètre.
`.trim()
  }
};
