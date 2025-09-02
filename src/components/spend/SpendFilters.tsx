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
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium mr-1">Categories:</span>
        {CATEGORIES.map((cat) => {
          const active = state.selectedCategories.has(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              aria-pressed={active}
              className={`rounded-full px-3 py-1 text-sm ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                active
                  ? "bg-violet-600 text-white ring-violet-600 hover:bg-violet-700"
                  : "bg-white text-gray-800 ring-gray-300 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setState({ ...state, selectedCategories: new Set(CATEGORIES) })}
          className="ml-1 text-sm underline-offset-2 hover:underline"
        >
          {allSelected ? "All" : "Select all"}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium mr-1">Date:</span>
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          {DATE_PRESETS.map((p) => {
            const active = state.range === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setRange(p.key)}
                aria-pressed={active}
                className={`px-3 py-1 text-sm rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition ${
                  active ? "bg-white shadow text-gray-900" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


