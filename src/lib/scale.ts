export const radiusFromSpend = (spend: number): number => {
  const safe = Math.max(spend, 1);
  const r = Math.sqrt(safe);
  return Math.max(4, Math.min(28, r / 2));
};


