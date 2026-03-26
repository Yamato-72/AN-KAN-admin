import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

type DataItem = {
  month: string;
  count: number;
};

type Props = {
  data: DataItem[];
};

export default function MonthlySalesProjectsChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <p>データがありません。</p>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: 320,
        background: "#fff",
        borderRadius: 12,
        padding: 16,
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: 18 }}>
        月別新規営業案件数
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}