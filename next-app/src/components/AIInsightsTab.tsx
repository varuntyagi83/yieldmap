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

interface InsightsData {
  error?: string;
  portfolioSummary?: {
    overallGrade: string;
    stressResilience: string;
    strategicRecommendation: string;
  };
  topPick?: {
    name: string;
    city: string;
    netYield: string;
    executiveSummary: string;
    whyBest?: string;
    watchOuts?: string[];
    nextSteps?: string[];
  };
  marketAlerts?: Array<{
    title: string;
    body: string;
    affectedProperties?: string[];
    action?: string;
    impactLevel?: string;
    type: 'warning' | 'opportunity' | 'info';
  }>;
  rankings?: Array<{
    name: string;
    city: string;
    netYield: string;
    action: string;
    risk: string;
    thesis: string;
    stressSurvival?: string;
    stressDetail?: string;
    exitInsight?: string;
    momentumAnalysis?: string;
    keyRisks?: string[];
    signals?: string[];
  }>;
}

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const fmtP = (n: number) => n.toFixed(1) + '%';

async function callAI(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
): Promise<string> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 8192,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    });
    const data = await res.json();
    if (data.error) return `API Error: ${data.error.message || JSON.stringify(data.error)}`;
    return data.choices?.[0]?.message?.content || 'No response';
  } catch (e: unknown) {
    return `Network error: ${e instanceof Error ? e.message : String(e)}`;
  }
}

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    // Ordered list
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      result.push(
        <div key={lineIdx} style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
          <span style={{ minWidth: 18, opacity: 0.6 }}>{olMatch[1]}.</span>
          <span>{inlineMarkdown(olMatch[2])}</span>
        </div>
      );
      return;
    }

    // Unordered list
    const ulMatch = trimmed.match(/^[-*]\s+(.*)/);
    if (ulMatch) {
      result.push(
        <div key={lineIdx} style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
          <span style={{ minWidth: 12, opacity: 0.6 }}>•</span>
          <span>{inlineMarkdown(ulMatch[1])}</span>
        </div>
      );
      return;
    }

    // Empty line
    if (!trimmed) {
      result.push(<div key={lineIdx} style={{ height: 6 }} />);
      return;
    }

    result.push(<span key={lineIdx}>{inlineMarkdown(trimmed)}<br /></span>);
  });

  return result;
}

function inlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2] !== undefined) parts.push(<strong key={m.index}>{m[2]}</strong>);
    else if (m[3] !== undefined) parts.push(<em key={m.index}>{m[3]}</em>);
    else if (m[4] !== undefined)
      parts.push(
        <code key={m.index} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 3, padding: '1px 4px', fontSize: '0.85em' }}>
          {m[4]}
        </code>
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

export default function AIInsightsTab({ listings, profile, selected, onSelect, s }: Props) {
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  function buildAIContext(): string {
    return listings
      .slice(0, 20)
      .map((l, i) => {
        const baseCF = l.yield.monthlyCashFlow;
        const mortgageDelta = (l.price * (1 - profile.downPct / 100)) * 0.02 / 12;
        const rentDelta = l.yield.monthlyRent * 0.10;
        const taxDelta = l.yield.monthlyPropTax * 0.25;
        const repairMonthly = 15000 / 12;
        const stressedCF = baseCF - mortgageDelta - rentDelta - taxDelta - repairMonthly;

        const fv5 = l.price * Math.pow(1.03, 5);
        const loanBal = l.price * (1 - profile.downPct / 100) * 0.9;
        const sellNet5 =
          fv5 * 0.94 - loanBal - Math.max(0, fv5 - l.price) * 0.20 - ((l.price * 0.8) / 27.5 * 5) * 0.25;

        const stressLabel = stressedCF >= 0 ? `+${fmt(stressedCF)}/mo (SURVIVES)` : `${fmt(stressedCF)}/mo (FAILS)`;

        return `#${i + 1} "${l.formattedAddress}, ${l.city} ${l.state}" | ${l.city} ${l.state} | ${l.bedrooms}BR/${l.squareFootage}sqft | ${fmt(l.price)} | Rent ${fmt(l.yield.monthlyRent)}/mo | Net ${fmtP(l.yield.netYield)} | Cap ${fmtP(l.yield.capRate)} | CF ${l.yield.monthlyCashFlow >= 0 ? '+' : ''}${fmt(l.yield.monthlyCashFlow)}/mo | CoC ${fmtP(l.yield.cashOnCash)} | Spread ${l.yield.leverageSpread >= 0 ? '+' : ''}${fmtP(l.yield.leverageSpread)} | STRESS CF ${stressLabel} | Yr5 sell net ${fmt(sellNet5)} | DOM ${l.daysOnMarket ?? 'N/A'} days`;
      })
      .join('\n');
  }

  async function generateInsights() {
    setInsightsLoading(true);
    setInsightsData(null);

    const context = buildAIContext();
    const systemPrompt = `You are YieldMap AI, a senior real estate investment analyst delivering institutional-grade research. Investor profile: tax rate ${profile.taxRate}%, down payment ${profile.downPct}%, mortgage rate ${profile.mortRate}%, ${profile.term}-year loan.

Each property record contains: net yield, cap rate, cash-on-cash return, monthly cash flow, leverageSpread (cap rate minus mortgage rate), stress test result (perfect storm: +2% rates, +25% property tax, -10% rent, $15K emergency repair simultaneously), year-5 net sale proceeds, and days on market.

ANALYSIS STANDARDS: Write like a senior analyst at a real estate private equity firm. Cite actual numbers from the data in every analysis field. Differentiate clearly between stress survivors and stress failures. No generic statements, every sentence must contain a specific figure, comparison, or data-backed claim.

CRITICAL: Output ONLY a raw JSON object. No markdown, no backticks, no text outside the JSON.

{"portfolioSummary":{"overallGrade":"A/B/C/D/F","stressResilience":"X of Y properties survive the perfect storm","strategicRecommendation":"4-5 sentence portfolio-level recommendation referencing concentration risk, stress performance distribution, yield range, and the single highest-priority action the investor should take now"},"topPick":{"name":"exact address from data","city":"city, ST","netYield":"X.X%","executiveSummary":"5-6 sentences: open with the yield headline and cap rate context, explain stress resilience citing the actual worst-case monthly CF number, quantify the 5-year exit upside with the projected net proceeds, and close with why this fits this specific investor profile","whyBest":"2-3 sentences comparing this property to the next-best alternative with specific numbers","watchOuts":["specific risk with mitigation","second risk","third risk if material"],"nextSteps":["concrete step the investor can take in the next 7 days","step 2","step 3"]},"marketAlerts":[{"title":"alert title","body":"4-5 sentences with specific data points","affectedProperties":["exact addresses from data"],"action":"One specific action in the next 30 days","impactLevel":"High/Medium/Low","type":"opportunity/warning/info"}],"rankings":[{"name":"exact address","city":"city, ST","netYield":"X.X%","action":"Buy/Hold/Watch/Pass","risk":"Low/Medium/High","thesis":"4-5 sentences with specific numbers","stressSurvival":"Survives/Fails perfect storm","stressDetail":"2 sentences describing worst-case CF and biggest stress vulnerability","exitInsight":"2 sentences with yr-5 net proceeds and timing risk","momentumAnalysis":"2 sentences on location trajectory and primary risk","keyRisks":["quantified risk with a number","second specific risk"],"signals":["data-backed signal with a number","signal 2","signal 3"]}]}

Rank all properties (max 8). Include exactly 4 market alerts. Every text field must contain substantive analysis with specific numbers.`;

    const text = await callAI(
      [{ role: 'user', content: `Analyze these ${listings.length} qualifying investment properties:\n\n${context}` }],
      systemPrompt
    );

    try {
      let clean = text
        .replace(/^[\s\S]*?```(?:json)?\s*\n?/i, '')
        .replace(/\n?\s*```[\s\S]*$/i, '')
        .trim();
      if (!clean.startsWith('{')) {
        const fb = clean.indexOf('{');
        const lb = clean.lastIndexOf('}');
        if (fb !== -1 && lb !== -1) clean = clean.slice(fb, lb + 1);
      }
      setInsightsData(JSON.parse(clean));
    } catch {
      try {
        const m = text.match(/\{[\s\S]*\}/);
        if (m) setInsightsData(JSON.parse(m[0]));
        else setInsightsData({ error: 'Could not parse AI response. Raw: ' + text.slice(0, 200) });
      } catch {
        setInsightsData({ error: 'Parse failed. Raw response: ' + text.slice(0, 300) });
      }
    }

    setInsightsLoading(false);
  }

  function downloadInsightsPDF() {
    if (!insightsData) return;
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const title = `${date}_Yieldmap_AI_Investment_Report`;

    const gradeColor = (g: string) => {
      if (g === 'A') return '#22C55E';
      if (g === 'B') return '#84CC16';
      if (g === 'C') return '#EAB308';
      if (g === 'D') return '#F97316';
      return '#EF4444';
    };

    const alertBorderColor = (type: string) => {
      if (type === 'opportunity') return '#22C55E';
      if (type === 'warning') return '#F97316';
      return '#3B82F6';
    };

    const alertBadgeColor = (level: string) => {
      if (level === 'High') return '#EF4444';
      if (level === 'Medium') return '#F97316';
      return '#3B82F6';
    };

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  body { font-family: Georgia, serif; background: #fff; color: #1a1d23; margin: 0; padding: 32px; max-width: 900px; margin: 0 auto; }
  h1 { color: #22C55E; font-size: 28px; margin-bottom: 4px; }
  h2 { color: #22C55E; font-size: 20px; border-bottom: 2px solid #22C55E; padding-bottom: 6px; margin-top: 32px; }
  h3 { font-size: 16px; margin: 0 0 8px 0; }
  .subtitle { color: #5f6b7a; font-size: 14px; margin-bottom: 32px; }
  .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
  .grade-circle { display: inline-block; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; text-align: center; font-size: 28px; font-weight: bold; color: #fff; margin-right: 16px; vertical-align: middle; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; color: #fff; margin-right: 6px; }
  .green-badge { background: #22C55E; }
  .red-badge { background: #EF4444; }
  .orange-badge { background: #F97316; }
  .blue-badge { background: #3B82F6; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 12px; }
  .grid3-cell { background: #f9fafb; border-radius: 6px; padding: 12px; }
  .grid3-cell h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #5f6b7a; margin: 0 0 6px 0; }
  .alert-card { border-left: 4px solid #22C55E; padding: 12px 16px; margin-bottom: 12px; background: #f9fafb; border-radius: 0 6px 6px 0; }
  .chip { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; background: #f3f4f6; color: #374151; margin: 2px; }
  .watch-item { display: flex; gap: 8px; margin-bottom: 6px; }
  .watch-icon { color: #F59E0B; }
  p { line-height: 1.6; margin: 6px 0; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
<h1>YieldMap AI Investment Report</h1>
<div class="subtitle">Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | ${listings.length} qualifying properties analyzed | Tax rate ${profile.taxRate}%, Down ${profile.downPct}%, Rate ${profile.mortRate}%</div>

${insightsData.portfolioSummary ? `
<h2>Portfolio Summary</h2>
<div class="card">
  <div>
    <span class="grade-circle" style="background:${gradeColor(insightsData.portfolioSummary.overallGrade)}">${insightsData.portfolioSummary.overallGrade}</span>
    <span style="font-size:18px; font-weight:bold;">${insightsData.portfolioSummary.stressResilience}</span>
  </div>
  <p style="margin-top:16px;">${insightsData.portfolioSummary.strategicRecommendation}</p>
</div>
` : ''}

${insightsData.topPick ? `
<h2>Top Pick</h2>
<div class="card" style="border-color:#22C55E;">
  <div style="display:flex; align-items:flex-start; gap:12px; flex-wrap:wrap;">
    <span style="font-size:28px;">🏆</span>
    <div style="flex:1;">
      <h3>${insightsData.topPick.name}</h3>
      <div>${insightsData.topPick.city} <span class="badge green-badge">Net ${insightsData.topPick.netYield}</span></div>
    </div>
  </div>
  <p style="margin-top:12px;">${insightsData.topPick.executiveSummary}</p>
  ${insightsData.topPick.whyBest ? `<p><strong>Why this is the best choice:</strong> ${insightsData.topPick.whyBest}</p>` : ''}
  ${insightsData.topPick.watchOuts?.length ? `
  <div style="margin-top:12px;">
    <strong>Watch-outs:</strong>
    ${insightsData.topPick.watchOuts.map(w => `<div class="watch-item"><span class="watch-icon">⚠</span><span>${w}</span></div>`).join('')}
  </div>
  ` : ''}
  ${insightsData.topPick.nextSteps?.length ? `
  <div style="margin-top:12px;">
    <strong>Next steps:</strong>
    <ol>${insightsData.topPick.nextSteps.map(ns => `<li>${ns}</li>`).join('')}</ol>
  </div>
  ` : ''}
</div>
` : ''}

${insightsData.marketAlerts?.length ? `
<h2>Market Alerts</h2>
${insightsData.marketAlerts.map(a => `
<div class="alert-card" style="border-left-color:${alertBorderColor(a.type)}">
  <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
    <strong>${a.title}</strong>
    ${a.impactLevel ? `<span class="badge" style="background:${alertBadgeColor(a.impactLevel)}">${a.impactLevel}</span>` : ''}
  </div>
  <p>${a.body}</p>
  ${a.action ? `<p><strong>Action:</strong> ${a.action}</p>` : ''}
  ${a.affectedProperties?.length ? `<p><strong>Affected:</strong> ${a.affectedProperties.join(', ')}</p>` : ''}
</div>
`).join('')}
` : ''}

${insightsData.rankings?.length ? `
<h2>Property Analysis</h2>
${insightsData.rankings.map((r, i) => `
<div class="card">
  <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
    <span style="font-size:14px; font-weight:bold; color:#5f6b7a;">#${i + 1}</span>
    <h3 style="margin:0; flex:1;">${r.name}</h3>
    <span class="badge ${r.action === 'Buy' ? 'green-badge' : r.action === 'Pass' ? 'red-badge' : 'orange-badge'}">${r.action}</span>
    <span class="badge ${r.risk === 'Low' ? 'green-badge' : r.risk === 'High' ? 'red-badge' : 'orange-badge'}">${r.risk} Risk</span>
  </div>
  <div style="color:#5f6b7a; font-size:13px; margin:4px 0 10px;">${r.city} | Net ${r.netYield}</div>
  <p>${r.thesis}</p>
  <div class="grid3">
    <div class="grid3-cell">
      <h4>Stress Test</h4>
      <div style="font-weight:bold; color:${r.stressSurvival?.toLowerCase().includes('survives') ? '#22C55E' : '#EF4444'}">${r.stressSurvival || 'N/A'}</div>
      <p style="font-size:12px; margin:4px 0 0;">${r.stressDetail || ''}</p>
    </div>
    <div class="grid3-cell">
      <h4>Exit Strategy</h4>
      <p style="font-size:12px; margin:0;">${r.exitInsight || ''}</p>
    </div>
    <div class="grid3-cell">
      <h4>Momentum</h4>
      <p style="font-size:12px; margin:0;">${r.momentumAnalysis || ''}</p>
    </div>
  </div>
  ${r.keyRisks?.length ? `<div style="margin-top:10px;">${r.keyRisks.map(kr => `<span class="chip">⚠ ${kr}</span>`).join('')}</div>` : ''}
  ${r.signals?.length ? `<div style="margin-top:6px;">${r.signals.map(sig => `<span class="chip">◆ ${sig}</span>`).join('')}</div>` : ''}
</div>
`).join('')}
` : ''}

</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 400);
  }

  const alertTypeColor = (type: string) => {
    if (type === 'opportunity') return s.accent;
    if (type === 'warning') return '#F97316';
    return '#3B82F6';
  };

  const actionBg = (action: string) => {
    if (action === 'Buy') return 'rgba(34,197,94,0.15)';
    if (action === 'Pass') return 'rgba(239,68,68,0.15)';
    return 'rgba(234,179,8,0.15)';
  };

  const actionColor = (action: string) => {
    if (action === 'Buy') return '#22C55E';
    if (action === 'Pass') return '#EF4444';
    return '#EAB308';
  };

  const riskColor = (risk: string) => {
    if (risk === 'Low') return '#22C55E';
    if (risk === 'High') return '#EF4444';
    return '#F97316';
  };

  const gradeColor = (g: string) => {
    if (g === 'A') return '#22C55E';
    if (g === 'B') return '#84CC16';
    if (g === 'C') return '#EAB308';
    if (g === 'D') return '#F97316';
    return '#EF4444';
  };

  if (listings.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', gap: 12 }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <div style={{ color: s.txt, fontSize: 18, fontWeight: 600 }}>No properties to analyze</div>
        <div style={{ color: s.txt2, fontSize: 14, textAlign: 'center' }}>Run a search first to find qualifying investment properties, then return here for AI analysis.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 0', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div>
          <div style={{ color: s.txt, fontSize: 22, fontWeight: 700 }}>AI Investment Insights</div>
          <div style={{ color: s.txt2, fontSize: 14, marginTop: 4 }}>
            Powered by GPT-4o. Personalized analysis of {listings.length} qualifying properties.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {insightsData && !insightsData.error && (
            <button
              onClick={downloadInsightsPDF}
              style={{
                padding: '9px 16px',
                borderRadius: 8,
                border: `1px solid ${s.border}`,
                background: 'transparent',
                color: s.txt,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              ⬇ Download Report
            </button>
          )}
          <button
            onClick={generateInsights}
            disabled={insightsLoading}
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              border: 'none',
              background: insightsLoading ? s.surf : 'linear-gradient(135deg, #22C55E, #16A34A)',
              color: insightsLoading ? s.txt2 : '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: insightsLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {insightsLoading ? 'Analyzing...' : insightsData ? 'Refresh Analysis' : 'Generate Insights'}
          </button>
        </div>
      </div>

      {/* Loading state */}
      {insightsLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '60px 0' }}>
          <div style={{ color: s.txt, fontSize: 16, fontWeight: 600 }}>Analyzing your portfolio...</div>
          <div style={{ width: 280, height: 6, background: s.surf, borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                borderRadius: 4,
                background: 'linear-gradient(90deg, #22C55E, #16A34A)',
                animation: 'slideProgress 1.8s ease-in-out infinite',
              }}
            />
          </div>
          <style>{`@keyframes slideProgress { 0% { width: 0%; margin-left: 0; } 50% { width: 70%; margin-left: 15%; } 100% { width: 0%; margin-left: 100%; } }`}</style>
          <div style={{ color: s.txt2, fontSize: 13 }}>GPT-4o is running institutional-grade analysis on {listings.length} properties.</div>
        </div>
      )}

      {/* Error state */}
      {!insightsLoading && insightsData?.error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: 24 }}>
          <div style={{ color: '#EF4444', fontWeight: 600, marginBottom: 8 }}>Analysis failed</div>
          <div style={{ color: s.txt2, fontSize: 13, marginBottom: 16 }}>{insightsData.error}</div>
          <button
            onClick={generateInsights}
            style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: '#EF4444', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state before first generation */}
      {!insightsLoading && !insightsData && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '60px 0' }}>
          <div style={{ fontSize: 52 }}>🧠</div>
          <div style={{ color: s.txt, fontSize: 17, fontWeight: 600 }}>AI analysis ready</div>
          <div style={{ color: s.txt2, fontSize: 14, textAlign: 'center', maxWidth: 440 }}>
            Click Generate Insights to get a full institutional-grade report: portfolio grade, stress tests, top pick, market alerts, and ranked analysis of all {listings.length} properties.
          </div>
        </div>
      )}

      {/* Results */}
      {!insightsLoading && insightsData && !insightsData.error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Portfolio summary */}
          {insightsData.portfolioSummary && (
            <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: gradeColor(insightsData.portfolioSummary.overallGrade),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 800, color: '#fff', flexShrink: 0,
                }}>
                  {insightsData.portfolioSummary.overallGrade}
                </div>
                <div>
                  <div style={{ color: s.txt, fontWeight: 700, fontSize: 18 }}>Portfolio Grade</div>
                  <div style={{ color: s.accent, fontSize: 14, marginTop: 2 }}>{insightsData.portfolioSummary.stressResilience}</div>
                </div>
              </div>
              <div style={{ color: s.txt2, fontSize: 14, lineHeight: 1.7 }}>{insightsData.portfolioSummary.strategicRecommendation}</div>
            </div>
          )}

          {/* Top pick */}
          {insightsData.topPick && (
            <div style={{ background: s.card, border: `2px solid ${s.accent}`, borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>🏆</span>
                <div>
                  <div style={{ color: s.accent, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Top pick for your profile</div>
                  <div style={{ color: s.txt, fontWeight: 700, fontSize: 17 }}>{insightsData.topPick.name}</div>
                </div>
                <div style={{ marginLeft: 'auto', background: 'rgba(34,197,94,0.15)', color: s.accent, padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                  Net {insightsData.topPick.netYield}
                </div>
              </div>
              <div style={{ color: s.txt2, fontSize: 12, marginBottom: 14 }}>{insightsData.topPick.city}</div>
              <div style={{ color: s.txt, fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
                {renderMarkdown(insightsData.topPick.executiveSummary)}
              </div>

              {insightsData.topPick.whyBest && (
                <div style={{ background: s.surf, borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
                  <div style={{ color: s.txt, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Why this beats the alternatives</div>
                  <div style={{ color: s.txt2, fontSize: 13, lineHeight: 1.6 }}>{insightsData.topPick.whyBest}</div>
                </div>
              )}

              {insightsData.topPick.watchOuts && insightsData.topPick.watchOuts.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ color: s.txt, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Watch-outs</div>
                  {insightsData.topPick.watchOuts.map((w, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, color: s.txt2, fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>
                      <span style={{ color: '#F59E0B', flexShrink: 0 }}>⚠</span>
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {insightsData.topPick.nextSteps && insightsData.topPick.nextSteps.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: s.txt, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Next steps</div>
                  {insightsData.topPick.nextSteps.map((ns, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, color: s.txt2, fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>
                      <span style={{ background: s.accentDim, color: s.accent, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                      <span>{ns}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  const match = listings.find(l => l.formattedAddress === insightsData.topPick?.name || l.formattedAddress + ', ' + l.city + ' ' + l.state === insightsData.topPick?.name);
                  if (match) onSelect(match);
                }}
                style={{ padding: '8px 18px', borderRadius: 8, border: `1px solid ${s.accent}`, background: 'transparent', color: s.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                View on map
              </button>
            </div>
          )}

          {/* Market alerts */}
          {insightsData.marketAlerts && insightsData.marketAlerts.length > 0 && (
            <div>
              <div style={{ color: s.txt, fontWeight: 700, fontSize: 17, marginBottom: 14 }}>Market Alerts</div>
              <div style={{ display: 'grid', gap: 12 }}>
                {insightsData.marketAlerts.map((alert, i) => (
                  <div key={i} style={{
                    background: s.card,
                    border: `1px solid ${s.border}`,
                    borderLeft: `4px solid ${alertTypeColor(alert.type)}`,
                    borderRadius: '0 10px 10px 0',
                    padding: '16px 20px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                      <div style={{ color: s.txt, fontWeight: 700, fontSize: 15 }}>{alert.title}</div>
                      {alert.impactLevel && (
                        <span style={{
                          padding: '2px 10px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#fff',
                          background: alert.impactLevel === 'High' ? '#EF4444' : alert.impactLevel === 'Medium' ? '#F97316' : '#3B82F6',
                        }}>
                          {alert.impactLevel}
                        </span>
                      )}
                      <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, color: alertTypeColor(alert.type), background: `rgba(${alert.type === 'opportunity' ? '34,197,94' : alert.type === 'warning' ? '249,115,22' : '59,130,246'},0.12)` }}>
                        {alert.type}
                      </span>
                    </div>
                    <div style={{ color: s.txt2, fontSize: 13, lineHeight: 1.65, marginBottom: 10 }}>{alert.body}</div>
                    {alert.affectedProperties && alert.affectedProperties.length > 0 && (
                      <div style={{ fontSize: 12, color: s.txt3, marginBottom: 8 }}>
                        Affected: {alert.affectedProperties.join(', ')}
                      </div>
                    )}
                    {alert.action && (
                      <div style={{ fontSize: 13, color: s.txt, fontWeight: 600 }}>Action: <span style={{ color: s.txt2, fontWeight: 400 }}>{alert.action}</span></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Property rankings */}
          {insightsData.rankings && insightsData.rankings.length > 0 && (
            <div>
              <div style={{ color: s.txt, fontWeight: 700, fontSize: 17, marginBottom: 14 }}>Property Analysis</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {insightsData.rankings.map((r, i) => (
                  <div key={i} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: 22 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ color: s.txt3, fontWeight: 700, fontSize: 13, minWidth: 24 }}>#{i + 1}</span>
                      <div style={{ color: s.txt, fontWeight: 700, fontSize: 15, flex: 1 }}>{r.name}</div>
                      <span style={{ padding: '3px 12px', borderRadius: 14, fontSize: 12, fontWeight: 700, background: actionBg(r.action), color: actionColor(r.action) }}>{r.action}</span>
                      <span style={{ padding: '3px 12px', borderRadius: 14, fontSize: 12, fontWeight: 700, background: `rgba(${r.risk === 'Low' ? '34,197,94' : r.risk === 'High' ? '239,68,68' : '249,115,22'},0.12)`, color: riskColor(r.risk) }}>{r.risk} Risk</span>
                    </div>
                    <div style={{ color: s.txt2, fontSize: 12, marginBottom: 12 }}>{r.city} | Net {r.netYield}</div>

                    {/* Thesis */}
                    <div style={{ color: s.txt2, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
                      {renderMarkdown(r.thesis)}
                    </div>

                    {/* 3-grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
                      <div style={{ background: s.surf, borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: s.txt3, marginBottom: 6 }}>Stress Test</div>
                        {r.stressSurvival && (
                          <div style={{ fontSize: 12, fontWeight: 700, color: r.stressSurvival.toLowerCase().includes('survives') ? '#22C55E' : '#EF4444', marginBottom: 6 }}>
                            {r.stressSurvival}
                          </div>
                        )}
                        {r.stressDetail && <div style={{ fontSize: 12, color: s.txt2, lineHeight: 1.5 }}>{r.stressDetail}</div>}
                      </div>
                      <div style={{ background: s.surf, borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: s.txt3, marginBottom: 6 }}>Exit Strategy</div>
                        {r.exitInsight && <div style={{ fontSize: 12, color: s.txt2, lineHeight: 1.5 }}>{r.exitInsight}</div>}
                      </div>
                      <div style={{ background: s.surf, borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: s.txt3, marginBottom: 6 }}>Momentum</div>
                        {r.momentumAnalysis && <div style={{ fontSize: 12, color: s.txt2, lineHeight: 1.5 }}>{r.momentumAnalysis}</div>}
                      </div>
                    </div>

                    {/* Key risks */}
                    {r.keyRisks && r.keyRisks.length > 0 && (
                      <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {r.keyRisks.map((kr, ki) => (
                          <span key={ki} style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>⚠ {kr}</span>
                        ))}
                      </div>
                    )}

                    {/* Signals */}
                    {r.signals && r.signals.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {r.signals.map((sig, si) => (
                          <span key={si} style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, background: s.accentDim, color: s.accent }}>◆ {sig}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
