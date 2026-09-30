import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Exam, ScanResult, ClassSummary } from "@/types";
import { formatDate } from "@/lib/utils";

export function generateClassResultsPdf(
  exam: Exam,
  results: ScanResult[],
  summary: ClassSummary
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Header Banner (Navy/Blue)
  doc.setFillColor(30, 58, 138); // Blue 900
  doc.rect(0, 0, 210, 36, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("EXAMINATION RESULTS REPORT", 14, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(219, 234, 254);
  doc.text(`Subject: ${exam.subjectCode} - ${exam.subject}`, 14, 23);
  doc.text(`Exam Title: ${exam.title} | Total Questions: ${exam.totalQuestions} items`, 14, 29);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 155, 29);

  // Summary Metrics Cards
  const startY = 44;
  const cardW = 42;
  const cardH = 20;

  const metrics = [
    { label: "Graded Students", value: summary.totalScanned.toString(), color: [37, 99, 235] },
    { label: "Class Average", value: `${summary.averageScore} / ${exam.totalQuestions}`, color: [30, 64, 175] },
    { label: "High / Low", value: `${summary.maxScore} / ${summary.minScore}`, color: [16, 185, 129] },
    { label: "Passing Rate", value: `${summary.passRate}%`, color: [217, 119, 6] },
  ];

  metrics.forEach((m, idx) => {
    const x = 14 + idx * (cardW + 4);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, startY, cardW, cardH, 2, 2, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, x + 3, startY + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.text(m.value, x + 3, startY + 14);
  });

  // Results Table using autoTable
  const tableData = results.map((r, idx) => [
    (idx + 1).toString(),
    r.studentId,
    r.studentName || "-",
    `${r.score} / ${exam.totalQuestions}`,
    `${r.percentage.toFixed(1)}%`,
    r.percentage >= 60 ? "PASS" : "FAIL",
    r.correctedManually ? "Verified" : "Auto",
    formatDate(r.scannedAt, "en"),
  ]);

  autoTable(doc, {
    startY: startY + cardH + 10,
    head: [["#", "Student ID", "Name", "Score", "Percentage", "Result", "Type", "Scanned At"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [15, 23, 42],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    styles: {
      cellPadding: 2.5,
      halign: "center",
    },
    columnStyles: {
      2: { halign: "left" }, // Student Name
    },
  });

  // Footer page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount} • OMR Exam Management System • Confidential Academic Record`,
      105,
      290,
      { align: "center" }
    );
  }

  return doc;
}

export function downloadClassResultsPdf(
  exam: Exam,
  results: ScanResult[],
  summary: ClassSummary
): void {
  const doc = generateClassResultsPdf(exam, results, summary);
  const sanitizedTitle = (exam.subjectCode || "Exam").replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`OMR_Results_${sanitizedTitle}.pdf`);
}
