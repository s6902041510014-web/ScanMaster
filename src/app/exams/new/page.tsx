"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChoiceStyle } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useExamStore } from "@/lib/store/examStore";
import { computeLayoutId } from "@/lib/utils";
import PageShell from "@/components/layout/PageShell";
import AnswerKeyEditor from "@/components/exam/AnswerKeyEditor";
import {
  Layers,
  Save,
  Sliders,
  BookOpen,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CreateExamPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { createExam } = useExamStore();

  const [subject, setSubject] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [title, setTitle] = useState("");
  const [totalQuestions, setTotalQuestions] = useState<number>(20);
  const [choicesPerQuestion, setChoicesPerQuestion] = useState<2 | 3 | 4 | 5>(4);
  const [choiceStyle, setChoiceStyle] = useState<ChoiceStyle>("กขคง");
  const [answerKey, setAnswerKey] = useState<string[]>(
    Array.from({ length: 20 }, (_, i) => ["ก", "ข", "ค", "ง"][i % 4])
  );

  const detectedLayout = computeLayoutId(totalQuestions);

  const handleQuestionCountChange = (newCount: number) => {
    const validCount = Math.max(5, Math.min(100, newCount));
    setTotalQuestions(validCount);

    // Adjust answerKey length
    const updatedKey = [...answerKey];
    const defaultChoice = choiceStyle === "กขคง" ? "ก" : choiceStyle === "1234" ? "1" : "A";

    while (updatedKey.length < validCount) {
      updatedKey.push(defaultChoice);
    }
    setAnswerKey(updatedKey.slice(0, validCount));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !subjectCode.trim()) {
      alert("กรุณากรอกชื่อวิชาและรหัสวิชา");
      return;
    }

    const newExam = createExam({
      subject: subject.trim(),
      subjectCode: subjectCode.trim().toUpperCase(),
      title: title.trim() || "แบบทดสอบมาตรฐาน",
      totalQuestions,
      choicesPerQuestion,
      choiceStyle,
      answerKey,
    });

    router.push(`/exams/${newExam.id}`);
  };

  return (
    <PageShell
      title={t.examForm.createTitle}
      subtitle={t.examForm.createSubtitle}
      breadcrumbs={[
        { label: t.nav.dashboard, href: "/dashboard" },
        { label: t.examForm.createTitle },
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        {/* Section 1: Subject Details (Visual Hierarchy & Proximity) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-700" />
              <CardTitle className="text-base font-bold text-slate-900">
                {t.examForm.basicInfo}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="subjectCode" className="text-xs text-slate-700">
                  {t.examForm.subjectCode} *
                </Label>
                <Input
                  id="subjectCode"
                  required
                  placeholder={t.examForm.subjectCodePlaceholder}
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="mt-1 font-mono uppercase font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="subject" className="text-xs text-slate-700">
                  {t.examForm.subjectName} *
                </Label>
                <Input
                  id="subject"
                  required
                  placeholder={t.examForm.subjectNamePlaceholder}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="text-xs text-slate-700">
                {t.examForm.examTitle}
              </Label>
              <Input
                id="title"
                placeholder={t.examForm.examTitlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Answer Sheet Layout Configuration (Grid & Contrast) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-blue-700" />
                <CardTitle className="text-base font-bold text-slate-900">
                  {t.examForm.configHeader}
                </CardTitle>
              </div>
              <Badge variant="outline" className="gap-1 bg-blue-50 border-blue-300 text-blue-800 font-bold">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Auto-Selected: Layout {detectedLayout}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Count Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-slate-700">
                  {t.examForm.totalQuestions}
                </Label>
                <span className="text-lg font-extrabold text-blue-800 bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-200">
                  {totalQuestions} {t.examForm.questionsUnit}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={totalQuestions}
                onChange={(e) => handleQuestionCountChange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>5 ข้อ</span>
                <span>30 (SM)</span>
                <span>60 (MD)</span>
                <span>100 ข้อ (LG)</span>
              </div>
            </div>

            {/* Layout Indicator Box */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3">
              <Layers className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-blue-900">
                  {t.examForm.layoutDetected}: <strong>Layout {detectedLayout}</strong>
                </p>
                <p className="text-blue-700">
                  {detectedLayout === "SM"
                    ? t.examForm.layoutDesc.SM
                    : detectedLayout === "MD"
                    ? t.examForm.layoutDesc.MD
                    : t.examForm.layoutDesc.LG}
                </p>
              </div>
            </div>

            {/* Choice Style & Choices count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-700 block mb-2">
                  {t.examForm.choicesPerQuestion}
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setChoicesPerQuestion(num as any)}
                      className={`h-10 rounded-lg text-xs font-bold border transition-all ${
                        choicesPerQuestion === num
                          ? "bg-blue-700 text-white border-blue-800 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {num} ตัวเลือก
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-slate-700 block mb-2">
                  {t.examForm.choiceStyle}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["กขคง", "ABCD", "1234"] as ChoiceStyle[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setChoiceStyle(st)}
                      className={`h-10 rounded-lg text-xs font-bold border transition-all ${
                        choiceStyle === st
                          ? "bg-blue-700 text-white border-blue-800 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Answer Key Editor (Interactive) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-700" />
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  {t.examForm.answerKeyHeader}
                </CardTitle>
                <p className="text-xs text-slate-500">
                  {t.examForm.answerKeySubtitle}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnswerKeyEditor
              totalQuestions={totalQuestions}
              choicesPerQuestion={choicesPerQuestion}
              choiceStyle={choiceStyle}
              answerKey={answerKey}
              onChange={(newKey) => setAnswerKey(newKey)}
            />
          </CardContent>
        </Card>

        {/* Submit Bar (Repetition & Contrast) */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => router.back()}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="gap-2 bg-blue-700 hover:bg-blue-800 font-bold shadow-blueGlow px-8"
          >
            <Save className="h-5 w-5" />
            <span>{t.examForm.submitCreate}</span>
          </Button>
        </div>
      </form>
    </PageShell>
  );
}
