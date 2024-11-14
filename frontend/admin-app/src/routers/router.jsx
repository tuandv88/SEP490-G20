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

const errorTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/error-test',
  component: lazy(() => import('@/components/error-test'))
})

const loadingTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/loading-test',
  component: lazy(() => import('@/components/loading-test'))
})

const createCourseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-course',
  component: lazy(() => import('@/pages/Course/CreateCourse'))
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loadingTestRoute,
  courseTableRoute,
  errorTestRoute,
  createCourseRoute
])

export const router = createRouter({ routeTree })
