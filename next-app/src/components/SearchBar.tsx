'use client';
import { useState, FormEvent } from 'react';

interface Props {
  onSearch: (query: string) => void;
  loading: boolean;
  currentZip?: string;
}

export default function SearchBar({ onSearch, loading, currentZip }: Props) {
  const [value, setValue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) onSearch(q);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-lg mx-auto">
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A94A6] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Search zip code..."
          className="w-full bg-[#111820] text-[#EEF0F4] placeholder-[#8A94A6] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#22C55E]/50 transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-[#22C55E] text-[#0B0F14] rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-[#16A34A] transition-colors whitespace-nowrap"
      >
        {loading ? (currentZip ? `Analyzing ${currentZip}…` : 'Loading…') : 'Search'}
      </button>
    </form>
  );
}
