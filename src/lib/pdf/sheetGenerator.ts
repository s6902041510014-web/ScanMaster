import { jsPDF } from "jspdf";
import { Exam } from "@/types";
import { getGridConfig } from "@/lib/omr/gridConfig";
import { getChoiceLabels } from "@/lib/utils";

export async function generateAnswerSheetPdf(exam: Exam): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const config = getGridConfig(exam.layoutId, exam.totalQuestions);
  const choiceLabels = getChoiceLabels(exam.choiceStyle, exam.choicesPerQuestion);

  // 1. Draw 4 Solid Black Corner Markers (Critical for OMR computer vision)
  doc.setFillColor(0, 0, 0);
  doc.rect(config.markers.topLeft.x, config.markers.topLeft.y, config.markers.topLeft.size, config.markers.topLeft.size, "F");
  doc.rect(config.markers.topRight.x, config.markers.topRight.y, config.markers.topRight.size, config.markers.topRight.size, "F");
  doc.rect(config.markers.bottomLeft.x, config.markers.bottomLeft.y, config.markers.bottomLeft.size, config.markers.bottomLeft.size, "F");
  doc.rect(config.markers.bottomRight.x, config.markers.bottomRight.y, config.markers.bottomRight.size, config.markers.bottomRight.size, "F");

  // 2. Header Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("OMR ANSWER SHEET / กระดาษคำตอบมาตรฐาน", 105, 18, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Subject: ${exam.subjectCode} - ${exam.subject}`, 24, 25);
  doc.text(`Exam: ${exam.title}`, 24, 30);
  doc.text(`Total Questions: ${exam.totalQuestions} items (${exam.choicesPerQuestion} choices)`, 135, 25);
  doc.text(`Layout: ${exam.layoutId} | Style: ${exam.choiceStyle}`, 135, 30);

  // Student Info Input Lines
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);
  doc.text("Student Name: __________________________________", 24, 38);
  doc.text("Room/Sec: ____________  Date: ____________", 125, 38);

  // Header separator line
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.6);
  doc.line(24, 42, 186, 42);

  // 3. Student ID Section (8-digit bubble matrix)
  const idConfig = config.studentIdGrid;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text("STUDENT ID / รหัสนักเรียน (8 DIGITS)", idConfig.x, idConfig.y - 6);

  // Box border around Student ID
  const idBoxW = idConfig.columns * idConfig.colSpacing + 8;
  const idBoxH = idConfig.rows * idConfig.rowSpacing + 12;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(idConfig.x - 4, idConfig.y - 4, idBoxW, idBoxH, 2, 2, "FD");

  // Digit row labels & bubbles
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);

  // Column header indicators (Digit 1 to 8)
  for (let c = 0; c < idConfig.columns; c++) {
    const cx = idConfig.x + c * idConfig.colSpacing + 2;
    doc.text(`D${c + 1}`, cx, idConfig.y);
  }

  // Draw 0-9 bubbles for each column
  for (let r = 0; r < idConfig.rows; r++) {
    const digitLabel = r.toString();
    const ry = idConfig.y + 4 + r * idConfig.rowSpacing;

    for (let c = 0; c < idConfig.columns; c++) {
      const cx = idConfig.x + c * idConfig.colSpacing + 2;
      doc.setDrawColor(71, 85, 105);
      doc.setLineWidth(0.2);
      doc.circle(cx, ry, idConfig.bubbleRadius, "S");
      doc.text(digitLabel, cx, ry + 0.8, { align: "center" });
    }
  }

  // 4. Instructions Box (if SM/MD layout has room next to student ID)
  if (exam.layoutId === "SM" || exam.layoutId === "MD") {
    const instructX = idConfig.x + idBoxW + 6;
    const instructW = 186 - instructX;
    doc.setDrawColor(191, 219, 254);
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(instructX, idConfig.y - 4, instructW, idBoxH, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 64, 175);
    doc.text("FILLING INSTRUCTIONS / วิธีการฝน", instructX + 4, idConfig.y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(51, 65, 85);
    doc.text("• Use 2B pencil or dark black/blue pen", instructX + 4, idConfig.y + 4.5);
    doc.text("• Fill bubble firmly & completely", instructX + 4, idConfig.y + 8.5);
    doc.text("• Correct: [ ● ] | Incorrect: [ × ] [ ✓ ] [ ◐ ]", instructX + 4, idConfig.y + 12.5);
    doc.text("• Ambiguous (2 marks) = 0 score", instructX + 4, idConfig.y + 16.5);
    doc.text("• Keep corner markers intact", instructX + 4, idConfig.y + 20.5);
  }

  // 5. Answer Grid Section
  const ansConfig = config.answerGrid;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text("ANSWER SHEET / ช่องบันทึกคำตอบ", ansConfig.x, ansConfig.y - 4);

  let currentQ = 1;

  for (let col = 0; col < ansConfig.columnsCount; col++) {
    const colStartX = ansConfig.x + col * ansConfig.colWidth;
    const startQ = col * ansConfig.questionsPerCol + 1;
    const endQ = Math.min(startQ + ansConfig.questionsPerCol - 1, exam.totalQuestions);

    if (startQ > exam.totalQuestions) break;

    // Draw Column Container Box
    const colBoxW = ansConfig.colWidth - 4;
    const colBoxH = (endQ - startQ + 1) * ansConfig.rowSpacing + 4;
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(colStartX, ansConfig.y, colBoxW, colBoxH, 1.5, 1.5, "FD");

    for (let q = startQ; q <= endQ; q++) {
      const qRowIdx = q - startQ;
      const qY = ansConfig.y + 4 + qRowIdx * ansConfig.rowSpacing;

      // Question Number Label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(15, 23, 42);
      doc.text(q.toString().padStart(2, "0") + ".", colStartX + 2, qY + 0.8);

      // Bubbles for this question
      const bubbleStartX = colStartX + 9;
      for (let ch = 0; ch < exam.choicesPerQuestion; ch++) {
        const bX = bubbleStartX + ch * ansConfig.bubbleSpacing;
        doc.setDrawColor(71, 85, 105);
        doc.setLineWidth(0.2);
        doc.circle(bX, qY, ansConfig.bubbleRadius, "S");

        // Choice letter / symbol inside bubble
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        const label = choiceLabels[ch] || String.fromCharCode(65 + ch);
        doc.text(label, bX, qY + 0.7, { align: "center" });
      }
    }
  }

  // 6. Footer Section: Scale warning & metadata
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Important: Print at 100% scale (Actual Size). Do NOT scale or fit to printable area.", 105, 282, { align: "center" });
  doc.text(`OMR Engine v1.0 • Form ID: ${exam.id} • Generated for Academic Evaluation`, 105, 285.5, { align: "center" });

  return doc;
}

export async function downloadAnswerSheetPdf(exam: Exam): Promise<void> {
  const doc = await generateAnswerSheetPdf(exam);
  const sanitizedTitle = (exam.subjectCode || "Exam").replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`OMR_AnswerSheet_${sanitizedTitle}_${exam.layoutId}.pdf`);
}
