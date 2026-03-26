import ankanDb from "../db/ankanDb";
import odaPayDb from "../db/odaPayDb";
import zaikoDb from "../db/zaikoDb";

export type DashboardSummary = {
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
    unpaidAmountByCurrency: Record<string, number>;
  };
  inventory: {
    stockTotalAmount: number;
    reservedTotalAmount: number;
  };
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  // Postgres: AN-KAN
  // 進行中案件数
  const inProgressResult = await ankanDb.query(`
    SELECT COUNT(*) AS in_progress_count
    FROM projects
    WHERE (lost_flag = false OR lost_flag IS NULL)
      AND status NOT IN ('設置完了', '失注')
  `);

  // 今月新規案件
  const newThisMonthResult = await ankanDb.query(`
    SELECT COUNT(*) AS new_this_month_count
    FROM projects
    WHERE (created_at AT TIME ZONE 'Asia/Tokyo') >= date_trunc('month', now() AT TIME ZONE 'Asia/Tokyo')
      AND (created_at AT TIME ZONE 'Asia/Tokyo') < date_trunc('month', now() AT TIME ZONE 'Asia/Tokyo') + interval '1 month'
  `);

  // 今月設置予定
  const installationResult = await ankanDb.query(`
    SELECT COUNT(*) AS installation_this_month_count
    FROM projects
    WHERE installation_date IS NOT NULL
      AND (installation_date AT TIME ZONE 'Asia/Tokyo') >= date_trunc('month', now() AT TIME ZONE 'Asia/Tokyo')
      AND (installation_date AT TIME ZONE 'Asia/Tokyo') < date_trunc('month', now() AT TIME ZONE 'Asia/Tokyo') + interval '1 month'
  `);

  // トラブル件数
  const troubleResult = await ankanDb.query(`
    SELECT COUNT(*) AS trouble_count
    FROM projects
    WHERE trouble_flag = true
  `);

  // 売上合計
  const revenueResult = await ankanDb.query(`
    SELECT COALESCE(SUM(revenue), 0) AS revenue_total
    FROM projects
    WHERE (lost_flag = false OR lost_flag IS NULL)
  `);

  //売上見込み
  const remainingEstimatedResult = await ankanDb.query(`
    SELECT COALESCE(SUM(
      GREATEST(COALESCE(estimated_amount, 0) - COALESCE(revenue, 0), 0)
    ), 0) AS remaining_estimated_amount
    FROM projects
    WHERE (lost_flag = false OR lost_flag IS NULL)
      AND status NOT IN ('設置完了', '失注')
  `);

  // MySQL: Oda-pay
  const [orderedRows] = await odaPayDb.query(`
    SELECT COALESCE(SUM(total_amount), 0) AS ordered_this_month_amount
    FROM purchases
    WHERE order_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
      AND order_date < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
  `);

  const [paidRows] = await odaPayDb.query(`
    SELECT COALESCE(SUM(paid_amount), 0) AS paid_this_month_amount
    FROM purchase_payments
    WHERE paid_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
      AND paid_date < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
  `);

  const [summaryRows] = await odaPayDb.query(`
  SELECT
    p.id,
    p.total_amount,
    p.currency,
    COALESCE(SUM(
      CASE
        WHEN pp.paid_date IS NOT NULL THEN pp.paid_amount
        ELSE 0
      END
    ), 0) AS paid_total
  FROM purchases p
  LEFT JOIN purchase_payments pp
    ON pp.purchase_id = p.id
  GROUP BY
    p.id,
    p.total_amount,
    p.currency
`);

const unpaidAmountByCurrency: Record<string, number> = {};
let unpaidPurchaseCount = 0;
let unpaidAmount = 0;

(summaryRows as any[]).forEach((row) => {
  const total = Number(row.total_amount || 0);
  const paid = Number(row.paid_total || 0);
  const unpaid = Math.max(total - paid, 0);
  const currency = row.currency || "UNKNOWN";

  if (unpaid > 0) {
    unpaidPurchaseCount += 1;
    unpaidAmount += unpaid;
    unpaidAmountByCurrency[currency] =
      (unpaidAmountByCurrency[currency] || 0) + unpaid;
  }
});


  // MySQL: zaiko
  const [stockRows] = await zaikoDb.query(`
    SELECT COALESCE(SUM(amount), 0) AS stock_total_amount
    FROM forStock
  `);

  const [reservedRows] = await zaikoDb.query(`
    SELECT COALESCE(SUM(amount), 0) AS reserved_total_amount
    FROM forOrder
  `);

  return {
    salesProjects: {
      inProgressCount: Number(inProgressResult.rows[0]?.in_progress_count || 0),
      newThisMonthCount: Number(inProgressResult.rows[0]?.new_this_month_count || 0),
      installationThisMonthCount: Number(installationResult.rows[0]?.installation_this_month_count || 0),
      troubleCount: Number(troubleResult.rows[0]?.trouble_count || 0),
      revenueTotal: Number(revenueResult.rows[0]?.revenue_total || 0),
      remainingEstimatedAmount: Number(
        remainingEstimatedResult.rows[0]?.remaining_estimated_amount || 0
      ),
    },
    payments: {
      orderedThisMonthAmount: Number((orderedRows as any[])[0]?.ordered_this_month_amount || 0),
      paidThisMonthAmount: Number((paidRows as any[])[0]?.paid_this_month_amount || 0),
      unpaidAmount,
      unpaidPurchaseCount,
      unpaidAmountByCurrency,
    },
    inventory: {
      stockTotalAmount: Number((stockRows as any[])[0]?.stock_total_amount || 0),
      reservedTotalAmount: Number((reservedRows as any[])[0]?.reserved_total_amount || 0),
    },
  };
}