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

const Separator = () => <div className="border-t border-gray-200 my-6" />;

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

    const hasFrom = data.fromName || data.fromCompany || data.fromAddress || data.fromEmail;
    const hasTo = data.toName || data.toCompany || data.toAddress || data.toEmail;
    const hasDateInfo = data.issueDate || data.dueDate || (data.paymentTerms && data.paymentTerms !== "None");

    return (
      <div
        ref={ref}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 sm:p-10 max-w-[700px] w-full"
        style={{ fontFamily: "-apple-system, system-ui, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif" }}
      >
        {/* Header: Invoice title + dates */}
        <div className="flex justify-between items-start">
          <h1
            className="font-bold text-[rgb(29,29,31)]"
            style={{ fontSize: "24px", lineHeight: "32px" }}
          >
            Invoice
          </h1>
          {hasDateInfo && (
            <div className="text-right space-y-0.5">
              {data.issueDate && (
                <p
                  className="text-[rgb(134,134,138)]"
                  style={{ fontSize: "13px", lineHeight: "17px" }}
                >
                  Issued {formatDate(data.issueDate)}
                </p>
              )}
              {data.dueDate && (
                <p
                  className="text-[rgb(134,134,138)]"
                  style={{ fontSize: "13px", lineHeight: "17px" }}
                >
                  Due {formatDate(data.dueDate)}
                </p>
              )}
              {data.paymentTerms && data.paymentTerms !== "None" && (
                <p
                  className="text-[rgb(134,134,138)]"
                  style={{ fontSize: "13px", lineHeight: "17px" }}
                >
                  {data.paymentTerms}
                </p>
              )}
            </div>
          )}
        </div>

        {/* FROM (no section header, just the data) */}
        {hasFrom && (
          <div className="mt-4" style={{ fontSize: "15px", lineHeight: "21px" }}>
            {data.fromName && (
              <p className="font-bold text-[rgb(29,29,31)]">{data.fromName}</p>
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
          </div>
        )}

        {/* BILL TO */}
        {hasTo && (
          <>
            <Separator />
            <p
              className="font-semibold uppercase tracking-wider text-[rgb(134,134,138)] mb-2"
              style={{ fontSize: "11px", lineHeight: "17px", letterSpacing: "0.05em" }}
            >
              Bill To
            </p>
            <div style={{ fontSize: "15px", lineHeight: "21px" }}>
              {data.toName && (
                <p className="font-bold text-[rgb(29,29,31)]">{data.toName}</p>
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
            </div>
          </>
        )}

        {/* PROJECT */}
        {data.projectName && (
          <>
            <Separator />
            <p
              className="font-semibold uppercase tracking-wider text-[rgb(134,134,138)] mb-2"
              style={{ fontSize: "11px", lineHeight: "17px", letterSpacing: "0.05em" }}
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
            style={{ fontSize: "13px", lineHeight: "17px" }}
          >
            Description
          </span>
          <span
            className="text-[rgb(134,134,138)]"
            style={{ fontSize: "13px", lineHeight: "17px" }}
          >
            Amount
          </span>
        </div>

        {data.lineItems.map((item) => {
          const amount = item.quantity * item.rate;
          const showQty = item.quantity > 1;
          return (
            <div key={item.id}>
              <div className="border-t border-gray-100" />
              <div className="flex justify-between items-start py-3">
                <div>
                  <p
                    className="font-semibold text-[rgb(29,29,31)]"
                    style={{ fontSize: "15px", lineHeight: "21px" }}
                  >
                    {item.description || "Untitled Item"}
                  </p>
                  {showQty && (
                    <p
                      className="text-[rgb(134,134,138)]"
                      style={{ fontSize: "13px", lineHeight: "17px" }}
                    >
                      {item.quantity} x {formatCurrency(item.rate)}
                    </p>
                  )}
                </div>
                <span
                  className="text-[rgb(134,134,138)]"
                  style={{ fontSize: "15px", lineHeight: "21px" }}
                >
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>
          );
        })}

        {/* SUBTOTAL / TAX / DISCOUNT / TOTAL */}
        <div className="border-t border-gray-200 mt-2 pt-4">
          {(data.taxEnabled || data.discountEnabled) && (
            <div className="space-y-1 mb-3">
              <div className="flex justify-between">
                <span
                  className="text-[rgb(134,134,138)]"
                  style={{ fontSize: "13px", lineHeight: "17px" }}
                >
                  Subtotal
                </span>
                <span
                  className="text-[rgb(134,134,138)]"
                  style={{ fontSize: "15px", lineHeight: "21px" }}
                >
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {data.taxEnabled && data.taxRate > 0 && (
                <div className="flex justify-between">
                  <span
                    className="text-[rgb(134,134,138)]"
                    style={{ fontSize: "13px", lineHeight: "17px" }}
                  >
                    Tax ({data.taxRate}%)
                  </span>
                  <span
                    className="text-[rgb(134,134,138)]"
                    style={{ fontSize: "15px", lineHeight: "21px" }}
                  >
                    {formatCurrency(taxAmount)}
                  </span>
                </div>
              )}
              {data.discountEnabled && data.discountValue > 0 && (
                <div className="flex justify-between">
                  <span
                    className="text-[rgb(134,134,138)]"
                    style={{ fontSize: "13px", lineHeight: "17px" }}
                  >
                    Discount
                    {data.discountType === "percentage"
                      ? ` (${data.discountValue}%)`
                      : ""}
                  </span>
                  <span
                    className="text-[rgb(134,134,138)]"
                    style={{ fontSize: "15px", lineHeight: "21px" }}
                  >
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-100 my-2" />
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
          <>
            <Separator />
            <p
              className="font-semibold uppercase tracking-wider text-[rgb(134,134,138)] mb-2"
              style={{ fontSize: "11px", lineHeight: "17px", letterSpacing: "0.05em" }}
            >
              Notes
            </p>
            <div
              className="text-[rgb(134,134,138)]"
              style={{ fontSize: "13px", lineHeight: "17px" }}
            >
              {data.notes.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";

export default InvoicePreview;
