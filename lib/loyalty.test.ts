import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    order: { count: vi.fn() },
    voucher: { count: vi.fn(), create: vi.fn() },
  },
}));

import { checkAndGrantVoucher } from "./loyalty";
import { db } from "@/lib/db";

const mockOrderCount = db.order.count as ReturnType<typeof vi.fn>;
const mockVoucherCount = db.voucher.count as ReturnType<typeof vi.fn>;
const mockVoucherCreate = db.voucher.create as ReturnType<typeof vi.fn>;

describe("checkAndGrantVoucher", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does nothing when delivered count is 0", async () => {
    mockOrderCount.mockResolvedValue(0);
    await checkAndGrantVoucher("user1");
    expect(mockVoucherCreate).not.toHaveBeenCalled();
  });

  it("does nothing when count is not a multiple of 10", async () => {
    mockOrderCount.mockResolvedValue(7);
    await checkAndGrantVoucher("user1");
    expect(mockVoucherCreate).not.toHaveBeenCalled();
  });

  it("creates voucher on exactly the 10th delivered order", async () => {
    mockOrderCount.mockResolvedValue(10);
    mockVoucherCount.mockResolvedValue(0);
    mockVoucherCreate.mockResolvedValue({});
    await checkAndGrantVoucher("user1");
    expect(mockVoucherCreate).toHaveBeenCalledWith({
      data: { userId: "user1", value: 100 },
    });
  });

  it("creates second voucher on 20th delivered order", async () => {
    mockOrderCount.mockResolvedValue(20);
    mockVoucherCount.mockResolvedValue(1);
    mockVoucherCreate.mockResolvedValue({});
    await checkAndGrantVoucher("user1");
    expect(mockVoucherCreate).toHaveBeenCalledOnce();
  });

  it("does not create duplicate when voucher already exists", async () => {
    mockOrderCount.mockResolvedValue(10);
    mockVoucherCount.mockResolvedValue(1);
    await checkAndGrantVoucher("user1");
    expect(mockVoucherCreate).not.toHaveBeenCalled();
  });
});
