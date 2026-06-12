import { fetchFortniteNews, NewsItem, NewsCategory } from "@/lib/fortniteApi";
import Image from "next/image";
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

function NewsCard({ item }: { item: NewsItem }) {
  const color = categoryColor[item.category];
  const label = categoryLabel[item.category];

  return (
    <div style={{
      backgroundColor: "var(--card)",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
    }}>
      {item.image ? (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : (
        <div style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "var(--border)" }} />
      )}
      <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{
          display: "inline-block",
          padding: "2px 10px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: "700",
          backgroundColor: `${color}22`,
          color: color,
          border: `1px solid ${color}44`,
          alignSelf: "flex-start",
        }}>
          {label}
        </span>
        <h2 style={{
          fontSize: "15px",
          fontWeight: "800",
          color: "var(--text)",
          lineHeight: 1.4,
        }}>
          {item.title}
        </h2>
        {item.body && (
          <p style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical" as any,
          }}>
            {item.body}
          </p>
        )}
      </div>
    </div>
  );
}

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
          公式の最新アップデート・イベント情報
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
