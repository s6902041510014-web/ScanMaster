import { Exam, ScanResult } from "@/types";
import { formatDate } from "@/lib/utils";

export function generateResultsCsv(exam: Exam, results: ScanResult[]): string {
  // Headers construction
  const headers: string[] = [
    "รหัสนักเรียน",
    "ชื่อ-นามสกุล",
    "คะแนนรวม",
    "คะแนนเต็ม",
    "ร้อยละ (%)",
    "สถานะผลสอบ",
  ];

  // Question Answer Columns (Q1 ... QN)
  for (let i = 1; i <= exam.totalQuestions; i++) {
    headers.push(`คำตอบ_ข้อ_${i}`);
  }

  // Answer Key Columns (Key_Q1 ... Key_QN)
  for (let i = 1; i <= exam.totalQuestions; i++) {
    headers.push(`เฉลย_ข้อ_${i}`);
  }

  // Correctness Columns (1/0 per Q)
  for (let i = 1; i <= exam.totalQuestions; i++) {
    headers.push(`ถูกผิด_ข้อ_${i}`);
  }

  // Metadata Columns
  headers.push("วันที่สแกน", "ชื่อวิชา", "รหัสวิชา", "ชื่อชุดข้อสอบ");

  // Rows Data
  const rows: string[][] = results.map((result) => {
    const row: string[] = [
      `"${result.studentId}"`,
      `"${result.studentName || "-"}"`,
      result.score.toString(),
      exam.totalQuestions.toString(),
      result.percentage.toFixed(1),
      result.percentage >= 60 ? "ผ่าน" : "ไม่ผ่าน",
    ];

    // Student's Answers
    for (let i = 0; i < exam.totalQuestions; i++) {
      const ans = result.correctedAnswers[i] || "-";
      row.push(`"${ans}"`);
    }

    // Answer Key
    for (let i = 0; i < exam.totalQuestions; i++) {
      const key = exam.answerKey[i] || "-";
      row.push(`"${key}"`);
    }

    // Correctness (1 or 0)
    for (let i = 0; i < exam.totalQuestions; i++) {
      const isCorrect = result.correctedAnswers[i] === exam.answerKey[i];
      row.push(isCorrect ? "1" : "0");
    }

    // Metadata
    row.push(
      `"${formatDate(result.scannedAt, "th")}"`,
      `"${exam.subject}"`,
      `"${exam.subjectCode}"`,
      `"${exam.title}"`
    );

    return row;
  });

  // Combine with UTF-8 BOM so Microsoft Excel renders Thai characters flawlessly
  const csvContent = [
    headers.join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\r\n");

  return "\uFEFF" + csvContent;
}

export function downloadResultsCsv(exam: Exam, results: ScanResult[]): void {
  const csvString = generateResultsCsv(exam, results);
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const sanitizedTitle = (exam.subjectCode || "Exam").replace(/[^a-zA-Z0-9_-]/g, "_");
  link.setAttribute("href", url);
  link.setAttribute("download", `OMR_Export_${sanitizedTitle}_Full.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
