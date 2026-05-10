'use client';
import { DiscoveryResult } from '@/lib/types';

interface Props {
  result: DiscoveryResult;
}

function fmt(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;
}

export default function FilterImpactBanner({ result }: Props) {
  const { totalListings, qualifyingCount, filterPercentage, zipCode, marketSummary } = result;

  return (
    <div className="flex flex-col border-l-4 border-[#22C55E] bg-[#111820] border border-white/10 rounded-lg p-3 mx-4 mt-3">
      <div className="flex items-center gap-3">
        <span className="text-[#EEF0F4] text-sm font-medium whitespace-nowrap">
          {totalListings.toLocaleString()} active listings in {zipCode}
        </span>
        <div className="flex items-center gap-1 text-[#8A94A6] text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M11 12h2M12 16h.01" />
          </svg>
          <span>→</span>
        </div>
        <span className="text-[#22C55E] text-sm font-bold whitespace-nowrap">
          {qualifyingCount} investor-friendly
        </span>
      </div>
      <div className="text-[#8A94A6] text-xs mt-1">
        ({filterPercentage}% noise eliminated)
        {marketSummary.avgPrice > 0 && ` · Avg ${fmt(marketSummary.avgPrice)}`}
        {marketSummary.avgRent > 0 && ` · Avg rent $${marketSummary.avgRent.toLocaleString()}/mo`}
        {marketSummary.avgDaysOnMarket > 0 && ` · ${marketSummary.avgDaysOnMarket}d avg DOM`}
      </div>
      {result.boundary.length > 0 && (
        <div className="text-[#F59E0B]/70 text-[10px] mt-0.5 flex items-center gap-1">
          + {result.boundary.length} negotiable (within 10% of qualifying)
          <span
            title="Properties that don't qualify at ask but would with a 1-10% price reduction"
            className="cursor-help text-[#8A94A6] hover:text-[#EEF0F4]"
          >(?)</span>
        </div>
      )}
    </div>
  );
}
