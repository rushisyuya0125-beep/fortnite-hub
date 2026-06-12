import { fetchShop, rarityColors, ShopItem } from "@/lib/shopApi";
import Image from "next/image";

export const revalidate = 600;

function ShopCard({ item }: { item: ShopItem }) {
  const color = rarityColors[item.rarity] ?? rarityColors.common;
  return (
    <div style={{
      backgroundColor: "var(--card)",
      borderRadius: "10px",
      overflow: "hidden",
      border: `1px solid ${color}44`,
      display: "flex",
      flexDirection: "column",
    }}>
      {item.image ? (
        <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 180px"
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : (
        <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "var(--border)" }} />
      )}
      <div style={{ height: "3px", backgroundColor: color }} />
      <div style={{ padding: "8px" }}>
        <p style={{
          fontSize: "10px",
          color: "var(--text-muted)",
          fontWeight: "600",
          textTransform: "uppercase",
          marginBottom: "2px",
        }}>
          {item.rarityDisplay || item.typeDisplay}
        </p>
        <p style={{
          fontSize: "12px",
          fontWeight: "700",
          color: "var(--text)",
          lineHeight: 1.3,
          marginBottom: "6px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as any,
        }}>
          {item.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: "12px" }}>⟁</span>
          <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: "12px" }}>
            {item.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default async function ShopPage() {
  let items: ShopItem[] = [];
  let error = false;

  try {
    items = await fetchShop();
  } catch {
    error = true;
  }

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{
          fontSize: "22px",
          fontWeight: "900",
          color: "var(--text)",
          letterSpacing: "1px",
          marginBottom: "4px",
        }}>
          🛍️ 今日のアイテムショップ
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{today}</p>
      </div>

      {error ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>データを読み込めませんでした</p>
          <p style={{ fontSize: "13px" }}>しばらくしてからリロードしてください</p>
        </div>
      ) : (
        <>
          <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "14px" }}>
            {items.length}件のアイテム
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: "10px",
          }}>
            {items.map((item) => (
              <ShopCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
