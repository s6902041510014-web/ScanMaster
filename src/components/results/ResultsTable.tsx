"use client";

import React, { useState } from "react";
import { ScanResult, Exam } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { formatDate, getScoreGrade } from "@/lib/utils";
import {
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ResultsTableProps {
  exam: Exam;
  results: ScanResult[];
  onDeleteResult?: (id: string) => void;
}

export default function ResultsTable({ exam, results, onDeleteResult }: ResultsTableProps) {
  const { locale, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPass, setFilterPass] = useState<"all" | "pass" | "fail">("all");

  const filtered = results.filter((r) => {
    const matchQuery =
      r.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.studentName && r.studentName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchQuery) return false;
    if (filterPass === "pass") return r.percentage >= 60;
    if (filterPass === "fail") return r.percentage < 60;
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Search & Filter Bar (Proximity & Alignment) */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="ค้นหารหัสนักเรียน หรือชื่อ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold">ตัวกรอง:</span>
          <button
            onClick={() => setFilterPass("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterPass === "all"
                ? "bg-blue-700 text-white shadow-sm"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            ทั้งหมด ({results.length})
          </button>
          <button
            onClick={() => setFilterPass("pass")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterPass === "pass"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            ผ่าน (≥60%)
          </button>
          <button
            onClick={() => setFilterPass("fail")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterPass === "fail"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            ไม่ผ่าน
          </button>
        </div>
      </div>

      {/* Table Section (High Contrast & Repetition) */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 w-12 text-center">ลำดับ</th>
              <th className="py-3 px-4">{t.results.table.studentId}</th>
              <th className="py-3 px-4">ชื่อ-นามสกุล</th>
              <th className="py-3 px-4 text-center">{t.results.table.score}</th>
              <th className="py-3 px-4 text-center">{t.results.table.percentage}</th>
              <th className="py-3 px-4 text-center">{t.results.table.grade}</th>
              <th className="py-3 px-4 text-center">{t.results.table.status}</th>
              <th className="py-3 px-4">{t.results.table.scannedAt}</th>
              {onDeleteResult && <th className="py-3 px-4 text-center">จัดการ</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  ไม่พบข้อมูลผลการตรวจที่ตรงกับเงื่อนไข
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => {
                const isPass = item.percentage >= 60;
                const gradeInfo = getScoreGrade(item.percentage);

                return (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-blue-700" />
                        <span>{item.studentId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {item.studentName || <span className="text-slate-400">-</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-extrabold text-sm text-slate-900">
                        {item.score}
                      </span>
                      <span className="text-slate-400 text-[11px]"> / {exam.totalQuestions}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {item.percentage.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${gradeInfo.bg} ${gradeInfo.color}`}>
                        {gradeInfo.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isPass ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" /> ผ่าน
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="h-3 w-3" /> ไม่ผ่าน
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium text-[11px]">
                      {formatDate(item.scannedAt, locale)}
                    </td>
                    {onDeleteResult && (
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onDeleteResult(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                          title="ลบผลการตรวจนี้"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
