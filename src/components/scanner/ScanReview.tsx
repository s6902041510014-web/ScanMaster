"use client";

import React, { useState } from "react";
import { Exam, ScanResult } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getChoiceLabels, getScoreGrade } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Save,
  Scan,
  BarChart3,
  UserCheck,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ScanReviewProps {
  exam: Exam;
  initialResult: Omit<ScanResult, "id" | "scannedAt">;
  onSave: (finalResult: Omit<ScanResult, "id" | "scannedAt">) => void;
  onScanNext: () => void;
  onViewResults: () => void;
}

export default function ScanReview({
  exam,
  initialResult,
  onSave,
  onScanNext,
  onViewResults,
}: ScanReviewProps) {
  const { t } = useLanguage();
  const [studentId, setStudentId] = useState(initialResult.studentId);
  const [studentName, setStudentName] = useState(initialResult.studentName || "");
  const [answers, setAnswers] = useState<string[]>([...initialResult.correctedAnswers]);
  const [isSaved, setIsSaved] = useState(false);

  const choiceOptions = getChoiceLabels(exam.choiceStyle, exam.choicesPerQuestion);

  // Live Score Recalculation
  let currentScore = 0;
  for (let i = 0; i < exam.totalQuestions; i++) {
    if (answers[i] && answers[i] !== "AMBIGUOUS" && answers[i] !== "-" && answers[i] === exam.answerKey[i]) {
      currentScore += 1;
    }
  }

  const percentage = exam.totalQuestions > 0 ? (currentScore / exam.totalQuestions) * 100 : 0;
  const gradeInfo = getScoreGrade(percentage);
  const hasAmbiguous = initialResult.ambiguousQuestions.length > 0;

  const handleChoiceChange = (qIndex: number, newChoice: string) => {
    const updated = [...answers];
    updated[qIndex] = newChoice;
    setAnswers(updated);
  };

  const handleConfirmSave = () => {
    const hasModifications = answers.some((ans, idx) => ans !== initialResult.answers[idx]);
    onSave({
      examId: exam.id,
      studentId: studentId.trim() || "UNKNOWN",
      studentName: studentName.trim() || undefined,
      answers: initialResult.answers,
      correctedAnswers: answers,
      score: currentScore,
      percentage: Math.round(percentage * 10) / 10,
      totalQuestions: exam.totalQuestions,
      ambiguousQuestions: initialResult.ambiguousQuestions,
      status: "CONFIRMED",
      correctedManually: hasModifications,
    });
    setIsSaved(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner: Student Identification & Metrics (Visual Hierarchy & Proximity) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Student ID Card */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t.review.studentIdLabel}
                </h3>
                <p className="text-xs text-slate-500">
                  ถอดรหัสจากตาราง OMR (แก้ไขได้หากตรวจพบความคลาดเคลื่อน)
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              8 Digits
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                รหัสนักเรียน
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                maxLength={10}
                className="w-full h-10 px-3 font-mono font-bold text-base text-blue-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ชื่อ-นามสกุล (ระบุหรือไม่ก็ได้)
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="เช่น นาย สมศักดิ์ มีสุข"
                className="w-full h-10 px-3 text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Live Score Summary Card (Contrast & High Impact) */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-xl p-5 shadow-elevated flex flex-col justify-between border border-blue-700">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                {t.review.scoreSummary}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeInfo.bg} ${gradeInfo.color}`}>
                Grade {gradeInfo.grade}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-white">
                {currentScore}
              </span>
              <span className="text-sm text-blue-300 font-medium">
                / {exam.totalQuestions} {t.dashboard.card.questions}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-700/60 flex items-center justify-between text-xs">
            <span className="text-blue-200">{t.review.percentage}:</span>
            <span className="text-base font-bold text-emerald-300">
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Ambiguous Alert Notice if any */}
      {hasAmbiguous && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-medium shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <span>{t.review.ambiguousNotice}</span>
        </div>
      )}

      {/* Legend Bar (Proximity & Alignment) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <span className="font-bold text-slate-800 flex items-center gap-1.5">
          <Edit3 className="h-4 w-4 text-blue-700" />
          คลิกที่ตัวเลือกเพื่อแก้ไขคำตอบ
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{t.review.legendCorrect}</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-700 font-semibold">
            <XCircle className="h-4 w-4 text-rose-600" />
            <span>{t.review.legendIncorrect}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>{t.review.legendAmbiguous}</span>
          </div>
        </div>
      </div>

      {/* Answer Verification Grid (Grid System: Responsive 1 to 4 cols) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          ตารางตรวจสอบคำตอบรายข้อ (ทั้งหมด {exam.totalQuestions} ข้อ)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: exam.totalQuestions }, (_, i) => {
            const studentAns = answers[i];
            const correctKey = exam.answerKey[i];
            const isCorrect = studentAns === correctKey;
            const isAmbiguous = studentAns === "AMBIGUOUS";

            return (
              <div
                key={i}
                className={`p-3 rounded-lg border transition-all ${
                  isCorrect
                    ? "bg-emerald-50/40 border-emerald-200"
                    : isAmbiguous
                    ? "bg-amber-50/60 border-amber-300"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      ข้อ {i + 1}.
                    </span>
                    {isCorrect ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : isAmbiguous ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-rose-600" />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    เฉลย: <strong className="text-blue-700 font-bold">{correctKey}</strong>
                  </span>
                </div>

                {/* Choice selection radio buttons */}
                <div className="grid grid-cols-4 gap-1">
                  {choiceOptions.map((choice) => {
                    const isSelected = studentAns === choice;
                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => handleChoiceChange(i, choice)}
                        className={`h-7 rounded text-xs font-bold transition-colors ${
                          isSelected
                            ? isCorrect
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-rose-600 text-white shadow-sm"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-800"
                        }`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer Bar (Repetition & Contrast) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm sticky bottom-4 z-20">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {isSaved ? (
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle2 className="h-4 w-4" /> บันทึกคะแนนเรียบร้อยแล้ว
            </span>
          ) : (
            <span>กรุณาตรวจสอบความถูกต้องและกดบันทึกผลคะแนน</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={handleConfirmSave}
            className="flex-1 sm:flex-none gap-2 bg-blue-700 hover:bg-blue-800 font-bold shadow-blueGlow"
          >
            <Save className="h-5 w-5" />
            {t.review.saveConfirm}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onScanNext}
            className="flex-1 sm:flex-none gap-2 border-slate-300"
          >
            <Scan className="h-5 w-5 text-blue-700" />
            {t.review.scanNext}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onViewResults}
            className="flex-1 sm:flex-none gap-2"
          >
            <BarChart3 className="h-5 w-5" />
            {t.review.viewResults}
          </Button>
        </div>
      </div>
    </div>
  );
}
