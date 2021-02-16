import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Environment1View from "../views/Environment1View.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/environment-1",
    name: "Environment1",
    component: Environment1View
  },
  {
    path: "/environment-2",
    name: "Environment2",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Environment2View.vue")
  },
  {
    path: "/environment-3",
    name: "Environment3",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Environment3View.vue")
  },
  {
    path: "/environment-4",
    name: "Environment4",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Environment4View.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

(window as any).vueRouterReference = router;

export default router;
