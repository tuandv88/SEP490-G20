import { lazy } from 'react'
import React from 'react'
import { createRouter, createRoute, createRootRoute, useNavigate } from '@tanstack/react-router'
export const DASHBOARD_PATH = '/app/dashboard'
export const COURSE_TABLE_PATH = '/app/course-table'
export const PROBLEM_TABLE_PATH = '/app/problem-table'
export const CREATE_COURSE_PATH = '/app/create-course'
export const EDIT_CURRICULUM_COURSE_PATH = '/app/edit-curriculum-course/$courseId'
export const EDIT_BASIC_COURSE_PATH = '/app/edit-basic-course/$courseId'
export const CREATE_CODE_PROBLEM_PATH = '/app/create-code-problem'
export const CREATE_PROBLEM_PATH = '/app/create-problem'
export const EDIT_COURSE_PATH = '/app/edit-course/$courseId'
export const QUIZ_MANAGEMENT_PATH = '/app/create-question'
export const CREATE_QUESTION_PATH = '/app/create-question/$quizId'
export const UPDATE_PROBLEM_PATH = '/app/update-problem'
export const UPDATE_PROBLEM_AG_PATH = '/app/update-problem/$problemId'
// export const UPDATE_PROBLEM_LECTURE_PATH = '/app/update-problem-lecture'
export const DOCUMENT_AI_TABLE_PATH = '/app/document-ai-table'
export const QUIZ_ASSESSMENT_PATH = '/app/quiz-assessment'
export const USER_TABLE_PATH = '/app/user-table'
export const USER_DETAIL_PATH = '/app/user-detail/$userId'
export const CREATE_PROBLEM_LECTURE_PATH = '/app/edit-course/$courseId/create-problem-lecture/$lectureId'
export const UPDATE_PROBLEM_LECTURE_PATH =
  '/app/update-problem-lecture/course/$courseId/lecture/$lectureId/problem/$problemId'

// Define the main root route with layout
const rootRoute = createRootRoute({
  component: lazy(() => import('@/components/public-layout'))
})

// Route cho trang đăng nhập
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazy(() => import('@/pages/Login/Login'))
})

// Route cho callback
const callbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'callback',
  component: lazy(() => import('@/oidc/Callback'))
})

const unauthorizedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'unauthorized',
  component: lazy(() => import('@/pages/Login/Unauthorized'))
})

// Route cần xác thực
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'app',
  component: lazy(() => import('@/components/layout'))
})

// Define other routes as children of the main root route
const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'dashboard',
  component: lazy(() => import('@/pages/Dashboard/dashboard'))
})

const courseTableRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'course-table',
  component: lazy(() => import('@/pages/Course/CourseTable'))
})

export const editCurriculumCourseRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'edit-curriculum-course/$courseId',
  component: lazy(() => import('@/pages/Course/EditCurriculumCourse'))
})

export const editBasicCourseRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'edit-basic-course/$courseId',
  component: lazy(() => import('@/pages/Course/EditBasicInfoCourse'))
})

const problemTableRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'problem-table',
  component: lazy(() => import('@/pages/Problem/ProblemTable'))
})

const createCourseRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'create-course',
  component: lazy(() => import('@/pages/Course/CreateCourse'))
})

const createCodeProblemRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'create-code-problem',
  component: lazy(() => import('@/pages/CodeProblem/CreateCodeProblem'))
})

const createAgProblemRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'create-problem',
  component: lazy(() => import('@/pages/Problem/ProblemAlgorithm/Create/CreateProblemAg'))
})

export const createProblemLectureRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'edit-course/$courseId/create-problem-lecture/$lectureId',
  component: lazy(() => import('@/pages/Problem/ProblemLecture/Create/CreateProblemLecture'))
})

export const quizManagementRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'create-question/$quizId',
  component: lazy(() => import('@/pages/Quiz/QuizManagement'))
})

export const updateAgProblemRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'update-problem/$problemId',
  component: lazy(() => import('@/pages/Problem/ProblemAlgorithm/Update/UpdateProblemAg'))
})

export const updateLectureProblemRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'update-problem-lecture/course/$courseId/lecture/$lectureId/problem/$problemId',
  component: lazy(() => import('@/pages/Problem/ProblemLecture/Update/UpdateProblemLec'))
})

const documentAiTableRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'document-ai-table',
  component: lazy(() => import('@/pages/Document/DocumentTable'))
})

const quizAssessmentRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'quiz-assessment',
  component: lazy(() => import('@/pages/QuizAssessment/QuizAssessment'))
})

const userTableRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'user-table',
  component: lazy(() => import('@/pages/User/UserTable'))
})

export const userDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'user-detail/$userId',
  component: lazy(() => import('@/pages/User/UserDetail'))
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  callbackRoute,
  unauthorizedRoute,
  protectedRoute.addChildren([
    dashboardRoute,
    courseTableRoute,
    createCourseRoute,
    editCurriculumCourseRoute,
    editBasicCourseRoute,
    createCodeProblemRoute,
    createProblemLectureRoute,
    updateAgProblemRoute,
    quizManagementRoute,
    problemTableRoute,
    createAgProblemRoute,
    updateLectureProblemRoute,
    documentAiTableRoute,
    quizAssessmentRoute,
    userTableRoute,
    userDetailRoute
  ])
])

// Export the routers
export const router = createRouter({ routeTree })
