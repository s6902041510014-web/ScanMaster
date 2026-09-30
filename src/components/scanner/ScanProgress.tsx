import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";

interface ScanProgressProps {
  step: "idle" | "preprocessing" | "cornerDetection" | "perspective" | "sampling" | "grading" | "complete" | "error";
  progress: number;
}

export default function ScanProgress({ step, progress }: ScanProgressProps) {
  const { t } = useLanguage();

  const stepsList = [
    { id: "preprocessing", label: t.scanner.steps.preprocessing },
    { id: "cornerDetection", label: t.scanner.steps.cornerDetection },
    { id: "perspective", label: t.scanner.steps.perspective },
    { id: "sampling", label: t.scanner.steps.sampling },
    { id: "grading", label: t.scanner.steps.grading },
  ];

  const currentIdx = stepsList.findIndex((s) => s.id === step);

  return (
    <div className="bg-white rounded-2xl border border-blue-200 p-8 shadow-elevated max-w-lg mx-auto text-center">
      <div className="relative mb-6">
        <div className="h-16 w-16 mx-auto rounded-full bg-blue-50 border-2 border-blue-600 flex items-center justify-center text-blue-700 shadow-inner animate-pulse">
          <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {t.scanner.processing}
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        OpenCV.js Computer Vision Pipeline (Client-Side)
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden border border-slate-200">
        <div
          className="bg-blue-700 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Indicators (Proximity & Hierarchy) */}
      <div className="space-y-3 text-left">
        {stepsList.map((s, idx) => {
          const isDone = currentIdx > idx || step === "complete";
          const isCurrent = currentIdx === idx;

          return (
            <div
              key={s.id}
              className={`flex items-center gap-3 text-xs p-2.5 rounded-lg transition-colors ${
                isCurrent
                  ? "bg-blue-50 text-blue-900 font-bold border border-blue-200"
                  : isDone
                  ? "text-emerald-800 bg-emerald-50/50"
                  : "text-slate-400"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 text-blue-700 animate-spin shrink-0" />
              ) : (
                <CircleDashed className="h-4 w-4 text-slate-300 shrink-0" />
              )}
              <span className="flex-1">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
