import { create } from 'zustand'

const useStore = create((set) => ({
  testCases: [],
  setTestCases: (newTestCases) => set({ testCases: newTestCases }),
  codeRun: null,
  setCodeRun: (newCodeRun) => set({ codeRun: newCodeRun }),
  codeResponse: null,
  setCodeResponse: (newCodeResponse) => set({ codeResponse: newCodeResponse })
}))

export default useStore
