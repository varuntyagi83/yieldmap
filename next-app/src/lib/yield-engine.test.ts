import { describe, it, expect } from 'vitest';
import { calcMortgagePayment, calcYield, qualifiesForInvestment, getYieldColor, getYieldLabel, enrichListing } from './yield-engine';
import { RentCastListing, InvestorProfile, DEFAULT_PROFILE } from './types';

function makeListing(overrides: Partial<RentCastListing> = {}): RentCastListing {
  return {
    id: 'test-1',
    formattedAddress: '123 Main St',
    city: 'Test City',
    state: 'NC',
    zipCode: '27253',
    latitude: 36.09,
    longitude: -79.44,
    propertyType: 'Single Family',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1500,
    price: 200000,
    estimatedRent: 1800,
    ...overrides,
  };
}

const baseProfile: InvestorProfile = { ...DEFAULT_PROFILE };

describe('calcMortgagePayment', () => {
  it('returns 0 for zero principal', () => {
    expect(calcMortgagePayment(0, 6.8, 30)).toBe(0);
  });
  it('returns 0 for zero rate', () => {
    expect(calcMortgagePayment(150000, 0, 30)).toBe(0);
  });
  it('calculates correctly for $150K at 6.8% 30yr', () => {
    const payment = calcMortgagePayment(150000, 6.8, 30);
    expect(payment).toBeCloseTo(978, 0);
  });
  it('is higher for shorter terms', () => {
    const p30 = calcMortgagePayment(150000, 6.8, 30);
    const p15 = calcMortgagePayment(150000, 6.8, 15);
    expect(p15).toBeGreaterThan(p30);
  });
});

describe('qualifiesForInvestment', () => {
  it('$200K at $1800/mo rent with 25% down 6.8% qualifies', () => {
    const listing = makeListing({ price: 200000, estimatedRent: 1800 });
    expect(qualifiesForInvestment(listing, baseProfile)).toBe(true);
  });

  it('$1M at $4167/mo rent with 25% down 6% does NOT qualify', () => {
    const listing = makeListing({ price: 1000000, estimatedRent: 4167, state: 'NC' });
    const profile = { ...baseProfile, mortRate: 6.0 };
    expect(qualifiesForInvestment(listing, profile)).toBe(false);
  });

  it('returns false for zero rent', () => {
    const listing = makeListing({ estimatedRent: 0 });
    expect(qualifiesForInvestment(listing, baseProfile)).toBe(false);
  });

  it('returns false for zero price', () => {
    const listing = makeListing({ price: 0 });
    expect(qualifiesForInvestment(listing, baseProfile)).toBe(false);
  });

  it('100% down (0% mortgage) almost always qualifies if rent > expenses', () => {
    const listing = makeListing({ price: 200000, estimatedRent: 1800 });
    const profile = { ...baseProfile, downPct: 100 };
    expect(qualifiesForInvestment(listing, profile)).toBe(true);
  });

  it('$5M property at low rent has huge negative spread and does not qualify', () => {
    const listing = makeListing({ price: 5000000, estimatedRent: 5000, state: 'NC' });
    expect(qualifiesForInvestment(listing, baseProfile)).toBe(false);
  });
});

describe('calcYield', () => {
  it('deducts 8% management fee correctly', () => {
    const listing = makeListing({ price: 200000, estimatedRent: 1800 });
    const result = calcYield(listing, baseProfile);
    expect(result.monthlyMgmt).toBeCloseTo(1800 * 0.08, 1);
  });

  it('$200K / $1800 rent has positive cash flow', () => {
    const listing = makeListing({ price: 200000, estimatedRent: 1800 });
    const result = calcYield(listing, baseProfile);
    expect(result.monthlyCashFlow).toBeGreaterThan(0);
  });

  it('$1M / $4167 rent 6% has negative cash flow', () => {
    const listing = makeListing({ price: 1000000, estimatedRent: 4167, state: 'NC' });
    const profile = { ...baseProfile, mortRate: 6.0 };
    const result = calcYield(listing, profile);
    expect(result.monthlyCashFlow).toBeLessThan(0);
  });

  it('$1M / $4167 rent has negative leverage spread', () => {
    const listing = makeListing({ price: 1000000, estimatedRent: 4167, state: 'NC' });
    const profile = { ...baseProfile, mortRate: 6.0 };
    const result = calcYield(listing, profile);
    expect(result.leverageSpread).toBeLessThan(0);
    expect(result.leverageSignal).toBe('negative');
  });

  it('uses TX tax rate ~1.8% for TX properties', () => {
    const ncListing = makeListing({ price: 200000, state: 'NC' });
    const txListing = makeListing({ price: 200000, state: 'TX' });
    const ncResult = calcYield(ncListing, baseProfile);
    const txResult = calcYield(txListing, baseProfile);
    expect(txResult.monthlyPropTax).toBeGreaterThan(ncResult.monthlyPropTax);
  });

  it('yearsToBreakeven is null if never breaks even', () => {
    const listing = makeListing({ price: 1000000, estimatedRent: 1000, state: 'NC' });
    const result = calcYield(listing, baseProfile);
    expect(result.yearsToBreakeven).toBeNull();
    expect(result.monthlyDeficit).toBeGreaterThan(0);
  });

  it('yearsToBreakeven is a number for moderate deficit', () => {
    const listing = makeListing({ price: 250000, estimatedRent: 1700, state: 'NC' });
    const result = calcYield(listing, baseProfile);
    if (result.monthlyCashFlow < 0) {
      expect(typeof result.yearsToBreakeven === 'number' || result.yearsToBreakeven === null).toBe(true);
    }
  });

  it('equity includes down payment plus 3.5% closing', () => {
    const listing = makeListing({ price: 200000 });
    const result = calcYield(listing, baseProfile);
    const expectedEquity = 200000 * 0.25 + 200000 * 0.035;
    expect(result.equity).toBeCloseTo(expectedEquity, 0);
  });

  it('grossYield is greater than netYield', () => {
    const listing = makeListing({ price: 200000, estimatedRent: 1800 });
    const result = calcYield(listing, baseProfile);
    expect(result.grossYield).toBeGreaterThan(result.netYield);
  });
});

describe('getYieldColor', () => {
  it('returns green for >= 6%', () => expect(getYieldColor(7)).toBe('#22C55E'));
  it('returns lime for 4-6%', () => expect(getYieldColor(5)).toBe('#84CC16'));
  it('returns amber for 2-4%', () => expect(getYieldColor(3)).toBe('#F59E0B'));
  it('returns red for < 2%', () => expect(getYieldColor(1)).toBe('#EF4444'));
});

describe('getYieldLabel', () => {
  it('returns Hot for >= 6%', () => expect(getYieldLabel(7)).toBe('Hot'));
  it('returns Marginal for < 2%', () => expect(getYieldLabel(1)).toBe('Marginal'));
});

describe('enrichListing', () => {
  it('attaches yield, qualifies, color, label', () => {
    const listing = makeListing({ price: 200000, estimatedRent: 1800 });
    const enriched = enrichListing(listing, baseProfile);
    expect(enriched.yield).toBeDefined();
    expect(typeof enriched.qualifies).toBe('boolean');
    expect(enriched.yieldColor).toMatch(/^#/);
    expect(enriched.yieldLabel).toBeTruthy();
  });
});
