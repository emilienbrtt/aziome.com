"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Orb() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0,1], [0, 60]);
  return (
    <motion.div
      aria-hidden
      style={{ y }}
      className="pointer-events-none absolute -top-24 right-[-120px] w-[420px] h-[420px] rounded-full blur-3xl opacity-70"
    >
      <div className="w-full h-full rounded-full" style={{
        background: "radial-gradient(circle at 30% 30%, rgba(246,231,178,0.8), rgba(212,175,55,0.2) 40%, transparent 60%)",
        boxShadow: "0 0 120px rgba(212,175,55,0.22)"
      }} />
    </motion.div>
  );
}
