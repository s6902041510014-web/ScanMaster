import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LayoutId, ChoiceStyle } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function computeLayoutId(totalQuestions: number): LayoutId {
  if (totalQuestions <= 30) return "SM";
  if (totalQuestions <= 60) return "MD";
  return "LG";
}

export function getChoiceLabels(style: ChoiceStyle, count: number): string[] {
  if (style === "กขคง") {
    const thaiLabels = ["ก", "ข", "ค", "ง", "จ"];
    return thaiLabels.slice(0, count);
  }
  if (style === "1234") {
    const numLabels = ["1", "2", "3", "4", "5"];
    return numLabels.slice(0, count);
  }
  const enLabels = ["A", "B", "C", "D", "E"];
  return enLabels.slice(0, count);
}

export function formatScore(score: number, total: number): string {
  if (total === 0) return "0.0%";
  return `${((score / total) * 100).toFixed(1)}%`;
}

export function getScoreGrade(percentage: number): { grade: string; color: string; bg: string } {
  if (percentage >= 80) return { grade: "A", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" };
  if (percentage >= 75) return { grade: "B+", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" };
  if (percentage >= 70) return { grade: "B", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" };
  if (percentage >= 65) return { grade: "C+", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" };
  if (percentage >= 60) return { grade: "C", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" };
  if (percentage >= 55) return { grade: "D+", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" };
  if (percentage >= 50) return { grade: "D", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" };
  return { grade: "F", color: "text-rose-700", bg: "bg-rose-50 border-rose-200" };
}

export function formatDate(isoString: string, locale: "th" | "en" = "th"): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return isoString;
  }
}
