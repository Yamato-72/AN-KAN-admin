type Props = {
  title: string;
  value: string | number;
  subLabel?: string;
};

export default function KpiCard({ title, value, subLabel }: Props) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>
        {value}
      </div>
      {subLabel && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#9ca3af" }}>
          {subLabel}
        </div>
      )}
    </div>
  );
}