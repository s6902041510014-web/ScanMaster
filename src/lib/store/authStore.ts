import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TeacherUser } from "@/types";

interface AuthState {
  user: TeacherUser | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: "teacher-01",
        name: "ดร. สมชาย พัฒนาวิชาการ",
        email: "somchai@university.ac.th",
        department: "ภาควิชาวิทยาการคอมพิวเตอร์",
      },
      isAuthenticated: true,
      login: (email: string, name?: string) => {
        set({
          user: {
            id: `teacher-${Date.now()}`,
            name: name || (email.split("@")[0] ? `อาจารย์ ${email.split("@")[0]}` : "อาจารย์ผู้สอน"),
            email: email,
            department: "คณะวิทยาศาสตร์และเทคโนโลยี",
          },
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "omr_auth_session",
    }
  )
);
