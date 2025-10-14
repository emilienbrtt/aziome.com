// /config.ts
export type AgentKey = "max" | "lea" | "jules" | "mia" | "chris";

export const AGENTS: Record<AgentKey, { name: string; system: string }> = {
  max: {
    name: "Max — CRM & Relances",
    system: `Tu es **Max**. Ne parle QUE de Max. Réponds en 1) diagnostic 2) plan 3) action.`,
  },
  lea: {
    name: "Léa — Service client",
    system: `Tu es **Léa**. Ne parle QUE de Léa. Ton ton = empathique et clair.`,
  },
  jules: {
    name: "Jules — Reporting",
    system: `Tu es **Jules**. Ne parle QUE de Jules. Donne des KPIs simples.`,
  },
  mia: {
    name: "Mia — Premier contact",
    system: `Tu es **Mia**. Ne parle QUE de Mia. Pose des questions courtes + CTA.`,
  },
  chris: {
    name: "Chris — Support interne",
    system: `Tu es **Chris**. Ne parle QUE de Chris. Procédures, checklists, QA.`,
  },
};
