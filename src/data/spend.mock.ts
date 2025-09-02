export type SpendPoint = {
  id: string;
  city: string;
  lat: number; // WGS84
  lng: number; // WGS84
  spend: number; // GBP float in mock
  category:
    | "Food & Drink"
    | "Transport"
    | "Shopping"
    | "Entertainment"
    | "Groceries"
    | "Bills"
    | "Other";
  date: string; // ISO, e.g., "2025-08-25"
};

export const CATEGORIES: SpendPoint["category"][] = [
  "Food & Drink",
  "Transport",
  "Shopping",
  "Entertainment",
  "Groceries",
  "Bills",
  "Other",
];

export const SAMPLE_SPEND: SpendPoint[] = [
  { id: "1", city: "London", lat: 51.5072, lng: -0.1276, spend: 1280, category: "Food & Drink", date: "2025-08-21" },
  { id: "2", city: "Manchester", lat: 53.4808, lng: -2.2426, spend: 920, category: "Transport", date: "2025-08-19" },
  { id: "3", city: "Cardiff", lat: 51.4816, lng: -3.1791, spend: 640, category: "Entertainment", date: "2025-08-18" },
  { id: "4", city: "Edinburgh", lat: 55.9533, lng: -3.1883, spend: 450, category: "Shopping", date: "2025-08-15" },
];

type City = {
  name: string;
  lat: number;
  lng: number;
  // Rough radius in degrees for random jittering around the city centre
  jitterDeg: number;
  weight: number; // relative weight for frequency (London highest)
};

const UK_CITIES: City[] = [
  { name: "London", lat: 51.5072, lng: -0.1276, jitterDeg: 0.25, weight: 9 },
  { name: "Manchester", lat: 53.4808, lng: -2.2426, jitterDeg: 0.15, weight: 6 },
  { name: "Birmingham", lat: 52.4862, lng: -1.8904, jitterDeg: 0.15, weight: 5 },
  { name: "Leeds", lat: 53.8008, lng: -1.5491, jitterDeg: 0.15, weight: 5 },
  { name: "Glasgow", lat: 55.8642, lng: -4.2518, jitterDeg: 0.18, weight: 5 },
  { name: "Edinburgh", lat: 55.9533, lng: -3.1883, jitterDeg: 0.15, weight: 4 },
  { name: "Cardiff", lat: 51.4816, lng: -3.1791, jitterDeg: 0.15, weight: 4 },
  { name: "Bristol", lat: 51.4545, lng: -2.5879, jitterDeg: 0.15, weight: 4 },
  { name: "Belfast", lat: 54.5973, lng: -5.9301, jitterDeg: 0.15, weight: 3 },
  { name: "Liverpool", lat: 53.4084, lng: -2.9916, jitterDeg: 0.15, weight: 4 },
  { name: "Nottingham", lat: 52.9548, lng: -1.1581, jitterDeg: 0.12, weight: 3 },
  { name: "Sheffield", lat: 53.3811, lng: -1.4701, jitterDeg: 0.12, weight: 3 },
  { name: "Newcastle", lat: 54.9783, lng: -1.6178, jitterDeg: 0.15, weight: 3 },
];

const randomChoiceWeighted = <T,>(items: T[], weights: number[]): T => {
  const total = weights.reduce((a, b) => a + b, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += weights[i];
    if (r <= acc) return items[i];
  }
  return items[items.length - 1];
};

const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

const randomDateWithinDays = (days: number): string => {
  const now = new Date();
  const past = new Date(now);
  past.setDate(now.getDate() - Math.floor(Math.random() * days));
  // Spread across hours to avoid identical times
  past.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
  return past.toISOString().slice(0, 10);
};

export const generateMockSpend = (count: number): SpendPoint[] => {
  const points: SpendPoint[] = [];
  const weights = UK_CITIES.map((c) => c.weight);

  for (let i = 0; i < count; i++) {
    const city = randomChoiceWeighted(UK_CITIES, weights);
    const lat = city.lat + randomInRange(-city.jitterDeg, city.jitterDeg);
    const lng = city.lng + randomInRange(-city.jitterDeg, city.jitterDeg);
    const spendBase = city.name === "London" ? 60 : 30;
    const spend = Math.round(randomInRange(spendBase, spendBase * 50)); // ~£30–£3000
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const date = randomDateWithinDays(90);
    points.push({
      id: `${i + 1000}`,
      city: city.name,
      lat,
      lng,
      spend,
      category,
      date,
    });
  }
  return points;
};


