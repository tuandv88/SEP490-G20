import { create } from 'zustand'

const useStore = create((set) => ({
  testCases: [],
  setTestCases: (newTestCases) => set({ testCases: newTestCases })
}))

export default useStore
