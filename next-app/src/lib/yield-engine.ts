import { RentCastListing, InvestorProfile, YieldResult, EnrichedListing } from './types';

const STATE_TAX_RATES: Record<string, number> = {
  TX: 0.018,
  NC: 0.0085,
  OH: 0.016,
  IN: 0.0085,
  TN: 0.007,
  MO: 0.010,
  AZ: 0.006,
  GA: 0.009,
  PA: 0.015,
  AL: 0.004,
  FL: 0.009,
  MI: 0.015,
  WI: 0.017,
};

export function calcMortgagePayment(principal: number, annualRate: number, termYears: number): number {
  if (principal <= 0 || annualRate <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calcYield(listing: RentCastListing, profile: InvestorProfile): YieldResult {
  const { price, state, estimatedRent = 0 } = listing;
  const { downPct, mortRate, term, mgmtPct } = profile;

  const taxRate = STATE_TAX_RATES[state?.toUpperCase()] ?? 0.012;

  const principal = price * (1 - downPct / 100);
  const monthlyMortgage = calcMortgagePayment(principal, mortRate, term);
  const monthlyPropTax = (price * taxRate) / 12;
  const monthlyInsurance = (price * 0.005) / 12;
  const monthlyHOA = 0;
  const monthlyMgmt = estimatedRent * mgmtPct / 100;

  const netOperatingRent = estimatedRent - monthlyPropTax - monthlyInsurance - monthlyHOA - monthlyMgmt;
  const monthlyCashFlow = netOperatingRent - monthlyMortgage;

  const annualNOI = (estimatedRent * 12) - ((monthlyPropTax + monthlyInsurance + monthlyHOA + monthlyMgmt) * 12);
  const noi = annualNOI;
  const capRate = price > 0 ? (annualNOI / price) * 100 : 0;
  const grossYield = price > 0 ? (estimatedRent * 12 / price) * 100 : 0;

  const equity = price * downPct / 100 + price * 0.035;
  const totalInvested = equity;
  const cashOnCash = equity > 0 ? (monthlyCashFlow * 12 / equity) * 100 : 0;

  const leverageSpread = capRate - mortRate;
  const leverageSignal: YieldResult['leverageSignal'] =
    leverageSpread > 0 ? 'positive' : leverageSpread > -1 ? 'marginal' : 'negative';

  const monthlyDeficit = Math.max(0, -monthlyCashFlow);

  let yearsToBreakeven: number | null = null;
  let totalOutOfPocket = 0;

  if (monthlyCashFlow < 0) {
    let rent = estimatedRent;
    let months = 0;
    for (let year = 1; year <= 30; year++) {
      rent *= 1.03;
      const mgmt = rent * mgmtPct / 100;
      const netRent = rent - monthlyPropTax - monthlyInsurance - monthlyHOA - mgmt;
      const cf = netRent - monthlyMortgage;
      months += 12;
      if (cf >= 0) {
        yearsToBreakeven = year;
        break;
      }
    }
    totalOutOfPocket = yearsToBreakeven !== null ? monthlyDeficit * (yearsToBreakeven * 12) : monthlyDeficit * 360;
  }

  const netYield = price > 0 ? (monthlyCashFlow * 12 / price) * 100 : 0;

  return {
    monthlyRent: estimatedRent,
    monthlyMortgage,
    monthlyPropTax,
    monthlyInsurance,
    monthlyHOA,
    monthlyMgmt,
    monthlyCashFlow,
    grossYield,
    netYield,
    capRate,
    cashOnCash,
    leverageSpread,
    leverageSignal,
    monthlyDeficit,
    yearsToBreakeven,
    totalOutOfPocket,
    noi,
    equity,
    totalInvested,
  };
}

export function qualifiesForInvestment(listing: RentCastListing, profile: InvestorProfile): boolean {
  const { price, state, estimatedRent = 0 } = listing;
  if (!estimatedRent || estimatedRent <= 0 || !price || price <= 0) return false;

  const taxRate = STATE_TAX_RATES[state?.toUpperCase()] ?? 0.012;
  const monthlyPropTax = (price * taxRate) / 12;
  const monthlyInsurance = (price * 0.005) / 12;
  const monthlyMgmt = estimatedRent * profile.mgmtPct / 100;
  const netRent = estimatedRent - monthlyPropTax - monthlyInsurance - monthlyMgmt;

  const principal = price * (1 - profile.downPct / 100);
  const mortgage = calcMortgagePayment(principal, profile.mortRate, profile.term);

  return netRent >= mortgage;
}

export function getYieldColor(netYield: number): string {
  if (netYield >= 6) return '#22C55E';
  if (netYield >= 4) return '#84CC16';
  if (netYield >= 2) return '#F59E0B';
  return '#EF4444';
}

export function getYieldLabel(netYield: number): string {
  if (netYield >= 6) return 'Hot';
  if (netYield >= 4) return 'Strong';
  if (netYield >= 2) return 'Moderate';
  return 'Marginal';
}

export function enrichListing(listing: RentCastListing, profile: InvestorProfile): EnrichedListing {
  const yieldResult = calcYield(listing, profile);
  const qualifies = qualifiesForInvestment(listing, profile);
  return {
    ...listing,
    yield: yieldResult,
    qualifies,
    yieldColor: getYieldColor(yieldResult.netYield),
    yieldLabel: getYieldLabel(yieldResult.netYield),
  };
}
