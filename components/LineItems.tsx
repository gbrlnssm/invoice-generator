"use client";

import { InvoiceData, LineItem } from "@/lib/types";
import { formatCurrency } from "@/lib/defaults";

interface LineItemsProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export default function LineItems({ data, onChange }: LineItemsProps) {
  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    const updated = data.lineItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, lineItems: updated });
  };

  const addItem = () => {
    onChange({
      ...data,
      lineItems: [
        ...data.lineItems,
        { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
      ],
    });
  };

  const removeItem = (id: string) => {
    if (data.lineItems.length <= 1) return;
    onChange({ ...data, lineItems: data.lineItems.filter((item) => item.id !== id) });
  };

  return (
    <div>
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)] mb-3">
        Line Items
      </h2>

      {/* Header */}
      <div className="grid grid-cols-[1fr_70px_90px_90px_32px] gap-2 mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)]">
          Description
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)]">
          Qty
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)]">
          Rate
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(134,134,138)] text-right">
          Amount
        </span>
        <span />
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {data.lineItems.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_70px_90px_90px_32px] gap-2 items-center">
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
              placeholder="Service or product"
              className="border border-gray-200 rounded-md px-3 py-2 text-[15px] text-[rgb(29,29,31)] placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
              className="border border-gray-200 rounded-md px-2 py-2 text-[15px] text-[rgb(29,29,31)] focus:outline-none focus:border-gray-400 transition-colors text-center"
            />
            <input
              type="number"
              min={0}
              step={0.01}
              value={item.rate || ""}
              onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="border border-gray-200 rounded-md px-2 py-2 text-[15px] text-[rgb(29,29,31)] placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />
            <span className="text-[15px] text-[rgb(29,29,31)] text-right pr-1">
              {formatCurrency(item.quantity * item.rate)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              disabled={data.lineItems.length <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-[rgb(29,29,31)] hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
              aria-label="Remove item"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="7" x2="11" y2="7" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-3 text-[13px] font-medium text-[rgb(134,134,138)] hover:text-[rgb(29,29,31)] transition-colors"
      >
        + Add Line Item
      </button>
    </div>
  );
}
