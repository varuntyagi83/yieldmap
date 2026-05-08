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

const difficultyColor = (d: string) =>
  d === 'Easy' ? '#22C55E' : d === 'Medium' ? '#F59E0B' : '#EF4444';

interface ScenarioItem {
  name: string;
  impact: number;
  cost: number;
  time: string;
  difficulty: string;
  icon: string;
}

interface ScenarioGroup {
  cat: string;
  items: ScenarioItem[];
}

export default function YieldOptimizerTab({ listings, profile, selected, onSelect, s }: Props) {
  const propertySelector = (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: s.txt3, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8 }}>Select a property</div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
        {listings.map((l) => {
          const addr = l.formattedAddress.length > 30 ? l.formattedAddress.slice(0, 29) + '...' : l.formattedAddress;
          const isActive = selected?.id === l.id;
          return (
            <button
              key={l.id}
              onClick={() => onSelect(l)}
              style={{
                padding: '6px 12px', fontSize: 12, borderRadius: 6, cursor: 'pointer',
                background: isActive ? s.accent : s.surf,
                color: isActive ? '#fff' : s.txt2,
                border: `1px solid ${isActive ? s.accent : s.border}`,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {addr}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!selected) {
    return (
      <div style={{ flex: 1, overflowY: 'auto' as const, padding: 28, background: s.bg, color: s.txt }}>
        {listings.length > 0 && propertySelector}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280, gap: 12 }}>
          <div style={{ fontSize: 40 }}>⚙️</div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Select a property above</div>
          <div style={{ fontSize: 13, color: s.txt2 }}>Yield optimization opportunities will appear here</div>
        </div>
      </div>
    );
  }

  const y = selected.yield;
  const price = selected.price;
  const units = selected.bedrooms > 3 ? 2 : 1;
  const sqft = selected.squareFootage || 1000;

  const rawScenarios: ScenarioGroup[] = [
    {
      cat: 'Revenue',
      items: [
        { name: 'Raise rent to market rate (+8%)', impact: (y.monthlyRent * 0.08 * 12) / price * 100, cost: 0, time: '1 month', difficulty: 'Easy', icon: '↑' },
        { name: 'Add coin laundry ($150/unit/mo)', impact: (units * 150 * 12) / price * 100, cost: units * 2500, time: '2 weeks', difficulty: 'Easy', icon: '🧺' },
        { name: 'Pet policy + pet rent ($50/unit/mo)', impact: (units * 50 * 12 * 0.6) / price * 100, cost: 0, time: '1 week', difficulty: 'Easy', icon: '🐶' },
        { name: 'Add covered parking ($75/spot/mo)', impact: (units * 75 * 12) / price * 100, cost: units * 3000, time: '1 month', difficulty: 'Medium', icon: '🅿️' },
      ],
    },
    {
      cat: 'Cost Reduction',
      items: [
        { name: 'Switch to LED lighting throughout', impact: (sqft * 0.15) / price * 100, cost: units * 400, time: '1 day', difficulty: 'Easy', icon: '💡' },
        { name: 'Install smart thermostats (save 15% HVAC)', impact: (units * 180) / price * 100, cost: units * 250, time: '1 day', difficulty: 'Easy', icon: '🌡️' },
        { name: 'Renegotiate insurance (shop 3 quotes)', impact: (y.monthlyInsurance * 12 * 0.12) / price * 100, cost: 0, time: '2 weeks', difficulty: 'Easy', icon: '🛡️' },
        { name: 'Self-manage (drop management fee)', impact: y.monthlyMgmt > 0 ? (y.monthlyMgmt * 12) / price * 100 : 0, cost: 0, time: 'Ongoing', difficulty: 'Hard', icon: '💼' },
        { name: 'Contest property tax assessment', impact: (y.monthlyPropTax * 12 * 0.08) / price * 100, cost: 500, time: '3 months', difficulty: 'Medium', icon: '🏛️' },
      ],
    },
    {
      cat: 'Value-Add Renovation',
      items: [
        { name: 'Kitchen refresh (cabinets + counters)', impact: 0.4, cost: units * 6000, time: '3 weeks/unit', difficulty: 'Medium', icon: '🍳' },
        { name: 'Bathroom update (vanity + tile)', impact: 0.3, cost: units * 4000, time: '2 weeks/unit', difficulty: 'Medium', icon: '🚿' },
        { name: 'Add ADU / convert garage', impact: 1.2, cost: 45000, time: '4 months', difficulty: 'Hard', icon: '🏠' },
        { name: 'Energy efficiency package (windows + insulation)', impact: 0.25, cost: sqft * 4, time: '2 months', difficulty: 'Hard', icon: '⚡' },
      ],
    },
    {
      cat: 'Vacancy Reduction',
      items: [
        { name: 'Professional photos + virtual tour', impact: (y.monthlyRent * 12 * 0.01) / price * 100, cost: 300, time: '1 day', difficulty: 'Easy', icon: '📸' },
        { name: 'Offer 13-month lease (1 month free)', impact: (y.monthlyRent * 12 * 0.015) / price * 100, cost: 0, time: 'Next lease', difficulty: 'Easy', icon: '📄' },
        { name: 'Tenant retention program (renewal bonus)', impact: (y.monthlyRent * 0.5) / price * 100, cost: units * y.monthlyRent * 0.25, time: 'Ongoing', difficulty: 'Easy', icon: '🤝' },
      ],
    },
  ];

  const scenarios: ScenarioGroup[] = rawScenarios.map((g) => ({
    ...g,
    items: g.items.filter((it) => it.impact > 0),
  })).filter((g) => g.items.length > 0);

  const totalImpact = scenarios.reduce((sum, g) => sum + g.items.reduce((s2, it) => s2 + it.impact, 0), 0);

  return (
    <div style={{ flex: 1, overflowY: 'auto' as const, padding: 28, background: s.bg, color: s.txt }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Yield Optimizer</div>
        <div style={{ fontSize: 13, color: s.txt2 }}>Actionable improvements to increase this property's yield</div>
      </div>

      {propertySelector}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: s.txt3, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>Current Net Yield</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: getColor(y.netYield) }}>{fmtP(y.netYield)}</div>
        </div>
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: s.txt3, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>Potential Yield</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#22C55E' }}>{fmtP(y.netYield + totalImpact)}</div>
        </div>
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, padding: '16px 18px', borderLeft: '3px solid #22C55E' }}>
          <div style={{ fontSize: 11, color: s.txt3, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>Total Uplift</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#22C55E' }}>+{fmtP(totalImpact)}</div>
        </div>
      </div>

      {/* Scenario sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {scenarios.map((group) => (
          <div key={group.cat} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: `1px solid ${s.border}`, fontSize: 13, fontWeight: 700, color: s.txt }}>
              {group.cat}
            </div>
            <div>
              {group.items.map((item, i) => (
                <div
                  key={item.name}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px',
                    borderTop: i === 0 ? 'none' : `1px solid ${s.border}`,
                  }}
                >
                  <div style={{ fontSize: 22, flex: '0 0 28px', textAlign: 'center' as const }}>{item.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{item.name}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: s.txt3 }}>
                      {item.cost > 0 && <span>Cost: {fmt(item.cost)}</span>}
                      {item.cost === 0 && <span>No cost</span>}
                      <span>{item.time}</span>
                      <span style={{ color: difficultyColor(item.difficulty) }}>{item.difficulty}</span>
                    </div>
                  </div>
                  <div style={{ flex: '0 0 80px', textAlign: 'right' as const }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#22C55E' }}>+{fmtP(item.impact)}</div>
                    <div style={{ fontSize: 11, color: s.txt3 }}>yield uplift</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
