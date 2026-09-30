"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useExamStore } from "@/lib/store/examStore";
import { useResultStore } from "@/lib/store/resultStore";
import PageShell from "@/components/layout/PageShell";
import ClassSummaryCards from "@/components/results/ClassSummaryCards";
import ScoreHistogram from "@/components/results/ScoreHistogram";
import ItemAnalysisTable from "@/components/results/ItemAnalysisTable";
import ResultsTable from "@/components/results/ResultsTable";
import ExportButtons from "@/components/results/ExportButtons";
import { EmptyState } from "@/components/shared/EmptyState";
import { ScanLine, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExamResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const examId = params.examId as string;

  const { getExamById } = useExamStore();
  const { getResultsByExamId, getClassSummary, deleteResult } = useResultStore();

  const exam = getExamById(examId);
  const results = getResultsByExamId(examId);

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

  const summary = getClassSummary(exam);

  return (
    <PageShell
      title={t.results.title}
      subtitle={`${exam.subjectCode} - ${exam.subject} (${exam.title})`}
      breadcrumbs={[
        { label: t.nav.dashboard, href: "/dashboard" },
        { label: exam.subjectCode || "Exam", href: `/exams/${exam.id}` },
        { label: t.results.title },
      ]}
      actions={
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/exams/${exam.id}/scan`)}
            className="gap-1.5"
          >
            <ScanLine className="h-4 w-4 text-blue-700" />
            <span>สแกนตรวจเพิ่ม</span>
          </Button>

          <ExportButtons exam={exam} results={results} summary={summary} />
        </div>
      }
    >
      <div className="space-y-8">
        {results.length === 0 ? (
          <EmptyState
            title="ยังไม่มีผลการตรวจข้อสอบสำหรับชุดนี้"
            description="เริ่มต้นด้วยการพิมพ์กระดาษคำตอบแจกนักเรียน และนำมาสแกนตรวจผ่านกล้องหรือไฟล์ภาพ"
            actionLabel="เริ่มสแกนตรวจข้อสอบ"
            onAction={() => router.push(`/exams/${exam.id}/scan`)}
          />
        ) : (
          <>
            {/* 1. Metric Summary Cards */}
            <ClassSummaryCards summary={summary} exam={exam} />

            {/* 2. Charts & Item Analysis Grid (12-col Grid: 5-col / 7-col) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <ScoreHistogram summary={summary} />
              </div>
              <div className="lg:col-span-7">
                <ItemAnalysisTable summary={summary} />
              </div>
            </div>

            {/* 3. Student Results Table (Comprehensive list with search & filters) */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                ตารางคะแนนผลสอบรายบุคคล (ทั้งหมด {results.length} คน)
              </h3>
              <ResultsTable
                exam={exam}
                results={results}
                onDeleteResult={(id) => {
                  if (confirm("ต้องการลบผลการตรวจของนักเรียนคนนี้หรือไม่?")) {
                    deleteResult(id);
                  }
                }}
              />
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
