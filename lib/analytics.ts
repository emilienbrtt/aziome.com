export const track = (name: string, data?: Record<string, any>) => {
  if (typeof window === "undefined") return;
  // Plausible compatible
  // @ts-ignore
  window.plausible && window.plausible(name, { props: data || {} });
};
