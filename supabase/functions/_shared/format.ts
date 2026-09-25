export function formatCurrency(amount: number, currency = "INR") {
  const symbols: Record<string, string> = { INR: "₹", USD: "$", AED: "AED ", GBP: "£", EUR: "€" };
  const symbol = symbols[currency] ?? currency + " ";
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return `${symbol}${Number(amount || 0).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
