export const BASE_URL = 'http://localhost:'

export const AUTHENTICATION_ROUTERS = {
  HOME: '/',
  ABOUT: '/about',
  NOTFOUND: '*',
  ERROR: '/error',
  THEME: '/themes',
  COURSELIST: '/courseList',
  COURSEDETAIL: '/courseDetail/:id',
  LEARNINGSPACE: '/learning-space/:id/lecture/:lectureId?',
  PROBLEMS: '/problems',
  CODE: '/code',
  CALLBACK: '/callback',
  DISCUSS: '/discussions/discuss',
  DISCUSSIONDETAIL: '/discussion/:id'
}

export const UNAUTHENTICATION_ROUTERS = {}

export const ROUTES = {
  ...AUTHENTICATION_ROUTERS,
  ...UNAUTHENTICATION_ROUTERS,
  ...BASE_URL
}



