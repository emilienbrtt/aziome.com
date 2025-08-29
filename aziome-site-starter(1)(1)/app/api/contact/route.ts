import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = contactSchema.parse(data);
    // TODO: wire to your email provider (Resend/Nodemailer). For now we just log.
    console.log("[CONTACT] New request:", parsed);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const message = err?.issues?.[0]?.message || "Erreur inattendue";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
