import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ThemeState {
  theme: {
    paddle: string;
    pitch: string;
  };

  setPaddleColor: (color: string) => void;
  setPitch: (pitch: string) => void;
  setTheme: (theme: ThemeState["theme"]) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: {
        paddle: "red",
        pitch: "green",
      },
      setTheme: (theme) => set({ theme }),
      setPaddleColor: (color: string) =>
        set((state) => ({ theme: { ...state.theme, paddle: color } })),
      setPitch: (pitch: string) =>
        set((state) => ({ theme: { ...state.theme, pitch } })),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
