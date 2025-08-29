import { cn } from "./cn";
export default function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("glass rounded-2xl p-6 transition-transform hover:-translate-y-0.5", className)}>
      {children}
    </div>
  );
}
