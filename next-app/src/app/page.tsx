'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { DiscoveryResult, EnrichedListing, InvestorProfile, DEFAULT_PROFILE } from '@/lib/types';
import { discoverProperties } from '@/lib/discovery-engine';
import { enrichListing } from '@/lib/yield-engine';
import { applyFilters, Filters, DEFAULT_FILTERS } from '@/components/FilterSidebar';
import { getTheme, ThemeStyles } from '@/lib/theme';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import FilterImpactBanner from '@/components/FilterImpactBanner';
import InvestorProfilePopover from '@/components/InvestorProfilePopover';
import PropertyDetailPanel from '@/components/PropertyDetailPanel';
import CompareTable from '@/components/CompareTable';
import BoundaryPropertiesSection from '@/components/BoundaryPropertiesSection';

interface TabProps {
  listings: EnrichedListing[];
  profile: InvestorProfile;
  selected: EnrichedListing | null;
  onSelect: (listing: EnrichedListing) => void;
  s: ThemeStyles;
}
interface ChatBotProps {
  listings: EnrichedListing[];
  profile: InvestorProfile;
  s: ThemeStyles;
}

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });
const AIInsightsTab = dynamic<TabProps>(() => import('@/components/AIInsightsTab'), { ssr: false });
const PortfolioTab = dynamic<TabProps>(() => import('@/components/PortfolioTab'), { ssr: false });
const StressTestTab = dynamic<TabProps>(() => import('@/components/StressTestTab'), { ssr: false });
const ExitStrategyTab = dynamic<TabProps>(() => import('@/components/ExitStrategyTab'), { ssr: false });
const MomentumTab = dynamic<TabProps>(() => import('@/components/MomentumTab'), { ssr: false });
const YieldOptimizerTab = dynamic<TabProps>(() => import('@/components/YieldOptimizerTab'), { ssr: false });
const ServicesTab = dynamic<TabProps>(() => import('@/components/ServicesTab'), { ssr: false });
const NetworkTab = dynamic<TabProps>(() => import('@/components/NetworkTab'), { ssr: false });
const ChatBot = dynamic<ChatBotProps>(() => import('@/components/ChatBot'), { ssr: false });

type ViewTab =
  | 'map' | 'compare'
  | 'insights' | 'portfolio'
  | 'stress' | 'exit' | 'momentum' | 'optimize' | 'services' | 'network';

const MORE_TABS: Array<{ key: ViewTab; icon: string; label: string; desc: string }> = [
  { key: 'stress', icon: '🚨', label: 'Stress Test', desc: 'What could go wrong scenarios' },
  { key: 'exit', icon: '✈️', label: 'Exit Strategy', desc: 'Hold vs sell vs refi vs 1031' },
  { key: 'momentum', icon: '📈', label: 'Neighborhood Momentum', desc: 'Where markets are heading' },
  { key: 'optimize', icon: '✨', label: 'Yield Optimizer', desc: 'Boost your returns' },
  { key: 'services', icon: '🛠️', label: 'Services Marketplace', desc: 'Vetted investor providers' },
  { key: 'network', icon: '🤝', label: 'Investor Network', desc: 'Share deals, find partners' },
];

const MORE_TAB_KEYS = MORE_TABS.map(t => t.key);

export default function HomePage() {
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentZip, setCurrentZip] = useState<string>();
  const [profile, setProfile] = useState<InvestorProfile>(DEFAULT_PROFILE);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<EnrichedListing | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('map');
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('dark');
  const [error, setError] = useState<string | null>(null);
  const didAutoSearch = useRef(false);

  const s = getTheme(themeMode);

  // Auto-load the default zip on first mount so the app opens with data already populated.
  // The API route serves this from a committed fixture, so no RentCast quota is consumed.
  useEffect(() => {
    if (didAutoSearch.current) return;
    didAutoSearch.current = true;
    handleSearch('75409');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(zip: string) {
    setLoading(true);
    setCurrentZip(zip);
    setError(null);
    setSelected(null);
    try {
      const data = await discoverProperties(zip, profile);
      setResult(data);
      if (activeTab !== 'map' && activeTab !== 'compare') setActiveTab('map');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }

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

  const isMapOrCompare = activeTab === 'map' || activeTab === 'compare';
  const isMoreTab = MORE_TAB_KEYS.includes(activeTab as ViewTab);
  const activeMoreLabel = MORE_TABS.find(t => t.key === activeTab)?.label;

  function handleSelectListing(listing: EnrichedListing) {
    setSelected(listing);
    setActiveTab('map');
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0B0F14]">
      {/* Header */}
      <header className="h-14 flex items-center gap-3 px-4 border-b border-white/7 bg-[#111820] flex-shrink-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-[#22C55E] rounded-md flex items-center justify-center text-[#0B0F14] font-black text-sm">Y</div>
          <span className="font-bold text-[#EEF0F4] text-sm tracking-tight hidden sm:block">YieldMap</span>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-auto">
          <SearchBar onSearch={handleSearch} loading={loading} currentZip={currentZip} />
        </div>

        {/* Navigation + controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Primary tabs: always visible */}
          <div style={{ display: 'flex', gap: 2 }}>
            {([['map', '🗺 Map'], ['compare', '📊 Compare']] as const).map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: activeTab === tab ? s.accentDim : 'transparent', color: activeTab === tab ? s.accent : s.txt2, fontFamily: 'inherit' }}>
                {label}
              </button>
            ))}

            {/* AI Insights + Portfolio */}
            {([['insights', '🧠 Insights'], ['portfolio', '📁 Portfolio']] as const).map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: activeTab === tab ? s.accentDim : 'transparent', color: activeTab === tab ? s.accent : s.txt2, fontFamily: 'inherit' }}>
                {label}
              </button>
            ))}

            {/* More dropdown */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowMoreDropdown(v => !v)}
                style={{ padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: isMoreTab || showMoreDropdown ? s.accentDim : 'transparent', color: isMoreTab || showMoreDropdown ? s.accent : s.txt2, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                {isMoreTab ? activeMoreLabel : 'More'} <span style={{ fontSize: 8 }}>{showMoreDropdown ? '▲' : '▼'}</span>
              </button>
              {showMoreDropdown && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: s.card, border: `1px solid ${s.borderH}`, borderRadius: 10, boxShadow: '0 12px 40px rgba(0,0,0,0.4)', zIndex: 200, overflow: 'hidden', minWidth: 210 }}>
                  {MORE_TABS.map(({ key, icon, label, desc }) => (
                    <button key={key} onClick={() => { setActiveTab(key); setShowMoreDropdown(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', borderBottom: `1px solid ${s.border}`, background: activeTab === key ? s.accentDim : 'transparent', color: s.txt, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                      <span style={{ fontSize: 15, width: 22, textAlign: 'center' }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: activeTab === key ? s.accent : s.txt }}>{label}</div>
                        <div style={{ fontSize: 10, color: s.txt3 }}>{desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Theme toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', marginLeft: 4 }}>
            {([['dark', '🌙'], ['light', '☀️'], ['system', '💻']] as const).map(([mode, icon]) => (
              <button key={mode} onClick={() => setThemeMode(mode)} title={mode}
                style={{ padding: '4px 7px', border: 'none', cursor: 'pointer', fontSize: 11, background: themeMode === mode ? s.accentDim : 'transparent', color: themeMode === mode ? s.accent : s.txt3, fontFamily: 'inherit', lineHeight: 1 }}>{icon}</button>
            ))}
          </div>

          <InvestorProfilePopover profile={profile} onChange={setProfile} />
        </div>
      </header>

      {/* Filter impact banner (map/compare only) */}
      {reEnrichedResult && isMapOrCompare && (
        <FilterImpactBanner result={reEnrichedResult} />
      )}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden" onClick={() => showMoreDropdown && setShowMoreDropdown(false)}>
        {/* Sidebar (map/compare only) */}
        {reEnrichedResult && isMapOrCompare && (
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

          {/* Empty / loading / error states (map/compare only) */}
          {isMapOrCompare && !result && !loading && (
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
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Map row */}
              <div className="flex flex-1 relative overflow-hidden">
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
                <div className="absolute bottom-4 left-4 z-10">
                  <button onClick={() => setShowAll(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#111820] border border-white/10 rounded-lg text-xs font-medium text-[#8A94A6] hover:border-white/20 hover:text-[#EEF0F4] transition-colors">
                    <span className={`w-3 h-3 rounded-full border ${showAll ? 'bg-[#22C55E] border-[#22C55E]' : 'border-[#8A94A6]'}`} />
                    Show all listings
                  </button>
                </div>
                {displayed.length > 0 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 py-2 bg-[#111820]/90 border border-white/10 rounded-full text-xs text-[#8A94A6] backdrop-blur-sm whitespace-nowrap">
                      Showing {displayed.length} qualifying
                      {` · avg yield ${(displayed.reduce((sum, l) => sum + l.yield.netYield, 0) / displayed.length).toFixed(1)}%`}
                      {` · best ${Math.max(...displayed.map(l => l.yield.netYield)).toFixed(1)}%`}
                    </div>
                  </div>
                )}
                {/* Detail panel */}
                {selected && (
                  <PropertyDetailPanel
                    listing={selected}
                    onClose={() => setSelected(null)}
                  />
                )}
              </div>
              {/* Boundary properties below map */}
              {reEnrichedResult.boundary.length > 0 && (
                <div className="overflow-y-auto flex-shrink-0 max-h-[40vh]" style={{ background: s.bg }}>
                  <BoundaryPropertiesSection
                    boundary={reEnrichedResult.boundary}
                    onSelect={setSelected}
                    s={s}
                  />
                </div>
              )}
            </div>
          )}

          {/* Compare view */}
          {reEnrichedResult && !loading && activeTab === 'compare' && (
            <CompareTable
              listings={displayed}
              onSelect={l => { setSelected(l); setActiveTab('map'); }}
              totalInZip={reEnrichedResult.totalListings}
              totalQualifying={reEnrichedResult.qualifyingCount}
              zipCode={reEnrichedResult.zipCode}
            />
          )}

          {/* All non-map/compare tabs — always mounted to preserve state across tab switches */}
          <div className="flex-1 overflow-y-auto" style={{ background: s.bg, display: isMapOrCompare || loading ? 'none' : 'block' }}>
            <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
              {([
                ['insights',  <AIInsightsTab    key="insights"  listings={displayed} profile={profile} selected={selected} onSelect={handleSelectListing} s={s} />],
                ['portfolio', <PortfolioTab     key="portfolio" listings={displayed} profile={profile} selected={selected} onSelect={handleSelectListing} s={s} />],
                ['stress',    <StressTestTab    key="stress"    listings={displayed} profile={profile} selected={selected} onSelect={setSelected} s={s} />],
                ['exit',      <ExitStrategyTab  key="exit"      listings={displayed} profile={profile} selected={selected} onSelect={setSelected} s={s} />],
                ['momentum',  <MomentumTab      key="momentum"  listings={displayed} profile={profile} selected={selected} onSelect={setSelected} s={s} />],
                ['optimize',  <YieldOptimizerTab key="optimize" listings={displayed} profile={profile} selected={selected} onSelect={setSelected} s={s} />],
                ['services',  <ServicesTab      key="services"  listings={displayed} profile={profile} selected={selected} onSelect={setSelected} s={s} />],
                ['network',   <NetworkTab       key="network"   listings={displayed} profile={profile} selected={selected} onSelect={setSelected} s={s} />],
              ] as [string, React.ReactNode][]).map(([tab, el]) => (
                <div key={tab} style={{ display: activeTab === tab ? undefined : 'none' }}>{el}</div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Floating chatbot */}
      {displayed.length > 0 && (
        <ChatBot listings={displayed} profile={profile} s={s} />
      )}
    </div>
  );
}
