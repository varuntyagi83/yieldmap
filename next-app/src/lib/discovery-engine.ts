import { RentCastListing, InvestorProfile, EnrichedListing, DiscoveryResult } from './types';
import { enrichListing } from './yield-engine';

function extractListings(data: unknown): RentCastListing[] {
  if (Array.isArray(data)) return data as RentCastListing[];
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.listings)) return obj.listings as RentCastListing[];
    if (Array.isArray(obj.data)) return obj.data as RentCastListing[];
  }
  return [];
}

function extractMarketRentData(market: unknown): { avgRentPerSqft: number; medianRentByBeds: Record<number, number> } {
  const fallback = { avgRentPerSqft: 0, medianRentByBeds: {} };
  if (!market || typeof market !== 'object') return fallback;

  const m = market as Record<string, unknown>;

  // Try multiple possible field paths RentCast may return
  const rentSections = [m.rentalData, m.rentData, m.rental, m] as Array<Record<string, unknown> | undefined>;

  let avgRentPerSqft = 0;
  const medianRentByBeds: Record<number, number> = {};

  for (const section of rentSections) {
    if (!section) continue;
    if (typeof section.averageRentPerSquareFoot === 'number' && section.averageRentPerSquareFoot > 0) {
      avgRentPerSqft = section.averageRentPerSquareFoot;
    }
    if (typeof section.rentPerSquareFoot === 'number' && section.rentPerSquareFoot > 0) {
      avgRentPerSqft = section.rentPerSquareFoot;
    }
    // Bedroom-specific medians
    for (const beds of [1, 2, 3, 4, 5]) {
      const key = `averageRent${beds}Bedroom` as string;
      const altKey = `median${beds}Bedroom` as string;
      if (typeof section[key] === 'number') medianRentByBeds[beds] = section[key] as number;
      else if (typeof section[altKey] === 'number') medianRentByBeds[beds] = section[altKey] as number;
    }
  }

  return { avgRentPerSqft, medianRentByBeds };
}

function bedroomMultiplier(beds: number): number {
  if (beds <= 1) return 0.9;
  if (beds === 2) return 1.0;
  if (beds === 3) return 1.05;
  return 1.1;
}

function estimateRent(listing: RentCastListing, avgRentPerSqft: number, medianRentByBeds: Record<number, number>): number {
  const beds = listing.bedrooms || 0;
  if (listing.squareFootage > 0 && avgRentPerSqft > 0) {
    return Math.round(listing.squareFootage * avgRentPerSqft * bedroomMultiplier(beds));
  }
  if (medianRentByBeds[beds]) return medianRentByBeds[beds];
  if (medianRentByBeds[2]) return medianRentByBeds[2];
  return 0;
}

export async function discoverProperties(zipCode: string, profile: InvestorProfile): Promise<DiscoveryResult> {
  const [listingsRes, marketRes] = await Promise.all([
    fetch(`/api/rentcast/listings?zipCode=${zipCode}&limit=500`),
    fetch(`/api/rentcast/market?zipCode=${zipCode}`),
  ]);

  const listingsData = await listingsRes.json();
  const marketData = await marketRes.json();

  const rawListings = extractListings(listingsData);
  const { avgRentPerSqft, medianRentByBeds } = extractMarketRentData(marketData);

  console.log(`[Discovery] ${zipCode}: fetched=${rawListings.length}, avgRentPerSqft=${avgRentPerSqft}`);

  let withValidData = 0;
  let withEstimatedRent = 0;

  const enrichedListings: EnrichedListing[] = [];

  for (const raw of rawListings) {
    if (!raw.price || raw.price <= 0) continue;
    withValidData++;

    const listing: RentCastListing = {
      ...raw,
      bedrooms: raw.bedrooms ?? 0,
      bathrooms: raw.bathrooms ?? 0,
      squareFootage: raw.squareFootage ?? 0,
    };

    if (!listing.estimatedRent || listing.estimatedRent <= 0) {
      const estimated = estimateRent(listing, avgRentPerSqft, medianRentByBeds);
      if (estimated > 0) {
        listing.estimatedRent = estimated;
        withEstimatedRent++;
      }
    } else {
      withEstimatedRent++;
    }

    if (!listing.estimatedRent || listing.estimatedRent <= 0) continue;

    enrichedListings.push(enrichListing(listing, profile));
  }

  const qualifying = enrichedListings.filter(l => l.qualifies).sort((a, b) => b.yield.netYield - a.yield.netYield);
  const nonQualifying = enrichedListings.filter(l => !l.qualifies);

  const boundary = nonQualifying
    .filter(l => l.discountFromAsk > 0 && l.discountFromAsk <= 10)
    .sort((a, b) => a.discountFromAsk - b.discountFromAsk)
    .slice(0, 50);

  console.log(`[Discovery] ${zipCode}: validData=${withValidData}, rentEstimated=${withEstimatedRent}, qualified=${qualifying.length}`);

  // Market summary
  const allPrices = enrichedListings.map(l => l.price).filter(p => p > 0);
  const allRents = enrichedListings.map(l => l.estimatedRent ?? 0).filter(r => r > 0);
  const allDOM = enrichedListings.map(l => l.daysOnMarket ?? 0).filter(d => d > 0);
  const allPricePerSqft = enrichedListings
    .filter(l => l.squareFootage > 0)
    .map(l => l.price / l.squareFootage);

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const median = (arr: number[]) => {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  };

  const totalListings = rawListings.length;
  const qualifyingCount = qualifying.length;

  return {
    zipCode,
    totalListings,
    qualifyingCount,
    filteredOutCount: totalListings - qualifyingCount,
    filterPercentage: totalListings > 0 ? Math.round(((totalListings - qualifyingCount) / totalListings) * 100) : 0,
    qualifying,
    nonQualifying,
    boundary,
    marketSummary: {
      avgPrice: Math.round(avg(allPrices)),
      avgRent: Math.round(avg(allRents)),
      avgDaysOnMarket: Math.round(avg(allDOM)),
      medianPricePerSqft: Math.round(median(allPricePerSqft)),
      avgRentPerSqft: avgRentPerSqft,
    },
  };
}

export function getFilterImpactText(result: DiscoveryResult): string {
  return `${result.totalListings} listings in ${result.zipCode} → ${result.qualifyingCount} qualify (${result.filterPercentage}% filtered)`;
}

export function getZipSignal(qualifying: number, total: number): 'hot' | 'selective' | 'cold' | 'empty' {
  if (total === 0) return 'empty';
  if (qualifying >= 3) return 'hot';
  if (qualifying >= 1) return 'selective';
  return 'cold';
}
