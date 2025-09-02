## Interactive Spend Map (UK)

A small side fun project to visualise spending across the UK using React, TypeScript, Leaflet, and TailwindCSS. It renders bubble markers sized by spend, includes simple category/date filters, an explanatory legend, and an interactive table that lets you jump to a selected transaction on the map.

### Features
- Interactive UK map with bubble markers sized by spend (sqrt scaling)
- Category multi-select + date range presets (7/30/90/all)
- Accessible tooltips and keyboard navigation
- Legend with size and category colours, live totals
- Table view sorted high → low with “Show on map” actions
- UK-weighted mock data (London, Manchester, Birmingham, Leeds, Glasgow, Edinburgh, Cardiff, Bristol, Belfast)

### Tech Stack
- React + TypeScript
- TailwindCSS
- Leaflet + react-leaflet (OpenStreetMap tiles)
- Vite dev setup (Next.js examples included as well)

### Getting Started
1) Install
```bash
npm install
```

2) Run the dev server
```bash
npm run dev
```

3) Open the app
- Vite: visit `http://localhost:5173`
- Next.js (if you copy the components/pages into a Next app): visit `/spend-map`

### Leaflet CSS
- Vite: already imported at the top of `src/index.css`:
```css
@import "leaflet/dist/leaflet.css";
```
- Next.js: import it once in your global CSS (e.g., `app/globals.css`):
```css
@import "leaflet/dist/leaflet.css";
```

### Data Shape
```ts
export type SpendPoint = {
  id: string;
  city: string;
  lat: number; // WGS84
  lng: number; // WGS84
  spend: number; // GBP float for mock
  category: "Food & Drink" | "Transport" | "Shopping" | "Entertainment" | "Groceries" | "Bills" | "Other";
  date: string; // ISO date, e.g. "2025-08-25"
};
```

Mock data and a generator live in `src/data/spend.mock.ts`.

### Swapping in Real Data
Replace the demo dataset creation with your own fetch that returns `SpendPoint[]`:
```ts
async function fetchSpend(): Promise<SpendPoint[]> {
  const res = await fetch("/api/spend");
  if (!res.ok) throw new Error("Failed to load spend");
  return (await res.json()) as SpendPoint[];
}
```
Then pass the resulting array into the map and table. The included `filterPoints(...)` helper will work with real data as long as it matches the `SpendPoint` shape.

### Scripts
- `npm run dev` — start dev server
- `npm run build` — type-check and build
- `npm run preview` — preview production build
- `npm run type-check` — run TypeScript only

### Project Structure
```
src/
  app/spend-map/page.tsx          # Next.js App Router example (optional)
  pages/spend-map.tsx             # Next.js Pages Router example (optional)
  components/spend/
    SpendMapInner.tsx             # Map + markers + tooltips
    SpendFilters.tsx              # Category/date filters
    SpendLegend.tsx               # Legend and totals
    SpendTable.tsx                # Interactive table with focus-on-map
  data/spend.mock.ts              # SpendPoint type, sample + generator
  lib/scale.ts                    # sqrt scaling for bubble radius
  main.tsx / App.tsx              # Vite entry/demo page
  index.css                       # Tailwind + Leaflet CSS import
```

### Tiles & Attribution
Map tiles by [OpenStreetMap](https://www.openstreetmap.org/) contributors.

### License
MIT — have fun! If you build on this, a link back is appreciated.


