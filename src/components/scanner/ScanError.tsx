import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { AlertTriangle, RefreshCw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScanErrorProps {
  message?: string;
  tips?: { th: string; en: string }[];
  onRetry: () => void;
}

export default function ScanError({ message, tips, onRetry }: ScanErrorProps) {
  const { locale, t } = useLanguage();

  const defaultTips = [
    {
      th: "ถ่ายในบริเวณที่มีแสงสว่างเพียงพอ หลีกเลี่ยงเงาตกกระทบกระดาษ",
      en: "Scan in a well-lit area without heavy shadows falling on the sheet",
    },
    {
      th: "วางกระดาษบนพื้นผิวเรียบ และให้จุดสี่เหลี่ยมดำ 4 มุมอยู่ในกรอบภาพทั้งหมด",
      en: "Place paper on a flat surface, ensuring all 4 black corner squares are visible",
    },
    {
      th: "ถือกล้องขนานกับกระดาษคำตอบ ไม่เอียงจนเกินไป",
      en: "Hold camera parallel to the sheet to reduce extreme skew",
    },
  ];

  const activeTips = tips || defaultTips;

  return (
    <div className="bg-white rounded-2xl border border-rose-200 p-8 shadow-elevated max-w-lg mx-auto text-center">
      <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {t.scanner.errorTitle}
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        {message || "ระบบไม่สามารถตรวจจับจุดมุมกระดาษคำตอบได้ชัดเจน"}
      </p>

      {/* Tips box (High Contrast & Proximity) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span>{t.scanner.tipsTitle}</span>
        </div>
        <ul className="space-y-2 text-xs text-slate-700">
          {activeTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-blue-700 font-bold">•</span>
              <span>{locale === "th" ? tip.th : tip.en}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={onRetry}
        className="w-full gap-2 text-base font-semibold"
      >
        <RefreshCw className="h-5 w-5" />
        {t.scanner.errorRetake}
      </Button>
    </div>
  );
}
