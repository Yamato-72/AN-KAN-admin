import { useEffect, useState } from "react";
import KpiCard from "@/components/dashboard/KpiCard";

type DashboardSummary = {
  salesProjects: {
    inProgressCount: number;
    newThisMonthCount: number;
    installationThisMonthCount: number;
    troubleCount: number;
    revenueTotal: number;
    remainingEstimatedAmount: number;
  };
  payments: {
    orderedThisMonthAmount: number;
    paidThisMonthAmount: number;
    unpaidAmount: number;
    unpaidPurchaseCount: number;
    unpaidAmountByCurrency: Record<string, number>; // ←追加
  };
  inventory: {
    stockTotalAmount: number;
    reservedTotalAmount: number;
  };
};

function formatYen(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/dashboard/summary");
        const json = await res.json();

        console.log("summary response:", json);

        if (!res.ok) {
          setErrorMessage(json?.error || "APIエラーが発生しました");
          return;
        }

        if (!json?.salesProjects || !json?.payments || !json?.inventory) {
          setErrorMessage("APIの返却形式が想定と異なります");
          return;
        }

        setData(json);
      } catch (error) {
        console.error(error);
        setErrorMessage("集計データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div
      style={{
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 24,
          minHeight: 0,
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>ダッシュボード</h1>
          {loading && <p>読み込み中...</p>}

          {!loading && errorMessage && (
            <p style={{ color: "red" }}>{errorMessage}</p>
          )}

          {!loading && data && (
            <>
              <h2 style={{ marginBottom: 12 }}>営業案件</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                <KpiCard title="進行中営業案件数" value={data.salesProjects.inProgressCount} />
                <KpiCard title="今月新規営業案件数" value={data.salesProjects.newThisMonthCount} />
                <KpiCard title="今月設置予定件数" value={data.salesProjects.installationThisMonthCount} />
                <KpiCard title="営業トラブル件数" value={data.salesProjects.troubleCount} />
                <KpiCard title="未確定売上見込み（見積−確定売上）" value={formatYen(data.salesProjects.remainingEstimatedAmount)} />
              </div>

              <h2 style={{ marginBottom: 12 }}>支払・発注</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                <KpiCard title="今月発注額" value={formatYen(data.payments.orderedThisMonthAmount)} />
                <KpiCard title="今月支払済額" value={formatYen(data.payments.paidThisMonthAmount)} />
                <KpiCard title="未払い額" value={formatYen(data.payments.unpaidAmount)} />
                <KpiCard title="未払い発注件数" value={data.payments.unpaidPurchaseCount} />
                {Object.entries(data.payments.unpaidAmountByCurrency).map(([currency, amount]) => (
                  <KpiCard
                    key={currency}
                    title={`未払い額 (${currency})`}
                    value={
                      currency === "JPY"
                        ? formatYen(amount as number)
                        : `${(amount as number).toLocaleString()} ${currency}`
                    }
                  />
                ))}
              </div>

              <h2 style={{ marginBottom: 12 }}>在庫</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                <KpiCard title="在庫総数" value={data.inventory.stockTotalAmount} />
                <KpiCard title="AD在庫総数" value={data.inventory.reservedTotalAmount} />
              </div>
            </>
          )}
        </main>
      </div>
  )}