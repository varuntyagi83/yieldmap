'use client';

import { useState, useRef, useEffect } from 'react';
import { EnrichedListing, InvestorProfile } from '@/lib/types';
import { ThemeStyles } from '@/lib/theme';

interface Props {
  listings: EnrichedListing[];
  profile: InvestorProfile;
  s: ThemeStyles;
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

    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      result.push(
        <div key={lineIdx} style={{ display: 'flex', gap: 7, marginBottom: 2 }}>
          <span style={{ minWidth: 16, opacity: 0.6, fontSize: 13 }}>{olMatch[1]}.</span>
          <span style={{ fontSize: 13 }}>{inlineMarkdown(olMatch[2])}</span>
        </div>
      );
      return;
    }

    const ulMatch = trimmed.match(/^[-*]\s+(.*)/);
    if (ulMatch) {
      result.push(
        <div key={lineIdx} style={{ display: 'flex', gap: 7, marginBottom: 2 }}>
          <span style={{ minWidth: 10, opacity: 0.6, fontSize: 13 }}>•</span>
          <span style={{ fontSize: 13 }}>{inlineMarkdown(ulMatch[1])}</span>
        </div>
      );
      return;
    }

    if (!trimmed) {
      result.push(<div key={lineIdx} style={{ height: 5 }} />);
      return;
    }

    result.push(<span key={lineIdx} style={{ fontSize: 13 }}>{inlineMarkdown(trimmed)}<br /></span>);
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
        <code
          key={m.index}
          style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 3, padding: '1px 4px', fontSize: '0.85em' }}
        >
          {m[4]}
        </code>
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

const SUGGESTED_QUESTIONS = [
  'Which property has the best cash flow?',
  'What should I buy first with $100K down?',
  'Compare the top 2 properties for me',
  'Show me properties under $300K',
];

export default function ChatBot({ listings, profile, s }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  function buildChatContext(): string {
    if (listings.length === 0) return 'No qualifying properties found in the current search.';
    return listings
      .slice(0, 15)
      .map(
        (l, i) =>
          `#${i + 1} "${l.formattedAddress}" ${l.city}: ${fmt(l.price)}, rent ${fmt(l.yield.monthlyRent)}/mo, net ${fmtP(l.yield.netYield)}, CF ${fmt(l.yield.monthlyCashFlow)}/mo, ${l.bedrooms}BR`
      )
      .join('\n');
  }

  async function sendMessage(text?: string) {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const newMessages: Array<{ role: 'user' | 'assistant'; text: string }> = [
      ...messages,
      { role: 'user', text: userText },
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const context = buildChatContext();
    const systemPrompt = `You are YieldMap AI Assistant, a helpful real estate investment chatbot. Investor profile: tax rate ${profile.taxRate}%, down payment ${profile.downPct}%, mortgage rate ${profile.mortRate}%, ${profile.term}-year term.

PORTFOLIO (qualifying properties from current search):
${context}

INSTRUCTIONS:
- Reference properties by address with specific yield numbers.
- Keep responses concise (3-5 sentences) but data-rich.
- Suggest visiting AI Insights tab for deeper analysis when relevant.
- Be conversational but professional.`;

    const history = newMessages.map((m) => ({ role: m.role, content: m.text }));
    const reply = await callAI(history, systemPrompt);

    setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 380,
            height: 500,
            background: s.card,
            border: `1px solid ${s.border}`,
            borderRadius: 16,
            boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 200,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              borderBottom: `1px solid ${s.border}`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 17,
                flexShrink: 0,
              }}
            >
              💬
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: s.txt, fontWeight: 700, fontSize: 14 }}>YieldMap AI</div>
              <div style={{ color: '#22C55E', fontSize: 11 }}>Online</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: s.txt2, cursor: 'pointer', fontSize: 18, padding: '0 4px', lineHeight: 1 }}
            >
              ✕
            </button>
          </div>

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.length === 0 && (
              <div>
                <div style={{ color: s.txt2, fontSize: 13, textAlign: 'center', marginBottom: 16, lineHeight: 1.6 }}>
                  Ask me anything about the {listings.length > 0 ? `${listings.length} qualifying properties` : 'current search'} in your portfolio.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      style={{
                        background: s.surf,
                        border: `1px solid ${s.border}`,
                        borderRadius: 10,
                        padding: '9px 13px',
                        color: s.txt2,
                        fontSize: 12,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = s.surfH)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = s.surf)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #22C55E, #16A34A)' : s.surf,
                    border: msg.role === 'assistant' ? `1px solid ${s.border}` : 'none',
                    color: msg.role === 'user' ? '#fff' : s.txt,
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  {msg.role === 'assistant' ? renderMarkdown(msg.text) : msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 16px',
                    borderRadius: '14px 14px 14px 4px',
                    background: s.surf,
                    border: `1px solid ${s.border}`,
                    display: 'flex',
                    gap: 5,
                    alignItems: 'center',
                  }}
                >
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: s.txt3,
                        display: 'inline-block',
                        animation: `chatDot 1.2s ease-in-out ${dot * 0.2}s infinite`,
                      }}
                    />
                  ))}
                  <style>{`@keyframes chatDot { 0%,80%,100%{transform:scale(1);opacity:0.4} 40%{transform:scale(1.25);opacity:1} }`}</style>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input bar */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: '10px 12px',
              borderTop: `1px solid ${s.border}`,
              flexShrink: 0,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any property..."
              disabled={loading}
              style={{
                flex: 1,
                background: s.surf,
                border: `1px solid ${s.border}`,
                borderRadius: 10,
                padding: '9px 13px',
                color: s.txt,
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                padding: '9px 16px',
                borderRadius: 10,
                border: 'none',
                background: loading || !input.trim() ? s.surf : 'linear-gradient(135deg, #22C55E, #16A34A)',
                color: loading || !input.trim() ? s.txt3 : '#fff',
                fontWeight: 700,
                fontSize: 13,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                flexShrink: 0,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        title={open ? 'Close chat' : 'Open YieldMap AI chat'}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: 'none',
          background: open ? s.card : 'linear-gradient(135deg, #22C55E, #16A34A)',
          boxShadow: open ? `0 2px 12px rgba(0,0,0,0.3)` : '0 4px 20px rgba(34,197,94,0.4)',
          color: open ? s.txt2 : '#fff',
          fontSize: 22,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 201,
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
      >
        {open ? '✕' : '💬'}
      </button>
    </>
  );
}
