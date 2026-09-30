import React from "react";
import { ClassSummary } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { HelpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ItemAnalysisTableProps {
  summary: ClassSummary;
}

export default function ItemAnalysisTable({ summary }: ItemAnalysisTableProps) {
  const { t } = useLanguage();

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-700" />
            <CardTitle className="text-base font-bold text-slate-900">
              {t.results.itemAnalysis}
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {summary.questionStats.length} ข้อ
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[360px] overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-sm text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">ข้อที่</th>
                <th className="py-2.5 px-3">เฉลย</th>
                <th className="py-2.5 px-3 text-center">ตอบถูก (คน)</th>
                <th className="py-2.5 px-3">อัตราความถูกต้อง (%)</th>
                <th className="py-2.5 px-4 text-center">ระดับความยาก</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.questionStats.map((item) => {
                const acc = item.accuracyPercentage;
                let diffBadge = { label: "ปานกลาง", color: "bg-blue-50 text-blue-700 border-blue-200" };
                if (acc >= 75) {
                  diffBadge = { label: "ง่าย", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
                } else if (acc < 40) {
                  diffBadge = { label: "ยาก", color: "bg-rose-50 text-rose-700 border-rose-200" };
                }

                return (
                  <tr key={item.questionNumber} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                      ข้อ {item.questionNumber}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-blue-800">
                      {item.correctKey}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                      {item.correctCount} / {summary.totalScanned}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              acc >= 70 ? "bg-emerald-600" : acc >= 40 ? "bg-blue-600" : "bg-rose-600"
                            }`}
                            style={{ width: `${acc}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-800">{acc}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${diffBadge.color}`}>
                        {diffBadge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
