"use client";

import { useEffect, useMemo, useRef } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { SpendPoint } from "../../data/spend.mock";
import { radiusFromSpend } from "../../lib/scale";
import L from "leaflet";

const CAT: Record<SpendPoint["category"], string> = {
  "Food & Drink": "#FFB800",
  Transport: "#483D6A",
  Shopping: "#F76559",
  Entertainment: "#1E90FF",
  Groceries: "#2ECC71",
  Bills: "#9B59B6",
  Other: "#95A5A6",
};

type Props = { points: SpendPoint[]; focusedId?: string };

// Ensures the map invalidates size when container becomes visible in responsive layouts
function ResizeOnMount() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 0);
  }, [map]);
  return null;
}

function AccessibleCircleMarker({ point }: { point: SpendPoint }) {
  const ref = useRef<L.CircleMarker | null>(null);
  const radius = useMemo(() => radiusFromSpend(point.spend), [point.spend]);

  useEffect(() => {
    const layer = ref.current;
    const el = layer?.getElement();
    if (!layer || !el) return;
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `${point.city}, £${point.spend.toLocaleString("en-GB", { maximumFractionDigits: 0 })}, ${point.category}, ${new Date(point.date).toLocaleDateString("en-GB")}`);

    const onFocus = () => layer.openTooltip();
    const onBlur = () => layer.closeTooltip();
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);
    return () => {
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
    };
  }, [point]);

  return (
    <CircleMarker
      ref={ref as any}
      center={[point.lat, point.lng]}
      radius={radius}
      pathOptions={{ color: "#7159B6", weight: 1, fillColor: CAT[point.category] ?? "#95A5A6", fillOpacity: 0.65 }}
    >
      <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={false} sticky>
        <div className="text-sm">
          <div className="font-semibold">{point.city}</div>
          <dl className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1 mt-1">
            <dt className="opacity-70">Spend</dt>
            <dd>£{point.spend.toLocaleString("en-GB", { maximumFractionDigits: 0 })}</dd>
            <dt className="opacity-70">Category</dt>
            <dd>{point.category}</dd>
            <dt className="opacity-70">Date</dt>
            <dd>{new Date(point.date).toLocaleDateString("en-GB")}</dd>
          </dl>
        </div>
      </Tooltip>
    </CircleMarker>
  );
}

export default function SpendMapInner({ points, focusedId }: Props) {
  return (
    <div className="w-full h-[360px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
      <MapContainer center={[54.5, -3]} zoom={6} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <ResizeOnMount />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <AccessibleCircleMarker key={p.id} point={p} />
        ))}
        <FlyToIfFocused points={points} focusedId={focusedId} />
      </MapContainer>
    </div>
  );
}

function FlyToIfFocused({ points, focusedId }: { points: SpendPoint[]; focusedId?: string }) {
  const map = useMap();
  useEffect(() => {
    if (!focusedId) return;
    const target = points.find((p) => p.id === focusedId);
    if (!target) return;
    map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 10), { duration: 0.8 });
  }, [focusedId, points, map]);
  return null;
}


