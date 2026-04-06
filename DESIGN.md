# Design System: Buildify ERP
**Project:** Buildify — Construction & Property ERP
**Stack:** Next.js 14, Tailwind CSS v3, Framer Motion, Recharts

---

## 1. Visual Theme & Atmosphere

Buildify adopts a "Sandy Luxury Glassmorphism" aesthetic — earthy warmth meets modern translucency. The intent is to communicate trust and craftsmanship without feeling sterile. Construction and real estate carry weight and permanence; the design mirrors that through rich sandy tones, forest greens, and antique brass, while glass-like surfaces keep the UI feeling modern and airy.

**Page Background:**
```css
radial-gradient(circle at top left, rgba(199,155,66,0.3), transparent 28%),
radial-gradient(circle at right, rgba(54,88,71,0.22), transparent 32%),
linear-gradient(180deg, #f6f0e8 0%, #efe6da 100%)
```
The radial gradient overlays create subtle ambient lighting — brass warmth in the top-left corner, moss depth on the right — over a warm linen base. This avoids the coldness of pure white without overwhelming the content.

---

## 2. Color Palette & Roles

| Token   | Hex       | Role & Rationale |
|---------|-----------|------------------|
| `ink`   | `#0f172a` | Deep navy-black. Used for all primary text, headings, and active nav items. Provides strong contrast against warm sandy backgrounds without the harshness of pure black. |
| `sand`  | `#f4efe7` | Warm sandy cream. The base page background color. Evokes natural materials — limestone, paper, unfinished concrete. |
| `clay`  | `#bb6b3f` | Terracotta orange. Used for accent, warning stats, and secondary visual interest. Echoes fired brick and earthen construction materials. |
| `moss`  | `#365847` | Deep forest green. The primary action color: buttons, active focus states, eyebrow labels. Grounds the palette with organic stability — the color of sites, surveying, and growth. |
| `brass` | `#c79b42` | Antique gold-brass. Reserved for financial and income-related statistics — invoices, revenue, billing. Signals value and monetary weight. |
| `gold`  | `#f3ca50` | Bright gold, used in marketing/landing page highlights and gradient accents. |
| `gold-dark` | `#d5af37` | Muted gold for gradient endpoints and pressed states in marketing contexts. |

**Semantic usage guidelines:**
- Use `moss` for all interactive/primary actions (primary buttons, links, form focus rings)
- Use `brass` and `clay` for stat cards and KPI highlights — never for interactive controls
- Use `ink` for all headings and body text; `slate-500`/`slate-600` for secondary/muted text
- Keep `sand` as background; layer `white/75` or `white/40` glass panels on top

---

## 3. Typography Rules

Buildify uses a three-font system with strict role separation:

| Role | Font | Class | Usage |
|------|------|-------|-------|
| Display / Headings | Georgia (serif) | `font-display` | Page titles, section headings, card headlines. Serif weight communicates permanence and authority — appropriate for a professional construction tool. |
| Body / UI | Inter (sans-serif) | `font-body` | All body text, form labels, table data, descriptions. Clean and legible at small sizes. |
| Marketing Headlines | Manrope (sans-serif) | `font-headline` | Landing page hero text and marketing copy. Modern geometric proportions contrast the serif headings for a premium feel. |

**Eyebrow labels** (small category labels above headings): `text-xs uppercase tracking-[0.25em]` in either `text-moss` (active/branded) or `text-slate-500` (neutral). The wide letter-spacing signals taxonomy and section identity.

**Size scale (practical):**
- Hero heading: `text-4xl font-display text-ink` (cards, section titles)
- Sub-heading: `text-3xl font-display text-ink` (secondary panels)
- Body: `text-sm leading-7 text-slate-600`
- Eyebrow: `text-xs uppercase tracking-[0.28em]`
- Table text: `text-sm text-slate-700`

---

## 4. Component Stylings

### Cards

**Standard Card** — Used for general content sections:
```
rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur
```

**Form / Hero Card** — Used for the ResourceManager form panel and similar primary panels:
```
rounded-[1.9rem] border border-black/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.78),rgba(255,247,235,0.95))] p-6 shadow-xl backdrop-blur
```
The diagonal gradient subtly warms the bottom-right corner, echoing the sandy page background and creating depth.

**GlassCard (Rich)** — Used for analytics, stats, and insight panels:
```
rounded-3xl bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6)]
```
The inset highlight on the top edge simulates a glass rim catching light — the hallmark of glassmorphism done right.

**Dark Insight Card** — Used for AI/intelligence panels and contrast sections:
```
bg-[linear-gradient(160deg,rgba(15,23,42,0.96),rgba(54,88,71,0.9))]
```
Deep navy fading to forest green. Used sparingly to create visual anchors and draw attention to critical insights.

### Buttons

**Primary button:**
```
rounded-2xl bg-[linear-gradient(135deg,#0f172a,#365847)] text-white font-semibold shadow-lg shadow-moss/10 transition hover:translate-y-[-1px]
```
The gradient runs from `ink` to `moss` — authoritative dark to organic action color. The subtle upward hover translation adds physicality without being distracting. `disabled:opacity-60` for inactive states.

**Secondary button:**
```
rounded-2xl border border-black/10 bg-white/70 px-5 py-3 text-sm transition hover:bg-white
```
Ghost-style with a glass tint. Used for cancel/secondary actions alongside primary buttons.

**Icon pill:**
```
rounded-full border border-black/10 bg-white px-4 py-2 text-xs
```
Used for eyebrow badges, record count indicators, and status tags.

### Form Inputs

All form inputs share the base:
```
rounded-2xl border border-black/10 bg-white/85 px-4 py-3 outline-none transition focus:border-moss focus:bg-white
```
The `focus:border-moss` ring uses the primary action color for visual consistency. `bg-white/85` at rest, full `bg-white` on focus — a subtle affordance that the field is active.

Textareas use `min-h-24` with the same styling. Selects preserve the `rounded-2xl` shape.

### Sidebar

Dark, deeply saturated sidebar using:
```
bg-[linear-gradient(180deg,#10201f,#0f172a)]
```
Top is dark teal-black (`#10201f`), bottom is pure `ink` (`#0f172a`). This avoids the flatness of a single-color sidebar.

- **Active nav item:** `bg-white text-ink` — high contrast white pill, grounding the active state
- **Inactive nav item:** `text-white/78 hover:bg-white/10` — softly visible, brightens subtly on hover

---

## 5. Layout Principles

**Dashboard pages** use a two-column grid for resource pages:
```
grid gap-6 xl:grid-cols-[0.95fr_1.05fr]
```
The form panel is slightly narrower (0.95fr) and the data table is slightly wider (1.05fr). This subtle asymmetry provides visual hierarchy without rigid 50/50 splitting.

**Responsive approach:** Full-width stacked on mobile and tablet; two-column grid at `xl` breakpoint (1280px+). The sidebar is full-height, fixed on desktop.

**Spacing rhythm:** `gap-6` (24px) between major sections, `mb-5` between eyebrow and heading, `mt-8` before form fields, `gap-4` between individual form rows.

**Table rows** use `border-t border-black/5` — an extremely subtle divider that separates rows without heavy visual noise. Row hover state: `hover:bg-sand/50`.

**Overflow:** Table sections use `overflow-x-auto` to handle narrow viewports gracefully.

---

## 6. Motion & Animation

Buildify uses **Framer Motion** for all significant UI transitions.

**Standard page/section entrance:**
- `staggerChildren: 0.1` — children animate in sequence, 100ms apart
- Spring physics: `stiffness: 100, damping: 15` — produces a gentle, organic settle, not a mechanical bounce

**Button micro-interactions:**
- Hover: `translate-y: -1px` — a 1px upward nudge on primary buttons, simulating a physical press
- Disabled: `opacity-60`, no hover transform

**Principles:**
- Motion should feel physical and grounded — springs over linear easing
- Stagger creates hierarchy: the eye follows the sequence, understanding which elements are primary
- Keep durations short (150–300ms) on interactive elements; page transitions can be 400–500ms
- Never animate layout-critical properties (width/height) — only transform and opacity for performance

---

## 7. Page Structure Pattern

Every dashboard resource page follows the same structural pattern:

```
<DashboardLayout>          ← Sidebar + topbar wrapper
  <PageHeader />           ← Eyebrow + title + optional CTA
  <ResourceManager>        ← Two-column: Form panel | Data table
    <FormPanel>            ← Glass card: eyebrow, title, description, form fields, submit
    <DataPanel>            ← Glass card: "Live Records" heading, count pill, data table
  </ResourceManager>
</DashboardLayout>
```

**Form panel anatomy:**
1. Decorative radial gradient overlay (pointer-events-none)
2. Eyebrow pill badge (moss text, white/70 bg, full-rounded)
3. Display heading (`font-display text-4xl text-ink`)
4. Contextual description paragraph (`text-sm leading-7 text-slate-600`)
5. Role-gated alert (amber for view-only, red for errors)
6. Form fields grid (`gap-4`)
7. Action row (primary submit + optional cancel)

**Data panel anatomy:**
1. Header row: "Live Records" eyebrow + heading + count pill
2. `overflow-x-auto` table wrapper
3. Table with `border-black/5` row dividers and `hover:bg-sand/50` row hover
4. Edit (full-rounded pill) + Delete (red-tinted pill) action buttons per row

This consistent pattern means every section of the app is immediately learnable from the first page a user visits.
