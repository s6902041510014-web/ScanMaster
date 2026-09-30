import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ScanResult, ClassSummary, Exam } from "@/types";
import { INITIAL_RESULTS } from "@/lib/mock/seedData";

interface ResultState {
  results: ScanResult[];
  getResultsByExamId: (examId: string) => ScanResult[];
  addResult: (result: Omit<ScanResult, "id" | "scannedAt">) => ScanResult;
  updateResult: (id: string, patch: Partial<ScanResult>) => void;
  deleteResult: (id: string) => void;
  getClassSummary: (exam: Exam) => ClassSummary;
  clearResultsByExamId: (examId: string) => void;
  resetToDefault: () => void;
}

export const useResultStore = create<ResultState>()(
  persist(
    (set, get) => ({
      results: INITIAL_RESULTS,
      getResultsByExamId: (examId: string) => {
        return get().results.filter((r) => r.examId === examId);
      },
      addResult: (data) => {
        const newResult: ScanResult = {
          ...data,
          id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          scannedAt: new Date().toISOString(),
        };
        set((state) => ({
          results: [newResult, ...state.results],
        }));
        return newResult;
      },
      updateResult: (id, patch) => {
        set((state) => ({
          results: state.results.map((r) =>
            r.id === id ? { ...r, ...patch } : r
          ),
        }));
      },
      deleteResult: (id) => {
        set((state) => ({
          results: state.results.filter((r) => r.id !== id),
        }));
      },
      clearResultsByExamId: (examId) => {
        set((state) => ({
          results: state.results.filter((r) => r.examId !== examId),
        }));
      },
      resetToDefault: () => {
        set({ results: INITIAL_RESULTS });
      },
      getClassSummary: (exam: Exam): ClassSummary => {
        const examResults = get().results.filter((r) => r.examId === exam.id);
        const totalScanned = examResults.length;

        if (totalScanned === 0) {
          return {
            examId: exam.id,
            totalScanned: 0,
            averageScore: 0,
            maxScore: 0,
            minScore: 0,
            passCount: 0,
            failCount: 0,
            passRate: 0,
            distribution: [
              { range: "0-49%", count: 0 },
              { range: "50-59%", count: 0 },
              { range: "60-69%", count: 0 },
              { range: "70-79%", count: 0 },
              { range: "80-100%", count: 0 },
            ],
            questionStats: exam.answerKey.map((key, i) => ({
              questionNumber: i + 1,
              correctKey: key,
              correctCount: 0,
              accuracyPercentage: 0,
            })),
          };
        }

        const scores = examResults.map((r) => r.score);
        const totalScoreSum = scores.reduce((acc, s) => acc + s, 0);
        const averageScore = totalScoreSum / totalScanned;
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);

        const passThreshold = exam.totalQuestions * 0.6;
        const passCount = examResults.filter((r) => r.score >= passThreshold).length;
        const failCount = totalScanned - passCount;
        const passRate = (passCount / totalScanned) * 100;

        // Distribution buckets
        const distMap = { "0-49%": 0, "50-59%": 0, "60-69%": 0, "70-79%": 0, "80-100%": 0 };
        examResults.forEach((r) => {
          if (r.percentage >= 80) distMap["80-100%"]++;
          else if (r.percentage >= 70) distMap["70-79%"]++;
          else if (r.percentage >= 60) distMap["60-69%"]++;
          else if (r.percentage >= 50) distMap["50-59%"]++;
          else distMap["0-49%"]++;
        });

        const distribution = Object.entries(distMap).map(([range, count]) => ({ range, count }));

        // Item Analysis per question
        const questionStats = exam.answerKey.map((key, qIdx) => {
          const correctCount = examResults.filter(
            (r) => r.correctedAnswers[qIdx] === key
          ).length;
          return {
            questionNumber: qIdx + 1,
            correctKey: key,
            correctCount,
            accuracyPercentage: Math.round((correctCount / totalScanned) * 100),
          };
        });

        return {
          examId: exam.id,
          totalScanned,
          averageScore: Math.round(averageScore * 10) / 10,
          maxScore,
          minScore,
          passCount,
          failCount,
          passRate: Math.round(passRate * 10) / 10,
          distribution,
          questionStats,
        };
      },
    }),
    {
      name: "omr_results_store",
    }
  )
);
