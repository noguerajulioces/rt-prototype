<!--
Sync Impact Report
==================
Version change: 1.0.0 → 1.1.0
Bump rationale: Five open questions resolved with binding decisions (map
  strategy, replay scope, theme mode, mobile pattern, brand tokens). Decisions
  add material content to scope and technology stack; MINOR bump.
Modified principles: (none — wording unchanged)
Modified sections:
  - Technology Stack → Map: TODO replaced with concrete MapLibre + Kartverket choice
  - Technology Stack → Brand tokens: caveat softened; values are working defaults
  - Visual Reference §4 (Elevation & timeline): replay confirmed as functional mock
  - Scope → In scope: dark mode confirmed; mock replay confirmed; bottom-sheet confirmed
Added sections:
  - Resolved Decisions (log of what was decided when, replacing Open Questions)
Removed sections:
  - Open Questions (all five resolved — see Resolved Decisions)
Templates requiring updates:
  - ⚠ .specify/templates/plan-template.md — pending (template not yet bootstrapped)
  - ⚠ .specify/templates/spec-template.md — pending (template not yet bootstrapped)
  - ⚠ .specify/templates/tasks-template.md — pending (template not yet bootstrapped)
Follow-up TODOs:
  - (none — all 1.0.0 TODOs resolved)
-->

# RaceTracker UI Redesign — Constitution

**Version:** 1.1.0
**Ratification date:** 2026-05-15
**Last amended:** 2026-05-15
**Project codename:** `racetracker-ui-prototype`

This constitution governs the **visual and interaction redesign** of the public
RaceTracker live-tracking experience (reference: `https://maps.racetracker.no/?race=<slug>`).
The artefact under design is the **spectator/viewer interface**: the public-facing
page that race fans, family, and journalists open during a race to follow runners.

It is **not** a redesign of the timing operator, race-director, or athlete-onboarding
back-office. Those flows are explicitly out of scope (see §Scope).

---

## Core Principles

### I. Visual Parity with RaceTracker, Minus Dead Features

The redesigned UI MUST cover the full information surface of the current
RaceTracker viewer that an end-user actually consumes during a race. The
following features observed in the reference UI are EXPLICITLY DROPPED for v1
and MUST NOT be added without an amendment:

- **Facebook integration** (the FB icon in the left toolbar): removed.
- **Video module** (the film/play-list icon in the left toolbar): removed.

Every other feature observed in the reference UI is in-scope (see §Visual
Reference). Removing a feature beyond the two listed above requires a MINOR
version bump and explicit user approval.

**Why:** the user has confirmed FB and video are not desired; preserving the
rest avoids regressions in functional coverage for spectators who depend on
specific features (e.g. predictive tracking, replay).

### II. shadcn/ui Is the Component Substrate

All interactive primitives (buttons, dialogs, tables, dropdowns, switches,
checkboxes, tabs, command palette, popovers, tooltips, sliders, progress) MUST
be sourced from `shadcn/ui` and customised through its CSS-variable theme
system. Hand-rolled equivalents are FORBIDDEN unless no shadcn primitive
exists, in which case the new component MUST follow shadcn conventions
(`cn()` utility, `data-state` attributes, Radix-compatible APIs).

**Why:** shadcn gives a consistent accessibility baseline (Radix), keeps the
prototype upgradeable, and matches the "modern" aesthetic the user requested.
Avoiding ad-hoc components prevents accessibility and theming drift.

### III. RaceTracker Brand Tokens as the Single Source of Truth for Color

A single set of CSS variables defines the brand palette (see §Technology Stack
→ Brand tokens). All Tailwind utility usage MUST consume these tokens
(`bg-primary`, `text-foreground`, `border-border`, etc.) rather than literal
Tailwind palette classes (`bg-blue-600`, `text-zinc-900`). Direct hex literals
in components are FORBIDDEN.

**Why:** the user has asked for "RaceTracker colors". A single token layer lets
us tune brand later without sweeping refactors and is the contract shadcn
expects (`--primary`, `--background`, etc.).

### IV. Spec-First, Mock-First, Wire-Later

Every screen MUST be specified before implementation. The implementation order
is: (a) spec doc, (b) mock data in `lib/`, (c) UI rendering the mock, (d)
later wiring to a real data source. No real network or websocket integration
is allowed in the prototype phase. Data shape is the contract.

**Why:** the user explicitly asked to "write everything first" before coding
further. This principle codifies that: design and data contracts precede
implementation, so visual review can happen against stable mocks.

### V. Performance Budget for Live Tracking

The viewer page MUST stay usable on a phone over LTE during a race. Concrete
budgets for v1:

- Initial JS bundle (route-level): **≤ 250 KB gzip** excluding map tiles.
- Time-to-interactive on a mid-tier Android over 4G: **≤ 3.0 s**.
- The list of participants MUST be virtualised when n > 100 rows.
- Map redraws on tick updates MUST NOT cause layout thrash (no full
  React tree re-render per tick; updates flow through refs/imperative APIs
  for the marker layer).

**Why:** the existing RaceTracker handles thousands of participants and ticks
every few seconds. Failing perf budgets here destroys the core use case
(spectator following their runner on mobile mid-race).

---

## Visual Reference

This section documents what was observed in the reference UI screenshots
shared on 2026-05-15. It is the **functional inventory** the redesign must
match (minus the two dropped features). Layout MAY change; functionality MUST
be preserved.

### 1. Frame chrome

- **Top bar**: full-width dark band. Left: race name in uppercase (e.g.
  `NEKROTRAIL 2026`). Right: RaceTracker wordmark + signal-wave logo.
- **Left rail (icon toolbar)**: vertical strip of icon-only buttons.
  Order in reference: Participants, Stats/Elevation, ~~Facebook~~,
  History/Replay, ~~Video~~, Settings. The redesign rail MUST contain:
  Participants, Stats/Elevation, History/Replay, Settings.
- **Collapsible left panel**: chevron button at the rail's edge collapses /
  expands the sidebar over the map.

### 2. Participants sidebar

- **Search field** (icon: magnifier) — free-text over name and BIB.
- **Filter button** (icon: people-with-filter) — opens a popover with gender,
  category, country, status filters.
- **List columns (compact)**: checkbox, Rank, Name, BIB.
- **List columns (expanded)**: checkbox, Rank, Name, BIB, Gender, Country
  (flag), one column per checkpoint (CP1, CP2, …), MÅL (finish time).
- **Selection checkboxes**: select participants to "follow" — their pins are
  highlighted on the map and their tracks are shown if "Show favourite's
  tracks" is on.
- **Row interaction**: clicking a row name opens the runner detail modal
  (§5).
- **Sort indicator**: caret on the active sort column (default: Rank asc).
- **Zebra striping**: alternating rows use a faint warm-yellow row tint.

### 3. Map canvas

- Base map: real-world tiles (Kartverket / Norwegian topographic in the
  reference). Trail line drawn as a thick blue polyline.
- **Checkpoint markers**: rounded pin with white check icon. Distinct shape
  for Start and Finish (square white icon inside the pin).
- **Map controls (bottom-right)**: fit-to-bounds, geolocate-me, zoom in,
  zoom out.
- **Scale indicator (top-right of canvas)**: distance scale (e.g. `5 km`).
- **Attribution (bottom-left)**: e.g. `© Kartverket`.
- **Runner pins**: BIB-labelled marker (toggleable via Settings → Show start
  number). Leader gets a distinct visual (Settings → Show leader).
- **Predictive tracking** (Settings toggle): when on, runner positions
  between known GPS fixes are extrapolated along the route; when off, last
  known position is shown.

### 4. Elevation & timeline (bottom strip)

- **Elevation profile**: area chart along the bottom of the map. X-axis in km
  (0 km → race distance), Y-axis in meters of elevation. Checkpoint cutoffs
  are marked with an alarm-clock glyph above the chart at the cutoff km.
- **Replay timeline (very bottom)**: play/pause button, scrubber, current
  time-of-day readout (`HH:MM:SS`). Scrubbing the bar moves all runner pins
  to their position at that moment in race time. v1 implementation is a
  **functional mock replay** against the splits in `lib/mock-data.ts`:
  positions are linearly interpolated along the route between adjacent
  checkpoint splits for each runner. No historical GPS trail is required for
  v1; the contract is proven against mocks so the real wiring is a drop-in
  replacement.

### 5. Runner detail modal

Opens on row-click or on map-pin-click. Centred dialog with:

- **Header**: runner name, CLOSE button.
- **Metadata block**: BIB, Gender, Born (year), Country (with flag).
- **Splits table**: two columns — `Time` (elapsed from start) and
  `Time of day` (wall-clock). Rows: Start, every CP, MÅL (finish).
- **Footer**: `LINK TO ATHLETE` (copy-link), `CLOSE`.

### 6. Settings panel (gear icon)

Toggles observed in reference (MUST be preserved):

- Show leader
- Show start number (BIB)
- Predictive tracking
- Show favourite's tracks
- Imperial length units (km ↔ mi, m ↔ ft)
- Show all names

---

## Technology Stack

### Framework

- **Next.js 16** (App Router, React Server Components by default).
- **React 19**.
- **TypeScript** strict mode.

### Styling

- **Tailwind CSS v4** (CSS-first config via `@theme inline`).
- **shadcn/ui** components (Radix UI primitives under the hood).
- **lucide-react** for icons (matches shadcn's default).

### Brand tokens

The following CSS variables are the v1 brand palette. Values are working
defaults derived from the reference RaceTracker UI. They MAY be swapped for
official brand hex values later via a PATCH amendment without touching any
component code, since all components consume tokens not literals.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` | `#ffffff` | `#0a0a0a` | App background |
| `--foreground` | `#0a0a0a` | `#fafafa` | Body text |
| `--header` | `#171717` | `#000000` | Top bar |
| `--header-foreground` | `#fafafa` | `#fafafa` | Top bar text |
| `--primary` | `#1d4ed8` | `#3b82f6` | Route line, pins, primary actions |
| `--primary-foreground` | `#ffffff` | `#ffffff` | Text on primary |
| `--accent` | `#fef3c7` | `#422006` | Selected row tint |
| `--muted` | `#f4f4f5` | `#171717` | Subtle surfaces |
| `--muted-foreground` | `#71717a` | `#a1a1aa` | Secondary text |
| `--border` | `#e4e4e7` | `#1f1f23` | Dividers, borders |
| `--success` | `#16a34a` | `#22c55e` | Finished status |
| `--warning` | `#d97706` | `#f59e0b` | Approaching cutoff |
| `--danger` | `#dc2626` | `#ef4444` | DNF / past cutoff |

### Map

- **MapLibre GL JS** as the map renderer (open source, ~200 KB gzip,
  GPU rendering, WebGL).
- **Default tile source: Kartverket** (Norwegian topographic) for Norwegian
  races, matching the reference RaceTracker look. Endpoint configured in
  `lib/map-sources.ts`.
- **Fallback tile source: OpenStreetMap** raster tiles for races outside
  Norway, switched automatically based on race metadata (`race.country !==
  "NO"`).
- Map is loaded only on the client (`'use client'` + dynamic import with
  `ssr: false`) to keep it out of the initial server bundle.
- Marker layer updates flow through MapLibre's imperative API
  (`map.getSource(id).setData(...)`) rather than React re-renders, per
  Principle V's performance budget.

### Charts

- Custom SVG for elevation profile (no chart library in v1). If we add
  multi-series charts later, prefer `recharts` (already React-native and
  shadcn has chart wrappers).

### State / data

- Server Components by default; Client Components only where interactivity
  requires it (filters, map, modal state, settings toggles).
- URL is the source of truth for: active runner (`/corredor/<id>`), filters
  (search-params), selected favourites (search-params, comma-separated BIBs).
- Mock data lives in `lib/mock-data.ts`. No network calls in v1.

### Internationalisation

- v1 UI strings in **Spanish** (matches the user's working language). Strings
  centralised in `lib/i18n.ts` to make a later Norwegian / English pass
  trivial.

---

## Scope

### In scope (v1)

- Public viewer page: map, sidebar, elevation, settings, runner modal.
- Mock data only (15+ runners, 5–7 checkpoints, single race).
- **Light and dark theme** with `prefers-color-scheme` detection and a
  manual override toggle in the Settings panel. Theme choice persists in
  `localStorage`.
- **Functional mock replay** of the bottom timeline (see Visual Reference §4
  for the contract).
- Desktop ≥ 1280 px width as primary target.
- **Mobile responsive view** (≥ 360 px width):
  - Participants sidebar collapses into a **draggable bottom sheet** with
    three snap points (peek / mid / full) — iOS Maps-style — using shadcn's
    `Drawer` primitive over `vaul`.
  - Runner detail becomes a **full-screen sheet** instead of a centred
    dialog.
  - Left icon rail collapses into a horizontal bottom action bar above the
    sheet.
- Static prerender with `searchParams` for filters (per Next.js 16 patterns).

### Out of scope (v1)

- Real-time data ingestion (websockets, polling, GPS feeds).
- Multi-race switcher / race index page (one race per deploy for v1).
- Athlete-onboarding / registration flows.
- Race-director / timing operator back-office.
- Push notifications, alerts, "your runner just hit CP3" subscriptions.
- Social sharing / Open Graph cards beyond a basic per-page OG image.
- Facebook integration (explicitly dropped).
- Video module (explicitly dropped).
- Internationalisation beyond Spanish (structure ready, content not
  translated).

---

## Resolved Decisions

Log of decisions that closed earlier open questions. Each entry is binding
until amended (see Governance → Amendment procedure). New decisions append
to this list; entries are not edited in place — they are superseded by a
later entry referencing them.

### 2026-05-15 · Map renderer and tile sources

**Decision:** MapLibre GL JS as the renderer. Kartverket topographic tiles
as the default source for races where `race.country === "NO"`. OpenStreetMap
raster tiles as the fallback for every other race.

**Rationale:** matches the reference RaceTracker look for the primary
audience (Norwegian races), avoids vendor lock-in, and the WebGL renderer
keeps per-tick redraws off the React tree. OSM fallback keeps the redesign
viable for international races without provisioning paid tile providers.

**Supersedes:** v1.0.0 TODO `MAP_STRATEGY`.

### 2026-05-15 · Replay timeline is functional in v1

**Decision:** The bottom replay timeline IS in scope and IS functional in
v1, backed by mock data. Scrubbing interpolates each runner's position
linearly between adjacent splits in `lib/mock-data.ts`. No historical GPS
trail is rendered in v1 (the marker just moves).

**Rationale:** mock replay is cheap, demos well, and proves the
interpolation contract so the real-data wiring is a drop-in. Cutting it
would leave a visually empty strip at the bottom of the reference layout.

**Supersedes:** v1.0.0 TODO `REPLAY_SCOPE`.

### 2026-05-15 · Light + dark theme at parity

**Decision:** v1 ships with both light and dark themes. Initial theme is
selected from `prefers-color-scheme`; a manual override toggle in the
Settings panel persists the choice in `localStorage` under the key
`racetracker:theme`.

**Rationale:** trail races are spectator events that often run into the
night; family members frequently watch from bed. Dark mode is real user
value, and shadcn's token system makes parity nearly free.

**Supersedes:** v1.0.0 TODO `THEME_MODE`.

### 2026-05-15 · Mobile uses bottom-sheet + full-screen patterns

**Decision:** Below the `md` breakpoint (768 px):

- The participants sidebar collapses into a draggable bottom sheet with
  three snap points (peek ≈ 96 px / mid ≈ 50 vh / full ≈ 92 vh), rendered
  with shadcn's `Drawer` primitive (over `vaul`).
- The runner detail modal becomes a full-screen sheet.
- The left icon rail becomes a horizontal action bar pinned above the
  bottom sheet's handle.

**Rationale:** trail-race spectators check on phones outdoors and one-handed.
Bottom sheets keep the map visible while the list is reachable, which a
hamburger drawer does not.

### 2026-05-15 · Brand tokens are working defaults

**Decision:** Ship v1 with the brand token hex values listed in Technology
Stack → Brand tokens. They are eyedroppered from the reference UI. Swapping
in official brand values later is a PATCH amendment that only edits CSS
custom properties — no component changes required, by Principle III.

**Supersedes:** v1.0.0 TODO `BRAND_TOKENS`.

---

## Governance

### Amendment procedure

1. Proposed amendments are described in plain language in a pull request
   description (or a chat message if no PR workflow is in place yet).
2. The amendment MUST list which principle(s) are affected and which version
   bump it implies (MAJOR / MINOR / PATCH — see versioning below).
3. The amendment MUST update this file AND the Sync Impact Report header
   comment AND, if it touches templates, the affected
   `.specify/templates/*.md` files.
4. The user (project owner) approves the amendment before it lands.

### Versioning policy

- **MAJOR**: removing or fundamentally redefining a principle, or removing a
  feature observed in the reference UI beyond the two already dropped (FB,
  video).
- **MINOR**: adding a new principle, adding a new section, materially
  expanding scope.
- **PATCH**: wording, typos, clarifications that do not change behaviour or
  scope.

### Compliance review

Before any speckit-plan or speckit-tasks phase begins, the corresponding
spec MUST include a "Constitution Check" section that verifies the planned
work against principles I–V. Plans that violate principles MUST either
amend the constitution first or be reduced in scope.

### Living document

This constitution is expected to be re-read and re-asserted at the start of
every major iteration of the prototype. Stale principles should be removed
or amended rather than ignored.
