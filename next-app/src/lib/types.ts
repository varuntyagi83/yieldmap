export interface InvestorProfile {
  taxRate: number;
  downPct: number;
  mortRate: number;
  term: number;
  mgmtPct: number;
}

export const DEFAULT_PROFILE: InvestorProfile = {
  taxRate: 32,
  downPct: 25,
  mortRate: 6.8,
  term: 30,
  mgmtPct: 8,
};

export interface RentCastListing {
  id: string;
  formattedAddress: string;
  addressLine1?: string;
  city: string;
  state: string;
  zipCode: string;
  county?: string;
  latitude: number;
  longitude: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  lotSize?: number;
  yearBuilt?: number;
  price: number;
  daysOnMarket?: number;
  status?: string;
  estimatedRent?: number;
  estimatedRentLow?: number;
  estimatedRentHigh?: number;
}

export interface YieldResult {
  monthlyRent: number;
  monthlyMortgage: number;
  monthlyPropTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  monthlyMgmt: number;
  monthlyCashFlow: number;
  grossYield: number;
  netYield: number;
  capRate: number;
  cashOnCash: number;
  leverageSpread: number;
  leverageSignal: 'positive' | 'marginal' | 'negative';
  monthlyDeficit: number;
  yearsToBreakeven: number | null;
  totalOutOfPocket: number;
  noi: number;
  equity: number;
  totalInvested: number;
}

export interface EnrichedListing extends RentCastListing {
  yield: YieldResult;
  qualifies: boolean;
  yieldColor: string;
  yieldLabel: string;
  maxOfferPrice: number | null;
  discountFromAsk: number;
  negotiability: 'easy' | 'moderate' | 'hard' | 'unrealistic';
}

export interface DiscoveryResult {
  zipCode: string;
  totalListings: number;
  qualifyingCount: number;
  filteredOutCount: number;
  filterPercentage: number;
  qualifying: EnrichedListing[];
  nonQualifying: EnrichedListing[];
  boundary: EnrichedListing[];
  marketSummary: {
    avgPrice: number;
    avgRent: number;
    avgDaysOnMarket: number;
    medianPricePerSqft: number;
    avgRentPerSqft: number;
  };
}
