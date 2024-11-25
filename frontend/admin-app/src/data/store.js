import { create } from 'zustand'

export const useStore = create((set) => ({
  courseIdToBack: null,
  setCourseIdToBack: (courseId) => set({ courseIdToBack: courseId }),
  quizIdToCreateProblem: null,
  setQuizIdToCreateProblem: (quizId) => set({ quizIdToCreateProblem: quizId }),
}))
