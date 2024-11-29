import { lazy } from 'react'
import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'

// Define the main root route with layout
const rootRoute = createRootRoute({
  component: lazy(() => import('@/components/layout'))
})

// Define a separate root route for the login page without layout
const loginRootRoute = createRootRoute({
  component: lazy(() => import('@/pages/Login/Login')) // Directly load the login component
})

// Define other routes as children of the main root route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazy(() => import('@/pages/Dashboard/dashboard'))
})

const courseTableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/course-table',
  component: lazy(() => import('@/pages/Course/CourseTable'))
})

export const editCurriculumCourseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edit-curriculum-course/$courseId',
  component: lazy(() => import('@/pages/Course/EditCurriculumCourse'))
})

export const editBasicCourseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edit-basic-course/$courseId',
  component: lazy(() => import('@/pages/Course/EditBasicInfoCourse'))
})

const problemTableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/problem-table',
  component: lazy(() => import('@/pages/Problem/ProblemTable'))
})

const createCourseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-course',
  component: lazy(() => import('@/pages/Course/CreateCourse'))
})

const createCodeProblemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-code-problem',
  component: lazy(() => import('@/pages/CodeProblem/CreateCodeProblem'))
})

const createAgProblemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-problem',
  component: lazy(() => import('@/pages/Problem/ProblemAlgorithm/Create/CreateProblemAg'))
})

export const createProblemLectureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edit-course/$courseId/create-problem-lecture/$lectureId',
  component: lazy(() => import('@/pages/Problem/ProblemLecture/Create/CreateProblemLecture'))
})

export const quizManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-question/$quizId',
  component: lazy(() => import('@/pages/Quiz/QuizManagement'))
})

// // Define the login route as a child of the login root route
// const loginRoute = createRoute({
//   getParentRoute: () => loginRootRoute,
//   path: '/login',
//   component: lazy(() => import('@/pages/Login/login'))
// })

const callbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/callback',
  component: lazy(() => import('@/oidc/Callback'))
})

export const testRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test',
  component: lazy(() => import('@/pages/Test/Test'))
})

export const testDetailRoute = createRoute({
  getParentRoute: () => testRoute,
  path: '$testId',
  component: lazy(() => import('@/pages/Test/Test'))
})

export const updateAgProblemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/update-problem/$problemId',
  component: lazy(() => import('@/pages/Problem/ProblemAlgorithm/Update/UpdateProblemAg'))
})

export const updateLectureProblemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/update-problem-lecture/course/$courseId/lecture/$lectureId/problem/$problemId',
  component: lazy(() => import('@/pages/Problem/ProblemLecture/Update/UpdateProblemLec'))
})

const documentAiTableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/document-ai-table',
  component: lazy(() => import('@/pages/Document/DocumentTable'))
})

const quizAssessmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz-assessment',
  component: lazy(() => import('@/pages/QuizAssessment/QuizAssessment'))
})

const userTableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/user-table',
  component: lazy(() => import('@/pages/User/UserTable'))
})

// Create the route trees
const mainRouteTree = rootRoute.addChildren([
  indexRoute,
  courseTableRoute,
  createCourseRoute,
  createCodeProblemRoute,
  createProblemLectureRoute,
  quizManagementRoute,
  testRoute,
  createAgProblemRoute,
  updateAgProblemRoute,
  editCurriculumCourseRoute,
  editBasicCourseRoute,
  problemTableRoute,
  documentAiTableRoute,
  quizAssessmentRoute,
  callbackRoute,
  userTableRoute
])

const loginRouteTree = loginRootRoute

// Export the routers
export const mainRouter = createRouter({ routeTree: mainRouteTree })
export const loginRouter = createRouter({ routeTree: loginRouteTree })
