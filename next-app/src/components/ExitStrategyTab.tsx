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

export default function ExitStrategyTab({ listings, profile, selected, onSelect, s }: Props) {
  const propertySelector = (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: s.txt3, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8 }}>Select a property</div>
      <select
        value={selected?.id ?? ''}
        onChange={e => { const l = listings.find(l => l.id === e.target.value); if (l) onSelect(l); }}
        style={{
          width: '100%', maxWidth: 560, padding: '10px 14px', borderRadius: 8, fontSize: 13,
          background: s.surf, color: s.txt, border: `1px solid ${s.border}`, cursor: 'pointer',
          outline: 'none', appearance: 'auto',
        }}
      >
        <option value="">— Choose a property —</option>
        {listings.map(l => (
          <option key={l.id} value={l.id}>
            {l.formattedAddress}, {l.city} · Net {l.yield.netYield.toFixed(1)}% · CF ${Math.round(l.yield.monthlyCashFlow)}/mo
          </option>
        ))}
      </select>
    </div>
  );

  if (!selected) {
    return (
      <div style={{ flex: 1, overflowY: 'auto' as const, padding: 28, background: s.bg, color: s.txt }}>
        {listings.length > 0 && propertySelector}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280, gap: 12 }}>
          <div style={{ fontSize: 40 }}>📊</div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Select a property above</div>
          <div style={{ fontSize: 13, color: s.txt2 }}>Exit strategy analysis will appear here</div>
        </div>
      </div>
    );
  }

  const appRate = 0.03;
  const sellingCostPct = 0.06;
  const capGainsTax = 0.20;
  const deprRecapture = 0.25;
  const annDepr = (selected.price * 0.8) / 27.5;
  const monthlyCF = selected.yield.monthlyCashFlow;
  const afterTaxCF = monthlyCF;

  const years = Array.from({ length: 10 }, (_, i) => {
    const yr = i + 1;
    const futureValue = selected.price * Math.pow(1 + appRate, yr);
    const totalCF = afterTaxCF * 12 * yr;
    const totalDepr = annDepr * yr;
    const loanBalance = selected.price * (1 - profile.downPct / 100) * (1 - yr * 0.02);

    const holdReturn = totalCF;
    const holdROI = selected.yield.equity > 0 ? holdReturn / selected.yield.equity * 100 : 0;

    const grossProceeds = futureValue;
    const sellingCosts = grossProceeds * sellingCostPct;
    const gain = grossProceeds - selected.price;
    const taxOnGain = Math.max(0, gain) * capGainsTax;
    const taxOnRecapture = totalDepr * deprRecapture;
    const netSaleProceeds = grossProceeds - sellingCosts - Math.max(0, loanBalance) - taxOnGain - taxOnRecapture;
    const sellTotalReturn = netSaleProceeds + totalCF - selected.yield.equity;
    const sellROI = selected.yield.equity > 0 ? sellTotalReturn / selected.yield.equity * 100 : 0;

    const refiLTV = 0.75;
    const refiLoan = futureValue * refiLTV;
    const cashOut = refiLoan - Math.max(0, loanBalance);
    const netCashOut = cashOut - refiLoan * 0.02;

    const exchangeEquity = grossProceeds - sellingCosts - Math.max(0, loanBalance);
    const deferredTax = taxOnGain + taxOnRecapture;
    const buyingPower = exchangeEquity / 0.25;

    return { yr, futureValue, holdReturn, holdROI, sellTotalReturn, sellROI, netSaleProceeds, netCashOut, exchangeEquity, deferredTax, buyingPower, taxOnGain, taxOnRecapture, sellingCosts };
  });

  const crossover = years.find(y => y.sellROI > y.holdROI);

  const stratCards = [
    {
      icon: '🏠', label: 'Hold', color: '#22C55E',
      lines: [`${fmt(monthlyCF)}/mo cash flow`, `${fmtP(selected.yield.cashOnCash)} CoC return forever`],
    },
    {
      icon: '💰', label: 'Sell (Yr 5)', color: '#F59E0B',
      lines: [`${fmt(years[4].netSaleProceeds)} net proceeds`, `${fmt(years[4].taxOnGain + years[4].taxOnRecapture)} in taxes`],
    },
    {
      icon: '🏦', label: 'Refi (Yr 3)', color: '#3B82F6',
      lines: [`${fmt(years[2].netCashOut)} cash out`, 'Keep property + pull equity'],
    },
    {
      icon: '🔄', label: '1031 (Yr 5)', color: '#8B5CF6',
      lines: [`${fmt(years[4].buyingPower)} buying power`, `${fmt(years[4].deferredTax)} tax deferred`],
    },
  ];

  const taxCols = [
    { label: 'Capital gains tax', value: fmt(years[4].taxOnGain), color: '#EF4444' },
    { label: 'Depreciation recapture', value: fmt(years[4].taxOnRecapture), color: '#F59E0B' },
    { label: 'Selling costs (6%)', value: fmt(years[4].sellingCosts), color: s.txt2 },
    { label: '1031 defers', value: fmt(years[4].deferredTax), color: '#22C55E' },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto' as const, padding: 28, background: s.bg, color: s.txt }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Exit Strategy Planner</div>
        <div style={{ fontSize: 13, color: s.txt2 }}>10-year hold, sell, refi, and 1031 exchange projections</div>
      </div>

      {propertySelector}

      {/* Strategy cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 24 }}>
        {stratCards.map((sc) => (
          <div key={sc.label} style={{
            background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: 18,
            borderLeft: `3px solid ${sc.color}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{sc.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: sc.color }}>{sc.label}</span>
            </div>
            {sc.lines.map((line, i) => (
              <div key={i} style={{ fontSize: 13, color: i === 0 ? s.txt : s.txt2, marginBottom: i === 0 ? 4 : 0 }}>{line}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Crossover banner */}
      {crossover && (
        <div style={{
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#F59E0B',
        }}>
          Crossover point: Selling beats holding at year {crossover.yr}.
        </div>
      )}

      {/* Year-by-year table */}
      <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, marginBottom: 24, overflowX: 'auto' as const }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}`, fontSize: 13, fontWeight: 600 }}>
          Year-by-Year Projections
        </div>
        <div style={{ overflowX: 'auto' as const }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 }}>
            <thead>
              <tr style={{ background: s.surf }}>
                {['Year', 'Property Value', 'Hold Return', 'Hold ROI', 'Sell Net', 'Sell ROI', 'Refi Cash-Out', '1031 Power'].map((h) => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'right' as const, color: s.txt3, fontWeight: 500, whiteSpace: 'nowrap' as const }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {years.map((y, i) => (
                <tr key={y.yr} style={{ background: i % 2 === 0 ? 'transparent' : s.surf, borderTop: `1px solid ${s.border}` }}>
                  <td style={{ padding: '7px 12px', textAlign: 'right' as const, fontWeight: 600 }}>Yr {y.yr}</td>
                  <td style={{ padding: '7px 12px', textAlign: 'right' as const, color: s.txt2 }}>{fmt(y.futureValue)}</td>
                  <td style={{ padding: '7px 12px', textAlign: 'right' as const, color: y.holdReturn >= 0 ? '#22C55E' : '#EF4444' }}>{fmt(y.holdReturn)}</td>
                  <td style={{ padding: '7px 12px', textAlign: 'right' as const, color: getColor(y.holdROI) }}>{fmtP(y.holdROI)}</td>
                  <td style={{ padding: '7px 12px', textAlign: 'right' as const, color: y.netSaleProceeds >= 0 ? s.txt : '#EF4444' }}>{fmt(y.netSaleProceeds)}</td>
                  <td style={{ padding: '7px 12px', textAlign: 'right' as const, color: getColor(y.sellROI) }}>{fmtP(y.sellROI)}</td>
                  <td style={{ padding: '7px 12px', textAlign: 'right' as const, color: y.netCashOut >= 0 ? '#3B82F6' : '#EF4444' }}>{fmt(y.netCashOut)}</td>
                  <td style={{ padding: '7px 12px', textAlign: 'right' as const, color: '#8B5CF6' }}>{fmt(y.buyingPower)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax impact at year 5 */}
      <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Tax Impact at Year 5</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {taxCols.map((tc) => (
            <div key={tc.label} style={{ background: s.surf, borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: s.txt3, marginBottom: 6 }}>{tc.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: tc.color }}>{tc.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
