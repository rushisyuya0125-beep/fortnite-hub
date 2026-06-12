const BASE_URL = 'https://fortnite-api.com';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: string;
  typeDisplay: string;
  rarity: string;
  rarityDisplay: string;
  price: number;
  image: string;
  bundle: string | null;
}

export const rarityColors: Record<string, string> = {
  common: '#b0b0b0',
  uncommon: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800',
  mythic: '#FFD700',
  exotic: '#00E5FF',
  transcendent: '#FF1744',
};

const rarityOrder: Record<string, number> = {
  transcendent: 0,
  mythic: 1,
  exotic: 2,
  legendary: 3,
  epic: 4,
  rare: 5,
  uncommon: 6,
  common: 7,
};

export async function fetchShop(): Promise<ShopItem[]> {
  const res = await fetch(`${BASE_URL}/v2/shop?language=ja`, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Shop API error: ${res.status}`);
  const json = await res.json();

  const entries: any[] = json.data?.entries ?? [];
  const seen = new Set<string>();
  const items: ShopItem[] = [];

  for (const entry of entries) {
    const brItems: any[] = entry.brItems ?? entry.items ?? [];
    if (!brItems.length) continue;

    for (const item of brItems) {
      const name: string = item.name ?? '';
      if (!name || seen.has(name)) continue;
      seen.add(name);

      const image =
        item.images?.featured ??
        item.images?.icon ??
        item.images?.smallIcon ??
        '';

      items.push({
        id: item.id ?? entry.offerId,
        name,
        description: item.description ?? '',
        type: item.type?.value ?? '',
        typeDisplay: item.type?.displayValue ?? '',
        rarity: item.rarity?.value ?? 'common',
        rarityDisplay: item.rarity?.displayValue ?? '',
        price: entry.finalPrice ?? entry.regularPrice ?? 0,
        image,
        bundle: entry.bundle?.name ?? null,
      });
    }
  }

  items.sort((a, b) => {
    const ra = rarityOrder[a.rarity] ?? 8;
    const rb = rarityOrder[b.rarity] ?? 8;
    return ra - rb;
  });

  return items;
}
