import { lazy } from "react";

const routers = [
  {
    path: "/",
    component: lazy(() => import("@/pages/Dashboard/dashboard")),
  },
  {
    path: "/courseTable",
    component: lazy(() => import("@/pages/Course/CourseTable")),
  },
  {
    path: "/createCourse",
    component: lazy(() => import("@/pages/Course/createCourse")),
  },
];
export default routers;
