"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useExamStore } from "@/lib/store/examStore";
import PageShell from "@/components/layout/PageShell";
import {
  generateAnswerSheetPdf,
  downloadAnswerSheetPdf,
} from "@/lib/pdf/sheetGenerator";
import {
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SheetPrintPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const examId = params.examId as string;

  const { getExamById } = useExamStore();
  const exam = getExamById(examId);

  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    if (!exam) return;
    async function loadPdfPreview() {
      try {
        setIsGenerating(true);
        const doc = await generateAnswerSheetPdf(exam!);
        const dataUrl = doc.output("datauristring");
        setPdfDataUrl(dataUrl);
      } catch (err) {
        console.error("Failed to generate PDF preview", err);
      } finally {
        setIsGenerating(false);
      }
    }
    loadPdfPreview();
  }, [exam]);

  if (!exam) {
    return (
      <PageShell title="ไม่พบชุดข้อสอบ">
        <div className="text-center py-12">
          <Button onClick={() => router.push("/dashboard")}>
            กลับหน้ารวมข้อสอบ
          </Button>
        </div>
      </PageShell>
    );
  }

  const handleDownload = () => {
    downloadAnswerSheetPdf(exam);
  };

  const handlePrint = () => {
    if (pdfDataUrl) {
      const printWindow = window.open(pdfDataUrl);
      printWindow?.print();
    }
  };

  return (
    <PageShell
      title={t.sheet.title}
      subtitle={`${exam.subjectCode} - ${exam.subject} (${exam.totalQuestions} ข้อ • Layout ${exam.layoutId})`}
      breadcrumbs={[
        { label: t.nav.dashboard, href: "/dashboard" },
        { label: exam.subjectCode || "Exam", href: `/exams/${exam.id}` },
        { label: t.sheet.title },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrint}
            disabled={!pdfDataUrl}
            className="gap-2 border-slate-300 font-semibold"
          >
            <Printer className="h-4 w-4 text-blue-700" />
            <span>{t.sheet.printDirect}</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleDownload}
            disabled={!pdfDataUrl}
            className="gap-2 bg-blue-700 hover:bg-blue-800 font-bold shadow-blueGlow"
          >
            <Download className="h-4 w-4" />
            <span>{t.sheet.downloadPdf}</span>
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Instructions & Metadata (Visual Hierarchy & Proximity) */}
        <div className="space-y-6">
          {/* Print Guidelines Box */}
          <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
            <CardHeader className="pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2 text-blue-900">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <CardTitle className="text-sm font-bold">
                  {t.sheet.instructionsTitle}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-xs text-slate-700 space-y-3">
              {t.sheet.instructions.map((inst, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{inst}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Exam Specs Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">
                ข้อมูลกระดาษคำตอบ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">ขนาดกระดาษ:</span>
                <span className="font-bold text-slate-800">A4 Portrait (210 x 297 mm)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">รูปแบบตาราง:</span>
                <span className="font-bold text-blue-800">Layout {exam.layoutId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">จำนวนข้อ:</span>
                <span className="font-bold text-slate-800">{exam.totalQuestions} ข้อ</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">ตัวเลือก:</span>
                <span className="font-bold text-slate-800">{exam.choicesPerQuestion} ตัวเลือก ({exam.choiceStyle})</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">รหัสนักเรียน:</span>
                <span className="font-bold text-slate-800">8 หลัก (Matrix 0-9)</span>
              </div>
            </CardContent>
          </Card>

          {/* Next Step Shortcut */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
            <p className="text-xs text-slate-600 mb-3">
              หลังจากพิมพ์และนักเรียนทำข้อสอบเรียบร้อยแล้ว
            </p>
            <Button
              variant="outline"
              size="md"
              onClick={() => router.push(`/exams/${exam.id}/scan`)}
              className="w-full gap-2 border-blue-700 text-blue-700 font-semibold"
            >
              <ScanLine className="h-4 w-4" />
              <span>ไปที่หน้าสแกนตรวจข้อสอบ</span>
            </Button>
          </div>
        </div>

        {/* Right Column: PDF Live Preview Frame (High Contrast & Alignment) */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-200 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-700" />
                <span className="text-xs font-bold text-slate-800">
                  {t.sheet.previewTitle}
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                100% Scale Standard
              </Badge>
            </CardHeader>
            <CardContent className="p-4 flex items-center justify-center min-h-[600px] bg-slate-100">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
                  <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
                  <span className="text-xs font-semibold">กำลังสร้างตัวอย่างกระดาษคำตอบ PDF...</span>
                </div>
              ) : pdfDataUrl ? (
                <iframe
                  src={pdfDataUrl}
                  title="PDF Preview"
                  className="w-full h-[700px] rounded-lg border border-slate-300 shadow-md bg-white"
                />
              ) : (
                <p className="text-xs text-slate-400">ไม่สามารถแสดงตัวอย่างได้</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
