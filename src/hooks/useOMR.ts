"use client";

import { useState } from "react";
import { Exam, ScanResult, OMRDetectionResult } from "@/types";
import { preprocessImage } from "@/lib/omr/preprocessor";
import { detectBubbles } from "@/lib/omr/detector";
import { decodeGrid } from "@/lib/omr/decoder";
import { gradeExamAnswers } from "@/lib/omr/grader";

export interface OMRProcessingState {
  isProcessing: boolean;
  step: "idle" | "preprocessing" | "cornerDetection" | "perspective" | "sampling" | "grading" | "complete" | "error";
  progress: number;
  result: Omit<ScanResult, "id" | "scannedAt"> | null;
  error: {
    code: string;
    message: string;
    tips: { th: string; en: string }[];
  } | null;
}

export function useOMR(exam: Exam) {
  const [state, setState] = useState<OMRProcessingState>({
    isProcessing: false,
    step: "idle",
    progress: 0,
    result: null,
    error: null,
  });

  const processImageSource = async (
    imageSource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    mockStudentId?: string
  ): Promise<Omit<ScanResult, "id" | "scannedAt"> | null> => {
    setState({
      isProcessing: true,
      step: "preprocessing",
      progress: 20,
      result: null,
      error: null,
    });

    try {
      await new Promise((r) => setTimeout(r, 250)); // smooth step transition

      // 1. Preprocess & Perspective transform
      setState((prev) => ({ ...prev, step: "cornerDetection", progress: 40 }));
      const preRes = await preprocessImage(imageSource);

      if (!preRes.success || !preRes.warpedCanvas) {
        throw new Error(preRes.errorMessage || "Corner markers not found on sheet");
      }

      // 2. Sampling bubble grid
      setState((prev) => ({ ...prev, step: "sampling", progress: 70 }));
      await new Promise((r) => setTimeout(r, 250));
      const grid = detectBubbles(preRes.warpedCanvas, exam);

      // 3. Decoding & Grading
      setState((prev) => ({ ...prev, step: "grading", progress: 90 }));
      const decoded = decodeGrid(grid, exam);

      // If mock student ID passed from simulator, use it
      if (mockStudentId) {
        decoded.studentId = mockStudentId;
      }

      const gradedResult = gradeExamAnswers(decoded, exam);

      setState({
        isProcessing: false,
        step: "complete",
        progress: 100,
        result: gradedResult,
        error: null,
      });

      return gradedResult;
    } catch (err: any) {
      const errorObj = {
        code: "CORNER_NOT_FOUND",
        message: err?.message || "ไม่สามารถตรวจจับจุดมุมกระดาษคำตอบได้ กรุณาถ่ายภาพใหม่อีกครั้ง",
        tips: [
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
        ],
      };

      setState({
        isProcessing: false,
        step: "error",
        progress: 0,
        result: null,
        error: errorObj,
      });

      return null;
    }
  };

  /**
   * Helper to simulate a realistic scan for demo/testing directly in browser
   */
  const simulateScan = async (
    customStudentId?: string,
    accuracyRate: number = 0.85
  ): Promise<Omit<ScanResult, "id" | "scannedAt">> => {
    setState({
      isProcessing: true,
      step: "preprocessing",
      progress: 20,
      result: null,
      error: null,
    });

    await new Promise((r) => setTimeout(r, 300));
    setState((prev) => ({ ...prev, step: "cornerDetection", progress: 50 }));

    await new Promise((r) => setTimeout(r, 300));
    setState((prev) => ({ ...prev, step: "sampling", progress: 80 }));

    await new Promise((r) => setTimeout(r, 300));
    setState((prev) => ({ ...prev, step: "grading", progress: 95 }));

    // Generate student answers based on answerKey + accuracyRate
    const answers: string[] = [];
    const ambiguousQuestions: number[] = [];
    const choices = exam.choiceStyle === "กขคง" ? ["ก", "ข", "ค", "ง"] : exam.choiceStyle === "1234" ? ["1", "2", "3", "4"] : ["A", "B", "C", "D"];

    for (let i = 0; i < exam.totalQuestions; i++) {
      const isCorrect = Math.random() < accuracyRate;
      if (isCorrect) {
        answers.push(exam.answerKey[i]);
      } else {
        const isAmbiguous = Math.random() < 0.05; // 5% chance of ambiguous
        if (isAmbiguous) {
          ambiguousQuestions.push(i);
          answers.push("AMBIGUOUS");
        } else {
          // pick a wrong choice
          const wrongChoices = choices.filter((c) => c !== exam.answerKey[i]);
          answers.push(wrongChoices[Math.floor(Math.random() * wrongChoices.length)] || choices[0]);
        }
      }
    }

    const randomIdNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    const studentId = customStudentId || randomIdNumber;

    const decoded = {
      studentId,
      answers,
      ambiguousQuestions,
      confidence: 0.94,
    };

    const gradedResult = gradeExamAnswers(decoded, exam);

    setState({
      isProcessing: false,
      step: "complete",
      progress: 100,
      result: gradedResult,
      error: null,
    });

    return gradedResult;
  };

  const resetOMR = () => {
    setState({
      isProcessing: false,
      step: "idle",
      progress: 0,
      result: null,
      error: null,
    });
  };

  return {
    state,
    processImageSource,
    simulateScan,
    resetOMR,
  };
}
