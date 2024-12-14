export const BASE_URL = 'http://localhost:'

export const AUTHENTICATION_ROUTERS = {
  HOME: '/',
  ABOUT: '/about',
  NOTFOUND: '*',
  ERROR: '/error',
  THEME: '/themes',
  COURSELIST: '/course-list',
  COURSEDETAIL: '/course-detail/:id',
  LEARNINGSPACE: '/learning-space/:id/lecture/:lectureId?',
  PROBLEMS: '/problems',
  CODE: '/code',
  CALLBACK: '/callback',
  SURVEY: '/survey',
  DISCUSS: '/discussions/discuss',
  DISCUSSIONDETAIL: '/discussion/:id',
  CREATEDISCUSSION: '/discussions/creatediscussion',
  USERPROFILE: '/user-profile',
  PROBLEMSPACE: '/problem-solve/:problemId',
  NOTIFICATION: '/notifications/history',
  PAYMENT: '/payment/:id',
  SILENTRENEW: '/silent-renew',
  LEADERBOARD: '/leaderboard'
}

export const UNAUTHENTICATION_ROUTERS = {}

export const ROUTES = {
  ...AUTHENTICATION_ROUTERS,
  ...UNAUTHENTICATION_ROUTERS,
  ...BASE_URL
}



