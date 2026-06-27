/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CurrencyType = 'BDT';

export const BDT_CONVERSION_RATE = 115; // 1 USD = 115 BDT

/**
 * Format price based on active currency
 */
export function formatPrice(priceUSD: number, currency?: CurrencyType): string {
  const bdtPrice = priceUSD * BDT_CONVERSION_RATE;
  return `৳${Math.round(bdtPrice).toLocaleString('en-US')}`;
}

/**
 * Convert USD price to BDT price
 */
export function convertToBDT(priceUSD: number): number {
  return priceUSD * BDT_CONVERSION_RATE;
}

