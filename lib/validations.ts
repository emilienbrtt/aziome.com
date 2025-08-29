import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  website: z.string().optional(),
  message: z.string().min(10, "Message trop court"),
  consent: z.boolean().refine(v => v === true, "Consentement requis"),
  honey: z.string().max(0).optional()
});

export type ContactValues = z.infer<typeof contactSchema>;
