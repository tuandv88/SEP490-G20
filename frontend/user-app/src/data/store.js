import { create } from 'zustand'

const useStore = create((set) => ({
  testCases: [],
  setTestCases: (newTestCases) => set({ testCases: newTestCases }),
  activeTabTestcase: 'Testcase',
  setActiveTabTestcase: (newActiveTabTestcase) => set({ activeTabTestcase: newActiveTabTestcase }),
  codeRun: null,
  setCodeRun: (newCodeRun) => set({ codeRun: newCodeRun }),
  codeResponse: null,
  setCodeResponse: (newCodeResponse) => set({ codeResponse: newCodeResponse }),
  selectedConversationId: null,
  setSelectedConversationId: (newSelectedConversationId) => set({ selectedConversationId: newSelectedConversationId })
}))

export default useStore
