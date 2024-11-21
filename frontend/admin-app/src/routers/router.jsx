import { lazy } from 'react'
import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'

const rootRoute = createRootRoute({
  component: lazy(() => import('@/components/layout'))
})

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

const editCourseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edit-course',
  component: lazy(() => import('@/pages/Course/EditCourse'))
})

// const errorTestRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/error-test',
//   component: lazy(() => import('@/components/error-test'))
// })

// const loadingTestRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/loading-test',
//   component: lazy(() => import('@/components/loading-test'))
// })

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

const createProblemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-problem',
  component: lazy(() => import('@/pages/Problem/CreateProblem'))
})

const createCourseTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-test',
  component: lazy(() => import('@/pages/CourseTest/Primary'))
})

const routeTree = rootRoute.addChildren([indexRoute, courseTableRoute, createCourseRoute, createCodeProblemRoute, editCourseRoute,createProblemRoute, createCourseTestRoute])

export const router = createRouter({ routeTree })
