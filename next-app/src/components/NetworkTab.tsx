'use client';

import { useState } from 'react';
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

interface SharedDeal {
  avatar: string;
  sharer: string;
  time: string;
  propertyName: string;
  city: string;
  state: string;
  price: number;
  rent: number;
  netYield: number;
  reason: string;
  tags: string[];
}

const DEALS: SharedDeal[] = [
  {
    avatar: '🧔',
    sharer: 'InvestorMike_ATX',
    time: '2h ago',
    propertyName: 'Duplex near Mueller',
    city: 'Austin',
    state: 'TX',
    price: 385000,
    rent: 3200,
    netYield: 5.8,
    reason: 'Great deal but I am maxed out on Austin exposure. 7.2% cap rate.',
    tags: ['Duplex', 'Value-add', 'East Austin'],
  },
  {
    avatar: '👩‍💼',
    sharer: 'ClevelandCashFlow',
    time: '5h ago',
    propertyName: 'Lakewood 3-Unit',
    city: 'Cleveland',
    state: 'OH',
    price: 240000,
    rent: 3100,
    netYield: 8.1,
    reason: 'Seller motivated, accepting below ask. I am pivoting to Columbus market. Solid 8.1% net.',
    tags: ['Multi-family', 'Below market', 'Motivated seller'],
  },
  {
    avatar: '😎',
    sharer: 'SunBeltSam',
    time: '8h ago',
    propertyName: 'Avondale SFH Package (3 homes)',
    city: 'Birmingham',
    state: 'AL',
    price: 310000,
    rent: 3600,
    netYield: 9.2,
    reason: 'Portfolio sale, seller wants one buyer for all 3. Need a JV partner to split. Combined 9.2% net.',
    tags: ['Package deal', 'JV opportunity', 'High yield'],
  },
  {
    avatar: '👩‍💻',
    sharer: 'TriangleTina',
    time: '12h ago',
    propertyName: 'SE Raleigh Triplex',
    city: 'Raleigh',
    state: 'NC',
    price: 420000,
    rent: 4100,
    netYield: 5.4,
    reason: 'Near Dix Park. I went under contract on another property and cant do both. Quick close possible.',
    tags: ['Triplex', 'Near development', 'Quick close'],
  },
  {
    avatar: '👨‍🔧',
    sharer: 'MotorCityInvestor',
    time: '1d ago',
    propertyName: 'Corktown Mixed-Use',
    city: 'Detroit',
    state: 'MI',
    price: 195000,
    rent: 2400,
    netYield: 6.9,
    reason: 'Retail on ground floor, 2 apts above. Michigan Central is 3 blocks away. Needs $30K rehab but ARV is $280K+.',
    tags: ['Mixed-use', 'BRRRR', 'Near Michigan Central'],
  },
  {
    avatar: '🎣',
    sharer: 'BayViewBuyer',
    time: '1d ago',
    propertyName: 'KK Avenue Storefront + 2 Apts',
    city: 'Milwaukee',
    state: 'WI',
    price: 275000,
    rent: 3500,
    netYield: 7.4,
    reason: 'Commercial tenant on 5yr NNN lease. Two apts above rented. Zero management. Retiring from RE, this is my last listing.',
    tags: ['NNN lease', 'Mixed-use', 'Zero management'],
  },
];

function yieldColor(netYield: number): string {
  if (netYield >= 6) return '#22C55E';
  if (netYield >= 4) return '#F59E0B';
  return '#EF4444';
}

function DealCard({ deal, s }: { deal: SharedDeal; s: ThemeStyles }) {
  const [hovered, setHovered] = useState(false);
  const yc = yieldColor(deal.netYield);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: s.card,
        border: `1px solid ${hovered ? s.borderH : s.border}`,
        borderRadius: 12,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'border-color 0.15s',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>{deal.avatar}</span>
          <div>
            <div style={{ fontWeight: 600, color: s.txt, fontSize: 14 }}>{deal.sharer}</div>
            <div style={{ color: s.txt3, fontSize: 12 }}>{deal.time}</div>
          </div>
        </div>
        <div
          style={{
            background: `${yc}1A`,
            color: yc,
            fontWeight: 700,
            fontSize: 13,
            padding: '4px 10px',
            borderRadius: 6,
          }}
        >
          {fmtP(deal.netYield)} net
        </div>
      </div>

      {/* Property info */}
      <div>
        <div style={{ fontWeight: 600, color: s.txt, fontSize: 15 }}>{deal.propertyName}</div>
        <div style={{ color: s.txt2, fontSize: 13, marginTop: 2 }}>
          {deal.city}, {deal.state} &nbsp;&middot;&nbsp; {fmt(deal.price)} &nbsp;&middot;&nbsp; {fmt(deal.rent)}/mo
        </div>
      </div>

      {/* Quote */}
      <div
        style={{
          borderLeft: `3px solid ${s.border}`,
          paddingLeft: 12,
          color: s.txt2,
          fontSize: 13,
          fontStyle: 'italic',
          lineHeight: 1.5,
        }}
      >
        {deal.reason}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {deal.tags.map(tag => (
          <span
            key={tag}
            style={{
              background: s.surf,
              color: s.txt2,
              fontSize: 11,
              padding: '3px 8px',
              borderRadius: 4,
              border: `1px solid ${s.border}`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          style={{
            background: '#22C55E',
            color: '#fff',
            border: 'none',
            borderRadius: 7,
            padding: '7px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Request intro
        </button>
        <button
          style={{
            background: 'transparent',
            color: s.txt,
            border: `1px solid ${s.border}`,
            borderRadius: 7,
            padding: '7px 14px',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Save for later
        </button>
        <button
          style={{
            background: 'transparent',
            color: s.txt2,
            border: `1px solid ${s.border}`,
            borderRadius: 7,
            padding: '7px 14px',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          ↗ Share
        </button>
      </div>
    </div>
  );
}

const STATS = [
  { icon: '👥', value: '2,847', label: 'Active investors', color: undefined },
  { icon: '🏠', value: '412', label: 'Shared deals this week', color: '#22C55E' },
  { icon: '🤝', value: '89', label: 'Partnerships formed', color: '#3B82F6' },
  { icon: '💰', value: '$24.5M', label: 'Deal volume (30d)', color: '#F59E0B' },
];

export default function NetworkTab({ s }: Props) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      {/* Title */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: s.txt, fontSize: 22, fontWeight: 700 }}>Investor Network</h2>
        <p style={{ margin: '6px 0 0', color: s.txt2, fontSize: 14 }}>
          Deals you passed on might be gold for someone else. Share deals, find partners, and build your investor network.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginBottom: 28,
        }}
      >
        {STATS.map(stat => (
          <div
            key={stat.label}
            style={{
              background: s.card,
              border: `1px solid ${s.border}`,
              borderRadius: 10,
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ fontSize: 22 }}>{stat.icon}</div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: stat.color ?? s.txt,
              }}
            >
              {stat.value}
            </div>
            <div style={{ color: s.txt2, fontSize: 13 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Section label */}
      <div style={{ marginBottom: 16, color: s.txt2, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
        Recent shared deals in your markets
      </div>

      {/* Deal cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {DEALS.map(deal => (
          <DealCard key={deal.propertyName} deal={deal} s={s} />
        ))}
      </div>

      {/* CTA */}
      <div
        style={{
          background: s.card,
          border: `1px solid #22C55E`,
          borderRadius: 12,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontWeight: 600, color: s.txt, fontSize: 15 }}>Have a deal to share?</div>
          <div style={{ color: s.txt2, fontSize: 13, marginTop: 4 }}>
            Post it to the network and let another investor run with it.
          </div>
        </div>
        <button
          style={{
            background: '#22C55E',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Share a Deal
        </button>
      </div>
    </div>
  );
}
