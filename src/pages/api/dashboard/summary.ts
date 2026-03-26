import type { NextApiRequest, NextApiResponse } from "next";
import { getDashboardSummary } from "@/lib/dashboard/summary";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const summary = await getDashboardSummary();
    return res.status(200).json(summary);
  } catch (error: any) {
    console.error("dashboard summary api error:", error);
    return res.status(500).json({
      error: "Failed to fetch dashboard summary",
      detail: error?.message || String(error),
    });
  }
}