import { Exam } from "@/types";
import { DetectedGrid } from "./detector";
import { getChoiceLabels } from "@/lib/utils";

export interface DecodedResult {
  studentId: string;
  answers: string[];
  ambiguousQuestions: number[];
  confidence: number;
}

export function decodeGrid(grid: DetectedGrid, exam: Exam): DecodedResult {
  const choiceLabels = getChoiceLabels(exam.choiceStyle, exam.choicesPerQuestion);

  // 1. Decode Student ID (8 digits from columns)
  let studentId = "";
  for (let col = 0; col < grid.studentIdMatrix.length; col++) {
    const colSamples = grid.studentIdMatrix[col];
    // Find sample with highest fill ratio
    let maxFill = 0;
    let selectedDigit = -1;

    for (let digit = 0; digit < colSamples.length; digit++) {
      const sample = colSamples[digit];
      if (sample.fillRatio > maxFill && sample.fillRatio >= 0.35) {
        maxFill = sample.fillRatio;
        selectedDigit = digit;
      }
    }

    if (selectedDigit !== -1) {
      studentId += selectedDigit.toString();
    } else {
      studentId += "0"; // fallback default
    }
  }

  // 2. Decode Answers for each question
  const answers: string[] = [];
  const ambiguousQuestions: number[] = [];
  let totalConfidence = 0;

  for (let q = 0; q < grid.answerMatrix.length; q++) {
    const qSamples = grid.answerMatrix[q];

    // Filter which choices exceed threshold
    const filledChoices: { index: number; fill: number }[] = [];
    qSamples.forEach((sample, idx) => {
      if (sample.isFilled || sample.fillRatio >= 0.38) {
        filledChoices.push({ index: idx, fill: sample.fillRatio });
      }
    });

    if (filledChoices.length === 1) {
      // Exactly one option filled
      const choiceIdx = filledChoices[0].index;
      answers.push(choiceLabels[choiceIdx] || "A");
      totalConfidence += filledChoices[0].fill;
    } else if (filledChoices.length > 1) {
      // Multiple options filled (Ambiguous fill)
      ambiguousQuestions.push(q);
      answers.push("AMBIGUOUS");
      totalConfidence += 0.2;
    } else {
      // Unanswered / blank
      answers.push("-");
      totalConfidence += 0.5;
    }
  }

  const confidence = grid.answerMatrix.length > 0 ? Math.min(1.0, totalConfidence / grid.answerMatrix.length) : 0.8;

  return {
    studentId,
    answers,
    ambiguousQuestions,
    confidence,
  };
}
