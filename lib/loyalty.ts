import { db } from "@/lib/db";

export async function checkAndGrantVoucher(userId: string): Promise<void> {
  const deliveredCount = await db.order.count({
    where: { userId, status: "DELIVERED" },
  });

  if (deliveredCount === 0 || deliveredCount % 10 !== 0) return;

  const existingVouchers = await db.voucher.count({ where: { userId } });
  const expectedVouchers = deliveredCount / 10;

  if (existingVouchers >= expectedVouchers) return;

  await db.voucher.create({ data: { userId, value: 100 } });
}
