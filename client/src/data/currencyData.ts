// Currency data for different countries
export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate to USD (base currency)
}

export const currencies: Record<string, Currency> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1.0
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rate: 0.85
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rate: 0.73
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    rate: 1.25
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    rate: 0.88
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    rate: 110.0
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    rate: 1.35
  }
};

// Map countries to their default currencies
export const countryCurrencies: Record<string, string> = {
  'Germany': 'EUR',
  'France': 'EUR',
  'Italy': 'EUR',
  'Spain': 'EUR',
  'Netherlands': 'EUR',
  'Austria': 'EUR',
  'Belgium': 'EUR',
  'United States': 'USD',
  'Canada': 'CAD',
  'United Kingdom': 'GBP',
  'Switzerland': 'CHF',
  'Japan': 'JPY',
  'Australia': 'AUD'
};

export const getCurrencyForCountry = (country: string): string => {
  return countryCurrencies[country] || 'USD';
};

export const formatPrice = (price: number, currencyCode: string): string => {
  const currency = currencies[currencyCode];
  if (!currency) return `$${price.toFixed(2)}`;
  
  const convertedPrice = price * currency.rate;
  return `${currency.symbol}${convertedPrice.toFixed(2)}`;
};

export const getAllCurrencies = (): Currency[] => {
  return Object.values(currencies);
};