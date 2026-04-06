# Concesionaria Web Design System

> Generated: 2026-04-05
> Based on: Stitch Design System "Precision Editorial" (The Mechanical Gallery)

---

## 1. Overview & Creative North Star

**"The Mechanical Gallery"** - A premium automotive marketplace that treats every vehicle listing as a curated piece of art. Intentional asymmetry, large display typography, and tonal depth create a trustworthy, engineered feel.

**Key Principles:**
- No lines for sectioning - use tonal depth
- Editorial typography with Manrope headlines
- Technical precision with Inter body text
- Electric blue accent for key actions

---

## 2. Color Palette

### Surface System (No Lines Rule)
Boundaries are defined through background color shifts, NOT borders.

| Name | Hex | Usage |
|------|-----|-------|
| `surface` | `#f9f9fc` | Base canvas |
| `surface-container` | `#eeeef0` | Secondary sections |
| `surface-container-low` | `#f3f3f6` | Cards on base |
| `surface-container-lowest` | `#ffffff` | Elevated cards |
| `surface-container-high` | `#e8e8ea` | High contrast areas |
| `surface-container-highest` | `#e2e2e5` | Interactive elements |

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| `primary` | `#191c1e` | Dark charcoal - CTAs, headers |
| `primary-container` | `#2e3133` | Darker variant |
| `on-primary` | `#ffffff` | Text on dark |

### Secondary Colors
| Name | Hex | Usage |
|------|-----|-------|
| `secondary` | `#5b5f63` | Neutral grays |
| `on-surface` | `#1a1c1e` | Primary text |
| `on-surface-variant` | `#444749` | Secondary text |

### Tertiary/Accent
| Name | Hex | Usage |
|------|-----|-------|
| `tertiary` | `#001a41` | Deep blue |
| `tertiary-fixed` | `#d8e2ff` | Light blue background |
| `on-tertiary-container` | `#5b96ff` | Electric blue - key actions |

### Utility Colors
| Name | Hex | Usage |
|------|-----|-------|
| `outline` | `#74777a` | Borders |
| `outline-variant` | `#c4c7c9` | Subtle borders |
| `error` | `#ba1a1a` | Error states |
| `error-container` | `#ffdad6` | Error backgrounds |

---

## 3. Typography

### Font Stacks
```css
--font-headline: 'Manrope', sans-serif;
--font-body: 'Inter', sans-serif;
--font-label: 'Inter', sans-serif;
```

### Usage Rules
- **Headlines (Manrope)**: display-lg, font-extrabold, tracking-tight, uppercase
- **Body (Inter)**: Technical specs, body text, labels
- **Labels**: text-[10px], font-bold, tracking-[0.1em], uppercase (mimics machined serial numbers)

---

## 4. Tailwind Config

```js
colors: {
  primary: '#191c1e',
  secondary: '#5b5f63',
  tertiary: '#001a41',
  accent: '#007AFF',
  background: '#f9f9fc',
  surface: '#f9f9fc',
  'surface-container': '#eeeef0',
  'surface-container-low': '#f3f3f6',
  'surface-container-lowest': '#ffffff',
  'surface-container-high': '#e8e8ea',
  'surface-container-highest': '#e2e2e5',
  'on-surface': '#1a1c1e',
  'on-surface-variant': '#444749',
  'on-primary': '#ffffff',
  'on-tertiary-container': '#5b96ff',
  'tertiary-fixed': '#d8e2ff',
  'outline-variant': '#c4c7c9',
}
```

---

## 5. Components

### Buttons
```css
.btn-primary {
  @apply bg-primary text-white px-6 py-3 rounded-md font-headline font-bold uppercase tracking-widest text-sm;
}
.btn-metallic {
  background: linear-gradient(135deg, #191c1e 0%, #2e3133 100%);
}
```

### Cards
```css
.card {
  @apply bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] overflow-hidden;
}
```

### Input Fields
- Background: `surface-container-low`
- Focus: `surface-container-lowest` + 2px bottom border in `primary`
- No 4-sided box

### Chips/Badges
- New Arrival: `tertiary-fixed` background, pill shape
- Verified: `emerald-500` background, white text

---

## 6. Do's and Don'ts

### Do:
- Use **tonal depth** instead of borders
- Use **large whitespace** (64px+) between sections
- Use **Manrope** for headlines and prices
- Use **Electric Blue** sparingly for key actions

### Don't:
- Use **100% black** - use `primary` (#191c1e) instead
- Use **1px solid borders** for sectioning
- Use **default drop shadows** - use tonal shifts
- Use **icons with varying stroke weights**
