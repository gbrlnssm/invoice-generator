"use client";

import { useRef, useState } from "react";
import { InvoiceData } from "@/lib/types";
import { createDefaultInvoice } from "@/lib/defaults";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import DownloadButton from "@/components/DownloadButton";

export default function Home() {
  const [data, setData] = useState<InvoiceData>(createDefaultInvoice);
  const previewRef = useRef<HTMLDivElement>(null);

  const pdfFilename = data.invoiceNumber
    ? `Invoice-${data.invoiceNumber}.pdf`
    : "Invoice.pdf";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-[20px] font-bold text-[rgb(29,29,31)]">
            Invoice Generator
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: Form */}
          <div className="w-full lg:w-1/2 lg:max-w-xl">
            <InvoiceForm data={data} onChange={setData} />
          </div>

          {/* RIGHT: Preview + Download */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-8 lg:self-start">
            <InvoicePreview ref={previewRef} data={data} />
            <div className="mt-6 flex justify-center">
              <DownloadButton previewRef={previewRef} filename={pdfFilename} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
