const LS_KEY = "productStats";

export interface ProductStat {
  productId: number;
  name: string;
  views: number;
  likes: number;
  loves: number;
  cartAdds: number;
}

function load(): Record<number, ProductStat> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function save(data: Record<number, ProductStat>) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}

function bump(productId: number, name: string, field: keyof Omit<ProductStat, "productId" | "name">) {
  const data = load();
  if (!data[productId]) data[productId] = { productId, name, views: 0, likes: 0, loves: 0, cartAdds: 0 };
  data[productId].name = name;
  data[productId][field]++;
  save(data);
}

export const trackView = (id: number, name: string) => bump(id, name, "views");
export const trackLike = (id: number, name: string) => bump(id, name, "likes");
export const trackLove = (id: number, name: string) => bump(id, name, "loves");
export const trackCartAdd = (id: number, name: string) => bump(id, name, "cartAdds");

export function loadStats(): ProductStat[] {
  const data = load();
  return Object.values(data).sort((a, b) => (b.views + b.likes + b.loves + b.cartAdds) - (a.views + a.likes + a.loves + a.cartAdds));
}
