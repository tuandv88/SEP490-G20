export const BASE_URL = 'http://localhost:'

export const AUTHENTICATION_ROUTERS = {
  HOME: '/',
  ABOUT: '/about',
  NOTFOUND: '*',
  THEME: '/themes',
  COURSELIST: '/courseList',
  COURSEDETAIL: '/courseDetail',
  LEARNINGSPACE: '/learningSpace'
}

export const UNAUTHENTICATION_ROUTERS = {}

export const ROUTES = {
  ...AUTHENTICATION_ROUTERS,
  ...UNAUTHENTICATION_ROUTERS,
  ...BASE_URL
}
