'use client';
import { useState } from 'react';

interface TestResult {
  zip: string;
  listingCount?: number;
  avgRent?: number;
  error?: string;
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  async function testZip(zip: string) {
    setLoading(zip);
    try {
      const [listRes, mktRes] = await Promise.all([
        fetch(`/api/rentcast/listings?zipCode=${zip}&limit=10`),
        fetch(`/api/rentcast/market?zipCode=${zip}`),
      ]);

      const listings = await listRes.json();
      const market = await mktRes.json();

      const listingCount = Array.isArray(listings) ? listings.length : (listings?.listings?.length ?? 0);
      const avgRent = market?.rentalData?.averageRent ?? market?.averageRent ?? market?.rentData?.averageRent;

      if (listings.error) {
        setResults(prev => [...prev, { zip, error: listings.error }]);
      } else {
        setResults(prev => [...prev, { zip, listingCount, avgRent }]);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setResults(prev => [...prev, { zip, error: message }]);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: 40, background: '#0B0F14', minHeight: '100vh', color: '#EEF0F4' }}>
      <h1 style={{ fontSize: 24, marginBottom: 24, color: '#22C55E' }}>RentCast API Test</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        {['27253', '75409'].map(zip => (
          <button
            key={zip}
            onClick={() => testZip(zip)}
            disabled={loading === zip}
            style={{ padding: '10px 20px', background: '#22C55E', color: '#0B0F14', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', opacity: loading === zip ? 0.6 : 1 }}
          >
            {loading === zip ? `Testing ${zip}...` : `Test ${zip}`}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {results.map((r, i) => (
          <div key={i} style={{ padding: 16, background: '#111820', borderRadius: 8, border: `1px solid ${r.error ? '#EF4444' : '#22C55E'}40` }}>
            {r.error ? (
              <span style={{ color: '#EF4444' }}>❌ {r.zip}: {r.error}</span>
            ) : (
              <span style={{ color: '#22C55E' }}>
                ✅ {r.zip}: Found {r.listingCount} listings · avg rent {r.avgRent ? `$${r.avgRent.toLocaleString()}` : 'N/A'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
