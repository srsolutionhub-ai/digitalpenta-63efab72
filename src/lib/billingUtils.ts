// Shared GST / billing helpers for Quotations & Invoices.
// Company is a Delhi-registered Indian entity; used to decide CGST+SGST (intra-state)
// vs IGST (inter-state / export / SEZ / outside-India clients).

export const COMPANY = {
  legalName: "Digital Penta",
  gstin: "07AAECD1234F1Z5", // TODO: replace with the real registered GSTIN
  state: "Delhi",
  stateCode: "07",
  address: "124 C Katwaria Sarai, New Delhi 110016, India",
  pan: "AAECD1234F",
  bank: {
    accountName: "Digital Penta Pvt Ltd",
    accountNumber: "XXXXXXXXXXXX1234",
    ifsc: "HDFC0001234",
    bankName: "HDFC Bank",
    branch: "Katwaria Sarai, New Delhi",
    swift: "HDFCINBB",
  },
  upi: "digitalpenta@okhdfcbank",
};

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh",
  "Chandigarh", "Puducherry", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
];

export const PLACE_OF_SUPPLY_OPTIONS = [...INDIAN_STATES, "Outside India (Export of Services)"];

export interface GstSplit {
  isExport: boolean;
  isIntraState: boolean;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
}

/** Split a tax amount into CGST/SGST (intra-state) or IGST (inter-state/export) by place of supply. */
export function calcGstSplit(taxableAmount: number, taxRate: number, placeOfSupply?: string | null): GstSplit {
  const isExport = !placeOfSupply || placeOfSupply === "Outside India (Export of Services)";
  const isIntraState = !isExport && placeOfSupply === COMPANY.state;
  const totalTax = Math.round(taxableAmount * (taxRate / 100) * 100) / 100;
  if (isExport) {
    // Zero-rated / LUT export — no GST charged (still shown as 0 split for clarity).
    return { isExport, isIntraState: false, cgst: 0, sgst: 0, igst: 0, totalTax: 0 };
  }
  if (isIntraState) {
    const half = Math.round((totalTax / 2) * 100) / 100;
    return { isExport, isIntraState, cgst: half, sgst: totalTax - half, igst: 0, totalTax };
  }
  return { isExport, isIntraState, cgst: 0, sgst: 0, igst: totalTax, totalTax };
}

/** e-Invoicing (IRN) is mandatory for B2B once aggregate turnover crosses the govt threshold (₹5 Cr as of FY24-25). */
export const E_INVOICE_TURNOVER_THRESHOLD_INR = 50000000;

export function formatCurrency(amount: number, currency = "INR") {
  const symbols: Record<string, string> = { INR: "₹", USD: "$", AED: "AED ", GBP: "£", EUR: "€" };
  const symbol = symbols[currency] ?? currency + " ";
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return `${symbol}${Number(amount || 0).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
}
function threeDigits(n: number): string {
  if (n < 100) return twoDigits(n);
  return ONES[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + twoDigits(n % 100) : "");
}

/** Convert a rupee amount to words using the Indian numbering system (Lakh/Crore). */
function numberToWordsIndian(num: number): string {
  if (num === 0) return "Zero";
  const crore = Math.floor(num / 10000000); num %= 10000000;
  const lakh = Math.floor(num / 100000); num %= 100000;
  const thousand = Math.floor(num / 1000); num %= 1000;
  const rest = num;
  let parts: string[] = [];
  if (crore) parts.push(threeDigits(crore) + " Crore");
  if (lakh) parts.push(threeDigits(lakh) + " Lakh");
  if (thousand) parts.push(threeDigits(thousand) + " Thousand");
  if (rest) parts.push(threeDigits(rest));
  return parts.join(" ");
}

/** International (million/billion) numbering for non-INR currencies. */
function numberToWordsInternational(num: number): string {
  if (num === 0) return "Zero";
  const billion = Math.floor(num / 1000000000); num %= 1000000000;
  const million = Math.floor(num / 1000000); num %= 1000000;
  const thousand = Math.floor(num / 1000); num %= 1000;
  const rest = num;
  let parts: string[] = [];
  if (billion) parts.push(threeDigits(billion) + " Billion");
  if (million) parts.push(threeDigits(million) + " Million");
  if (thousand) parts.push(threeDigits(thousand) + " Thousand");
  if (rest) parts.push(threeDigits(rest));
  return parts.join(" ");
}

const CURRENCY_UNITS: Record<string, { major: string; minor: string }> = {
  INR: { major: "Rupees", minor: "Paise" },
  USD: { major: "US Dollars", minor: "Cents" },
  AED: { major: "UAE Dirhams", minor: "Fils" },
  GBP: { major: "Pounds Sterling", minor: "Pence" },
  EUR: { major: "Euros", minor: "Cents" },
};

/** Amount in words, e.g. "Rupees Two Lakh Fifty Thousand Only" — Stripe/Razorpay-style invoice line. */
export function amountInWords(amount: number, currency = "INR"): string {
  const units = CURRENCY_UNITS[currency] ?? { major: currency, minor: "Cents" };
  const whole = Math.floor(Math.abs(amount));
  const paise = Math.round((Math.abs(amount) - whole) * 100);
  const wordFn = currency === "INR" ? numberToWordsIndian : numberToWordsInternational;
  let words = `${units.major} ${wordFn(whole)}`;
  if (paise > 0) words += ` and ${wordFn(paise)} ${units.minor}`;
  return `${words} Only`;
}

export const QUOTE_STATUS_FLOW = ["draft", "sent", "viewed", "accepted", "declined", "expired"] as const;
export const INVOICE_PAYMENT_STATUS = ["unpaid", "partial", "paid", "overdue"] as const;

export function computeInvoicePaymentStatus(total: number, amountPaid: number, dueDate?: string | null, currentStatus?: string | null): string {
  if (currentStatus === "cancelled") return "cancelled";
  const paid = Number(amountPaid || 0);
  const totalNum = Number(total || 0);
  if (paid >= totalNum && totalNum > 0) return "paid";
  const today = new Date().toISOString().slice(0, 10);
  if (dueDate && dueDate < today && paid < totalNum) return "overdue";
  if (paid > 0 && paid < totalNum) return "partial";
  return "unpaid";
}

/** Postgres "column does not exist" error code — used to feature-detect schema upgrades gracefully. */
export function isMissingColumnError(err: any): boolean {
  return err?.code === "42703" || /column .* does not exist/i.test(err?.message ?? "");
}

export function stripUnknownColumns<T extends Record<string, any>>(obj: T, keysToStrip: string[]): T {
  const copy = { ...obj };
  for (const k of keysToStrip) delete (copy as any)[k];
  return copy;
}
