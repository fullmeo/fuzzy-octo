# CLAUDE.md — Fuzzy-Octo AI Assistant Guide

This file documents the project architecture, conventions, and workflows for AI assistants (Claude and others) working on **Fuzzy-Octo**.

---

## Project Overview

**Fuzzy-Octo** is a React + Node.js/Express AI coding assistant with a Sea-Quest game integration and a "Pinky Poulpe" octopus mascot.

- **Frontend**: React 19 + TypeScript SPA (Create React App / react-scripts)
- **Backend**: Express.js REST API serving both API endpoints and the static React build
- **AI Core**: Magnus 13.2 Convergence Engine + AdvancedAI multi-model router
- **Game**: Sea-Quest integration with FUZZY token economy

---

## Directory Structure

```
fuzzy-octo/
├── api/
│   ├── index.js              # Express server entry point
│   ├── fuzzy_api_system.ts   # TypeScript API type definitions
│   ├── routes/
│   │   └── seaquest.js       # Sea-Quest game routes
│   ├── src/
│   │   ├── gameState.js      # GameStateManager (in-memory sessions)
│   │   ├── players.js        # PlayerManager (XP/leveling/leaderboard)
│   │   └── tokens.js         # TokenManager (FUZZY token economy)
│   └── tests/
│       ├── seaquest.test.js  # 17 tests (game, players, tokens)
│       ├── convergence.test.js # 21 tests (Magnus 13.2 engine)
│       └── advancedai.test.js # 12 tests (AdvancedAI router)
├── services/
│   ├── AdvancedAI.js         # Multi-model AI router
│   └── convergence/
│       └── index.js          # Magnus 13.2 Convergence Engine
├── src/
│   ├── App.tsx               # Main React app
│   ├── index.tsx             # React entry point
│   ├── vscode-integration.ts # VS Code bridge (must export {})
│   ├── components/
│   │   ├── PinkyOctopus.tsx  # Octopus mascot component
│   │   ├── analytics/
│   │   │   ├── MetricsPanel.tsx    # Analytics dashboard panel
│   │   │   └── LeaderboardPanel.tsx # Leaderboard panel
│   │   └── dashboard/
│   │       └── Dashboard.tsx       # Main dashboard (tabs: metrics/leaderboard/status)
│   └── styles/
│       └── pinky.css         # Pinky Poulpe octopus styles
├── public/                   # Static assets (production build target in Docker)
├── Dockerfile                # Multi-stage build (builder → production)
├── .github/workflows/ci.yml  # CI: test, build, audit, docker
├── .env.example              # Required env vars template
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## Key Architecture

### Magnus 13.2 Convergence Engine (`services/convergence/index.js`)

Pipeline: `UnderstandingEngine` → `LearningEngine` → `AgentAllocator` → `ConvergenceEngine`

- **UnderstandingEngine**: Complexity/clarity scoring (keyword analysis, sentence structure)
- **LearningEngine**: Bigram pattern tracking, query history, top-pattern extraction
- **AgentAllocator**: Routes to AI tier based on complexity (low/medium/high/critical → haiku/sonnet/opus)
- **ConvergenceEngine**: Full pipeline orchestration, singleton `convergenceEngine` exported

### AdvancedAI Service (`services/AdvancedAI.js`)

Multi-model router with fallback chain:
1. **Anthropic** (primary): `claude-haiku-4-5` / `claude-sonnet-4-6` / `claude-opus-4-6` by complexity
2. **OpenAI** (fallback): `gpt-3.5-turbo` / `gpt-4o` by complexity
3. **Rule-based fallback**: Always available, no API keys needed

Key methods:
- `query(prompt, context?)` — Single query through the chain
- `generateTentacleSolutions(problem)` — 8 parallel solutions in different styles
- `getStats()` — Provider call counts, error rates, availability

### Sea-Quest Game API (`api/routes/seaquest.js`)

All routes mounted at `/api/seaquest/`:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/leaderboard?limit=N` | Top N players |
| POST | `/sessions` | Create game session |
| PATCH | `/sessions/:id` | Update session state |
| GET | `/players/:userId` | Get player profile |
| POST | `/players` | Create player |
| PATCH | `/players/:userId/score` | Update score + XP/level |
| GET | `/tokens/:userId` | Get FUZZY balance + history |
| POST | `/tokens/:userId/spend` | Spend FUZZY tokens |
| GET | `/status` | Game system health |

### FUZZY Token Economy (`api/src/tokens.js`)

- Welcome bonus: 100 FUZZY on first player creation
- Score rewards: 1 FUZZY per 10 score points
- Daily login bonus: 10 FUZZY (once per UTC day)
- Spend guard: rejects if balance insufficient

### Express Server (`api/index.js`)

- Static files served from `build/` (dev) or `public/` (production/Docker)
- SPA catch-all at end: `app.get('*', ...)` sends `index.html` for React deep-links
- Key endpoints: `/api/seaquest/*`, `/api/analytics/metrics`, `/v1/fuzzy/status`

---

## npm Scripts

```bash
npm start          # React dev server (port 3000)
npm run build      # Production React build → build/
npm run server     # Express API server (port 3001 or $PORT)
npm test           # React test runner (interactive)
npm run test:api   # node api/tests/seaquest.test.js   (17 tests)
npm run test:convergence  # node api/tests/convergence.test.js (21 tests)
npm run test:ai    # node api/tests/advancedai.test.js  (12 tests)
npm run test:all   # All 3 API test suites (50 tests total)
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-openai-key-here   # optional, enables OpenAI fallback
PORT=3001                                 # API server port (default 3001)
NODE_ENV=production                       # set in Docker/deploy
```

The app works without API keys (falls back to rule-based responses).

---

## Docker

```bash
# Build
docker build -t fuzzy-octo .

# Run
docker run -p 3001:3001 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  fuzzy-octo
```

Multi-stage build:
1. **builder** (`node:20-alpine`): installs all deps, runs `npm run build`
2. **production**: installs only prod deps, copies `build/` → `public/`, runs as non-root user

---

## CI/CD (`.github/workflows/ci.yml`)

Four jobs on every push/PR:

| Job | What it does |
|-----|-------------|
| `test` | `npm run test:all` — 50 API tests |
| `build` | `npm run build` with `CI=false` — React production build |
| `audit` | `npm audit --audit-level=high` — security check |
| `docker` | `docker build -t fuzzy-octo:ci .` — image build |

---

## TypeScript Notes

- **`tsconfig.json`** uses `"isolatedModules": true` — every `.ts`/`.tsx` file must be a module
- Files without imports/exports need `export {};` at the bottom (e.g., `vscode-integration.ts`)
- Target is `"es5"` — use `Array.from(new Set(...))` not `[...new Set(...)]`

---

## CSS Conventions (Pinky Poulpe — `src/styles/pinky.css`)

**Critical**: Tentacles use positional `transform: translate(...)` for placement. Never override with `transform: scale()` — use the separate CSS `scale` property instead:

```css
/* WRONG — overrides the positional translate */
.tentacle:hover { transform: scale(1.2); }

/* CORRECT — separate property, no conflict */
.tentacle:hover { scale: 1.25; }
```

Same rule applies to `@keyframes` for tentacle animations.

---

## Security Overrides (`package.json`)

The `overrides` field patches transitive dependency vulnerabilities. **Do not remove** without checking `npm audit` first.

**Do not add** `ajv` or `minimatch` overrides — they break `fork-ts-checker-webpack-plugin` (AJV 6 vs 8 API mismatch) and `minimatch` v3 callers respectively.

Current overrides: `nth-check`, `postcss`, `webpack-dev-server`, `js-yaml`, `svgo`, `node-forge`, `jsonpath`, `bfj`, `lodash`, `qs`, `react-router`, `webpack`, `serialize-javascript`.

---

## Pinky Poulpe Component (`src/components/PinkyOctopus.tsx`)

States: `idle` | `thinking` | `success` | `excited` | `error` | `sleeping` | `hovered`

The component is fully accessible:
- `role="button"`, `tabIndex={0}`, `aria-label` on main body and each tentacle
- `aria-live="polite"` status region for screen readers
- `onKeyDown` handles Enter/Space for keyboard activation

Tentacle emojis map to 8 AI capabilities: run, brain, shield, lightning, art, book, crystal ball, bulb.

---

## Common Pitfalls

1. **Build fails with AJV error**: You added an `ajv` override. Remove it.
2. **`minimatch_1.default is not a function`**: You added a `minimatch` override. Remove it.
3. **TS1208 "not a module"**: File under `isolatedModules` needs `export {};` at bottom.
4. **Tentacle hover breaks position**: Used `transform: scale()` instead of `scale:`.
5. **SPA 404 on deep-link**: Missing catch-all in `api/index.js` — `app.get('*', ...)` must be last.
6. **`@anthropic-ai/sdk` not found in tests**: Run `npm install` — it's a required dependency.

---

## Development Workflow

```bash
# Terminal 1 — React dev server
npm start

# Terminal 2 — Express API server
npm run server

# Run all tests
npm run test:all

# Build for production
npm run build
```

The React app proxies API calls to Express via the `"proxy"` field (if configured) or via absolute URLs in production.
