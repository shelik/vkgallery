import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import GalleryList from "../components/GalleryList.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "GalleryList",
    component: GalleryList,
  },
  {
    path: "/galleries",
    name: "GalleryList",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/GalleryList.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
