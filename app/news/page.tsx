import { fetchFortniteNews, NewsItem, NewsCategory } from "@/lib/fortniteApi";
import { NewsCard } from "@/components/NewsCard";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "フォートナイト最新ニュース | フォトナHub",
  description: "フォートナイトの最新ニュース・アップデート情報をいち早くチェック。バトルロイヤル・STW・クリエイティブの情報をまとめて確認できます。",
};

const categoryLabel: Record<NewsCategory, string> = {
  br: "バトルロイヤル",
  stw: "STW",
  creative: "クリエイティブ",
};

const categoryColor: Record<NewsCategory, string> = {
  br: "#00c8ff",
  stw: "#ff8c00",
  creative: "#a855f7",
};

export default async function NewsPage() {
  let items: NewsItem[] = [];
  let error = false;

  try {
    items = await fetchFortniteNews();
  } catch {
    error = true;
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{
          fontSize: "22px",
          fontWeight: "900",
          color: "var(--text)",
          letterSpacing: "1px",
          marginBottom: "4px",
        }}>
          📰 フォートナイト最新ニュース
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          タップで詳細を読めます
        </p>
      </div>

      {/* カテゴリー凡例 */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {(Object.keys(categoryLabel) as NewsCategory[]).map((cat) => (
          <span key={cat} style={{
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "700",
            backgroundColor: `${categoryColor[cat]}22`,
            color: categoryColor[cat],
            border: `1px solid ${categoryColor[cat]}44`,
          }}>
            {categoryLabel[cat]}
          </span>
        ))}
      </div>

      {error ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>データを読み込めませんでした</p>
          <p style={{ fontSize: "13px" }}>しばらくしてからリロードしてください</p>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <p>現在ニュースはありません</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
        }}>
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
