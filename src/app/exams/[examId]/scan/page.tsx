"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useExamStore } from "@/lib/store/examStore";
import { useResultStore } from "@/lib/store/resultStore";
import { useOMR } from "@/hooks/useOMR";
import PageShell from "@/components/layout/PageShell";
import CameraCapture from "@/components/scanner/CameraCapture";
import FileUpload from "@/components/scanner/FileUpload";
import ScanProgress from "@/components/scanner/ScanProgress";
import ScanError from "@/components/scanner/ScanError";
import ScanReview from "@/components/scanner/ScanReview";
import { ScanResult } from "@/types";
import { Camera, Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExamScanPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const examId = params.examId as string;

  const { getExamById } = useExamStore();
  const { addResult } = useResultStore();
  const exam = getExamById(examId);

  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [currentScannedResult, setCurrentScannedResult] = useState<Omit<ScanResult, "id" | "scannedAt"> | null>(null);

  const { state: omrState, processImageSource, simulateScan, resetOMR } = useOMR(
    exam || {
      id: "dummy",
      title: "",
      subject: "",
      subjectCode: "",
      totalQuestions: 20,
      choicesPerQuestion: 4,
      choiceStyle: "ABCD",
      layoutId: "SM",
      answerKey: [],
      createdAt: "",
      updatedAt: "",
    }
  );

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

  const handleCapture = async (img: HTMLImageElement) => {
    const res = await processImageSource(img);
    if (res) {
      setCurrentScannedResult(res);
    }
  };

  const handleSimulate = async () => {
    const res = await simulateScan();
    if (res) {
      setCurrentScannedResult(res);
    }
  };

  const handleSaveResult = (finalResult: Omit<ScanResult, "id" | "scannedAt">) => {
    addResult(finalResult);
  };

  const handleScanNext = () => {
    setCurrentScannedResult(null);
    resetOMR();
  };

  return (
    <PageShell
      title={t.scanner.title}
      subtitle={`${exam.subjectCode} - ${exam.subject} (${exam.totalQuestions} ข้อ • Layout ${exam.layoutId})`}
      breadcrumbs={[
        { label: t.nav.dashboard, href: "/dashboard" },
        { label: exam.subjectCode || "Exam", href: `/exams/${exam.id}` },
        { label: t.scanner.title },
      ]}
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push(`/exams/${exam.id}`)}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>กลับหน้ารายละเอียด</span>
        </Button>
      }
    >
      <div className="w-full">
        {/* If in Review Mode (after successful OMR) */}
        {currentScannedResult ? (
          <ScanReview
            exam={exam}
            initialResult={currentScannedResult}
            onSave={handleSaveResult}
            onScanNext={handleScanNext}
            onViewResults={() => router.push(`/exams/${exam.id}/results`)}
          />
        ) : omrState.isProcessing ? (
          /* OMR Processing State */
          <ScanProgress step={omrState.step} progress={omrState.progress} />
        ) : omrState.error ? (
          /* OMR Error State (ADR-006 Hard stop & retry) */
          <ScanError
            message={omrState.error.message}
            tips={omrState.error.tips}
            onRetry={resetOMR}
          />
        ) : (
          /* Scanner View (Tabs: Camera vs Upload) */
          <div className="space-y-6">
            {/* Tab Selection Switcher (Proximity & Alignment) */}
            <div className="flex items-center justify-center">
              <div className="inline-flex p-1 bg-slate-200/80 rounded-xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => setActiveTab("camera")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "camera"
                      ? "bg-blue-700 text-white shadow-sm"
                      : "text-slate-700 hover:text-blue-900"
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span>{t.scanner.tabCamera}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "upload"
                      ? "bg-blue-700 text-white shadow-sm"
                      : "text-slate-700 hover:text-blue-900"
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span>{t.scanner.tabUpload}</span>
                </button>
              </div>
            </div>

            {/* Active Scanner View */}
            {activeTab === "camera" ? (
              <CameraCapture
                onCapture={handleCapture}
                onSimulate={handleSimulate}
              />
            ) : (
              <FileUpload
                onImageSelected={handleCapture}
                onSimulate={handleSimulate}
              />
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
