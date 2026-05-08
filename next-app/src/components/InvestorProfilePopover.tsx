'use client';
import { useState } from 'react';
import { InvestorProfile } from '@/lib/types';

interface Props {
  profile: InvestorProfile;
  onChange: (p: InvestorProfile) => void;
}

export default function InvestorProfilePopover({ profile, onChange }: Props) {
  const [open, setOpen] = useState(false);

  function update(key: keyof InvestorProfile, val: number) {
    onChange({ ...profile, [key]: val });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#111820] border border-white/10 rounded-lg text-xs text-[#8A94A6] hover:border-white/20 transition-colors whitespace-nowrap"
      >
        <span>{profile.downPct}% ↓</span>
        <span>·</span>
        <span>{profile.mortRate}%</span>
        <span>·</span>
        <span>{profile.term}yr</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#111820] border border-white/10 rounded-xl p-4 z-50 shadow-2xl">
          <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider mb-3">Investor Profile</div>
          {([
            { key: 'downPct', label: 'Down Payment', min: 5, max: 50, step: 1, suffix: '%' },
            { key: 'mortRate', label: 'Mortgage Rate', min: 3, max: 12, step: 0.1, suffix: '%' },
            { key: 'term', label: 'Loan Term', min: 10, max: 30, step: 5, suffix: 'yr' },
            { key: 'mgmtPct', label: 'Management Fee', min: 0, max: 15, step: 1, suffix: '%' },
          ] as Array<{ key: keyof InvestorProfile; label: string; min: number; max: number; step: number; suffix: string }>).map(({ key, label, min, max, step, suffix }) => (
            <div key={key} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#8A94A6]">{label}</span>
                <span className="text-[#EEF0F4] font-medium">{profile[key]}{suffix}</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={profile[key]}
                onChange={e => update(key, parseFloat(e.target.value))}
                className="w-full accent-[#22C55E]"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
