"use client";

import { InvoiceData } from "@/lib/types";
import {
  formatCurrency,
  formatDate,
  calculateSubtotal,
  calculateTotal,
} from "@/lib/defaults";
import { forwardRef } from "react";

interface InvoicePreviewProps {
  data: InvoiceData;
}

const Separator = () => (
  <div
    className="my-7"
    style={{ height: "1px", background: "#e5e5e5" }}
  />
);

const LightSeparator = () => (
  <div style={{ height: "1px", background: "#f0f0f0" }} />
);

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ data }, ref) => {
    const subtotal = calculateSubtotal(data.lineItems);
    const total = calculateTotal(data);
    const taxAmount =
      data.taxEnabled && data.taxRate > 0
        ? subtotal * (data.taxRate / 100)
        : 0;
    const discountAmount =
      data.discountEnabled && data.discountValue > 0
        ? data.discountType === "percentage"
          ? subtotal * (data.discountValue / 100)
          : data.discountValue
        : 0;

    const hasFrom =
      data.fromName || data.fromCompany || data.fromAddress || data.fromEmail || data.fromPhone;
    const hasTo =
      data.toName || data.toCompany || data.toAddress || data.toEmail || data.toPhone;
    const hasDateInfo =
      data.issueDate || data.dueDate || (data.paymentTerms && data.paymentTerms !== "None");

    return (
      <div
        ref={ref}
        className="bg-white w-full invoice-preview"
        style={{
          fontFamily:
            "-apple-system, system-ui, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif",
          maxWidth: "700px",
          minHeight: "906px",
          padding: "48px 44px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header: Invoice title + dates */}
        <div className="flex justify-between items-start">
          <div>
            <h1
              className="font-bold text-[rgb(29,29,31)]"
              style={{ fontSize: "26px", lineHeight: "34px", letterSpacing: "-0.02em" }}
            >
              Invoice
            </h1>
            {data.invoiceNumber && (
              <p
                className="text-[rgb(134,134,138)]"
                style={{ fontSize: "13px", lineHeight: "18px" }}
              >
                {data.invoiceNumber}
              </p>
            )}
          </div>
          {hasDateInfo && (
            <div className="text-right space-y-0.5">
              {data.issueDate && (
                <p
                  className="text-[rgb(134,134,138)]"
                  style={{ fontSize: "13px", lineHeight: "18px" }}
                >
                  Issued {formatDate(data.issueDate)}
                </p>
              )}
              {data.dueDate && (
                <p
                  className="text-[rgb(134,134,138)]"
                  style={{ fontSize: "13px", lineHeight: "18px" }}
                >
                  Due {formatDate(data.dueDate)}
                </p>
              )}
              {data.paymentTerms && data.paymentTerms !== "None" && (
                <p
                  className="text-[rgb(134,134,138)]"
                  style={{ fontSize: "13px", lineHeight: "18px" }}
                >
                  {data.paymentTerms}
                </p>
              )}
            </div>
          )}
        </div>

        {/* FROM (no section header) */}
        {hasFrom && (
          <div className="mt-5" style={{ fontSize: "14px", lineHeight: "20px" }}>
            {data.fromName && (
              <p className="font-bold text-[rgb(29,29,31)]" style={{ fontSize: "15px", lineHeight: "21px" }}>
                {data.fromName}
              </p>
            )}
            {data.fromCompany && (
              <p className="text-[rgb(134,134,138)]">{data.fromCompany}</p>
            )}
            {data.fromAddress && (
              <div className="text-[rgb(134,134,138)]">
                {data.fromAddress.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
            {data.fromEmail && (
              <p className="text-[rgb(134,134,138)]">{data.fromEmail}</p>
            )}
            {data.fromPhone && (
              <p className="text-[rgb(134,134,138)]">{data.fromPhone}</p>
            )}
          </div>
        )}

        {/* BILL TO */}
        {hasTo && (
          <>
            <Separator />
            <p
              className="font-semibold uppercase text-[rgb(134,134,138)] mb-2"
              style={{ fontSize: "10px", lineHeight: "14px", letterSpacing: "0.08em" }}
            >
              Bill To
            </p>
            <div style={{ fontSize: "14px", lineHeight: "20px" }}>
              {data.toName && (
                <p className="font-bold text-[rgb(29,29,31)]" style={{ fontSize: "15px", lineHeight: "21px" }}>
                  {data.toName}
                </p>
              )}
              {data.toCompany && (
                <p className="text-[rgb(134,134,138)]">{data.toCompany}</p>
              )}
              {data.toAddress && (
                <div className="text-[rgb(134,134,138)]">
                  {data.toAddress.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
              {data.toEmail && (
                <p className="text-[rgb(134,134,138)]">{data.toEmail}</p>
              )}
              {data.toPhone && (
                <p className="text-[rgb(134,134,138)]">{data.toPhone}</p>
              )}
            </div>
          </>
        )}

        {/* PROJECT */}
        {data.projectName && (
          <>
            <Separator />
            <p
              className="font-semibold uppercase text-[rgb(134,134,138)] mb-2"
              style={{ fontSize: "10px", lineHeight: "14px", letterSpacing: "0.08em" }}
            >
              Project
            </p>
            <p
              className="font-bold text-[rgb(29,29,31)]"
              style={{ fontSize: "15px", lineHeight: "21px" }}
            >
              {data.projectName}
            </p>
          </>
        )}

        {/* LINE ITEMS */}
        <Separator />
        <div className="flex justify-between mb-3">
          <span
            className="text-[rgb(134,134,138)]"
            style={{ fontSize: "12px", lineHeight: "16px" }}
          >
            Description
          </span>
          <span
            className="text-[rgb(134,134,138)]"
            style={{ fontSize: "12px", lineHeight: "16px" }}
          >
            Amount
          </span>
        </div>

        {data.lineItems.map((item) => {
          const amount = item.quantity * item.rate;
          const showQty = item.quantity > 1;
          return (
            <div key={item.id}>
              <LightSeparator />
              <div className="flex justify-between items-start py-3">
                <div>
                  <p
                    className="font-semibold text-[rgb(29,29,31)]"
                    style={{ fontSize: "14px", lineHeight: "20px" }}
                  >
                    {item.description || "Untitled Item"}
                  </p>
                  {item.details && (
                    <div
                      className="text-[rgb(134,134,138)]"
                      style={{ fontSize: "12px", lineHeight: "16px" }}
                    >
                      {item.details.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  )}
                  {showQty && (
                    <p
                      className="text-[rgb(134,134,138)]"
                      style={{ fontSize: "12px", lineHeight: "16px" }}
                    >
                      {item.quantity} &times; {formatCurrency(item.rate)}
                    </p>
                  )}
                </div>
                <span
                  className="text-[rgb(134,134,138)]"
                  style={{ fontSize: "14px", lineHeight: "20px" }}
                >
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>
          );
        })}

        {/* SUBTOTAL / TAX / DISCOUNT / TOTAL */}
        <div style={{ marginTop: "8px", paddingTop: "16px" }}>
          <div style={{ height: "1px", background: "#e5e5e5", marginBottom: "16px" }} />

          {(data.taxEnabled || data.discountEnabled) && (
            <div className="space-y-1 mb-3">
              <div className="flex justify-between">
                <span
                  className="text-[rgb(134,134,138)]"
                  style={{ fontSize: "12px", lineHeight: "16px" }}
                >
                  Subtotal
                </span>
                <span
                  className="text-[rgb(134,134,138)]"
                  style={{ fontSize: "14px", lineHeight: "20px" }}
                >
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {data.taxEnabled && data.taxRate > 0 && (
                <div className="flex justify-between">
                  <span
                    className="text-[rgb(134,134,138)]"
                    style={{ fontSize: "12px", lineHeight: "16px" }}
                  >
                    Tax ({data.taxRate}%)
                  </span>
                  <span
                    className="text-[rgb(134,134,138)]"
                    style={{ fontSize: "14px", lineHeight: "20px" }}
                  >
                    {formatCurrency(taxAmount)}
                  </span>
                </div>
              )}
              {data.discountEnabled && data.discountValue > 0 && (
                <div className="flex justify-between">
                  <span
                    className="text-[rgb(134,134,138)]"
                    style={{ fontSize: "12px", lineHeight: "16px" }}
                  >
                    Discount
                    {data.discountType === "percentage"
                      ? ` (${data.discountValue}%)`
                      : ""}
                  </span>
                  <span
                    className="text-[rgb(134,134,138)]"
                    style={{ fontSize: "14px", lineHeight: "20px" }}
                  >
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>
              )}
              <div style={{ height: "1px", background: "#f0f0f0", margin: "8px 0" }} />
            </div>
          )}

          <div className="flex justify-between items-center">
            <span
              className="font-bold text-[rgb(29,29,31)]"
              style={{ fontSize: "16px", lineHeight: "24px" }}
            >
              Total Due
            </span>
            <span
              className="font-bold text-[rgb(29,29,31)]"
              style={{ fontSize: "16px", lineHeight: "24px" }}
            >
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* NOTES */}
        {data.notes && (
          <div className="mt-auto pt-8">
            <Separator />
            <p
              className="font-semibold uppercase text-[rgb(134,134,138)] mb-2"
              style={{ fontSize: "10px", lineHeight: "14px", letterSpacing: "0.08em" }}
            >
              Notes
            </p>
            <div
              className="text-[rgb(134,134,138)]"
              style={{ fontSize: "13px", lineHeight: "18px" }}
            >
              {data.notes.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";

export default InvoicePreview;
