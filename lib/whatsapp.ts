const PHONE = "5599984078478";

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

export const buildCatalogMessage = () =>
  "Olá! Vi o catálogo da AllBlack Sports e gostaria de realizar uma compra.";

export function buildCartMessage(
  items: { name: string; qty: number; price: number }[],
  total: number,
  voucherCode?: string,
  voucherValue?: number
): string {
  const lines = items.map(
    (i) => `• ${i.qty}x ${i.name} — R$ ${i.price.toFixed(2)} cada`
  );

  const totals =
    voucherValue && voucherCode
      ? [
          `Subtotal: R$ ${total.toFixed(2)}`,
          `Voucher (${voucherCode}): -R$ ${voucherValue.toFixed(2)}`,
          `Total com desconto: R$ ${(total - voucherValue).toFixed(2)}`,
        ]
      : [`Total: R$ ${total.toFixed(2)}`];

  return [
    "Olá! Gostaria de realizar um pedido na AllBlack Sports.",
    "",
    "Itens:",
    ...lines,
    "",
    ...totals,
    "",
    "Aguardo confirmação! 🛒",
  ].join("\n");
}
