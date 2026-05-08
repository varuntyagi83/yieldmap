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

interface Provider {
  name: string;
  desc: string;
  savings: string;
  tags: string[];
  rating: number;
  reviews: number;
}

interface Category {
  name: string;
  icon: string;
  color: string;
  providers: Provider[];
}

const CATEGORIES: Category[] = [
  {
    name: 'Acquisition & Closing',
    icon: '🏠',
    color: '#22C55E',
    providers: [
      {
        name: 'Investor-Friendly Lenders',
        desc: 'DSCR loans, portfolio lenders, hard money for BRRRR. Pre-approval in 48hrs.',
        savings: 'Save 0.25-0.5% on rate vs retail banks',
        tags: ['DSCR', 'Portfolio', 'Hard money'],
        rating: 4.8,
        reviews: 312,
      },
      {
        name: 'Title & Escrow',
        desc: 'Investor-specialized title companies. Bulk closing discounts for repeat buyers.',
        savings: 'Save $500-1,200 per closing',
        tags: ['Bulk discount', 'Fast close'],
        rating: 4.7,
        reviews: 189,
      },
      {
        name: 'Real Estate Attorneys',
        desc: 'Entity structuring, LLC formation, 1031 exchange specialists.',
        savings: 'Tax savings of $2K-20K/yr',
        tags: ['LLC', '1031', 'Asset protection'],
        rating: 4.9,
        reviews: 156,
      },
      {
        name: 'Home Inspectors',
        desc: 'Investment-focused inspectors who estimate repair costs, not just flag issues.',
        savings: 'Avoid $5K-50K surprise repairs',
        tags: ['Cost estimates', 'Investor focus'],
        rating: 4.6,
        reviews: 243,
      },
    ],
  },
  {
    name: 'Property Management',
    icon: '💼',
    color: '#3B82F6',
    providers: [
      {
        name: 'Full-Service PM',
        desc: 'Tenant placement, rent collection, maintenance coordination, evictions. 8-10% of rent.',
        savings: 'Save 15-20hrs/month per property',
        tags: ['Full service', 'Tenant placement', 'Maintenance'],
        rating: 4.5,
        reviews: 428,
      },
      {
        name: 'Tenant Screening',
        desc: 'Background checks, credit reports, eviction history, income verification. Per-applicant pricing.',
        savings: 'Reduce bad tenant risk by 70%',
        tags: ['Background check', 'Credit', 'Income verify'],
        rating: 4.7,
        reviews: 567,
      },
      {
        name: 'Rent Collection Tech',
        desc: 'Online rent collection with autopay, late fee automation, and accounting sync.',
        savings: 'Reduce late payments by 40%',
        tags: ['Autopay', 'Late fees', 'Accounting'],
        rating: 4.8,
        reviews: 892,
      },
      {
        name: 'Eviction Services',
        desc: 'Legal eviction processing, court filing, tenant removal coordination.',
        savings: 'Resolve 3x faster than DIY',
        tags: ['Legal', 'Court filing', 'Removal'],
        rating: 4.4,
        reviews: 134,
      },
    ],
  },
  {
    name: 'Renovation & Contractors',
    icon: '🔨',
    color: '#F59E0B',
    providers: [
      {
        name: 'General Contractors',
        desc: 'Investor-friendly GCs who understand rental-grade vs owner-occupied finishes. Fixed bids.',
        savings: 'Save 20-35% vs owner-occupied quality',
        tags: ['Fixed bid', 'Rental grade', 'Fast turnaround'],
        rating: 4.5,
        reviews: 267,
      },
      {
        name: 'Kitchen & Bath Refresh',
        desc: 'Cabinet refacing, countertop overlays, reglazing. Rent-ready in days, not weeks.',
        savings: '$3-6K vs $15-25K full remodel',
        tags: ['Quick turn', 'Budget friendly'],
        rating: 4.6,
        reviews: 198,
      },
      {
        name: 'Turnkey Renovation',
        desc: 'Full property rehab packages with guaranteed timeline and budget. Ideal for BRRRR.',
        savings: 'Guaranteed budget, no surprises',
        tags: ['BRRRR', 'Full rehab', 'Guaranteed'],
        rating: 4.3,
        reviews: 89,
      },
      {
        name: 'Handyman Networks',
        desc: 'On-demand handyman for small repairs, turnovers, and maintenance. Per-task pricing.',
        savings: 'Save $50-100/hr vs licensed specialists',
        tags: ['On-demand', 'Small repairs', 'Turnovers'],
        rating: 4.4,
        reviews: 534,
      },
    ],
  },
  {
    name: 'Utilities & Energy',
    icon: '⚡',
    color: '#8B5CF6',
    providers: [
      {
        name: 'Utility Setup & Transfer',
        desc: 'Automated utility transfers between tenants. Never pay a vacant unit utility bill again.',
        savings: 'Save $200-500 per turnover',
        tags: ['Auto transfer', 'No gaps'],
        rating: 4.7,
        reviews: 345,
      },
      {
        name: 'Solar Installation',
        desc: 'Solar lease or PPA programs for rental properties. Offset common area electric costs.',
        savings: 'Reduce electric 40-60%',
        tags: ['Solar', 'PPA', 'No upfront cost'],
        rating: 4.5,
        reviews: 167,
      },
      {
        name: 'Smart Home / Submetering',
        desc: 'RUBS (ratio utility billing) and submetering to pass utility costs to tenants legally.',
        savings: 'Recover $100-300/unit/month',
        tags: ['RUBS', 'Submetering', 'Cost recovery'],
        rating: 4.6,
        reviews: 213,
      },
      {
        name: 'Energy Audits',
        desc: 'Free or low-cost energy audits with utility rebate identification.',
        savings: 'Identify $500-2K/yr in savings',
        tags: ['Free audit', 'Rebates', 'Insulation'],
        rating: 4.4,
        reviews: 178,
      },
    ],
  },
  {
    name: 'Insurance & Risk',
    icon: '🛡️',
    color: '#EC4899',
    providers: [
      {
        name: 'Landlord Insurance',
        desc: 'Investor-specific policies: loss of rent coverage, liability, umbrella. Multi-property discounts.',
        savings: 'Save 15-25% with investor policies',
        tags: ['Multi-property', 'Loss of rent', 'Umbrella'],
        rating: 4.6,
        reviews: 289,
      },
      {
        name: 'Rent Guarantee Insurance',
        desc: 'Covers up to 12 months rent if tenant defaults. Eliminates vacancy risk.',
        savings: 'Guarantee $12-60K in annual rent',
        tags: ['Rent guarantee', '12 months'],
        rating: 4.3,
        reviews: 112,
      },
      {
        name: 'Home Warranty (Rentals)',
        desc: 'Appliance and systems warranty designed for rental properties. Cap repair costs.',
        savings: 'Cap repairs at $75-150/call',
        tags: ['Appliances', 'HVAC', 'Plumbing'],
        rating: 4.1,
        reviews: 456,
      },
    ],
  },
  {
    name: 'Tax & Accounting',
    icon: '📊',
    color: '#14B8A6',
    providers: [
      {
        name: 'RE-Specialized CPAs',
        desc: 'Cost segregation, depreciation optimization, 1031 exchange planning, entity structuring.',
        savings: 'Save $3K-15K/yr in taxes',
        tags: ['Cost seg', 'Depreciation', '1031'],
        rating: 4.8,
        reviews: 234,
      },
      {
        name: 'Bookkeeping for Landlords',
        desc: 'Monthly P&L per property, Schedule E prep, expense categorization. From $50/property/month.',
        savings: 'Save 5-10hrs/month',
        tags: ['Per property P&L', 'Schedule E'],
        rating: 4.6,
        reviews: 378,
      },
      {
        name: 'Cost Segregation Studies',
        desc: 'Accelerate depreciation to front-load tax deductions. ROI typically 5-10x study cost.',
        savings: 'Accelerate $20-100K in deductions',
        tags: ['Accelerated depreciation', 'Year 1 deductions'],
        rating: 4.7,
        reviews: 98,
      },
    ],
  },
  {
    name: 'Financing & Refinance',
    icon: '🏦',
    color: '#F97316',
    providers: [
      {
        name: 'Cash-Out Refinance',
        desc: 'Pull equity to fund next acquisition. BRRRR strategy specialists. 30-day close.',
        savings: 'Recycle capital for next deal',
        tags: ['Cash-out', 'BRRRR', 'Fast close'],
        rating: 4.5,
        reviews: 267,
      },
      {
        name: 'Portfolio Lenders',
        desc: 'Blanket loans across multiple properties. Simplified financing for 5+ properties.',
        savings: 'One payment, lower total rate',
        tags: ['Blanket loan', '5+ properties'],
        rating: 4.4,
        reviews: 145,
      },
      {
        name: 'Hard Money / Bridge',
        desc: 'Short-term financing for acquisitions and rehabs. Close in 7-14 days.',
        savings: 'Win deals with speed',
        tags: ['7-day close', 'Rehab funding'],
        rating: 4.3,
        reviews: 198,
      },
    ],
  },
];

function StarRating({ rating, s }: { rating: number; s: ThemeStyles }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span style={{ color: '#F59E0B', fontSize: 12 }}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
      <span style={{ color: s.txt2, marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

function ProviderCard({ provider, s }: { provider: Provider; s: ThemeStyles }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: s.card,
        border: `1px solid ${hovered ? s.borderH : s.border}`,
        borderRadius: 10,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'border-color 0.15s',
      }}
    >
      <div style={{ fontWeight: 600, color: s.txt, fontSize: 14 }}>{provider.name}</div>
      <div style={{ color: s.txt2, fontSize: 13, lineHeight: 1.5 }}>{provider.desc}</div>
      <div
        style={{
          background: 'rgba(34,197,94,0.1)',
          color: '#22C55E',
          fontSize: 12,
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: 6,
          alignSelf: 'flex-start',
        }}
      >
        {provider.savings}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {provider.tags.map(tag => (
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <StarRating rating={provider.rating} s={s} />
        <span style={{ color: s.txt3, fontSize: 12 }}>({provider.reviews} reviews)</span>
      </div>
    </div>
  );
}

export default function ServicesTab({ s }: Props) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, color: s.txt, fontSize: 22, fontWeight: 700 }}>Services Marketplace</h2>
        <p style={{ margin: '6px 0 0', color: s.txt2, fontSize: 14 }}>
          Vetted providers for every stage of the investor lifecycle. Save money, increase yield, reduce risk.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {CATEGORIES.map(cat => (
          <div key={cat.name}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 20 }}>{cat.icon}</span>
              <h3
                style={{
                  margin: 0,
                  color: cat.color,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {cat.name}
              </h3>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 14,
              }}
            >
              {cat.providers.map(p => (
                <ProviderCard key={p.name} provider={p} s={s} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
