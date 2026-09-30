import { Exam, ScanResult } from "@/types";
import { DecodedResult } from "./decoder";

export function gradeExamAnswers(
  decoded: DecodedResult,
  exam: Exam,
  studentName?: string
): Omit<ScanResult, "id" | "scannedAt"> {
  let score = 0;
  const totalQuestions = exam.totalQuestions;

  for (let i = 0; i < totalQuestions; i++) {
    const studentAnswer = decoded.answers[i];
    const correctAnswer = exam.answerKey[i];

    // ADR-005 rule: If studentAnswer is AMBIGUOUS, it automatically receives 0 points
    if (studentAnswer !== "AMBIGUOUS" && studentAnswer !== "-" && studentAnswer === correctAnswer) {
      score += 1;
    }
  }

  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  return {
    examId: exam.id,
    studentId: decoded.studentId || "65010001",
    studentName: studentName || undefined,
    answers: [...decoded.answers],
    correctedAnswers: [...decoded.answers],
    score,
    percentage: Math.round(percentage * 10) / 10,
    totalQuestions,
    ambiguousQuestions: [...decoded.ambiguousQuestions],
    status: "PENDING",
    correctedManually: false,
  };
}
