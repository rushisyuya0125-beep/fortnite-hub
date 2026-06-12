const BASE_URL = 'https://fortnite-api.com';

export type NewsCategory = 'br' | 'stw' | 'creative';

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  image: string;
  date: string;
  category: NewsCategory;
}

export async function fetchFortniteNews(): Promise<NewsItem[]> {
  const response = await fetch(`${BASE_URL}/v2/news`, { next: { revalidate: 300 } });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const json = await response.json();
  const { br, stw, creative } = json.data ?? {};

  const brItems: NewsItem[] = (br?.motds ?? [])
    .filter((m: any) => !m.hidden)
    .map((m: any) => ({
      id: `br-${m.id}`,
      title: m.title,
      body: m.body,
      image: m.tileImage || m.image || '',
      date: br.date,
      category: 'br' as NewsCategory,
    }));

  const stwItems: NewsItem[] = (stw?.messages ?? []).map((m: any, i: number) => ({
    id: `stw-${i}`,
    title: m.title,
    body: m.body,
    image: m.image || '',
    date: stw?.date ?? '',
    category: 'stw' as NewsCategory,
  }));

  const creativeRaw = creative?.motds ?? creative?.messages ?? [];
  const creativeItems: NewsItem[] = creativeRaw
    .filter((m: any) => !m.hidden)
    .map((m: any, i: number) => ({
      id: `creative-${m.id ?? i}`,
      title: m.title,
      body: m.body,
      image: m.tileImage || m.image || '',
      date: creative?.date ?? '',
      category: 'creative' as NewsCategory,
    }));

  return [...brItems, ...stwItems, ...creativeItems];
}
