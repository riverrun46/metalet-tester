import { create } from 'zustand'

export const useBtcjsStore = create((set, get) => ({
  instance: null,
  setInstance: (instance: any) => set({ instance }),
}))
