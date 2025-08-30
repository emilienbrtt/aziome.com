'use client';
import Link from "next/link";
import { cn } from "./cn";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
};

export default function Button({ children, href, onClick, variant = "primary", className, type }: Props) {
  const base = "inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-semibold transition relative";
  const variants = {
    primary: "text-black shadow-glow bg-[linear-gradient(92deg,var(--gold-1),var(--gold-2))] hover:brightness-110",
    secondary: "border border-[color:var(--gold-1)] text-[color:var(--gold-1)] hover:glass",
    ghost: "text-fg hover:opacity-80"
  } as const;
  const Comp: any = href ? Link : "button";
  return (
    <Comp href={href as any} onClick={onClick} className={cn(base, variants[variant], className)} type={type}>
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <span className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", maskImage: "radial-gradient(50% 50% at 50% 50%, black 30%, transparent 60%)" }}
        />
      )}
    </Comp>
  );
}
