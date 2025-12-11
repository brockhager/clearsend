export const validateRecipientId = (id: string): string | null => {
  if (!id || id.trim().length === 0) return 'Recipient ID is required';
  if (id.trim().length < 3) return 'Recipient ID must be at least 3 characters';
  // Additional rules can be added here
  return null;
};

export const validateAmount = (val: string): string | null => {
  if (val === undefined || val === null || val.trim().length === 0) return 'Amount is required';
  // Remove commas, currency signs, etc
  const sanitized = val.replace(/[$,]/g, '').trim();
  const amount = Number(sanitized);
  if (Number.isNaN(amount)) return 'Amount must be a number';
  if (!isFinite(amount)) return 'Amount must be finite';
  if (amount <= 0) return 'Amount must be greater than 0';
  if (amount < 0.01) return 'Amount must be at least 0.01';
  // Optionally limit precision
  return null;
};
