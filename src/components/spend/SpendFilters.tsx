"use client";

import { useMemo, useState } from "react";
import type { SpendPoint } from "../../data/spend.mock";
import { CATEGORIES } from "../../data/spend.mock";

export type DateRangeKey = "7d" | "30d" | "90d" | "all";

export type SpendFiltersState = {
  selectedCategories: Set<string>;
  range: DateRangeKey;
};

export function filterPoints(points: SpendPoint[], state: SpendFiltersState): SpendPoint[] {
  const now = new Date();
  const minDate = (() => {
    if (state.range === "all") return null;
    const d = new Date(now);
    const days = state.range === "7d" ? 7 : state.range === "30d" ? 30 : 90;
    d.setDate(d.getDate() - days);
    return d;
  })();
  return points.filter((p) => {
    if (!state.selectedCategories.has(p.category)) return false;
    if (!minDate) return true;
    return new Date(p.date) >= minDate;
  });
}

type Props = {
  value?: SpendFiltersState;
  onChange?: (state: SpendFiltersState) => void;
};

const DATE_PRESETS: { key: DateRangeKey; label: string }[] = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "all", label: "All time" },
];

export default function SpendFilters({ value, onChange }: Props) {
  const [internal, setInternal] = useState<SpendFiltersState>(
    value ?? { selectedCategories: new Set(CATEGORIES), range: "all" }
  );

  const state = value ?? internal;

  const setState = (next: SpendFiltersState) => {
    if (onChange) onChange(next);
    else setInternal(next);
  };

  const toggleCategory = (category: string) => {
    const next = new Set(state.selectedCategories);
    if (next.has(category)) next.delete(category);
    else next.add(category);
    setState({ ...state, selectedCategories: next });
  };

  const setRange = (range: DateRangeKey) => setState({ ...state, range });

  const allSelected = useMemo(() => state.selectedCategories.size === CATEGORIES.length, [state.selectedCategories]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Filter by Category</h3>
          <div className="flex flex-wrap items-center gap-2.5">
            {CATEGORIES.map((cat) => {
              const active = state.selectedCategories.has(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  aria-pressed={active}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${
                    active
                      ? "bg-violet-600 text-white shadow-md hover:bg-violet-700 hover:shadow-lg transform hover:scale-105"
                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setState({ ...state, selectedCategories: new Set(CATEGORIES) })}
            className="mt-3 text-sm font-medium text-violet-600 hover:text-violet-700 underline-offset-2 hover:underline transition-colors"
          >
            {allSelected ? "All selected" : "Select all"}
          </button>
        </div>

        <div className="lg:border-l lg:border-gray-200 lg:pl-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Time Period</h3>
          <div className="inline-flex rounded-xl bg-gray-100 p-1 shadow-inner">
            {DATE_PRESETS.map((p) => {
              const active = state.range === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setRange(p.key)}
                  aria-pressed={active}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${
                    active 
                      ? "bg-white shadow-md text-gray-900 transform scale-105" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


