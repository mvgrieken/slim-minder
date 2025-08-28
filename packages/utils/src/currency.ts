export function formatCurrency(amount: number, currency: string = 'EUR', locale: string = 'nl-NL') {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    // Minimal fallback
    return `${currency} ${amount.toFixed(2)}`;
  }
}

