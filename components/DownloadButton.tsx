"use client";

import { RefObject, useState } from "react";

interface DownloadButtonProps {
  previewRef: RefObject<HTMLDivElement | null>;
  filename: string;
}

export default function DownloadButton({ previewRef, filename }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const element = previewRef.current;
    if (!element) return;

    setLoading(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.borderRadius = "0";
      clone.style.border = "none";
      clone.style.boxShadow = "none";
      clone.style.minHeight = "auto";

      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      const opt = {
        margin: [0.3, 0.35, 0.3, 0.35] as [number, number, number, number],
        filename: filename || "Invoice.pdf",
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "portrait" as const,
        },
      };

      await html2pdf().set(opt).from(clone).save();

      document.body.removeChild(wrapper);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center justify-center px-6 py-2.5 bg-[rgb(29,29,31)] text-white text-[14px] font-medium rounded-md hover:bg-[rgb(50,50,52)] transition-colors disabled:opacity-60"
    >
      {loading ? "Generating..." : "Download PDF"}
    </button>
  );
}
