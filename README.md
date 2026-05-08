# YieldMap v2.0

**The Investor Operating System for US Real Estate**

YieldMap is a comprehensive property investment platform that combines a full-cost yield calculator, interactive map visualization, AI-powered analysis, and 10+ tools that don't exist in any competing product.

## Live Demo

**[https://varuntyagi83.github.io/yieldmap/](https://varuntyagi83.github.io/yieldmap/)**

## Features

| Feature | Description | Exists Elsewhere? |
|---------|-------------|:-:|
| **Interactive Map** | US map with yield-colored pins, clustering, decluttering | Partial |
| **Full-Cost Yield Engine** | 15 cost categories, IRS 27.5yr depreciation, actual mortgage amortization | No |
| **AI Investment Insights** | Claude-powered analysis with stress/exit/momentum context | No |
| **Deal Stress Test** | 7 scenarios including "perfect storm", break-even thresholds | No |
| **Exit Strategy Planner** | Hold vs Sell vs Refi vs 1031, 10-year projections with tax modeling | No |
| **Neighborhood Momentum** | Direction-weighted city scoring (where it's going, not where it is) | No |
| **Portfolio Health** | Concentration risk, blended metrics, auto risk flags | No |
| **Yield Optimizer** | 16 specific improvements with calculated yield impact | No |
| **Services Marketplace** | 26 vetted provider types across 7 categories | No |
| **Investor Network** | Deal-sharing social feed with intro requests | No |
| **AI Chatbot** | Portfolio-aware conversational assistant on every view | No |
| **Theme System** | Dark / Light / System default | Standard |

## Tech Stack (Prototype)

- React 18 + Vite
- SVG-based US map (no external tile server needed)
- Anthropic Claude API (AI Insights + Chatbot)
- Pure client-side yield calculations

## Getting Started

```bash
git clone https://github.com/varuntyagi83/yieldmap.git
cd yieldmap
npm install
npm run dev
```

## Production Roadmap

See `YieldMap-v2-Production-PRD.docx` for the full production specification including:
- Next.js 15 + Supabase + Mapbox GL architecture
- Database schema with RLS
- 14-week build timeline (M0-M6)
- Claude Code prompts for each feature
- Kill criteria and cost targets

## Author

**Varun Tyagi** - [meetvaruntyagi.com](https://www.meetvaruntyagi.com)

Built with CoreVisionAI Labs | Raygency
