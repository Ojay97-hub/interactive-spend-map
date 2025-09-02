"use client";

import { useMemo } from "react";
import type { SpendPoint } from "../../data/spend.mock";

type Props = {
  points: SpendPoint[];
  onFocus: (id: string) => void;
};

export default function SpendTable({ points, onFocus }: Props) {
  const sorted = useMemo(() => {
    const copy = [...points];
    copy.sort((a, b) => b.spend - a.spend);
    return copy;
  }, [points]);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Transactions (high → low)</h2>
        <div className="text-sm text-gray-600">{sorted.length} shown</div>
      </div>
      <div className="overflow-x-auto rounded-xl ring-1 ring-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">City</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Spend</th>
              <th scope="col" className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sorted.map((p) => (
              <tr key={p.id} className="hover:bg-violet-50/50">
                <td className="px-4 py-2 text-sm text-gray-900">{p.city}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{p.category}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{new Date(p.date).toLocaleDateString("en-GB")}</td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right">£{p.spend.toLocaleString("en-GB", { maximumFractionDigits: 0 })}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => onFocus(p.id)}
                    className="inline-flex items-center rounded-full bg-violet-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    aria-label={`Show ${p.city} on map`}
                  >
                    Show on map
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


