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

export async function fetchShop(): Promise<ShopItem[]> {
  const res = await fetch(`${BASE_URL}/v2/shop?language=ja`, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Shop API error: ${res.status}`);
  const json = await res.json();

  const entries: any[] = json.data?.entries ?? [];
  const items: ShopItem[] = [];

  for (const entry of entries) {
    const brItems: any[] = entry.brItems ?? entry.items ?? [];
    if (!brItems.length) continue;
    const item = brItems[0];
    items.push({
      id: entry.offerId ?? item.id,
      name: item.name ?? '不明',
      description: item.description ?? '',
      type: item.type?.value ?? '',
      typeDisplay: item.type?.displayValue ?? '',
      rarity: item.rarity?.value ?? 'common',
      rarityDisplay: item.rarity?.displayValue ?? '',
      price: entry.finalPrice ?? entry.regularPrice ?? 0,
      image: item.images?.featured ?? item.images?.icon ?? item.images?.smallIcon ?? '',
      bundle: entry.bundle?.name ?? null,
    });
  }

  return items;
}
