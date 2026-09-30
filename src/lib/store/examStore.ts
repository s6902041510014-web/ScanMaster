import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Exam } from "@/types";
import { INITIAL_EXAMS } from "@/lib/mock/seedData";
import { computeLayoutId } from "@/lib/utils";

interface ExamState {
  exams: Exam[];
  getExamById: (id: string) => Exam | undefined;
  createExam: (data: Omit<Exam, "id" | "layoutId" | "createdAt" | "updatedAt">) => Exam;
  updateExam: (id: string, patch: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  resetToDefault: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      exams: INITIAL_EXAMS,
      getExamById: (id: string) => {
        return get().exams.find((e) => e.id === id);
      },
      createExam: (data) => {
        const layoutId = computeLayoutId(data.totalQuestions);
        const newExam: Exam = {
          ...data,
          id: `exam-${Date.now()}`,
          layoutId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          exams: [newExam, ...state.exams],
        }));
        return newExam;
      },
      updateExam: (id, patch) => {
        set((state) => ({
          exams: state.exams.map((e) =>
            e.id === id
              ? {
                  ...e,
                  ...patch,
                  layoutId: patch.totalQuestions ? computeLayoutId(patch.totalQuestions) : e.layoutId,
                  updatedAt: new Date().toISOString(),
                }
              : e
          ),
        }));
      },
      deleteExam: (id) => {
        set((state) => ({
          exams: state.exams.filter((e) => e.id !== id),
        }));
      },
      resetToDefault: () => {
        set({ exams: INITIAL_EXAMS });
      },
    }),
    {
      name: "omr_exams_store",
    }
  )
);
