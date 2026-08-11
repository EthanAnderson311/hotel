import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    rate: 1.0,
    format: (amount: number) => `$${Math.round(amount).toLocaleString()}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rate: 0.92,
    format: (amount: number) => `€${Math.round(amount * 0.92).toLocaleString()}`,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rate: 0.79,
    format: (amount: number) => `£${Math.round(amount * 0.79).toLocaleString()}`,
  },
  KHR: {
    code: 'KHR',
    symbol: '៛',
    rate: 4100,
    format: (amount: number) => `៛${Math.round(amount * 4100).toLocaleString()}`,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    rate: 155,
    format: (amount: number) => `¥${Math.round(amount * 155).toLocaleString()}`,
  },
};

export function formatPrice(amountInUSD: number, currencyCode: CurrencyCode = 'USD'): string {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  return currency.format(amountInUSD);
}
