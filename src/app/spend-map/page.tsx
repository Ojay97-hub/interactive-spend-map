"use client";

// import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { SAMPLE_SPEND, generateMockSpend, type SpendPoint } from "../../data/spend.mock";
import SpendFilters, { filterPoints, type SpendFiltersState } from "../../components/spend/SpendFilters";
import SpendLegend from "../../components/spend/SpendLegend";
import SpendTable from "../../components/spend/SpendTable";

import SpendMapInner from "../../components/spend/SpendMapInner";

export default function SpendMapRoute() {
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
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            UK Spend Map
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Visualize spending patterns across the United Kingdom
          </p>
        </div>

        {/* Filters */}
        <SpendFilters value={filters} onChange={setFilters} />

        {/* Map */}
        <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-sm">
          <SpendMapInner points={visible} focusedId={focusedId} />
        </div>

        {/* Legend */}
        <SpendLegend visiblePoints={visible} />

        {/* Table */}
        <SpendTable points={visible} onFocus={setFocusedId} />
      </main>
    </div>
  );
}


