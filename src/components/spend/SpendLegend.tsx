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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-end gap-3">
          {sizeExamples.map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div
                className="rounded-full border border-[#7159B6] bg-[#7159B6]/10"
                style={{ width: radiusFromSpend(s) * 2, height: radiusFromSpend(s) * 2 }}
              />
              <span className="mt-1 text-[11px] text-gray-600">£{s}</span>
            </div>
          ))}
        </div>
        <span className="text-gray-700">Bubble size scales with spend</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {Object.entries(CAT).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-gray-800">{name}</span>
          </div>
        ))}
      </div>

      <div className="font-medium text-gray-900">
        Total shown: £{Math.round(totalSpend).toLocaleString("en-GB")} • {count} transactions
      </div>
    </div>
  );
}


