"use client";

import React, { useState } from "react";
import { Exam, ScanResult, ClassSummary } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { downloadResultsCsv } from "@/lib/csv/exporter";
import { downloadClassResultsPdf } from "@/lib/pdf/resultExporter";
import { FileSpreadsheet, FileText, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportButtonsProps {
  exam: Exam;
  results: ScanResult[];
  summary: ClassSummary;
}

export default function ExportButtons({ exam, results, summary }: ExportButtonsProps) {
  const { t } = useLanguage();
  const [csvDownloaded, setCsvDownloaded] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const handleExportCsv = () => {
    downloadResultsCsv(exam, results);
    setCsvDownloaded(true);
    setTimeout(() => setCsvDownloaded(false), 2500);
  };

  const handleExportPdf = () => {
    downloadClassResultsPdf(exam, results, summary);
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 2500);
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* 1. Export CSV (Full columns) */}
      <Button
        variant="secondary"
        size="md"
        onClick={handleExportCsv}
        disabled={results.length === 0}
        className="gap-2 border-emerald-300 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 font-semibold shadow-sm"
      >
        {csvDownloaded ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
        )}
        <span>{csvDownloaded ? "ดาวน์โหลด CSV แล้ว" : t.results.exportCsv}</span>
      </Button>

      {/* 2. Export PDF Report */}
      <Button
        variant="primary"
        size="md"
        onClick={handleExportPdf}
        disabled={results.length === 0}
        className="gap-2 bg-blue-700 hover:bg-blue-800 font-semibold shadow-sm"
      >
        {pdfDownloaded ? (
          <Check className="h-4 w-4" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        <span>{pdfDownloaded ? "ดาวน์โหลด PDF แล้ว" : t.results.exportPdf}</span>
      </Button>
    </div>
  );
}
