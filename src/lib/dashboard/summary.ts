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
  };
  payments: {
    orderedThisMonthAmount: number;
    paidThisMonthAmount: number;
    unpaidAmount: number;
    unpaidPurchaseCount: number;
  };
  inventory: {
    stockTotalAmount: number;
    reservedTotalAmount: number;
  };
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  // Postgres: AN-KAN
  const inProgressResult = await ankanDb.query(`
    SELECT COUNT(*) AS in_progress_count
    FROM projects
    WHERE (lost_flag = 0 OR lost_flag IS NULL)
      AND status NOT IN ('設置完了', '失注')
  `);

  const newThisMonthResult = await ankanDb.query(`
    SELECT COUNT(*) AS new_this_month_count
    FROM projects
    WHERE created_at >= date_trunc('month', current_date)
      AND created_at < date_trunc('month', current_date) + interval '1 month'
  `);

  const installationResult = await ankanDb.query(`
    SELECT COUNT(*) AS installation_this_month_count
    FROM projects
    WHERE installation_date >= date_trunc('month', current_date)
      AND installation_date < date_trunc('month', current_date) + interval '1 month'
  `);

  const troubleResult = await ankanDb.query(`
    SELECT COUNT(*) AS trouble_count
    FROM projects
    WHERE trouble_flag = 1
  `);

  const revenueResult = await ankanDb.query(`
    SELECT COALESCE(SUM(revenue), 0) AS revenue_total
    FROM projects
    WHERE (lost_flag = 0 OR lost_flag IS NULL)
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

  const [unpaidAmountRows] = await odaPayDb.query(`
    SELECT COALESCE(SUM(
      p.total_amount - COALESCE(pp.paid_total, 0)
    ), 0) AS unpaid_amount
    FROM purchases p
    LEFT JOIN (
      SELECT purchase_id, SUM(paid_amount) AS paid_total
      FROM purchase_payments
      GROUP BY purchase_id
    ) pp
      ON p.id = pp.purchase_id
    WHERE p.total_amount > COALESCE(pp.paid_total, 0)
  `);

  const [unpaidCountRows] = await odaPayDb.query(`
    SELECT COUNT(*) AS unpaid_purchase_count
    FROM purchases p
    LEFT JOIN (
      SELECT purchase_id, SUM(paid_amount) AS paid_total
      FROM purchase_payments
      GROUP BY purchase_id
    ) pp
      ON p.id = pp.purchase_id
    WHERE p.total_amount > COALESCE(pp.paid_total, 0)
  `);

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
    },
    payments: {
      orderedThisMonthAmount: Number((orderedRows as any[])[0]?.ordered_this_month_amount || 0),
      paidThisMonthAmount: Number((paidRows as any[])[0]?.paid_this_month_amount || 0),
      unpaidAmount: Number((unpaidAmountRows as any[])[0]?.unpaid_amount || 0),
      unpaidPurchaseCount: Number((unpaidCountRows as any[])[0]?.unpaid_purchase_count || 0),
    },
    inventory: {
      stockTotalAmount: Number((stockRows as any[])[0]?.stock_total_amount || 0),
      reservedTotalAmount: Number((reservedRows as any[])[0]?.reserved_total_amount || 0),
    },
  };
}