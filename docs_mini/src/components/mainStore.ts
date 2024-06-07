import { create } from 'zustand';

type MainStore = {
  isDrag: boolean;
  setIsDrag: (value: boolean) => void;
  forceRefresh: boolean;
  toggleForceRefresh: () => void;
};

export const mainStore = create<MainStore>((set) => ({
  isDrag: false,
  setIsDrag: (value) => set({ isDrag: value }),
  forceRefresh: false,
  toggleForceRefresh: () =>
    set((state) => ({ forceRefresh: !state.forceRefresh })),
}));