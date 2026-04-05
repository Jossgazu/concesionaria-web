# Concesionaria Web - Design System Specification

## 1. Concept & Vision

**Concesionaria Web** is a premium multi-vendor car marketplace built for Latin American users. It blends automotive professionalism with the warmth and approachability of Latin American culture. The platform feels like walking into a trusted dealership—clean, organized, and reassuring—while embracing modern digital experiences. Think "AutoScout24 meets Latin American hospitality."

**Design Philosophy**: "Confianza sobre ruedas" (Trust on wheels) — Every visual element reinforces reliability, transparency, and professionalism while avoiding the cold, corporate feel of typical marketplaces.

---

## 2. Design Tokens

### 2.1 Color Palette

#### Primary: Deep Teal (Trust + Automotive)

```css
--color-primary: oklch(52% 0.12 185);        /* #0D7377 - Main brand color */
--color-primary-light: oklch(70% 0.10 185);  /* #32A8A8 - Hover states */
--color-primary-dark: oklch(38% 0.10 185);   /* #065E60 - Active/pressed */
--color-primary-muted: oklch(85% 0.04 185);  /* #E6F3F3 - Subtle backgrounds */
```

#### Neutral Scale (Warm-tinted toward teal)

```css
--color-neutral-50: oklch(98% 0.005 185);    /* #F7FAFA - Lightest background */
--color-neutral-100: oklch(95% 0.008 185);   /* #EDF2F2 - Card backgrounds */
--color-neutral-200: oklch(88% 0.010 185);   /* #D4DFDF - Borders */
--color-neutral-300: oklch(75% 0.015 185);   /* #A8C4C4 - Disabled states */
--color-neutral-400: oklch(60% 0.020 185);   /* #7DA8A8 - Placeholder text */
--color-neutral-500: oklch(45% 0.025 185);   /* #528585 - Secondary text */
--color-neutral-600: oklch(35% 0.025 185);   /* #366565 - Body text */
--color-neutral-700: oklch(25% 0.020 185);   /* #1F4040 - Headings */
--color-neutral-800: oklch(18% 0.015 185);   /* #152C2C - Dark backgrounds */
--color-neutral-900: oklch(12% 0.010 185);   /* #0D1E1E - Darkest */
```

#### Semantic Colors

```css
/* Success - Confirmed/Verified */
--color-success: oklch(58% 0.12 145);        /* #1A9A5C */
--color-success-light: oklch(88% 0.06 145);   /* #E6F5EE */
--color-success-dark: oklch(42% 0.10 145);   /* #0E6E40 */

/* Warning - Attention needed */
--color-warning: oklch(72% 0.14 75);          /* #D4880C */
--color-warning-light: oklch(90% 0.06 75);    /* #FDF5E6 */
--color-warning-dark: oklch(52% 0.12 75);    /* #A66A08 */

/* Error - Validation/problems */
--color-error: oklch(52% 0.18 25);           /* #C42B2B */
--color-error-light: oklch(92% 0.05 25);     /* #FDEAEA */
--color-error-dark: oklch(38% 0.15 25);       /* #8C1E1E */

/* Info - Neutral announcements */
--color-info: oklch(55% 0.12 250);           /* #2B6CB0 */
--color-info-light: oklch(92% 0.04 250);     /* #EBF4FF */
```

#### Surface & Elevation

```css
--surface-base: var(--color-neutral-50);
--surface-raised: #FFFFFF;
--surface-overlay: rgba(13, 30, 30, 0.6);
--surface-sunken: var(--color-neutral-100);

/* Shadow scale */
--shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.04);
--shadow-md: 0 4px 12px oklch(0% 0 0 / 0.08);
--shadow-lg: 0 12px 32px oklch(0% 0 0 / 0.12);
--shadow-xl: 0 24px 48px oklch(0% 0 0 / 0.16);
```

### 2.2 Typography

**Font Family**: Plus Jakarta Sans (Google Fonts)
- Modern geometric sans with friendly character
- Excellent Latin character support (ñ, á, é, í, ó, ú, ü, ¡, ¿)
- Professional yet approachable
- Fallback: `system-ui, -apple-system, sans-serif`

```css
/* Type Scale */
--text-xs: 0.75rem;       /* 12px - Legal, timestamps */
--text-sm: 0.875rem;      /* 14px - Secondary UI, metadata */
--text-base: 1rem;        /* 16px - Body text */
--text-lg: 1.125rem;      /* 18px - Lead text */
--text-xl: 1.25rem;       /* 20px - Subheadings */
--text-2xl: 1.5rem;       /* 24px - Section headings */
--text-3xl: 1.875rem;     /* 30px - Page titles */
--text-4xl: 2.25rem;      /* 36px - Hero subheadings */
--text-5xl: 3rem;         /* 48px - Hero headlines */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;    /* Headlines */
--leading-normal: 1.5;    /* Body */
--leading-relaxed: 1.75;  /* Long-form */

/* Letter Spacing */
--tracking-tight: -0.02em;   /* Large headings */
--tracking-normal: 0;        /* Body */
--tracking-wide: 0.02em;    /* Small caps, labels */
```

### 2.3 Spacing Scale (4pt base)

```css
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

### 2.4 Border Radius

```css
--radius-sm: 0.375rem;   /* 6px - Small elements */
--radius-md: 0.5rem;     /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;        /* 16px - Large cards, modals */
--radius-2xl: 1.5rem;    /* 24px - Hero containers */
--radius-full: 9999px;   /* Pills, avatars */
```

### 2.5 Breakpoints

```css
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### 2.6 Motion

```css
/* Durations */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
--duration-slower: 600ms;

/* Easings */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 3. Component Specifications

### 3.1 VehicleCard

**Purpose**: Display vehicle listing in grid/list views

| State | Description |
|-------|-------------|
| Default | White card, subtle shadow, image + info |
| Hover | Elevated shadow, slight scale (1.02), primary color accent on price |
| Favorited | Heart icon filled in primary color, subtle border glow |
| Loading | Skeleton with shimmer animation |
| Sold | Grayscale overlay, "VENDIDO" badge |

**Layout**:
```
┌─────────────────────────────┐
│  [Image - 16:10 ratio]     │
│  ♥ (favorite)    [-badge]  │
├─────────────────────────────┤
│  Toyota Corolla 2023       │ ← Title: --text-lg --font-semibold
│  USD $22,500               │ ← Price: --text-xl --font-bold --color-primary
│  ─────────────────────     │
│  ⛽ 2.0L  🔄 Automático     │ ← Specs: --text-sm --color-neutral-500
│  📍 Ciudad de México       │ ← Location: --text-sm --color-neutral-500
│  ─────────────────────     │
│  ★ 4.8 (24 evaluaciones)   │ ← Rating if available
└─────────────────────────────┘
```

### 3.2 FilterSidebar

**Layout**: Vertical stack of filter groups with accordion behavior

| Component | Description |
|-----------|-------------|
| Search Input | Text input with search icon |
| Price Range | Dual-handle slider with min/max inputs |
| Brand/Model | Searchable multi-select chips |
| Year | Range selector (from-to) |
| Mileage | Range selector |
| Fuel Type | Checkbox group (Gasolina, Diésel, Híbrido, Eléctrico) |
| Transmission | Radio group (Manual, Automático) |
| Location | Region/province dropdown |
| Condition | Toggle (Nuevo, Usado, Certificados) |
| Apply Button | Full-width primary CTA |
| Clear All | Text button to reset |

### 3.3 ImageGallery

**States**:
- Loading: Skeleton placeholder with shimmer
- Single image: Full-width display
- Multiple: Thumbnail strip below, click to expand
- Lightbox: Full-screen overlay with swipe navigation
- Zoom: Pinch-to-zoom on mobile, hover zoom on desktop

**Layout**:
```
┌─────────────────────────────────────┐
│                                     │
│         [Main Image]                │
│                                     │
├────┬────┬────┬────┬────┬────┬────┬──┤
│ ○  │ ●  │ ○  │ ○  │ ○  │ +5 │    │  │ ← Thumbnails + count
└────┴────┴────┴────┴────┴────┴────┴──┘
```

### 3.4 SellerCard

**Components**:
- Avatar (48px, rounded)
- Name (--text-base --font-semibold)
- Verification badges (check icon if verified dealer)
- Rating stars (1-5 with count)
- "X vehículos en venta" count
- Contact button (primary CTA)
- Message button (secondary CTA)

**States**:
- Verified Dealer: Blue checkmark badge, "Concesionaria verificada"
- Private Seller: Gray badge, "Vendedor particular"
- New Seller: No rating, "Nuevo vendedor"

### 3.5 ValuationWizard

**Multi-step flow**:

| Step | Title | Description |
|------|-------|-------------|
| 1 | Datos del vehículo | Brand, model, year, mileage |
| 2 | Estado del vehículo | Condition, accidents, modifications |
| 3 | Fotos | Upload 5-20 photos |
| 4 | Precio esperado | Suggested range + user input |
| 5 | Tu información | Contact details |
| 6 |listo | Summary + submit |

**Progress indicator**: Horizontal stepper with numbered circles, current step highlighted in primary color.

### 3.6 StatsCards (Dashboard)

**Types**:
- Vehicles Listed: Count + trend arrow
- Total Views: Count + percentage change
- Leads Received: Count + trend
- Average Response Time: Time in hours/minutes

**Layout**: Grid of cards with icon, metric, label, and trend indicator.

### 3.7 Navigation

**Header (Desktop)**:
```
┌─────────────────────────────────────────────────────────────────────┐
│ [Logo]    Buscar...     [Vender] [Favoritos] [Mensajes] [Avatar ▾]  │
└─────────────────────────────────────────────────────────────────────┘
```

**Header (Mobile)**:
```
┌───────────────────────────────────────┐
│ [☰] [Logo]              [Favoritos]  │
│ ___________________________________  │
│ [🔍 Buscar vehículos...]            │
└───────────────────────────────────────┘
```

**Mobile Menu**: Full-screen overlay with slide-in animation from left.

### 3.8 Footer

**Layout**: 4-column grid on desktop, stacked on mobile

| Column | Content |
|--------|---------|
| Explorar | Marcas, Modelos populares, Ubicaciones |
| Vender | Publicar vehículo, Valoración, Precios |
| Soporte | Centro de ayuda, Contacto, FAQ |
| Empresa | Sobre nosotros, Términos, Privacidad |

### 3.9 Buttons

| Variant | Use Case | Style |
|---------|----------|-------|
| Primary | Main CTAs | --color-primary bg, white text |
| Secondary | Secondary actions | White bg, --color-primary border + text |
| Ghost | Tertiary actions | Transparent, --color-primary text |
| Destructive | Delete/remove | --color-error bg or outline |
| Loading | Async actions | Spinner icon + disabled state |

**Sizes**: sm (32px), md (40px), lg (48px)

### 3.10 Form Inputs

| Type | States |
|------|--------|
| Text/Email/Password | Default, Focus (primary ring), Error (red ring), Disabled |
| Select | Default, Open (dropdown), Selected |
| Textarea | Default, Focus, Error, Character count |
| Checkbox | Unchecked, Checked (primary), Indeterminate |
| Radio | Unselected, Selected (primary dot) |
| Range | Default, Active (dragging), Labels at ends |
| File Upload | Drag zone, Hover (primary dashed border), Uploading (progress) |

### 3.11 Badges

| Type | Style |
|------|-------|
| Status: Nuevo | Green bg |
| Status: Usado | Orange bg |
| Status: Certificado | Blue bg |
| Verification: Verificado | Teal outline + check icon |
| Feature: Destacado | Gold/yellow bg |
| Feature: Urgente | Red bg |

### 3.12 Modal Patterns

- **Standard Modal**: Centered, max-width 480px, overlay backdrop with blur
- **Confirmation Modal**: Icon at top, title, description, action buttons
- **Full-screen Mobile**: Slide-up from bottom, drag handle at top
- **Side Panel**: Slide-in from right, 400px width, for filters on mobile

### 3.13 Toast Notifications

| Type | Style |
|------|-------|
| Success | Green left border, check icon |
| Error | Red left border, X icon |
| Warning | Yellow left border, alert icon |
| Info | Blue left border, info icon |

**Position**: Top-right on desktop, bottom-center on mobile.

---

## 4. Screen-by-Screen Design Instructions for Stitch

### Screen 1: Home Page

**Prompt for Stitch**:
"Design a home page for 'Concesionaria Web', a premium multi-vendor car marketplace for Latin America. The design should feel trustworthy and professional with Latin American warmth.

**Layout Requirements**:
1. **Hero Section**: Full-width gradient background (primary color to primary-dark), large headline "Encuentra tu próximoauto en confianza", subheadline "Miles de vehículos verificados en toda Latinoamérica", prominent search bar with location dropdown and search button
2. **Quick Categories**: Horizontal scroll of category cards (Sedán, SUV, Pickup, etc.) with icons
3. **Featured Vehicles**: Grid of 4 VehicleCards with 'Destacado' badge
4. **Top Brands**: Logo strip of car brands (Toyota, Honda, Chevrolet, Ford, Nissan, Volkswagen)
5. **Value Proposition**: 3-column grid with icons - 'Verificados' (verification shield), 'Financiamiento' (hand with coin), 'Garantía' (shield check)
6. **CTA Banner**: "Vende tu vehículo" section with gradient background and 'Comenzar ahora' button
7. **Footer**: 4-column layout with links

**Spanish Text**:
- Nav: Buscar, Vender, Favoritos, Mensajes, Iniciar sesión
- Hero: "Encuentra tu próximo auto en confianza", "Miles de vehículos verificados en toda Latinoamérica"
- Search placeholder: "¿Qué vehículo buscas?"
- Categories: Sedán, SUV, Pickup, Hatchback, Camioneta, Deportivo
- Featured: "Vehículos Destacados", "Ver más"
- Brands: "Marcas Populares"
- Value props: "Verificados", "Financiamiento", "Garantía"
- CTA: "Vende tu vehículo", "Comenzar ahora"
- Footer sections: Explorar, Vender, Soporte, Empresa

**Desktop**: 1280px max-width container, 12-column grid
**Mobile**: Full-width, stacked layout, sticky search bar

---

### Screen 2: Vehicle Browse Page

**Prompt for Stitch**:
"Design a vehicle browse/search results page for 'Concesionaria Web', a Latin American car marketplace.

**Layout Requirements**:
1. **Header**: Same navigation as home
2. **Search Bar**: Sticky below header with 'Modificar búsqueda' button
3. **Results Bar**: "1,234 vehículos encontrados" + sort dropdown (Más relevantes, Precio menor, Precio mayor, Más nuevos) + view toggle (grid/list)
4. **Main Content**: Two-column layout
   - Left: FilterSidebar (collapsible on mobile)
   - Right: VehicleCard grid (3 columns desktop, 2 tablet, 1 mobile)
5. **Pagination**: Bottom of results

**Spanish Text**:
- "vehículos encontrados"
- Sort: "Más relevantes", "Precio menor", "Precio mayor", "Más nuevos"
- Filters: "Precio", "Marca", "Modelo", "Año", "Kilometraje", "Tipo de combustible", "Transmisión", "Ubicación", "Condición"
- Filter values: "Todas las marcas", "Gasolina", "Diésel", "Híbrido", "Eléctrico", "Manual", "Automático", "Nuevo", "Usado", "Certificado"
- Actions: "Aplicar filtros", "Limpiar todo", "Ver X resultados"

**Desktop**: Sidebar fixed on left (280px), results fluid
**Mobile**: Sidebar as slide-in panel triggered by filter button, full-width cards

---

### Screen 3: Vehicle Detail Page

**Prompt for Stitch**:
"Design a detailed vehicle listing page for 'Concesionaria Web'.

**Layout Requirements**:
1. **Breadcrumb**: Inicio > Toyota > Corolla > 2023
2. **Image Gallery**: Large hero image with thumbnail strip below, fullscreen button
3. **Title Block**: Vehicle name, year, price (large, primary color), location with map pin
4. **Quick Stats Bar**: Horizontal bar with fuel, transmission, mileage, color
5. **Two-Column Layout**:
   - Left (60%): Description, Specifications table, Features list (checkmarks), Location map
   - Right (40%): Sticky SellerCard, share buttons, report button
6. **Similar Vehicles**: "Vehículos Similares" carousel at bottom
7. **Related Searches**: Tag cloud at bottom

**Spanish Text**:
- Title: "Toyota Corolla 2023"
- Price: "USD $22,500" (or "MXN $385,000" based on currency)
- Specs labels: "Combustible", "Transmisión", "Kilometraje", "Color", "Año", "Motor"
- Features: "Características", "Equipamiento"
- Seller: "Vendedor", "Verificado", "Contactar", "Enviar mensaje"
- Actions: "Compartir", "Guardar", "Reportar"
- Similar: "Vehículos Similares"

**Desktop**: 1280px container, gallery left-heavy
**Mobile**: Full-width gallery with swipe, stats as horizontal scroll, seller card below specs

---

### Screen 4: Sell/Valuation Flow (Multi-step Wizard)

**Prompt for Stitch**:
"Design a multi-step wizard for vehicle valuation and listing creation on 'Concesionaria Web'.

**Layout Requirements**:
1. **Header**: Logo + step counter "Paso 2 de 6"
2. **Progress Stepper**: Horizontal numbered steps with labels
3. **Form Container**: Centered card (max-width 640px)
   - Step 1: Brand/model/year selectors (dependent dropdowns), mileage input
   - Step 2: Condition radio cards (Excelente, Bueno, Regular, Necesita trabajo), accident history, modifications
   - Step 3: Image upload grid with drag-drop zone, reorder capability
   - Step 4: Price suggestion display (chart) + price input with currency
   - Step 5: Name, email, phone inputs + location autocomplete
   - Step 6: Summary card with all info + submit button
4. **Navigation**: Back/Next buttons at bottom, Save draft option

**Spanish Text**:
- Title: "Vende tu vehículo"
- Steps: "Datos del vehículo", "Estado", "Fotos", "Precio", "Tus datos", "Revisar"
- Step 1 labels: "Marca", "Modelo", "Año", "Kilometraje"
- Step 2 labels: "Condición", "Accidentes", "Modificaciones"
- Condition options: "Excelente", "Bueno", "Regular", "Necesita trabajo"
- Step 3: "Agregar fotos", "Arrastra las fotos aquí", "Máximo 20 fotos"
- Step 4: "Precio sugerido", "Tu precio"
- Step 5: "Nombre completo", "Email", "Teléfono", "Ubicación"
- Step 6: "Resumen", "Publicar vehículo"
- Buttons: "Anterior", "Siguiente", "Guardar como borrador", "Publicar"

**Desktop**: Centered wizard card with progress stepper above
**Mobile**: Full-screen steps, bottom-fixed navigation buttons

---

### Screen 5: Dashboard Overview

**Prompt for Stitch**:
"Design a seller dashboard overview page for 'Concesionaria Web'.

**Layout Requirements**:
1. **Welcome Header**: "¡Buenos días, [Nombre]!" with avatar
2. **Stats Grid**: 4 cards in row (responsive to 2x2 on tablet, stacked on mobile)
   - Total vistas, Vehicles listed, Mensajes nuevos, Tiempo promedio de respuesta
3. **Quick Actions**: 3-button row - "Agregar vehículo", "Ver mensajes", "Editar perfil"
4. **Recent Activity**: Timeline list with icons (views, inquiries, saves)
5. **My Listings Preview**: 3 most recent listings as mini cards with status badges
6. **Notifications Bell**: Icon with unread count

**Spanish Text**:
- Greeting: "¡Buenos días!", "¡Buenas tardes!", "¡Buenas noches!"
- Stats labels: "Vistas totales", "Vehículos publicados", "Mensajes nuevos", "Tiempo de respuesta"
- Actions: "Agregar vehículo", "Ver mensajes", "Editar perfil"
- Activity: "Juan vio tu Corolla", "María preguntó por tu Civic", "Tu Civic fue guardado 5 veces"
- Listings: "Mis vehículos", "Ver todos"
- Status: "Activo", "Pendiente", "Vendido"

**Desktop**: 1280px container, stats as 4-column grid
**Mobile**: Stacked layout, horizontal scroll for stats

---

### Screen 6: Vehicle Create/Edit Form

**Prompt for Stitch**:
"Design a full-page form for creating/editing a vehicle listing on 'Concesionaria Web'.

**Layout Requirements**:
1. **Form Header**: "Publicar vehículo" or "Editar vehículo" + status badge
2. **Sectioned Form**:
   - Basic Info (brand, model, year, mileage, color)
   - Vehicle Details (fuel, transmission, doors, seats)
   - Condition (description textarea, checkbox options)
   - Equipment/Features (checkbox grid by category)
   - Pricing (price input, negotiable toggle)
   - Location (address autocomplete, map preview)
   - Photos (drag-drop grid with reordering)
3. **Sticky Footer**: Save Draft + Preview + Publish buttons

**Spanish Text**:
- Sections: "Información básica", "Detalles del vehículo", "Condición", "Equipamiento", "Precio", "Ubicación", "Fotos"
- Labels: All vehicle spec labels in Spanish
- Features categories: "Seguridad", "Confort", "Tecnología", "Exterior"
- Buttons: "Guardar borrador", "Vista previa", "Publicar", "Actualizar"
- Photos: "Agregar fotos", "Arrastra para reordenar", "Eliminar", "Portada"

**Desktop**: 800px centered form with section cards
**Mobile**: Full-width, collapsible sections, floating save button

---

### Screen 7: User Profile Page

**Prompt for Stitch**:
"Design a user/seller profile page for 'Concesionaria Web'.

**Layout Requirements**:
1. **Profile Header**: Cover image area (optional), avatar overlapping, name, member since date, verification badge
2. **Rating Section**: Large average rating with star visualization, total review count, "Ver todas las evaluaciones" link
3. **Reviews List**: Review cards with avatar, name, date, stars, comment
4. **Active Listings**: Grid of seller's vehicles (same as VehicleCard)
5. **Contact Section**: Sticky card on desktop with "Contactar" button

**Spanish Text**:
- Profile: "Miembro desde", "Verificado", "Concesionaria verificada"
- Rating: "Calificación promedio", "evaluaciones", "Ver todas las evaluaciones"
- Review: "Evaluó", " hace X días", "Comentario:"
- Listings: "Vehículos en venta", "Ver todos"
- Contact: "Contactar vendedor"

**Desktop**: Left column profile info, right column listings grid
**Mobile**: Stacked, avatar centered, listings below

---

### Screen 8: Authentication Pages

**Prompt for Stitch**:
"Design login and register pages for 'Concesionaria Web'.

**Login Page Layout**:
1. **Split Layout**: Left side with brand imagery/illustration, right side with form
2. **Logo**: At top left of form area
3. **Welcome Text**: "Iniciar sesión" + "Bienvenido de vuelta"
4. **Form**: Email input, password input, remember me checkbox, forgot password link
5. **Submit Button**: "Iniciar sesión" primary button
6. **Social Login**: Google and Facebook buttons with icons
7. **Footer**: "¿No tienes cuenta? Regístrate"

**Register Page Layout**:
1. **Split Layout**: Same as login
2. **Form**: Full name, email, password (with strength indicator), confirm password, terms checkbox
3. **Submit Button**: "Crear cuenta"
4. **Social Login**: Same options
5. **Footer**: "¿Ya tienes cuenta? Inicia sesión"

**Spanish Text**:
- "Iniciar sesión", "Bienvenido de vuelta"
- "Crear cuenta", "Completa tu registro"
- Form: "Email", "Contraseña", "Confirmar contraseña", "Nombre completo"
- Checkbox: "Recordarme", "Acepto los Términos y Condiciones"
- Links: "¿Olvidaste tu contraseña?", "¿No tienes cuenta?", "¿Ya tienes cuenta?"
- Buttons: "Iniciar sesión", "Crear cuenta", "o continúa con"
- Errors: "Email inválido", "Contraseña muy corta", "Las contraseñas no coinciden"

**Desktop**: 50/50 split
**Mobile**: Full-screen form, illustration as background or hidden

---

## 5. Spanish Text/Labels Reference

### Navigation
- Buscar (Search)
- Vender (Sell)
- Favoritos (Favorites)
- Mensajes (Messages)
- Mi cuenta (My account)
- Iniciar sesión (Sign in)
- Registrarse (Register)
- Cerrar sesión (Sign out)

### Vehicle Search
- "¿Qué vehículo buscas?" (Search placeholder)
- "Ubicación" (Location)
- "Buscar" (Search button)

### Vehicle Details
- "Combustible" (Fuel)
- "Transmisión" (Transmission)
- "Kilometraje" (Mileage)
- "Color" (Color)
- "Año" (Year)
- "Motor" (Engine)
- "Puertas" (Doors)
- "Asientos" (Seats)
- "Equipamiento" (Equipment)
- "Características" (Features)

### Vehicle Conditions
- "Nuevo" (New)
- "Usado" (Used)
- "Certificado" (Certified)
- "Excelente" (Excellent)
- "Bueno" (Good)
- "Regular" (Fair)
- "Necesita trabajo" (Needs work)

### Fuel Types
- "Gasolina" (Gasoline)
- "Diiesel" (Diesel)
- "Híbrido" (Hybrid)
- "Eléctrico" (Electric)

### Actions
- "Contactar" (Contact)
- "Enviar mensaje" (Send message)
- "Guardar" (Save)
- "Compartir" (Share)
- "Reportar" (Report)
- "Eliminar" (Delete)
- "Editar" (Edit)
- "Publicar" (Publish)
- "Vista previa" (Preview)

### Status
- "Activo" (Active)
- "Pendiente" (Pending)
- "Vendido" (Sold)
- "Expirado" (Expired)

### Feedback
- "Cargando..." (Loading...)
- "Error al cargar" (Error loading)
- "Sin resultados" (No results)
- "Guardado correctamente" (Saved successfully)

---

## 6. Interaction States

### Hover States
| Element | Hover Effect |
|---------|--------------|
| VehicleCard | Scale 1.02, shadow-lg, price color to primary |
| Button Primary | Background lightens 10% |
| Button Secondary | Background fills with primary-muted |
| Link | Underline appears |
| Nav item | Text color to primary |

### Active/Pressed States
| Element | Active Effect |
|---------|---------------|
| Button | Scale 0.98, shadow inset |
| Card | Shadow-sm, no scale |
| Nav item | Bold weight |

### Disabled States
| Element | Disabled Style |
|---------|----------------|
| Button | Opacity 50%, cursor not-allowed |
| Input | Background neutral-100, text muted |
| Link | Color neutral-400 |

### Loading States
| Element | Loading Style |
|---------|---------------|
| Button | Spinner replaces text, disabled |
| Card | Skeleton shimmer animation |
| Image | Placeholder gray with shimmer |
| Page | Full-screen spinner centered |

### Focus States
| Element | Focus Style |
|---------|-------------|
| Input | 2px primary ring offset |
| Button | 2px primary ring |
| Card | Dashed primary border |

---

## 7. Dark Mode Considerations

For dark mode, the following adjustments apply:

- `--surface-base`: `oklch(15% 0.01 185)` instead of neutral-50
- `--surface-raised`: `oklch(20% 0.01 185)` instead of white
- Text remains light on dark surfaces
- Shadows become much more subtle (0.5 opacity instead of 8-16%)
- Primary color remains the same but text on it becomes white
- Avoid pure black backgrounds - use dark tinted neutrals

---

## 8. Accessibility Guidelines

- All interactive elements have visible focus states
- Minimum 44x44px touch targets on mobile
- Color contrast minimum 4.5:1 for body text, 3:1 for large text
- Form errors clearly associated with inputs via aria-describedby
- Loading states announced via aria-live regions
- Modal focus trapping implemented
- Skip links for keyboard navigation
- All images have meaningful alt text
