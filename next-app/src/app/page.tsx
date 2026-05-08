'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { DiscoveryResult, EnrichedListing, InvestorProfile, DEFAULT_PROFILE } from '@/lib/types';
import { discoverProperties } from '@/lib/discovery-engine';
import { enrichListing } from '@/lib/yield-engine';
import { applyFilters, Filters, DEFAULT_FILTERS } from '@/components/FilterSidebar';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import FilterImpactBanner from '@/components/FilterImpactBanner';
import InvestorProfilePopover from '@/components/InvestorProfilePopover';
import PropertyDetailPanel from '@/components/PropertyDetailPanel';
import CompareTable from '@/components/CompareTable';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function HomePage() {
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentZip, setCurrentZip] = useState<string>();
  const [profile, setProfile] = useState<InvestorProfile>(DEFAULT_PROFILE);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<EnrichedListing | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'compare'>('map');
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(zip: string) {
    setLoading(true);
    setCurrentZip(zip);
    setError(null);
    setSelected(null);
    try {
      const data = await discoverProperties(zip, profile);
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  // Re-enrich qualifying list when profile changes (client-side, no API call)
  const reEnrichedResult = useMemo(() => {
    if (!result) return null;
    const allListings = [...result.qualifying, ...result.nonQualifying];
    const reEnriched = allListings.map(l => enrichListing(l, profile));
    const qualifying = reEnriched.filter(l => l.qualifies).sort((a, b) => b.yield.netYield - a.yield.netYield);
    const nonQualifying = reEnriched.filter(l => !l.qualifies);
    return { ...result, qualifying, nonQualifying, qualifyingCount: qualifying.length };
  }, [result, profile]);

  const displayed = useMemo(() => {
    if (!reEnrichedResult) return [];
    return applyFilters(reEnrichedResult.qualifying, filters);
  }, [reEnrichedResult, filters]);

  const maxPrice = useMemo(() => {
    if (!reEnrichedResult) return 5000000;
    return Math.max(...reEnrichedResult.qualifying.map((l: EnrichedListing) => l.price), 1000000);
  }, [reEnrichedResult]);

  const centerLat = reEnrichedResult?.qualifying[0]?.latitude;
  const centerLng = reEnrichedResult?.qualifying[0]?.longitude;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0B0F14]">
      {/* Header */}
      <header className="h-14 flex items-center gap-4 px-4 border-b border-white/7 bg-[#111820] flex-shrink-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-[#22C55E] rounded-md flex items-center justify-center text-[#0B0F14] font-black text-sm">Y</div>
          <span className="font-bold text-[#EEF0F4] text-sm tracking-tight">YieldMap</span>
        </div>

        {/* Search bar — center */}
        <div className="flex-1 max-w-lg mx-auto">
          <SearchBar onSearch={handleSearch} loading={loading} currentZip={currentZip} />
        </div>

        {/* Right: tab + profile */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {result && (
            <div className="flex bg-[#0B0F14] rounded-lg p-0.5 border border-white/7">
              {(['map', 'compare'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === tab ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'text-[#8A94A6] hover:text-[#EEF0F4]'}`}>
                  {tab === 'map' ? '🗺 Map' : '📊 Compare'}
                </button>
              ))}
            </div>
          )}
          <InvestorProfilePopover profile={profile} onChange={setProfile} />
        </div>
      </header>

      {/* Filter impact banner */}
      {reEnrichedResult && (
        <FilterImpactBanner result={reEnrichedResult} />
      )}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — only when there are results */}
        {reEnrichedResult && (
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            maxPriceInData={maxPrice}
            shownCount={displayed.length}
            totalQualifying={reEnrichedResult.qualifyingCount}
          />
        )}

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Empty / loading states */}
          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 p-8">
              <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center text-3xl">🏘</div>
              <div className="text-lg font-semibold text-[#EEF0F4]">Search a zip code to discover deals</div>
              <div className="text-sm text-[#8A94A6] max-w-sm">YieldMap filters hundreds of MLS listings down to the handful that actually cash-flow at your investment profile.</div>
              <div className="flex gap-2 mt-2">
                {['75409', '27253'].map(zip => (
                  <button key={zip} onClick={() => handleSearch(zip)}
                    className="px-4 py-2 text-xs font-semibold bg-[#111820] border border-white/10 rounded-lg text-[#8A94A6] hover:border-white/20 hover:text-[#EEF0F4] transition-colors">
                    Try {zip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-2 border-[#22C55E]/30 border-t-[#22C55E] rounded-full animate-spin" />
              <div className="text-sm text-[#8A94A6]">Analyzing {currentZip}…</div>
            </div>
          )}

          {error && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
              <div className="text-3xl">⚠️</div>
              <div className="text-sm font-medium text-[#EEF0F4]">Search failed</div>
              <div className="text-xs text-[#EF4444]">{error}</div>
            </div>
          )}

          {/* Map view */}
          {reEnrichedResult && !loading && activeTab === 'map' && (
            <>
              <div className="flex-1">
                <MapView
                  qualifying={displayed}
                  nonQualifying={showAll ? reEnrichedResult.nonQualifying : []}
                  showAll={showAll}
                  onSelect={setSelected}
                  selectedId={selected?.id}
                  centerLat={centerLat}
                  centerLng={centerLng}
                />
              </div>
              {/* Show all toggle */}
              <div className="absolute bottom-4 left-4 z-10">
                <button onClick={() => setShowAll(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#111820] border border-white/10 rounded-lg text-xs font-medium text-[#8A94A6] hover:border-white/20 hover:text-[#EEF0F4] transition-colors">
                  <span className={`w-3 h-3 rounded-full border ${showAll ? 'bg-[#22C55E] border-[#22C55E]' : 'border-[#8A94A6]'}`} />
                  Show all listings
                </button>
              </div>
              {/* Status bar */}
              {displayed.length > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-2 bg-[#111820]/90 border border-white/10 rounded-full text-xs text-[#8A94A6] backdrop-blur-sm whitespace-nowrap">
                    Showing {displayed.length} qualifying
                    {displayed.length > 0 && ` · avg yield ${(displayed.reduce((s, l) => s + l.yield.netYield, 0) / displayed.length).toFixed(1)}%`}
                    {displayed.length > 0 && ` · best ${Math.max(...displayed.map(l => l.yield.netYield)).toFixed(1)}%`}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Compare table view */}
          {reEnrichedResult && !loading && activeTab === 'compare' && (
            <CompareTable
              listings={displayed}
              onSelect={l => { setSelected(l); setActiveTab('map'); }}
              totalInZip={reEnrichedResult.totalListings}
              totalQualifying={reEnrichedResult.qualifyingCount}
              zipCode={reEnrichedResult.zipCode}
            />
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <PropertyDetailPanel
            listing={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}
