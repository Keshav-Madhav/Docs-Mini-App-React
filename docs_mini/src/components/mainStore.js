import { create } from 'zustand';

export const mainStore = create((set) => ({
  isDrag: false,
  setIsDrag: (value) => set({ isDrag: value }),
  forceRefresh: false,
  toggleForceRefresh: () =>
    set((state) => ({ forceRefresh: !state.forceRefresh })),
}));