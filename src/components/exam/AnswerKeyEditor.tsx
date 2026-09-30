"use client";

import React from "react";
import { ChoiceStyle } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getChoiceLabels } from "@/lib/utils";
import { Check, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnswerKeyEditorProps {
  totalQuestions: number;
  choicesPerQuestion: number;
  choiceStyle: ChoiceStyle;
  answerKey: string[];
  onChange: (newKey: string[]) => void;
}

export default function AnswerKeyEditor({
  totalQuestions,
  choicesPerQuestion,
  choiceStyle,
  answerKey,
  onChange,
}: AnswerKeyEditorProps) {
  const { t } = useLanguage();
  const choiceOptions = getChoiceLabels(choiceStyle, choicesPerQuestion);

  const handleSelect = (qIdx: number, choice: string) => {
    const updated = [...answerKey];
    updated[qIdx] = choice;
    onChange(updated);
  };

  const handleQuickFill = (choice: string) => {
    const filled = Array.from({ length: totalQuestions }, () => choice);
    onChange(filled);
  };

  const handlePatternFill = () => {
    const patterned = Array.from(
      { length: totalQuestions },
      (_, i) => choiceOptions[i % choiceOptions.length]
    );
    onChange(patterned);
  };

  const handleReset = () => {
    const empty = Array.from({ length: totalQuestions }, () => "");
    onChange(empty);
  };

  const filledCount = answerKey.filter((k) => k !== "").length;

  return (
    <div className="space-y-4">
      {/* Quick Fill Toolbar (Visual Hierarchy & Proximity) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
          <Zap className="h-4 w-4 text-amber-500" />
          <span>
            กำหนดแล้ว <strong className="text-blue-700">{filledCount}</strong> / {totalQuestions} ข้อ
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 mr-1 hidden sm:inline">
            {t.examForm.quickFill}:
          </span>
          {choiceOptions.map((choice) => (
            <Button
              key={choice}
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleQuickFill(choice)}
              className="h-7 px-2.5 text-xs font-bold border-slate-300 hover:bg-blue-50 hover:text-blue-800"
            >
              ทั้งหมด {choice}
            </Button>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handlePatternFill}
            className="h-7 px-2.5 text-xs font-semibold border-slate-300 hover:bg-blue-50"
          >
            สลับวน ({choiceOptions.join("-")})
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            {t.examForm.resetAll}
          </Button>
        </div>
      </div>

      {/* Answer Key Grid (1 to 4 responsive columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-[500px] overflow-y-auto p-2 border border-slate-200 rounded-xl bg-white shadow-inner">
        {Array.from({ length: totalQuestions }, (_, qIdx) => {
          const selected = answerKey[qIdx] || "";
          const isSet = selected !== "";

          return (
            <div
              key={qIdx}
              className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                isSet
                  ? "bg-blue-50/50 border-blue-200"
                  : "bg-slate-50/60 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-[50px]">
                <span className="text-xs font-mono font-bold text-slate-900">
                  {qIdx + 1}.
                </span>
                {isSet && <Check className="h-3 w-3 text-blue-700" />}
              </div>

              {/* Choices Options */}
              <div className="flex items-center gap-1">
                {choiceOptions.map((choice) => {
                  const isChecked = selected === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleSelect(qIdx, choice)}
                      className={`h-7 w-7 rounded-md text-xs font-bold transition-all ${
                        isChecked
                          ? "bg-blue-700 text-white shadow-sm ring-2 ring-blue-600 ring-offset-1 scale-105"
                          : "bg-white text-slate-700 border border-slate-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800"
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
  );
}
