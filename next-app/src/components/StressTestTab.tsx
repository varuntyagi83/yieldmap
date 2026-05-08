'use client';

import { EnrichedListing, InvestorProfile } from '@/lib/types';
import { ThemeStyles } from '@/lib/theme';
import { calcYield } from '@/lib/yield-engine';

interface Props {
  listings: EnrichedListing[];
  profile: InvestorProfile;
  selected: EnrichedListing | null;
  onSelect: (listing: EnrichedListing) => void;
  s: ThemeStyles;
}

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const fmtP = (n: number) => n.toFixed(1) + '%';

function calcStressedCF(
  listing: EnrichedListing,
  profile: InvestorProfile,
  rateAdj: number,
  rentAdj: number,
  taxHikePct: number,
  repairAnnual: number
): { monthlyCF: number; netYield: number; capRate: number } {
  const stressedListing = {
    ...listing,
    estimatedRent: (listing.yield.monthlyRent || 0) * (1 + rentAdj / 100),
  };
  const stressedProfile = { ...profile, mortRate: profile.mortRate + rateAdj };
  const y = calcYield(stressedListing, stressedProfile);
  const extraTax = listing.yield.monthlyPropTax * (taxHikePct / 100);
  const monthlyRepair = repairAnnual / 12;
  const monthlyCF = y.monthlyCashFlow - extraTax - monthlyRepair;
  const netYield = listing.price > 0 ? (monthlyCF * 12 / listing.price) * 100 : 0;
  return { monthlyCF, netYield, capRate: y.capRate };
}

const SCENARIOS = [
  { name: 'Base case (current)', rateAdj: 0, rentAdj: 0, taxHikePct: 0, repairAnnual: 0 },
  { name: 'Rate hike (+2%)', rateAdj: 2, rentAdj: 0, taxHikePct: 0, repairAnnual: 0 },
  { name: 'Rent decline (-10%)', rateAdj: 0, rentAdj: -10, taxHikePct: 0, repairAnnual: 0 },
  { name: 'Property tax hike (+25%)', rateAdj: 0, rentAdj: 0, taxHikePct: 25, repairAnnual: 0 },
  { name: 'Major repair ($15K)', rateAdj: 0, rentAdj: 0, taxHikePct: 0, repairAnnual: 15000 },
  { name: 'Perfect storm (all above)', rateAdj: 2, rentAdj: -10, taxHikePct: 25, repairAnnual: 15000 },
];

export default function StressTestTab({ listings, profile, selected, onSelect, s }: Props) {
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
          <div style={{ fontSize: 40 }}>🔬</div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Select a property above</div>
          <div style={{ fontSize: 13, color: s.txt2 }}>Stress test analysis will appear here</div>
        </div>
      </div>
    );
  }

  const results = SCENARIOS.map((sc) => ({
    ...sc,
    ...calcStressedCF(selected, profile, sc.rateAdj, sc.rentAdj, sc.taxHikePct, sc.repairAnnual),
  }));

  const survived = results.filter(r => r.monthlyCF > 0).length;
  const worstCase = results[5];
  const perfectStormOk = worstCase.monthlyCF > 0;

  // Break-even thresholds
  let maxRate = '>' + (profile.mortRate + 12).toFixed(1) + '%';
  for (let r = profile.mortRate; r <= 15; r += 0.25) {
    const t = calcStressedCF(selected, profile, r - profile.mortRate, 0, 0, 0);
    if (t.monthlyCF <= 0) {
      maxRate = r.toFixed(2) + '%';
      break;
    }
  }

  let minRent = selected.yield.monthlyRent;
  const baseRent = selected.yield.monthlyRent;
  for (let rent = baseRent; rent >= 0; rent -= 50) {
    const adj = ((rent - baseRent) / baseRent) * 100;
    const t = calcStressedCF(selected, profile, 0, adj, 0, 0);
    if (t.monthlyCF <= 0) {
      minRent = rent + 50;
      break;
    }
  }

  const emergencyFund = Math.max(0, -worstCase.monthlyCF * 6);

  return (
    <div style={{ flex: 1, overflowY: 'auto' as const, padding: 28, background: s.bg, color: s.txt }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Stress Test</div>
        <div style={{ fontSize: 13, color: s.txt2 }}>How does this property perform under adverse conditions?</div>
      </div>

      {propertySelector}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, color: s.txt3, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>Scenarios Survived</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: survived >= 5 ? '#22C55E' : survived >= 3 ? '#F59E0B' : '#EF4444' }}>{survived} / 6</div>
        </div>
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, color: s.txt3, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>Worst Case CF/mo</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: worstCase.monthlyCF >= 0 ? '#22C55E' : '#EF4444' }}>{fmt(worstCase.monthlyCF)}</div>
        </div>
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, color: s.txt3, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>Perfect Storm</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: perfectStormOk ? '#22C55E' : '#EF4444' }}>
            {perfectStormOk ? '✅' : '❌'} <span style={{ fontSize: 14 }}>{perfectStormOk ? 'Survives' : 'Breaks'}</span>
          </div>
        </div>
      </div>

      {/* Scenario rows */}
      <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Scenario Analysis</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map((r, i) => {
            const survives = r.monthlyCF > 0;
            const icon = i === 0 ? '✅' : survives ? '🟢' : '🔴';
            return (
              <div key={r.name} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px',
                background: s.surf, borderRadius: 8,
                border: `1px solid ${i === 5 && !survives ? 'rgba(239,68,68,0.3)' : 'transparent'}`,
              }}>
                <div style={{ fontSize: 16, flex: '0 0 20px' }}>{icon}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: i === 0 ? 600 : 400 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: s.txt2, flex: '0 0 80px', textAlign: 'right' as const }}>{fmtP(r.netYield)}</div>
                <div style={{ fontSize: 13, fontWeight: 600, flex: '0 0 90px', textAlign: 'right' as const, color: r.monthlyCF >= 0 ? '#22C55E' : '#EF4444' }}>
                  {fmt(r.monthlyCF)}/mo
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Break-even thresholds */}
      <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Break-Even Thresholds</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div style={{ background: s.surf, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: s.txt3, marginBottom: 6 }}>Max rate before loss</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.txt }}>{maxRate}</div>
          </div>
          <div style={{ background: s.surf, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: s.txt3, marginBottom: 6 }}>Min rent to break even</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.txt }}>{fmt(minRent)}/mo</div>
          </div>
          <div style={{ background: s.surf, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: s.txt3, marginBottom: 6 }}>Emergency fund needed</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: emergencyFund > 0 ? '#F59E0B' : '#22C55E' }}>{fmt(emergencyFund)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
