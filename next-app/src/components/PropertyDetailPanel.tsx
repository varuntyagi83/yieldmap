'use client';
import { EnrichedListing } from '@/lib/types';

interface Props {
  listing: EnrichedListing;
  onClose: () => void;
}

function fmt(n: number) { return `$${Math.round(n).toLocaleString()}`; }
function fmtPct(n: number) { return `${n.toFixed(1)}%`; }

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-[#0B0F14] rounded-lg p-3">
      <div className="text-[10px] text-[#8A94A6] uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-base font-bold ${color ?? 'text-[#EEF0F4]'}`}>{value}</div>
      {sub && <div className="text-[10px] text-[#8A94A6] mt-0.5">{sub}</div>}
    </div>
  );
}

function BreakdownRow({ label, value, bold, separator }: { label: string; value: string; bold?: boolean; separator?: boolean }) {
  return (
    <>
      {separator && <div className="border-t border-white/7 my-1" />}
      <div className={`flex justify-between text-xs ${bold ? 'font-bold text-[#EEF0F4]' : 'text-[#8A94A6]'}`}>
        <span>{label}</span>
        <span className={bold ? (value.startsWith('-') ? 'text-[#EF4444]' : 'text-[#22C55E]') : ''}>{value}</span>
      </div>
    </>
  );
}

export default function PropertyDetailPanel({ listing, onClose }: Props) {
  const y = listing.yield;
  const dom = listing.daysOnMarket ?? 0;
  const domColor = dom < 21 ? 'text-[#22C55E]' : dom < 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]';

  const zillowUrl = `https://www.zillow.com/homes/${encodeURIComponent(listing.formattedAddress)}_rb/`;
  const redfinUrl = `https://www.redfin.com/stingray/do/location-autocomplete?location=${encodeURIComponent(listing.formattedAddress)}`;

  return (
    <div
      className="w-[420px] flex-shrink-0 bg-[#111820] border-l border-white/7 overflow-y-auto flex flex-col"
      onWheel={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-white/7 sticky top-0 bg-[#111820] z-10">
        <div>
          <div className="text-xs text-[#8A94A6] mb-0.5">{listing.city}, {listing.state} {listing.zipCode}</div>
          <div className="text-sm font-semibold text-[#EEF0F4] leading-snug">{listing.formattedAddress}</div>
        </div>
        <button onClick={onClose} className="text-[#8A94A6] hover:text-[#EEF0F4] p-1 ml-2 flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Price + DOM */}
        <div className="flex items-end justify-between">
          <div className="text-3xl font-black text-[#EEF0F4]">{fmt(listing.price)}</div>
          {dom > 0 && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 ${domColor}`}>
              {dom}d on market
            </span>
          )}
        </div>

        {/* Property stats */}
        <div className="flex gap-3 text-xs text-[#8A94A6]">
          {listing.bedrooms > 0 && <span>{listing.bedrooms} bd</span>}
          {listing.bathrooms > 0 && <span>{listing.bathrooms} ba</span>}
          {listing.squareFootage > 0 && <span>{listing.squareFootage.toLocaleString()} sqft</span>}
          {listing.yearBuilt && <span>Built {listing.yearBuilt}</span>}
          {listing.lotSize && <span>{(listing.lotSize / 43560).toFixed(2)} ac</span>}
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-2">
          <MetricCard label="Net Yield" value={fmtPct(y.netYield)} color={listing.yieldColor} />
          <MetricCard label="Cap Rate" value={fmtPct(y.capRate)} />
          <MetricCard label="Cash/Cash" value={fmtPct(y.cashOnCash)} />
          <MetricCard label="Monthly CF" value={fmt(y.monthlyCashFlow)} color={y.monthlyCashFlow >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'} />
          <MetricCard label="Gross Yield" value={fmtPct(y.grossYield)} />
          <MetricCard label="Equity In" value={fmt(y.equity)} />
        </div>

        {/* Leverage analysis */}
        <div className="bg-[#0B0F14] rounded-lg p-3">
          <div className="text-[10px] text-[#8A94A6] uppercase tracking-wider mb-2">Leverage Analysis</div>
          {/* Cap rate vs borrow rate bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#8A94A6]">Cap Rate</span>
              <span className="text-[#EEF0F4] font-medium">{fmtPct(y.capRate)}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div style={{ width: `${Math.min(100, y.capRate * 8)}%`, background: y.leverageSignal === 'positive' ? '#22C55E' : y.leverageSignal === 'marginal' ? '#F59E0B' : '#EF4444' }} className="h-full rounded-full" />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-[#8A94A6]">Borrow Rate</span>
              <span className="text-[#EEF0F4] font-medium">{listing.yield.leverageSpread > 0 ? `+${fmtPct(y.leverageSpread)} spread` : fmtPct(y.leverageSpread + (listing.yield.leverageSpread < 0 ? 0 : 0))}</span>
            </div>
          </div>
          <div className={`text-xs font-medium ${y.leverageSignal === 'positive' ? 'text-[#22C55E]' : y.leverageSignal === 'marginal' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
            {y.leverageSignal === 'positive' && `✓ +${fmtPct(y.leverageSpread)} spread — leverage amplifies returns`}
            {y.leverageSignal === 'marginal' && `⚠ ${fmtPct(y.leverageSpread)} spread — tight, needs appreciation`}
            {y.leverageSignal === 'negative' && `✗ ${fmtPct(y.leverageSpread)} spread — ${fmt(y.monthlyDeficit)}/mo deficit${y.yearsToBreakeven ? ` · breakeven ~${y.yearsToBreakeven}yr · ${fmt(y.totalOutOfPocket)} out of pocket` : ' · no breakeven in 30yr'}`}
          </div>
        </div>

        {/* Monthly breakdown */}
        <div className="bg-[#0B0F14] rounded-lg p-3">
          <div className="text-[10px] text-[#8A94A6] uppercase tracking-wider mb-2">Monthly Breakdown</div>
          <div className="flex flex-col gap-1.5">
            <BreakdownRow label="Est. rent" value={`+${fmt(y.monthlyRent)}`} />
            <BreakdownRow label="Property tax" value={`-${fmt(y.monthlyPropTax)}`} />
            <BreakdownRow label="Insurance" value={`-${fmt(y.monthlyInsurance)}`} />
            <BreakdownRow label="HOA" value={`-${fmt(y.monthlyHOA)}`} />
            <BreakdownRow label="Management" value={`-${fmt(y.monthlyMgmt)}`} />
            <BreakdownRow label="Net rent" value={fmt(y.monthlyRent - y.monthlyPropTax - y.monthlyInsurance - y.monthlyHOA - y.monthlyMgmt)} bold separator />
            <BreakdownRow label="Mortgage" value={`-${fmt(y.monthlyMortgage)}`} />
            <BreakdownRow label="Cash flow" value={`${y.monthlyCashFlow >= 0 ? '+' : ''}${fmt(y.monthlyCashFlow)}`} bold separator />
          </div>
        </div>

        {/* Property details */}
        <div className="bg-[#0B0F14] rounded-lg p-3">
          <div className="text-[10px] text-[#8A94A6] uppercase tracking-wider mb-2">Property Details</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {[
              ['Type', listing.propertyType],
              ['Year', listing.yearBuilt?.toString()],
              ['Beds', listing.bedrooms?.toString()],
              ['Baths', listing.bathrooms?.toString()],
              ['SqFt', listing.squareFootage?.toLocaleString()],
              ['Price/sqft', listing.squareFootage > 0 ? `$${Math.round(listing.price / listing.squareFootage)}` : null],
              ['DOM', dom > 0 ? `${dom} days` : null],
              ['County', listing.county],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[#8A94A6]">{k}</span>
                <span className="text-[#EEF0F4]">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-2">
          <a href={zillowUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center py-2 text-xs font-semibold text-[#8A94A6] border border-white/10 rounded-lg hover:border-white/20 hover:text-[#EEF0F4] transition-colors">
            View on Zillow ↗
          </a>
          <a href={redfinUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center py-2 text-xs font-semibold text-[#8A94A6] border border-white/10 rounded-lg hover:border-white/20 hover:text-[#EEF0F4] transition-colors">
            View on Redfin ↗
          </a>
        </div>
      </div>
    </div>
  );
}
