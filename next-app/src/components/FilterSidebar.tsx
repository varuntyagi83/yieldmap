'use client';
import { EnrichedListing } from '@/lib/types';

export interface Filters {
  minNetYield: number;
  maxPrice: number;
  propertyTypes: string[];
  minBeds: number;
  minBaths: number;
  minYear: number;
  maxYear: number;
  positiveSpreadOnly: boolean;
}

export const DEFAULT_FILTERS: Filters = {
  minNetYield: 0,
  maxPrice: 5000000,
  propertyTypes: [],
  minBeds: 0,
  minBaths: 0,
  minYear: 1900,
  maxYear: 2026,
  positiveSpreadOnly: false,
};

export function applyFilters(listings: EnrichedListing[], filters: Filters): EnrichedListing[] {
  return listings.filter(l => {
    if (l.yield.netYield < filters.minNetYield) return false;
    if (l.price > filters.maxPrice) return false;
    if (filters.propertyTypes.length > 0 && !filters.propertyTypes.some(t => l.propertyType?.toLowerCase().includes(t.toLowerCase()))) return false;
    if (filters.minBeds > 0 && l.bedrooms < filters.minBeds) return false;
    if (filters.minBaths > 0 && l.bathrooms < filters.minBaths) return false;
    if (l.yearBuilt && (l.yearBuilt < filters.minYear || l.yearBuilt > filters.maxYear)) return false;
    if (filters.positiveSpreadOnly && l.yield.leverageSpread <= 0) return false;
    return true;
  });
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  maxPriceInData: number;
  shownCount: number;
  totalQualifying: number;
}

const PROPERTY_TYPES = ['Single Family', 'Multi-Family', 'Condo', 'Townhome'];

export default function FilterSidebar({ filters, onChange, maxPriceInData, shownCount, totalQualifying }: Props) {
  function update<K extends keyof Filters>(key: K, val: Filters[K]) {
    onChange({ ...filters, [key]: val });
  }

  function toggleType(type: string) {
    const has = filters.propertyTypes.includes(type);
    update('propertyTypes', has ? filters.propertyTypes.filter(t => t !== type) : [...filters.propertyTypes, type]);
  }

  const fmtPrice = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`;

  return (
    <div className="w-64 flex-shrink-0 bg-[#111820] border-r border-white/7 overflow-y-auto p-4 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">Filters</span>
        <span className="text-xs text-[#22C55E] font-medium">{shownCount} of {totalQualifying} qualifying</span>
      </div>

      {/* Min net yield */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-[#8A94A6]">Min net yield</span>
          <span className="text-[#EEF0F4] font-medium">{filters.minNetYield}%</span>
        </div>
        <input type="range" min={0} max={12} step={0.5} value={filters.minNetYield}
          onChange={e => update('minNetYield', parseFloat(e.target.value))}
          className="w-full accent-[#22C55E]" />
      </div>

      {/* Max price */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-[#8A94A6]">Max price</span>
          <span className="text-[#EEF0F4] font-medium">{fmtPrice(filters.maxPrice)}</span>
        </div>
        <input type="range" min={50000} max={Math.max(maxPriceInData, 1000000)} step={25000} value={filters.maxPrice}
          onChange={e => update('maxPrice', parseInt(e.target.value))}
          className="w-full accent-[#22C55E]" />
      </div>

      {/* Property type */}
      <div>
        <div className="text-xs text-[#8A94A6] mb-2">Property type</div>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map(type => (
            <button key={type} onClick={() => toggleType(type)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${filters.propertyTypes.includes(type) ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]' : 'bg-transparent border-white/10 text-[#8A94A6] hover:border-white/20'}`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Beds */}
      <div>
        <div className="text-xs text-[#8A94A6] mb-2">Min beds</div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => update('minBeds', n)}
              className={`w-8 h-8 rounded-md text-xs font-medium border transition-colors ${filters.minBeds === n ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]' : 'border-white/10 text-[#8A94A6] hover:border-white/20'}`}>
              {n === 0 ? 'Any' : n === 5 ? '5+' : n}
            </button>
          ))}
        </div>
      </div>

      {/* Baths */}
      <div>
        <div className="text-xs text-[#8A94A6] mb-2">Min baths</div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => update('minBaths', n)}
              className={`w-8 h-8 rounded-md text-xs font-medium border transition-colors ${filters.minBaths === n ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]' : 'border-white/10 text-[#8A94A6] hover:border-white/20'}`}>
              {n === 0 ? 'Any' : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Positive spread toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8A94A6]">Positive spread only</span>
        <button onClick={() => update('positiveSpreadOnly', !filters.positiveSpreadOnly)}
          className={`w-10 h-5 rounded-full transition-colors relative ${filters.positiveSpreadOnly ? 'bg-[#22C55E]' : 'bg-white/10'}`}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${filters.positiveSpreadOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </div>
  );
}
