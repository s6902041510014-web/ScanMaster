"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useExamStore } from "@/lib/store/examStore";
import { useResultStore } from "@/lib/store/resultStore";
import PageShell from "@/components/layout/PageShell";
import ExamCard from "@/components/exam/ExamCard";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  PlusCircle,
  Search,
  BookOpen,
  FileCheck,
  TrendingUp,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const { t } = useLanguage();
  const { exams, deleteExam, resetToDefault } = useExamStore();
  const { results } = useResultStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExams = exams.filter(
    (e) =>
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalScannedAll = results.length;
  const avgOverallScore =
    results.length > 0
      ? (results.reduce((acc, r) => acc + r.percentage, 0) / results.length).toFixed(1)
      : "0.0";

  return (
    <PageShell
      title={t.dashboard.title}
      subtitle={t.dashboard.subtitle}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/exams/new">
            <Button
              variant="primary"
              size="md"
              className="gap-2 bg-blue-700 hover:bg-blue-800 font-bold shadow-blueGlow"
            >
              <PlusCircle className="h-5 w-5 text-blue-200" />
              <span>{t.dashboard.createNew}</span>
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Global Summary Metrics (Visual Hierarchy & Proximity) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t.dashboard.totalExams}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  {exams.length} <span className="text-xs font-normal text-slate-500">ชุด</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t.dashboard.totalScanned}
                </p>
                <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">
                  {totalScannedAll} <span className="text-xs font-normal text-slate-500">แผ่น</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t.dashboard.avgClassScore}
                </p>
                <p className="text-2xl font-extrabold text-amber-800 mt-0.5">
                  {avgOverallScore}% <span className="text-xs font-normal text-slate-500">เฉลี่ยรวม</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Reset Bar (Alignment & Proximity) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder={t.dashboard.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-slate-500 font-medium">
              แสดง <strong>{filteredExams.length}</strong> จาก {exams.length} รายการ
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefault}
              className="text-xs text-slate-500 hover:text-blue-800 gap-1"
              title="โหลดชุดข้อมูลตัวอย่างเริ่มต้น"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>รีเซ็ตข้อมูลตัวอย่าง</span>
            </Button>
          </div>
        </div>

        {/* Exams Grid (12-Column Grid System: 1, 2, or 3 columns) */}
        {filteredExams.length === 0 ? (
          <EmptyState
            title={t.dashboard.noExamsTitle}
            description={t.dashboard.noExamsSubtitle}
            actionLabel={t.dashboard.noExamsAction}
            onAction={() => window.location.assign("/exams/new")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onDelete={(id) => {
                  if (confirm(`คุณต้องการลบชุดข้อสอบ "${exam.subject}" หรือไม่?`)) {
                    deleteExam(id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
