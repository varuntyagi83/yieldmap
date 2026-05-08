'use client';
import { useState } from 'react';
import { EnrichedListing } from '@/lib/types';

type SortKey = 'netYield' | 'price' | 'capRate' | 'leverageSpread' | 'monthlyCashFlow' | 'grossYield' | 'bedrooms' | 'squareFootage' | 'daysOnMarket';

interface Props {
  listings: EnrichedListing[];
  onSelect: (listing: EnrichedListing) => void;
  totalInZip: number;
  totalQualifying: number;
  zipCode: string;
}

function fmt(n: number) { return `$${Math.round(n).toLocaleString()}`; }
function fmtPct(n: number) { return `${n.toFixed(1)}%`; }

export default function CompareTable({ listings, onSelect, totalInZip, totalQualifying, zipCode }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('netYield');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...listings].sort((a, b) => {
    const getVal = (l: EnrichedListing): number => {
      const yieldKeys: SortKey[] = ['netYield', 'capRate', 'leverageSpread', 'monthlyCashFlow', 'grossYield'];
      if (yieldKeys.includes(sortKey)) return (l.yield as unknown as Record<string, number>)[sortKey] ?? 0;
      return (l as unknown as Record<string, number>)[sortKey] ?? 0;
    };
    return sortDir === 'asc' ? getVal(a) - getVal(b) : getVal(b) - getVal(a);
  });

  const cols: Array<{ key: SortKey; label: string; render: (l: EnrichedListing) => React.ReactNode }> = [
    { key: 'price', label: 'Price', render: l => fmt(l.price) },
    { key: 'netYield', label: 'Net Yield', render: l => <span style={{ color: l.yieldColor }}>{fmtPct(l.yield.netYield)}</span> },
    { key: 'capRate', label: 'Cap Rate', render: l => fmtPct(l.yield.capRate) },
    { key: 'leverageSpread', label: 'Spread', render: l => <span className={l.yield.leverageSpread >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}>{l.yield.leverageSpread >= 0 ? '+' : ''}{fmtPct(l.yield.leverageSpread)}</span> },
    { key: 'monthlyCashFlow', label: 'Monthly CF', render: l => <span className={l.yield.monthlyCashFlow >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}>{fmt(l.yield.monthlyCashFlow)}</span> },
    { key: 'grossYield', label: 'Gross Yield', render: l => fmtPct(l.yield.grossYield) },
    { key: 'bedrooms', label: 'Beds', render: l => l.bedrooms },
    { key: 'squareFootage', label: 'SqFt', render: l => l.squareFootage > 0 ? l.squareFootage.toLocaleString() : '—' },
    { key: 'daysOnMarket', label: 'DOM', render: l => l.daysOnMarket ?? '—' },
  ];

  const filterPct = totalInZip > 0 ? Math.round(((totalInZip - totalQualifying) / totalInZip) * 100) : 0;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/7 text-sm text-[#8A94A6]">
        <span className="text-[#22C55E] font-semibold">{totalQualifying} qualifying</span>
        {' '}from {totalInZip.toLocaleString()} listings in {zipCode} ({filterPct}% filtered)
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="sticky top-0 bg-[#0B0F14]">
            <tr>
              <th className="px-4 py-2.5 text-[#8A94A6] font-medium whitespace-nowrap">#</th>
              <th className="px-4 py-2.5 text-[#8A94A6] font-medium">Address</th>
              <th className="px-4 py-2.5 text-[#8A94A6] font-medium whitespace-nowrap">City</th>
              {cols.map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)}
                  className="px-4 py-2.5 text-[#8A94A6] font-medium whitespace-nowrap cursor-pointer hover:text-[#EEF0F4] select-none">
                  {col.label} {sortKey === col.key ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((l, i) => (
              <tr key={l.id} onClick={() => onSelect(l)}
                className="border-t border-white/5 hover:bg-white/3 cursor-pointer transition-colors">
                <td className="px-4 py-2.5 text-[#8A94A6]">{i + 1}</td>
                <td className="px-4 py-2.5 text-[#EEF0F4] max-w-[200px] truncate">{l.formattedAddress}</td>
                <td className="px-4 py-2.5 text-[#8A94A6] whitespace-nowrap">{l.city}</td>
                {cols.map(col => (
                  <td key={col.key} className="px-4 py-2.5 text-[#EEF0F4] whitespace-nowrap">{col.render(l)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className="text-center text-[#8A94A6] py-16 text-sm">No qualifying properties match the current filters.</div>
        )}
      </div>
    </div>
  );
}
