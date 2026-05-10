'use client';

import { useState } from 'react';
import { EnrichedListing } from '@/lib/types';
import { ThemeStyles } from '@/lib/theme';

interface Props {
  boundary: EnrichedListing[];
  onSelect: (listing: EnrichedListing) => void;
  s: ThemeStyles;
}

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

function negotiabilityBadge(neg: EnrichedListing['negotiability']): { label: string; bg: string; color: string } {
  switch (neg) {
    case 'easy':
      return { label: 'Easy', bg: 'rgba(34,197,94,0.15)', color: '#22C55E' };
    case 'moderate':
      return { label: 'Moderate', bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' };
    case 'hard':
      return { label: 'Hard', bg: 'rgba(239,68,68,0.15)', color: '#EF4444' };
    case 'unrealistic':
      return { label: 'Unrealistic', bg: 'rgba(139,92,246,0.15)', color: '#A78BFA' };
  }
}

interface BoundaryCardProps {
  listing: EnrichedListing;
  onSelect: (listing: EnrichedListing) => void;
  s: ThemeStyles;
}

function BoundaryCard({ listing, onSelect, s }: BoundaryCardProps) {
  const [hovered, setHovered] = useState(false);
  const dom = listing.daysOnMarket ?? 0;
  const badge = negotiabilityBadge(listing.negotiability);

  const netYieldAtOffer =
    listing.maxOfferPrice && listing.maxOfferPrice < listing.price
      ? listing.yield.netYield * (listing.price / listing.maxOfferPrice)
      : listing.yield.netYield;

  const cashFlowAtOffer =
    listing.maxOfferPrice && listing.maxOfferPrice < listing.price
      ? listing.yield.monthlyCashFlow +
        ((listing.price - listing.maxOfferPrice) * 0.25 * (listing.maxOfferPrice > 0 ? (listing.price / listing.maxOfferPrice - 1) : 0)) /
          12
      : listing.yield.monthlyCashFlow;

  // Simpler approximation: show discountFromAsk info if maxOfferPrice missing
  const showOfferLine = listing.maxOfferPrice !== null && listing.maxOfferPrice > 0;

  return (
    <div
      onClick={() => onSelect(listing)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: s.card,
        border: `1px solid ${hovered ? s.borderH : s.border}`,
        borderRadius: 12,
        padding: '16px 18px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'border-color 0.15s ease',
      }}
    >
      {/* Address */}
      <div
        style={{
          color: s.txt,
          fontWeight: 600,
          fontSize: 14,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {listing.formattedAddress}
      </div>

      {/* Price row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ color: s.txt2, fontSize: 13 }}>
          Ask: <span style={{ color: s.txt, fontWeight: 600 }}>{fmt(listing.price)}</span>
        </span>
        {listing.maxOfferPrice && listing.maxOfferPrice > 0 && (
          <>
            <span style={{ color: s.txt3, fontSize: 12 }}>&#8594;</span>
            <span style={{ color: s.txt2, fontSize: 13 }}>
              Max offer: <span style={{ color: s.txt, fontWeight: 600 }}>{fmt(listing.maxOfferPrice)}</span>
            </span>
          </>
        )}
        <span
          style={{
            background: badge.bg,
            color: badge.color,
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 4,
            letterSpacing: 0.3,
          }}
        >
          {listing.discountFromAsk > 0 ? `${listing.discountFromAsk.toFixed(1)}% below ask` : 'At ask'}
          {' '}&#183; {badge.label}
        </span>
      </div>

      {/* Mini stats */}
      <div style={{ display: 'flex', gap: 10, color: s.txt2, fontSize: 12 }}>
        {listing.bedrooms > 0 && <span>{listing.bedrooms} bd</span>}
        {listing.bathrooms > 0 && <span>{listing.bathrooms} ba</span>}
        {listing.squareFootage > 0 && <span>{listing.squareFootage.toLocaleString()} sqft</span>}
      </div>

      {/* Yield at offer */}
      <div
        style={{
          color: '#22C55E',
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {showOfferLine
          ? `At max offer — Net yield: ${netYieldAtOffer.toFixed(1)}% · CF: ${cashFlowAtOffer >= 0 ? '+' : ''}${fmt(cashFlowAtOffer)}/mo`
          : `${listing.discountFromAsk.toFixed(1)}% below ask → qualifies`}
      </div>

      {/* DOM badge */}
      {dom > 30 && (
        <div style={{ display: 'flex' }}>
          <span
            style={{
              background: 'rgba(245,158,11,0.12)',
              color: '#F59E0B',
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            {dom}d on market
          </span>
        </div>
      )}
    </div>
  );
}

export default function BoundaryPropertiesSection({ boundary, onSelect, s }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (boundary.length === 0) return null;

  return (
    <div
      style={{
        background: s.card,
        border: `1px solid ${s.border}`,
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      {/* Collapsible header */}
      <div
        onClick={() => setExpanded(prev => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: s.txt, fontWeight: 700, fontSize: 15 }}>
            &#128310; {boundary.length} Boundary {boundary.length === 1 ? 'Property' : 'Properties'}
          </span>
          <span style={{ color: s.txt2, fontSize: 12 }}>
            within 10% of qualifying — negotiation candidates
          </span>
        </div>
        <span style={{ color: s.txt3, fontSize: 16, lineHeight: 1 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {/* Expanded grid */}
      {expanded && (
        <div
          style={{
            padding: '0 18px 18px',
            borderTop: `1px solid ${s.border}`,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 14,
              marginTop: 16,
            }}
          >
            {boundary.map(listing => (
              <BoundaryCard
                key={listing.id}
                listing={listing}
                onSelect={onSelect}
                s={s}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
