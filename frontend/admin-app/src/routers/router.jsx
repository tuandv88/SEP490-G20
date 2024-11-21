import { lazy } from 'react'
import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'

// Define the main root route with layout
const rootRoute = createRootRoute({
  component: lazy(() => import('@/components/layout'))
})

// Define a separate root route for the login page without layout
const loginRootRoute = createRootRoute({
  component: lazy(() => import('@/pages/Login/login')) // Directly load the login component
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

const editCourseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edit-course',
  component: lazy(() => import('@/pages/Course/EditCourse'))
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

const createProblemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-problem',
  component: lazy(() => import('@/pages/Problem/CreateProblem'))
})

// Define the login route as a child of the login root route
const loginRoute = createRoute({
  getParentRoute: () => loginRootRoute,
  path: '/login',
  component: lazy(() => import('@/pages/Login/login'))
})

// Create the route trees
const mainRouteTree = rootRoute.addChildren([
  indexRoute,
  courseTableRoute,
  createCourseRoute,
  createCodeProblemRoute,
  editCourseRoute,
  createProblemRoute
])

const loginRouteTree = loginRootRoute.addChildren([loginRoute])

// Export the routers
export const mainRouter = createRouter({ routeTree: mainRouteTree })
export const loginRouter = createRouter({ routeTree: loginRouteTree })
