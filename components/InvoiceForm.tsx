"use client";

import { InvoiceData } from "@/lib/types";
import { PAYMENT_TERMS_OPTIONS } from "@/lib/defaults";
import LineItems from "./LineItems";

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const inputClasses =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-[15px] text-[rgb(29,29,31)] placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors";

  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)] mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
}

export default function InvoiceForm({ data, onChange }: InvoiceFormProps) {
  const update = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-8">
      {/* FROM / BILL TO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* FROM */}
        <div className="space-y-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)]">
            From
          </h2>
          <Field label="Name" value={data.fromName} onChange={(v) => update("fromName", v)} placeholder="Your name" />
          <Field label="Company" value={data.fromCompany} onChange={(v) => update("fromCompany", v)} placeholder="Your Company LLC" />
          <Field label="Address" value={data.fromAddress} onChange={(v) => update("fromAddress", v)} placeholder={"123 Main St\nNew York, NY 10001"} multiline />
          <Field label="Email" value={data.fromEmail} onChange={(v) => update("fromEmail", v)} placeholder="you@company.com" type="email" />
        </div>

        {/* BILL TO */}
        <div className="space-y-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)]">
            Bill To
          </h2>
          <Field label="Contact Name" value={data.toName} onChange={(v) => update("toName", v)} placeholder="Jane Smith" />
          <Field label="Company" value={data.toCompany} onChange={(v) => update("toCompany", v)} placeholder="Acme Corp" />
          <Field label="Address" value={data.toAddress} onChange={(v) => update("toAddress", v)} placeholder={"456 Market St\nSan Francisco, CA 94105"} multiline />
          <Field label="Email" value={data.toEmail} onChange={(v) => update("toEmail", v)} placeholder="client@acme.com" type="email" />
        </div>
      </div>

      {/* INVOICE DETAILS / NOTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)]">
            Invoice Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Invoice #" value={data.invoiceNumber} onChange={(v) => update("invoiceNumber", v)} placeholder="INV-001" />
            <Field label="Issue Date" value={data.issueDate} onChange={(v) => update("issueDate", v)} type="date" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Due Date" value={data.dueDate} onChange={(v) => update("dueDate", v)} type="date" />
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)] mb-1.5">
                Payment Terms
              </label>
              <select
                value={data.paymentTerms}
                onChange={(e) => update("paymentTerms", e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-[15px] text-[rgb(29,29,31)] bg-white focus:outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer"
              >
                {PAYMENT_TERMS_OPTIONS.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)]">
            Notes
          </h2>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)] mb-1.5">
              Payment Instructions / Notes
            </label>
            <textarea
              value={data.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder={"Payment via wire transfer:\nBank...\nRouting...\nAccount..."}
              rows={5}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-[15px] text-[rgb(29,29,31)] placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* PROJECT NAME */}
      <Field label="Project Name" value={data.projectName} onChange={(v) => update("projectName", v)} placeholder="Website redesign" />

      {/* LINE ITEMS */}
      <LineItems data={data} onChange={onChange} />

      {/* TAX / DISCOUNT TOGGLES */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={data.taxEnabled}
            onChange={(e) => update("taxEnabled", e.target.checked)}
            className="rounded border-gray-300 accent-[rgb(29,29,31)]"
          />
          <span className="text-[13px] text-[rgb(134,134,138)]">Add Tax</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={data.discountEnabled}
            onChange={(e) => update("discountEnabled", e.target.checked)}
            className="rounded border-gray-300 accent-[rgb(29,29,31)]"
          />
          <span className="text-[13px] text-[rgb(134,134,138)]">Add Discount</span>
        </label>
      </div>

      {/* TAX FIELDS */}
      {data.taxEnabled && (
        <div className="flex items-center gap-3">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)]">
            Tax Rate (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={data.taxRate || ""}
            onChange={(e) => update("taxRate", parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-24 border border-gray-200 rounded-md px-3 py-2 text-[15px] text-[rgb(29,29,31)] focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
      )}

      {/* DISCOUNT FIELDS */}
      {data.discountEnabled && (
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)]">
            Discount
          </label>
          <select
            value={data.discountType}
            onChange={(e) => update("discountType", e.target.value as "percentage" | "flat")}
            className="border border-gray-200 rounded-md px-3 py-2 text-[15px] text-[rgb(29,29,31)] bg-white focus:outline-none focus:border-gray-400 transition-colors"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat Amount ($)</option>
          </select>
          <input
            type="number"
            min={0}
            step={data.discountType === "percentage" ? 0.1 : 0.01}
            value={data.discountValue || ""}
            onChange={(e) => update("discountValue", parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-24 border border-gray-200 rounded-md px-3 py-2 text-[15px] text-[rgb(29,29,31)] focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
      )}
    </div>
  );
}
