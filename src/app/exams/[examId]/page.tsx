"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useExamStore } from "@/lib/store/examStore";
import { useResultStore } from "@/lib/store/resultStore";
import PageShell from "@/components/layout/PageShell";
import {
  Printer,
  ScanLine,
  BarChart3,
  Calendar,
  Layers,
  HelpCircle,
  FileSpreadsheet,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale, t } = useLanguage();
  const examId = params.examId as string;

  const { getExamById } = useExamStore();
  const { getResultsByExamId, getClassSummary } = useResultStore();

  const exam = getExamById(examId);
  const results = getResultsByExamId(examId);

  if (!exam) {
    return (
      <PageShell title="ไม่พบชุดข้อสอบ">
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">ไม่พบชุดข้อสอบที่ระบุ</p>
          <Button onClick={() => router.push("/dashboard")}>
            กลับไปหน้ารวมข้อสอบ
          </Button>
        </div>
      </PageShell>
    );
  }

  const summary = getClassSummary(exam);

  return (
    <PageShell
      title={exam.subject}
      subtitle={`${exam.subjectCode} • ${exam.title}`}
      badge={
        <Badge variant="outline" className="font-mono text-xs font-bold text-blue-800 bg-blue-50 border-blue-200">
          Layout {exam.layoutId}
        </Badge>
      }
      breadcrumbs={[
        { label: t.nav.dashboard, href: "/dashboard" },
        { label: exam.subjectCode || "Exam" },
      ]}
    >
      <div className="space-y-8">
        {/* 3 Primary Action Hub Cards (Visual Hierarchy & Contrast) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1: Print Answer Sheet */}
          <Card className="hover:shadow-elevated transition-all border-slate-200 group flex flex-col justify-between overflow-hidden">
            <div>
              <div className="h-1.5 w-full bg-blue-600" />
              <CardHeader className="pb-3">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2 shadow-inner">
                  <Printer className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-800">
                  1. พิมพ์กระดาษคำตอบ
                </CardTitle>
                <p className="text-xs text-slate-500">
                  ดาวน์โหลด PDF ขนาด A4 พร้อม Corner Markers เพื่อพิมพ์แจกนักเรียน
                </p>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-1.5">
                <p>• รูปแบบ: Layout {exam.layoutId} ({exam.totalQuestions} ข้อ)</p>
                <p>• ตารางรหัสนักเรียน 8 หลัก (0-9)</p>
              </CardContent>
            </div>
            <div className="p-6 pt-0">
              <Link href={`/exams/${exam.id}/sheet`} className="w-full">
                <Button variant="secondary" className="w-full gap-2 font-semibold border-slate-300 group-hover:border-blue-600 group-hover:text-blue-800">
                  <span>ดูตัวอย่างและพิมพ์</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Action 2: Scan & Grade (Primary CTA) */}
          <Card className="hover:shadow-elevated transition-all border-blue-400 bg-gradient-to-b from-white to-blue-50/40 group flex flex-col justify-between overflow-hidden shadow-sm">
            <div>
              <div className="h-1.5 w-full bg-blue-700" />
              <CardHeader className="pb-3">
                <div className="h-12 w-12 rounded-xl bg-blue-700 text-white flex items-center justify-center mb-2 shadow-md">
                  <ScanLine className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-blue-950 group-hover:text-blue-700">
                  2. สแกนตรวจข้อสอบ
                </CardTitle>
                <p className="text-xs text-slate-600">
                  สแกนผ่านกล้องมือถือ/เว็บแคม หรืออัปโหลดไฟล์ภาพเพื่อตรวจคะแนนทันที
                </p>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-1.5">
                <p>• ตรวจจับผ่าน OpenCV.js Client-Side</p>
                <p>• มีหน้าจอตรวจสอบและแก้ไขคำตอบก่อนบันทึก</p>
              </CardContent>
            </div>
            <div className="p-6 pt-0">
              <Link href={`/exams/${exam.id}/scan`} className="w-full">
                <Button variant="primary" className="w-full gap-2 font-bold bg-blue-700 hover:bg-blue-800 shadow-blueGlow">
                  <span>เริ่มสแกนตรวจทันที</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Action 3: View Results */}
          <Card className="hover:shadow-elevated transition-all border-slate-200 group flex flex-col justify-between overflow-hidden">
            <div>
              <div className="h-1.5 w-full bg-emerald-600" />
              <CardHeader className="pb-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 shadow-inner">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-emerald-800">
                  3. ผลคะแนนและส่งออก
                </CardTitle>
                <p className="text-xs text-slate-500">
                  ดูสถิติชั้นเรียน กราฟคะแนน และส่งออกไฟล์ CSV / PDF ครบถ้วน
                </p>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-1.5">
                <p>• ตรวจแล้วทั้งหมด: <strong className="text-emerald-700 font-bold">{results.length} แผ่น</strong></p>
                <p>• คะแนนเฉลี่ย: <strong>{summary.averageScore} / {exam.totalQuestions}</strong></p>
              </CardContent>
            </div>
            <div className="p-6 pt-0">
              <Link href={`/exams/${exam.id}/results`} className="w-full">
                <Button variant="outline" className="w-full gap-2 font-semibold border-blue-700 text-blue-700 hover:bg-blue-50">
                  <span>ดูผลคะแนน ({results.length})</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Answer Key Reference Table (Proximity & Repetition) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-700" />
                <CardTitle className="text-base font-bold text-slate-900">
                  เฉลยคำตอบของชุดข้อสอบนี้ (Answer Key)
                </CardTitle>
              </div>
              <span className="text-xs text-slate-500">
                ทั้งหมด {exam.totalQuestions} ข้อ ({exam.choicesPerQuestion} ตัวเลือก รูปแบบ {exam.choiceStyle})
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
              {exam.answerKey.map((key, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                >
                  <span className="font-mono font-bold text-slate-600">{idx + 1}.</span>
                  <span className="h-6 w-6 rounded-md bg-blue-700 text-white font-bold flex items-center justify-center shadow-xs">
                    {key}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
