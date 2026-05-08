'use client';

import { EnrichedListing, InvestorProfile } from '@/lib/types';
import { ThemeStyles } from '@/lib/theme';

interface Props {
  listings: EnrichedListing[];
  profile: InvestorProfile;
  selected: EnrichedListing | null;
  onSelect: (listing: EnrichedListing) => void;
  s: ThemeStyles;
}

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const fmtP = (n: number) => n.toFixed(1) + '%';
const getColor = (n: number) => n >= 6 ? '#22C55E' : n >= 4 ? '#84CC16' : n >= 2 ? '#F59E0B' : '#EF4444';

const PROP_TYPE_COLORS: Record<string, string> = {
  'Residential': '#22C55E',
  'Single Family': '#22C55E',
  'Condo': '#F59E0B',
  'Townhouse': '#3B82F6',
  'Multi Family': '#8B5CF6',
};

export default function PortfolioTab({ listings, profile, selected, onSelect, s }: Props) {
  if (listings.length === 0) {
    return (
      <div style={{ flex: 1, overflowY: 'auto' as const, padding: 28, background: s.bg, color: s.txt }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 12 }}>
          <div style={{ fontSize: 48 }}>🏠</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Search a zip code first</div>
          <div style={{ fontSize: 14, color: s.txt2 }}>Portfolio analysis appears here once properties are loaded</div>
        </div>
      </div>
    );
  }

  const totalValue = listings.reduce((sum, l) => sum + l.price, 0);
  const totalEquity = listings.reduce((sum, l) => sum + l.yield.equity, 0);
  const monthlyCF = listings.reduce((sum, l) => sum + l.yield.monthlyCashFlow, 0);
  const avgNetYield = listings.reduce((sum, l) => sum + l.yield.netYield, 0) / listings.length;
  const avgCoC = listings.reduce((sum, l) => sum + l.yield.cashOnCash, 0) / listings.length;

  // Geographic concentration
  const cityMap: Record<string, number> = {};
  for (const l of listings) {
    cityMap[l.city] = (cityMap[l.city] || 0) + l.price;
  }
  const cityEntries = Object.entries(cityMap)
    .map(([city, val]) => ({ city, val, pct: totalValue > 0 ? (val / totalValue) * 100 : 0 }))
    .sort((a, b) => b.pct - a.pct);

  // Property type mix
  const typeMap: Record<string, number> = {};
  for (const l of listings) {
    typeMap[l.propertyType] = (typeMap[l.propertyType] || 0) + l.price;
  }
  const typeEntries = Object.entries(typeMap)
    .map(([type, val]) => ({ type, val, pct: totalValue > 0 ? (val / totalValue) * 100 : 0 }))
    .sort((a, b) => b.pct - a.pct);

  // Risk flags
  const riskFlags: { label: string; severity: 'high' | 'med' | 'ok' }[] = [];
  for (const { city, pct } of cityEntries) {
    if (pct > 30) {
      riskFlags.push({
        label: `${fmtP(pct)} concentrated in ${city}`,
        severity: pct > 50 ? 'high' : 'med',
      });
    }
  }
  const negCF = listings.filter(l => l.yield.monthlyCashFlow < 0);
  if (negCF.length > 0) {
    riskFlags.push({ label: `${negCF.length} ${negCF.length === 1 ? 'property is' : 'properties are'} cash flow negative`, severity: 'high' });
  }
  if (avgNetYield < 4) {
    riskFlags.push({ label: `Portfolio avg yield of ${fmtP(avgNetYield)} is below 4% threshold`, severity: 'med' });
  }
  if (riskFlags.length === 0) {
    riskFlags.push({ label: 'Portfolio is well diversified', severity: 'ok' });
  }

  const severityColor = (s: 'high' | 'med' | 'ok') =>
    s === 'high' ? '#EF4444' : s === 'med' ? '#F59E0B' : '#22C55E';

  // Performance ranking
  const ranked = [...listings].sort((a, b) => b.yield.monthlyCashFlow - a.yield.monthlyCashFlow);
  const maxAbsCF = Math.max(...ranked.map(l => Math.abs(l.yield.monthlyCashFlow)), 1);

  const metricCard = (label: string, value: string, valueColor?: string) => (
    <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: '16px 18px' }}>
      <div style={{ fontSize: 11, color: s.txt3, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: valueColor || s.txt }}>{value}</div>
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto' as const, padding: 28, background: s.bg, color: s.txt }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Portfolio Health</div>
        <div style={{ fontSize: 13, color: s.txt2 }}>{listings.length} properties in current search</div>
      </div>

      {/* Top-line metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        {metricCard('Total Value', fmt(totalValue))}
        {metricCard('Total Equity', fmt(totalEquity))}
        {metricCard('Monthly CF', fmt(monthlyCF), monthlyCF >= 0 ? '#22C55E' : '#EF4444')}
        {metricCard('Avg Net Yield', fmtP(avgNetYield), getColor(avgNetYield))}
        {metricCard('Avg CoC', fmtP(avgCoC), getColor(avgCoC))}
      </div>

      {/* 2-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Geographic concentration */}
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Geographic Concentration</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cityEntries.map(({ city, pct }) => (
              <div key={city}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: s.txt2 }}>{city}</span>
                  <span style={{ fontWeight: 600 }}>{fmtP(pct)}</span>
                </div>
                <div style={{ height: 6, background: s.surf, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: pct > 30 ? '#F59E0B' : '#22C55E', borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property type mix */}
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Property Type Mix</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {typeEntries.map(({ type, pct }) => {
              const color = PROP_TYPE_COLORS[type] || '#8B95A5';
              return (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: s.txt2 }}>{type}</span>
                    <span style={{ fontWeight: 600 }}>{fmtP(pct)}</span>
                  </div>
                  <div style={{ height: 6, background: s.surf, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Risk flags */}
      <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Risk Flags</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {riskFlags.map((flag, i) => (
            <div key={i} style={{
              borderLeft: `3px solid ${severityColor(flag.severity)}`,
              paddingLeft: 12,
              paddingTop: 6,
              paddingBottom: 6,
              background: s.surf,
              borderRadius: '0 6px 6px 0',
              fontSize: 13,
              color: severityColor(flag.severity),
            }}>
              {flag.label}
            </div>
          ))}
        </div>
      </div>

      {/* Performance ranking */}
      <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Property Performance Ranking</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ranked.map((listing) => {
            const cf = listing.yield.monthlyCashFlow;
            const barPct = Math.abs(cf) / maxAbsCF * 100;
            const isPos = cf >= 0;
            const addr = listing.formattedAddress.length > 35
              ? listing.formattedAddress.slice(0, 34) + '...'
              : listing.formattedAddress;
            return (
              <div
                key={listing.id}
                onClick={() => onSelect(listing)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  background: selected?.id === listing.id ? s.surfH : s.surf,
                  borderRadius: 8, cursor: 'pointer', border: `1px solid ${selected?.id === listing.id ? s.borderH : 'transparent'}`,
                }}
              >
                <div style={{ flex: '0 0 180px', fontSize: 12, color: s.txt2, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{addr}</div>
                <div style={{ flex: 1, height: 6, background: s.border, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${barPct}%`, background: isPos ? '#22C55E' : '#EF4444', borderRadius: 3 }} />
                </div>
                <div style={{ flex: '0 0 90px', textAlign: 'right' as const, fontSize: 12, fontWeight: 600, color: isPos ? '#22C55E' : '#EF4444' }}>
                  {fmt(cf)}/mo
                </div>
                <div style={{ flex: '0 0 60px', textAlign: 'right' as const, fontSize: 12, color: s.txt2 }}>
                  {fmtP(listing.yield.netYield)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
