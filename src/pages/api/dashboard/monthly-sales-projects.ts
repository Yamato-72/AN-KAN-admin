import type { NextApiRequest, NextApiResponse } from "next";
import ankanDb from "@/lib/db/ankanDb";

type MonthlySalesProjectsRow = {
  month: string;
  count: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await ankanDb.query(`
      SELECT
        TO_CHAR(
          date_trunc('month', created_at AT TIME ZONE 'Asia/Tokyo'),
          'YYYY-MM'
        ) AS month,
        COUNT(*) AS count
      FROM projects
      WHERE created_at IS NOT NULL
      GROUP BY date_trunc('month', created_at AT TIME ZONE 'Asia/Tokyo')
      ORDER BY date_trunc('month', created_at AT TIME ZONE 'Asia/Tokyo') ASC
    `);

    const data: MonthlySalesProjectsRow[] = result.rows.map((row) => ({
      month: row.month,
      count: Number(row.count || 0),
    }));

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("monthly sales projects api error:", error);
    return res.status(500).json({
      error: "Failed to fetch monthly sales projects",
      detail: error?.message || String(error),
    });
  }
}