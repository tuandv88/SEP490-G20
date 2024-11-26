import { create } from 'zustand'

const useStore = create((set) => ({
  selectedCourse: null,
  setSelectedCourse: (newSelectedCourse) => set({ selectedCourse: newSelectedCourse }),
  testCases: [],
  setTestCases: (newTestCases) => set({ testCases: newTestCases }),
  activeTabTestcase: 'Testcase',
  setActiveTabTestcase: (newActiveTabTestcase) => set({ activeTabTestcase: newActiveTabTestcase }),
  codeRun: null,
  setCodeRun: (newCodeRun) => set({ codeRun: newCodeRun }),
  codeResponse: null,
  setCodeResponse: (newCodeResponse) => set({ codeResponse: newCodeResponse }),
  selectedConversationId: null,
  setSelectedConversationId: (newSelectedConversationId) => set({ selectedConversationId: newSelectedConversationId }),

  codeRunQuiz: null,
  setCodeRunQuiz: (newCodeRunQuiz) => set({ codeRunQuiz: newCodeRunQuiz }),
  
  testCasesQuiz: null,
  setTestCasesQuiz: (newTestCasesQuiz) => set({ testCasesQuiz: newTestCasesQuiz }),
}))

export default useStore
