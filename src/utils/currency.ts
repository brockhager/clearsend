export const parseCurrency = (value: string): number => {
  if (!value) return NaN;
  const sanitized = value.replace(/[$,]/g, '').trim();
  const n = Number(sanitized);
  return Number.isNaN(n) ? NaN : n;
};

export const formatCurrency = (value: number): string => {
  if (!isFinite(value)) return '';
  // Format with commas and 2 decimals
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
