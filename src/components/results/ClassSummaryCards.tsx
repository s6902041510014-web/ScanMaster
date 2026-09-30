import React from "react";
import { ClassSummary, Exam } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Users, Award, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ClassSummaryCardsProps {
  summary: ClassSummary;
  exam: Exam;
}

export default function ClassSummaryCards({ summary, exam }: ClassSummaryCardsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Graded */}
      <Card className="border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.results.totalStudents}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {summary.totalScanned}
              </span>
              <span className="text-xs text-slate-500">คน</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Class Average */}
      <Card className="border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.results.classAverage}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-blue-800">
                {summary.averageScore}
              </span>
              <span className="text-xs text-slate-500">
                / {exam.totalQuestions} ({summary.totalScanned > 0 ? ((summary.averageScore / exam.totalQuestions) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Highest / Lowest */}
      <Card className="border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              สูงสุด / ต่ำสุด
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-emerald-700">
                {summary.maxScore}
              </span>
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xl font-bold text-rose-600">
                {summary.minScore}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Pass Rate */}
      <Card className="border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.results.passRate}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-amber-800">
                {summary.passRate}%
              </span>
              <span className="text-xs text-slate-500">
                ({summary.passCount}/{summary.totalScanned} คน)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
