import { InvoiceData } from "./types";

export const PAYMENT_TERMS_OPTIONS = [
  "None",
  "Due on Receipt",
  "Net 15",
  "Net 30",
  "Net 60",
] as const;

function todayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function createDefaultInvoice(): InvoiceData {
  return {
    fromName: "Nataly Schloser",
    fromCompany: "Design Gurú LLC, EIN 84-2529742",
    fromAddress: "1135 103rd St, Bay Harbor Islands, FL 33154",
    fromEmail: "natalyschloser@gmail.com",
    fromPhone: "(305) 202-2892",

    toName: "",
    toCompany: "",
    toAddress: "",
    toEmail: "",
    toPhone: "",

    invoiceNumber: "",
    issueDate: todayString(),
    dueDate: "",
    paymentTerms: "None",

    projectName: "",

    lineItems: [{ id: crypto.randomUUID(), description: "", details: "", quantity: 1, rate: 0 }],

    taxEnabled: false,
    taxRate: 0,
    discountEnabled: false,
    discountType: "percentage",
    discountValue: 0,

    notes: "Payment via Zelle: natalyschloser@gmail.com",
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateSubtotal(items: InvoiceData["lineItems"]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
}

export function calculateTotal(data: InvoiceData): number {
  const subtotal = calculateSubtotal(data.lineItems);
  let total = subtotal;

  if (data.taxEnabled && data.taxRate > 0) {
    total += subtotal * (data.taxRate / 100);
  }

  if (data.discountEnabled && data.discountValue > 0) {
    if (data.discountType === "percentage") {
      total -= subtotal * (data.discountValue / 100);
    } else {
      total -= data.discountValue;
    }
  }

  return Math.max(0, total);
}
