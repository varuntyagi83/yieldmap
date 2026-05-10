'use client';

import { EnrichedListing } from '@/lib/types';
import { ThemeStyles } from '@/lib/theme';

interface Props {
  listing: EnrichedListing;
  marketAvgPricePerSqft: number;
  s: ThemeStyles;
}

interface Signal {
  color: string;
  text: string;
}

export default function NegotiationInsights({ listing, marketAvgPricePerSqft, s }: Props) {
  const signals: Signal[] = [];

  // 1. DOM signal
  const dom = listing.daysOnMarket;
  if (dom !== undefined && dom !== null) {
    if (dom > 60) {
      signals.push({ color: '#22C55E', text: `Listed ${dom}d — sellers likely open to below-ask offers` });
    } else if (dom >= 30) {
      signals.push({ color: '#F59E0B', text: `Listed ${dom}d — some negotiation room possible` });
    } else {
      signals.push({ color: '#EF4444', text: `Listed ${dom}d — fresh listing, may resist discounts` });
    }
  }

  // 2. Price per sqft signal
  if (marketAvgPricePerSqft > 0 && listing.squareFootage > 0) {
    const listingPpsf = listing.price / listing.squareFootage;
    const diffPct = ((listingPpsf - marketAvgPricePerSqft) / marketAvgPricePerSqft) * 100;
    if (diffPct > 10) {
      signals.push({
        color: '#F59E0B',
        text: `Priced ${diffPct.toFixed(0)}% above zip avg/sqft — potentially overpriced`,
      });
    } else {
      signals.push({
        color: '#22C55E',
        text: 'Priced near zip avg/sqft — fair market pricing',
      });
    }
  }

  // 3. Discount signal
  const disc = listing.discountFromAsk;
  if (disc < 3) {
    signals.push({ color: '#22C55E', text: `Only ${disc.toFixed(1)}% discount needed — tight but negotiable` });
  } else if (disc <= 7) {
    signals.push({ color: '#F59E0B', text: `${disc.toFixed(1)}% discount needed — possible with motivated seller` });
  } else {
    signals.push({ color: '#F97316', text: `${disc.toFixed(1)}% discount needed — needs strong justification (DOM, condition)` });
  }

  return (
    <div
      style={{
        background: s.surf,
        border: `1px solid ${s.border}`,
        borderRadius: 8,
        padding: 12,
      }}
    >
      {/* Header */}
      <div
        style={{
          color: s.txt2,
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 8,
        }}
      >
        Negotiation Signals
      </div>

      {/* Bullets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {signals.map((sig, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 7,
              lineHeight: 1.6,
            }}
          >
            <span
              style={{
                color: sig.color,
                fontSize: 9,
                marginTop: 3,
                flexShrink: 0,
              }}
            >
              &#9679;
            </span>
            <span style={{ color: s.txt, fontSize: 12, lineHeight: 1.6 }}>
              {sig.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
