import React from "react";
import { ClassSummary } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ScoreHistogramProps {
  summary: ClassSummary;
}

export default function ScoreHistogram({ summary }: ScoreHistogramProps) {
  const { t } = useLanguage();
  const maxCount = Math.max(...summary.distribution.map((d) => d.count), 1);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-700" />
          <CardTitle className="text-base font-bold text-slate-900">
            {t.results.scoreDistribution}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {summary.distribution.map((bucket) => {
            const ratio = summary.totalScanned > 0 ? (bucket.count / summary.totalScanned) * 100 : 0;
            const barWidth = (bucket.count / maxCount) * 100;

            return (
              <div key={bucket.range} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 w-20">{bucket.range}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-900 font-bold">{bucket.count} คน</span>
                    <span className="text-slate-400 text-[11px]">({ratio.toFixed(1)}%)</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200">
                  <div
                    className="bg-gradient-to-r from-blue-700 to-blue-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(barWidth, bucket.count > 0 ? 4 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
