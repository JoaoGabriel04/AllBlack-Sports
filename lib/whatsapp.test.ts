import { describe, it, expect } from "vitest";
import {
  buildWhatsAppUrl,
  buildCatalogMessage,
  buildCartMessage,
} from "./whatsapp";

describe("buildWhatsAppUrl", () => {
  it("builds correct base URL with phone number", () => {
    const url = buildWhatsAppUrl("hello");
    expect(url).toContain("https://wa.me/5599984078478");
  });

  it("encodes the message correctly", () => {
    const url = buildWhatsAppUrl("olá mundo");
    expect(url).toContain(encodeURIComponent("olá mundo"));
  });
});

describe("buildCatalogMessage", () => {
  it("returns catalog contact message", () => {
    const msg = buildCatalogMessage();
    expect(msg).toContain("AllBlack Sports");
    expect(msg).toContain("catálogo");
  });
});

describe("buildCartMessage", () => {
  const items = [
    { name: "Camisa Brasil", qty: 2, price: 89.9 },
    { name: "Kit Treino PSG", qty: 1, price: 149.9 },
  ];
  const total = 329.7;

  it("includes all item names and quantities", () => {
    const msg = buildCartMessage(items, total);
    expect(msg).toContain("2x Camisa Brasil");
    expect(msg).toContain("1x Kit Treino PSG");
  });

  it("shows total without voucher", () => {
    const msg = buildCartMessage(items, total);
    expect(msg).toContain("Total: R$ 329.70");
    expect(msg).not.toContain("Voucher");
  });

  it("shows discount when voucher applied", () => {
    const msg = buildCartMessage(items, total, "VOUCHER-ABC", 100);
    expect(msg).toContain("Subtotal: R$ 329.70");
    expect(msg).toContain("Voucher (VOUCHER-ABC): -R$ 100.00");
    expect(msg).toContain("Total com desconto: R$ 229.70");
  });

  it("does not show voucher line when no voucher", () => {
    const msg = buildCartMessage(items, total);
    expect(msg).not.toContain("Subtotal");
    expect(msg).not.toContain("desconto");
  });
});
