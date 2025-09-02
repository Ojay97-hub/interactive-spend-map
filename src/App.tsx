import { useMemo, useState } from "react";
import { SAMPLE_SPEND, generateMockSpend, type SpendPoint } from "./data/spend.mock";
import SpendFilters, { filterPoints, type SpendFiltersState } from "./components/spend/SpendFilters";
import SpendLegend from "./components/spend/SpendLegend";
import SpendMapInner from "./components/spend/SpendMapInner";
import SpendTable from "./components/spend/SpendTable";

export default function App() {
  const baseData: SpendPoint[] = useMemo(() => {
    return [...SAMPLE_SPEND, ...generateMockSpend(100)];
  }, []);

  const [filters, setFilters] = useState<SpendFiltersState>({
    selectedCategories: new Set([
      "Food & Drink",
      "Transport",
      "Shopping",
      "Entertainment",
      "Groceries",
      "Bills",
      "Other",
    ]),
    range: "all",
  });

  const visible = useMemo(() => filterPoints(baseData, filters), [baseData, filters]);
  const [focusedId, setFocusedId] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-semibold">Spend Map (UK)</h1>
        <SpendFilters value={filters} onChange={setFilters} />
        <SpendMapInner points={visible} focusedId={focusedId} />
        <SpendLegend visiblePoints={visible} />
        <SpendTable points={visible} onFocus={setFocusedId} />
      </main>
    </div>
  );
}


