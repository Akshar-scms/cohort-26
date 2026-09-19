---
name: Precision Dark Utility
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#cac4d5'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#938e9e'
  outline-variant: '#484553'
  surface-tint: '#cbbeff'
  primary: '#cbbeff'
  on-primary: '#320a93'
  primary-container: '#6e56cf'
  on-primary-container: '#efe8ff'
  inverse-primary: '#6249c2'
  secondary: '#cabeff'
  on-secondary: '#320e90'
  secondary-container: '#492fa6'
  on-secondary-container: '#b9aaff'
  tertiary: '#a3c9ff'
  on-tertiary: '#00315d'
  tertiary-container: '#006cc0'
  on-tertiary-container: '#e3ecff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#cbbeff'
  on-primary-fixed: '#1d0061'
  on-primary-fixed-variant: '#4a2ea9'
  secondary-fixed: '#e6deff'
  secondary-fixed-dim: '#cabeff'
  on-secondary-fixed: '#1d0061'
  on-secondary-fixed-variant: '#492fa6'
  tertiary-fixed: '#d3e3ff'
  tertiary-fixed-dim: '#a3c9ff'
  on-tertiary-fixed: '#001c39'
  on-tertiary-fixed-variant: '#004883'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  h1:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  h2:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '550'
    lineHeight: 24px
    letterSpacing: -0.01em
  body:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  small:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  micro:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  mono-metric:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 22px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system embodies high-density engineering aesthetics, directly influenced by Linear, Vercel Dashboard, and Resend. It is built strictly for high-focus environments: MCA placement tracking, technical mentorship, and interview scheduling.

### Emotional Tone & Character
- **Disciplined & Quiet:** Dark-only surfaces eliminate visual fatigue. There are no ambient glows, decorative gradients, or saturated cards.
- **Engineered Precision:** Crisp 1px hairlines establish structural clarity. Visual hierarchy is achieved entirely through typography scaling and subtle surface shade differences.
- **High Utility:** Interface elements are compact, deliberate, and high-density, respecting screen real estate for deep metrics and pipelines.

### The Single-Accent Rule
Accent saturation (#6E56CF) is preserved exclusively for deliberate user actions. Exactly **one primary action element per view** may utilize a filled accent surface. All other buttons, chips, indicators, and controls must utilize neutral borders, muted surface tiers, or raw text styles.

## Colors

The palette operates in dark mode only. It consists of calibrated neutral zinc levels paired with a single vibrant purple-indigo accent and crisp semantic tones.

### Surface Tiers
- **Surface 0 (`#0A0A0B`):** Global canvas and base viewport backdrop.
- **Surface 1 (`#121214`):** Base structural layer for containers, sidebar, data tables, and major content cards.
- **Surface 2 (`#18181B`):** Interactive resting states (inputs, search bars) and hover states over Surface 1.
- **Surface 3 (`#1F1F23`):** Transient elements elevated above all base layouts: dialog panels, dropdown menus, context popovers.

### Hairline Borders
Structural separation relies strictly on borders, avoiding drop shadows:
- **Hairline Default (`#26262A`):** Applied uniformly to panel dividers, card boundaries, table rows, and input perimeters at exactly 1px thickness.
- **Hairline Strong (`#34343A`):** Used for input hover, active tab borders, and elevated context edges.

### Accent & Semantics
- **Accent Primary (`#6E56CF`):** Applied strictly to the singular dominant CTA per view.
- **Accent Hover (`#7C66DC`):** Interaction state for the primary CTA.
- **Accent Tint (`rgba(110, 86, 207, 0.12)`): Active state for secondary elements (e.g., active navigation item badge or active sidebar item).
- **Semantics:** Success (`#30A46C`), Warning (`#FFB224`), Danger (`#E5484D`), and Info (`#0091FF`) are reserved strictly for 6px status dots, status text, and critical error states. They never fill full card or button backgrounds.

## Typography

Typography prioritizes information density, readability, and immediate scan-times.

### Typefaces
- **Primary Typeface:** `Geist` (fallback: `Inter`) handles all display, headings, body, and navigation items.
- **Monospace Typeface:** `JetBrains Mono` (fallback: `Geist Mono`) is used systematically for all dynamic numerical and technical identifiers: CGPA ratings, student enrollment numbers, dates, timestamps, code snippets, and metric counters.

### Tabular Formatting
Every instance of numeric data, tables, metric readouts, and timestamps must declare `font-variant-numeric: tabular-nums` to maintain vertical visual alignment across fast-updating pipelines.

### Text Hierarchy
- **Display & Headings:** Tight letter-spacing with strong weights (550-600) ensure titles remain sharp and grounded.
- **Labels & Metadata:** All tokens designated as `label` and `micro` enforce an uppercase transformation with expanded tracking (+0.02em to +0.03em) to distinguish metadata from content copy.
- **Secondary & Tertiary Colors:** Use `#A0A0AB` for descriptions, column headings, and secondary details. Use `#6E6E78` for disabled states, micro metadata, and breadcrumb dividers.

## Layout & Spacing

The interface follows an integrated application-shell layout model:

### Application Shell
- **Fixed Sidebar:** Dedicated width of `240px`, pinned to the left on desktop viewports. Bordered with a right hairline (`1px solid #26262A`).
- **Topbar:** Pinned height of `56px`, full width across the content canvas, bordered with a bottom hairline (`1px solid #26262A`).
- **Main Canvas:** Centered content with a max-width limit of `1200px`, avoiding sprawling line-lengths on ultra-wide monitors.

### Spacing Rhythm
Built upon a strict 4px base increment:
- **`space-xs` (4px):** Gaps between status indicators and micro labels; button icon-to-text spacing.
- **`space-sm` (8px):** Internal padding for small buttons, table cell vertical padding, tight form field gaps.
- **`space-md` (12px):** Standard input horizontal padding, badge padding, card header-to-content gap.
- **`space-lg` (16px):** Standard component padding inside cards and side panels; grid gutters on medium screens.
- **`space-xl` (24px):** Main canvas edge padding; gap between distinct analytical cards.
- **`space-2xl` (32px):** Major vertical section padding.

### Responsive Breakpoints
- **Desktop (≥ 1024px):** Persistent 240px sidebar, 12-column grid layout for cards and placement lists.
- **Tablet (768px - 1023px):** Sidebar collapses to an icon rail (64px) or modal drawer; content grid drops to 6 columns; outer margins contract to `1rem`.
- **Mobile (< 768px):** Sidebar collapses entirely into an off-canvas drawer controlled via the topbar; topbar remains 56px; 4-column layout; card padding defaults to `space-md` (12px).

## Elevation & Depth

Visual hierarchy is constructed entirely without box-shadows, using surface layering and hairline borders.

### The No-Shadow Rule
Drop shadows are prohibited in standard page flows, metric cards, navigation panels, and table rows. Depth is conveyed purely through:
1. **Luminance Steps:** Baseline content rests on Surface 0 (`#0A0A0B`). Cards and major blocks live on Surface 1 (`#121214`). Nested inputs live on Surface 2 (`#18181B`).
2. **Hairline Outlines:** All containers, cards, tables, and borders are outlined with a crisp `1px solid #26262A`.

### Permitted Exceptions: Focus & Dialogs
- **Focus Rings:** Form controls and accessible interactive elements receive an outer ring: `0 0 0 2px #0A0A0B, 0 0 0 4px #6E56CF`.
- **Modal Dialogs & Floating Drawers:** Popovers and dialogs (Surface 3 `#1F1F23`) sit on an overlay backdrop of `rgba(0, 0, 0, 0.7)` with `backdrop-filter: blur(4px)`. They may utilize an ambient deep shadow (`0 20px 48px -12px rgba(0, 0, 0, 0.6)`) to preserve contrast against busy background content.

## Shapes

The geometric framework balances technical discipline with subtle softness:

- **Radius Card (`12px`):** Applied to top-level containers, dashboard widgets, modal dialog windows, and main surface enclosures.
- **Radius Base (`10px`):** Applied to all inner interactive components: form inputs, standard action buttons, dropdown select menus, and contextual menu sheets.
- **Pill (`9999px`):** Reserved exclusively for status indicator badges, student tag chips, and notification counters. Inner elements like check controls or icon containers never use circular forms unless purely representational (e.g., student profile avatars).

## Components

### Buttons
- **Primary Action (Max 1 per view):**
  - Background: `#6E56CF`, Color: `#FFFFFF`, Border: `none`, Radius: `10px`, Font: `13px / 20px`, Weight: `500`.
  - Hover: `#7C66DC`.
- **Secondary Action:**
  - Background: `#121214`, Color: `#EDEDEF`, Border: `1px solid #26262A`, Radius: `10px`.
  - Hover: Background `#18181B`, Border `#34343A`.
- **Ghost / Subtle:**
  - Background: `transparent`, Color: `#A0A0AB`, Border: `none`.
  - Hover: Background `#18181B`, Color `#EDEDEF`.

### Chips & Badges
Chips are never filled with solid color. They are outline-only:
- **Base Style:** Height 24px, Border `1px solid #26262A`, Background: `transparent`, Radius: `9999px`, Padding: `0 8px`.
- **Status Chips:** Feature a 6px circular dot followed by label text (`12px`, weight 500, tabular numbers).
  - *Shortlisted / Placed:* Dot `#30A46C`, Text `#EDEDEF`.
  - *Under Review / In Process:* Dot `#FFB224`, Text `#EDEDEF`.
  - *Rejected:* Dot `#E5484D`, Text `#A0A0AB`.
  - *Scheduled:* Dot `#0091FF`, Text `#EDEDEF`.

### Input Fields & Controls
- **Height:** 36px standard, 32px compact.
- **Surface:** Background `#18181B`, Border `1px solid #26262A`, Radius `10px`, Color `#EDEDEF`, Font: `14px`.
- **Placeholder:** Color `#6E6E78`.
- **Hover:** Border `#34343A`.
- **Focus:** Border `#6E56CF`, Outline `0 0 0 1px #6E56CF`.

### Checkboxes & Radios
- **Size:** 16px × 16px square (Checkbox: Radius 4px; Radio: Radius 9999px).
- **Surface:** Background `#121214`, Border `1px solid #34343A`.
- **Checked State:** Background `#6E56CF`, Border `#6E56CF`, Check icon `#FFFFFF`.

### Cards & Table Panels
- **Container:** Background `#121214`, Border `1px solid #26262A`, Radius `12px`, Overflow `hidden`.
- **Card Header:** Padding `16px`, Border-Bottom `1px solid #26262A`. Titles use H2 (`16px`, weight 550).
- **Data Table:** Row borders `1px solid #26262A`, hover state on row `#18181B`. All numeric columns (CGPA, CTC, dates) set in `JetBrains Mono` with `tabular-nums`.

### Mentoring & Pipeline Widgets
- **Cohort Trackers:** Linear horizontal stage pipelines connected by `1px solid #26262A` rules. Completed stages use `#30A46C`, current active stage uses a `#6E56CF` indicator outline, pending stages stay `#26262A`.