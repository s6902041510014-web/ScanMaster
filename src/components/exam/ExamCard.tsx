"use client";

import React from "react";
import Link from "next/link";
import { Exam } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useResultStore } from "@/lib/store/resultStore";
import {
  Printer,
  ScanLine,
  BarChart3,
  Calendar,
  Layers,
  HelpCircle,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface ExamCardProps {
  exam: Exam;
  onDelete?: (id: string) => void;
}

export default function ExamCard({ exam, onDelete }: ExamCardProps) {
  const { locale, t } = useLanguage();
  const { getResultsByExamId } = useResultStore();
  const results = getResultsByExamId(exam.id);
  const scannedCount = results.length;

  return (
    <Card className="hover:shadow-elevated transition-all border-slate-200 group flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500" />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="outline" className="font-mono text-xs font-bold text-blue-800 bg-blue-50 border-blue-200">
              {exam.subjectCode || "GENERAL"}
            </Badge>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{formatDate(exam.createdAt, locale)}</span>
            </div>
          </div>

          <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-800 transition-colors line-clamp-1 mt-1">
            {exam.subject}
          </CardTitle>
          <CardDescription className="line-clamp-1 text-xs text-slate-600 font-medium">
            {exam.title}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-4">
          {/* Metadata Grid (Proximity & Hierarchy) */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[11px] text-slate-500 block">{t.dashboard.card.questions}</span>
              <span className="text-sm font-extrabold text-blue-900">{exam.totalQuestions}</span>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[11px] text-slate-500 block">{t.dashboard.card.choices}</span>
              <span className="text-sm font-extrabold text-blue-900">{exam.choicesPerQuestion} ({exam.choiceStyle})</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">{t.dashboard.card.scannedCount}</span>
              <span className="text-sm font-extrabold text-emerald-700">{scannedCount} {t.dashboard.card.sheets}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-blue-600" />
              Layout: <strong>{exam.layoutId}</strong>
            </span>
            <span className="flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              เฉลยครบ <strong>{exam.answerKey.length}</strong> ข้อ
            </span>
          </div>
        </CardContent>
      </div>

      {/* Action Buttons Grid (3 Main Buttons with High Contrast) */}
      <CardFooter className="pt-2 border-t border-slate-100 flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-1.5 w-full">
          {/* 1. Print Sheet */}
          <Link href={`/exams/${exam.id}/sheet`} className="w-full">
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs font-semibold hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 border-slate-300 gap-1 px-1 h-9"
              title={t.dashboard.card.actions.printSheet}
            >
              <Printer className="h-3.5 w-3.5 text-blue-700 shrink-0" />
              <span className="truncate">พิมพ์กระดาษ</span>
            </Button>
          </Link>

          {/* 2. Scan Sheet (Primary Call to Action) */}
          <Link href={`/exams/${exam.id}/scan`} className="w-full">
            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white gap-1 px-1 h-9 shadow-sm"
              title={t.dashboard.card.actions.scanSheet}
            >
              <ScanLine className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">สแกนตรวจ</span>
            </Button>
          </Link>

          {/* 3. View Results */}
          <Link href={`/exams/${exam.id}/results`} className="w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold border-blue-700 text-blue-700 hover:bg-blue-50 gap-1 px-1 h-9"
              title={t.dashboard.card.actions.viewResults}
            >
              <BarChart3 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">ดูผลคะแนน</span>
            </Button>
          </Link>
        </div>

        {onDelete && (
          <div className="w-full flex justify-end pt-1">
            <button
              onClick={() => onDelete(exam.id)}
              className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              {t.dashboard.card.actions.deleteExam}
            </button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
