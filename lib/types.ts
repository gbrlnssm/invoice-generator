export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  // FROM
  fromName: string;
  fromCompany: string;
  fromAddress: string;
  fromEmail: string;

  // BILL TO
  toName: string;
  toCompany: string;
  toAddress: string;
  toEmail: string;

  // INVOICE DETAILS
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;

  // PROJECT
  projectName: string;

  // LINE ITEMS
  lineItems: LineItem[];

  // TAX / DISCOUNT
  taxEnabled: boolean;
  taxRate: number;
  discountEnabled: boolean;
  discountType: "percentage" | "flat";
  discountValue: number;

  // NOTES
  notes: string;
}
