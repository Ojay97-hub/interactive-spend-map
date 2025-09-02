import { radiusFromSpend } from "../../lib/scale";
import type { SpendPoint } from "../../data/spend.mock";

const CAT: Record<SpendPoint["category"], string> = {
  "Food & Drink": "#FFB800",
  Transport: "#483D6A",
  Shopping: "#F76559",
  Entertainment: "#1E90FF",
  Groceries: "#2ECC71",
  Bills: "#9B59B6",
  Other: "#95A5A6",
};

type Props = {
  visiblePoints: SpendPoint[];
};

export default function SpendLegend({ visiblePoints }: Props) {
  const totalSpend = visiblePoints.reduce((acc, p) => acc + (Number.isFinite(p.spend) ? p.spend : 0), 0);
  const count = visiblePoints.length;

  const sizeExamples = [200, 800, 2000];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        {/* Size Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Bubble Size</h3>
            <div className="flex items-end gap-4">
              {sizeExamples.map((s) => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <div
                    className="rounded-full border-2 border-violet-600/30 bg-violet-600/10"
                    style={{ width: radiusFromSpend(s) * 2, height: radiusFromSpend(s) * 2 }}
                  />
                  <span className="text-xs font-medium text-gray-600">£{s.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Size scales with spend amount
          </div>
        </div>

        {/* Category Colors */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Categories</h3>
          <div className="flex flex-wrap items-center gap-3">
            {Object.entries(CAT).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: color }} 
                />
                <span className="text-sm font-medium text-gray-700">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="xl:text-right">
          <div className="text-2xl font-bold text-gray-900">
            £{Math.round(totalSpend).toLocaleString("en-GB")}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            {count.toLocaleString()} transactions shown
          </div>
        </div>
      </div>
    </div>
  );
}


