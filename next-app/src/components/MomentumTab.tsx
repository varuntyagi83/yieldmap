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

interface MomentumEntry {
  current: number;
  trend: number;
  permits: number;
  newBiz: number;
  popGrowth: number;
  rentGrowth: number;
  crimeDir: 'up' | 'down' | 'flat';
  transitScore: number;
  signals: string[];
  risk: string;
}

const MOMENTUM_DATA: Record<string, MomentumEntry> = {
  Austin: {
    current: 8.2,
    trend: 0.3,
    permits: 847,
    newBiz: 124,
    popGrowth: 2.8,
    rentGrowth: 4.2,
    crimeDir: 'down',
    transitScore: 45,
    signals: ['Tech job inflow from CA', 'New transit line funded', 'East side gentrification accelerating'],
    risk: 'Overheating. Prices may outpace rent growth.',
  },
  Dallas: {
    current: 7.5,
    trend: 0.8,
    permits: 1230,
    newBiz: 189,
    popGrowth: 2.1,
    rentGrowth: 3.8,
    crimeDir: 'flat',
    transitScore: 38,
    signals: ['Corporate relocations driving demand', 'Bishop Arts area rapidly gentrifying', 'Highway expansion improving connectivity'],
    risk: 'Property tax increases could erode yields.',
  },
  Indianapolis: {
    current: 5.8,
    trend: 1.4,
    permits: 412,
    newBiz: 67,
    popGrowth: 0.9,
    rentGrowth: 5.1,
    crimeDir: 'down',
    transitScore: 32,
    signals: ['Fountain Square arts renaissance', 'Cultural Trail driving walkability', 'Undervalued vs peer cities (30-40%)'],
    risk: 'Slower job growth than Sun Belt markets.',
  },
  Cleveland: {
    current: 5.2,
    trend: 1.1,
    permits: 298,
    newBiz: 43,
    popGrowth: -0.2,
    rentGrowth: 4.8,
    crimeDir: 'down',
    transitScore: 40,
    signals: ['Ohio City/Tremont restaurant boom', 'Healthcare sector anchor (Cleveland Clinic)', 'Lakefront development planned'],
    risk: 'Population decline in broader metro.',
  },
  Memphis: {
    current: 4.5,
    trend: 0.6,
    permits: 187,
    newBiz: 31,
    popGrowth: 0.1,
    rentGrowth: 3.2,
    crimeDir: 'flat',
    transitScore: 25,
    signals: ['Cooper Young becoming destination neighborhood', 'FedEx logistics hub expansion', 'Low barrier to entry for investors'],
    risk: 'Higher crime in some areas. Selective buying needed.',
  },
  'Kansas City': {
    current: 6.1,
    trend: 0.9,
    permits: 356,
    newBiz: 58,
    popGrowth: 0.7,
    rentGrowth: 4.0,
    crimeDir: 'down',
    transitScore: 30,
    signals: ['Westport/Crossroads area revitalization', 'Affordable vs coastal markets', 'Google Fiber driving tech migration'],
    risk: 'Missouri/Kansas border taxation complexity.',
  },
  Phoenix: {
    current: 7.8,
    trend: 0.2,
    permits: 1580,
    newBiz: 215,
    popGrowth: 3.1,
    rentGrowth: 2.9,
    crimeDir: 'flat',
    transitScore: 35,
    signals: ['Massive population inflow from CA', 'TSMC semiconductor plant jobs', 'Arcadia area premium appreciation'],
    risk: 'Water supply long-term concern. Cooling price growth.',
  },
  Atlanta: {
    current: 7.4,
    trend: 0.7,
    permits: 892,
    newBiz: 143,
    popGrowth: 1.8,
    rentGrowth: 3.9,
    crimeDir: 'down',
    transitScore: 48,
    signals: ['BeltLine driving massive appreciation along route', 'Film industry expansion', 'EAV and Kirkwood next wave neighborhoods'],
    risk: 'Traffic congestion affecting livability scores.',
  },
  Pittsburgh: {
    current: 5.9,
    trend: 1.2,
    permits: 267,
    newBiz: 45,
    popGrowth: 0.3,
    rentGrowth: 4.5,
    crimeDir: 'down',
    transitScore: 52,
    signals: ['Robotics/AI hub (CMU/Uber)', 'Lawrenceville nationally ranked neighborhood', 'Healthcare/education economy is recession-proof'],
    risk: 'High property taxes. Population aging.',
  },
  Charlotte: {
    current: 6.8,
    trend: 1.0,
    permits: 520,
    newBiz: 92,
    popGrowth: 2.2,
    rentGrowth: 4.3,
    crimeDir: 'down',
    transitScore: 35,
    signals: ['Banking hub driving steady job growth', 'NoDa arts district revitalization', 'Light rail expansion planned'],
    risk: 'Insurance costs rising. Market heating fast.',
  },
  Raleigh: {
    current: 7.1,
    trend: 0.6,
    permits: 567,
    newBiz: 87,
    popGrowth: 2.4,
    rentGrowth: 3.6,
    crimeDir: 'down',
    transitScore: 30,
    signals: ['Research Triangle tech jobs engine', 'Dix Park development catalyzing SE Raleigh', 'Top 5 US metro for job growth'],
    risk: 'Appreciation may slow as prices catch up to demand.',
  },
  Nashville: {
    current: 7.2,
    trend: 0.5,
    permits: 678,
    newBiz: 105,
    popGrowth: 2.3,
    rentGrowth: 3.5,
    crimeDir: 'flat',
    transitScore: 28,
    signals: ['No state income tax advantage', 'Music/tech hybrid economy', 'Germantown and East Nashville gentrifying'],
    risk: 'Short-term rental restrictions tightening.',
  },
  Tampa: {
    current: 6.9,
    trend: 0.6,
    permits: 590,
    newBiz: 98,
    popGrowth: 2.0,
    rentGrowth: 3.3,
    crimeDir: 'down',
    transitScore: 26,
    signals: ['No state income tax', 'Remote worker influx post-COVID', 'Ybor City arts renaissance'],
    risk: 'Hurricane insurance costs surging.',
  },
  Detroit: {
    current: 3.8,
    trend: 2.1,
    permits: 324,
    newBiz: 52,
    popGrowth: 0.2,
    rentGrowth: 6.8,
    crimeDir: 'down',
    transitScore: 35,
    signals: ['Michigan Central Station (Ford) transformative', 'Highest rent growth in dataset', 'Corktown becoming national destination'],
    risk: 'High property taxes. Selective buying critical.',
  },
  Milwaukee: {
    current: 5.0,
    trend: 0.9,
    permits: 213,
    newBiz: 34,
    popGrowth: 0.1,
    rentGrowth: 4.2,
    crimeDir: 'flat',
    transitScore: 42,
    signals: ['Bay View trending nationally', 'Lakefront development pipeline', 'Strong rental demand from Marquette/UWM students'],
    risk: 'Highest property taxes in Wisconsin. Factor into yield.',
  },
};

function crimeLabel(dir: 'up' | 'down' | 'flat'): { text: string; color: string } {
  if (dir === 'down') return { text: 'Falling', color: '#22C55E' };
  if (dir === 'up') return { text: 'Rising', color: '#EF4444' };
  return { text: 'Flat', color: '#F59E0B' };
}

interface CityCardProps {
  city: string;
  data: MomentumEntry;
  rank: number;
  inResults: boolean;
  s: ThemeStyles;
}

function CityCard({ city, data, rank, inResults, s }: CityCardProps) {
  const isHot = data.trend >= 1.5;
  const crime = crimeLabel(data.crimeDir);

  return (
    <div
      style={{
        background: s.card,
        border: `1px solid ${inResults ? 'rgba(34,197,94,0.3)' : s.border}`,
        borderRadius: 12,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ color: s.txt3, fontSize: 13, fontWeight: 600 }}>#{rank}</span>
        <span style={{ fontWeight: 700, color: s.txt, fontSize: 16 }}>{city}</span>
        {isHot && (
          <span
            style={{
              background: 'rgba(239,68,68,0.15)',
              color: '#EF4444',
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 4,
              letterSpacing: 0.5,
            }}
          >
            HOT
          </span>
        )}
        {inResults && (
          <span
            style={{
              background: 'rgba(34,197,94,0.12)',
              color: '#22C55E',
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            In your results
          </span>
        )}
      </div>

      {/* Score badges */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div
          style={{
            background: s.surf,
            border: `1px solid ${s.border}`,
            borderRadius: 8,
            padding: '8px 14px',
            textAlign: 'center',
          }}
        >
          <div style={{ color: s.txt3, fontSize: 11, marginBottom: 2 }}>Score</div>
          <div style={{ color: s.txt, fontWeight: 700, fontSize: 18 }}>{data.current}</div>
        </div>
        <div
          style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 8,
            padding: '8px 14px',
            textAlign: 'center',
          }}
        >
          <div style={{ color: s.txt3, fontSize: 11, marginBottom: 2 }}>Trend</div>
          <div style={{ color: '#22C55E', fontWeight: 700, fontSize: 18 }}>+{data.trend}/yr</div>
        </div>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}
      >
        <div style={{ background: s.surf, borderRadius: 7, padding: '8px 10px' }}>
          <div style={{ color: s.txt3, fontSize: 11 }}>🏗️ Permits</div>
          <div style={{ color: s.txt, fontWeight: 600, fontSize: 13, marginTop: 2 }}>{data.permits.toLocaleString()}</div>
        </div>
        <div style={{ background: s.surf, borderRadius: 7, padding: '8px 10px' }}>
          <div style={{ color: s.txt3, fontSize: 11 }}>🏢 New biz</div>
          <div style={{ color: s.txt, fontWeight: 600, fontSize: 13, marginTop: 2 }}>{data.newBiz}</div>
        </div>
        <div style={{ background: s.surf, borderRadius: 7, padding: '8px 10px' }}>
          <div style={{ color: s.txt3, fontSize: 11 }}>📈 Pop growth</div>
          <div
            style={{
              color: data.popGrowth < 0 ? '#EF4444' : s.txt,
              fontWeight: 600,
              fontSize: 13,
              marginTop: 2,
            }}
          >
            {data.popGrowth > 0 ? '+' : ''}{data.popGrowth}%
          </div>
        </div>
        <div style={{ background: s.surf, borderRadius: 7, padding: '8px 10px' }}>
          <div style={{ color: s.txt3, fontSize: 11 }}>💵 Rent growth</div>
          <div style={{ color: s.txt, fontWeight: 600, fontSize: 13, marginTop: 2 }}>+{data.rentGrowth}%</div>
        </div>
        <div style={{ background: s.surf, borderRadius: 7, padding: '8px 10px' }}>
          <div style={{ color: s.txt3, fontSize: 11 }}>🚨 Crime</div>
          <div style={{ color: crime.color, fontWeight: 600, fontSize: 13, marginTop: 2 }}>{crime.text}</div>
        </div>
        <div style={{ background: s.surf, borderRadius: 7, padding: '8px 10px' }}>
          <div style={{ color: s.txt3, fontSize: 11 }}>🚌 Transit</div>
          <div style={{ color: s.txt, fontWeight: 600, fontSize: 13, marginTop: 2 }}>{data.transitScore}/100</div>
        </div>
      </div>

      {/* Signals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {data.signals.map(sig => (
          <div key={sig} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
            <span style={{ color: '#22C55E', fontSize: 12, marginTop: 1, flexShrink: 0 }}>●</span>
            <span style={{ color: s.txt2, fontSize: 13, lineHeight: 1.4 }}>{sig}</span>
          </div>
        ))}
      </div>

      {/* Risk */}
      <div
        style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 7,
          padding: '8px 12px',
          color: '#F59E0B',
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        <span style={{ fontWeight: 600 }}>Risk: </span>{data.risk}
      </div>
    </div>
  );
}

export default function MomentumTab({ listings, s }: Props) {
  // Extract unique base city names from listings (first word of city field)
  const listingCities = new Set(
    listings.map(l => l.city.split(',')[0].trim().split(' ')[0])
  );

  // Find which MOMENTUM_DATA keys match listing cities
  // More robust: check if any listing city starts with the key
  const matchedKeys = new Set<string>();
  for (const city of listingCities) {
    for (const key of Object.keys(MOMENTUM_DATA)) {
      if (key.toLowerCase() === city.toLowerCase() || city.toLowerCase().startsWith(key.toLowerCase())) {
        matchedKeys.add(key);
      }
    }
  }

  const allKeys = Object.keys(MOMENTUM_DATA);

  // Separate into matched (in results) and unmatched
  const inResults = allKeys.filter(k => matchedKeys.has(k));
  const notInResults = allKeys.filter(k => !matchedKeys.has(k));

  // Sort each group by trend desc
  const byTrendDesc = (a: string, b: string) => MOMENTUM_DATA[b].trend - MOMENTUM_DATA[a].trend;
  const sorted = [...inResults.sort(byTrendDesc), ...notInResults.sort(byTrendDesc)];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, color: s.txt, fontSize: 22, fontWeight: 700 }}>Neighborhood Momentum</h2>
        <p style={{ margin: '6px 0 0', color: s.txt2, fontSize: 14 }}>
          Static scores tell you where a neighborhood is today. Momentum tells you where it is going. A 4/10 trending up is worth more than a 7/10 trending flat.
        </p>
      </div>

      {/* Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 16,
        }}
      >
        {sorted.map((city, idx) => (
          <CityCard
            key={city}
            city={city}
            data={MOMENTUM_DATA[city]}
            rank={idx + 1}
            inResults={matchedKeys.has(city)}
            s={s}
          />
        ))}
      </div>
    </div>
  );
}
