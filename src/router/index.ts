import FilmListView from "@/views/FilmListView.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import FilmDetailView from "../views/FilmDetailView.vue";
import ActorListView from "../views/ActorListView.vue";
import ActorDetailView from "../views/ActorDetailView.vue";
import RentalListView from "@/views/RentalListView.vue";
import CustomerDetailView from "@/views/CustomerDetailView.vue";
import RentalDetailView from "@/views/RentalDetailView.vue";

declare module "vue-router" {
  interface RouteMeta {
    routeTitle?: string;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/film",
      name: "film",
      component: FilmListView,
      meta: { routeTitle: "Film List" },
    },
    {
      path: "/film/:id(\\d+)",
      name: "filmDetail",
      component: FilmDetailView,
      props: true,
      meta: { routeTitle: "Film" },
    },
    {
      path: "/actor",
      name: "actor",
      component: ActorListView,

      meta: { routeTitle: "Actor / Actress List" },
    },
    {
      path: "/actor/:actorId(\\d+)",
      name: "actorDetail",
      component: ActorDetailView,
      meta: { routeTitle: "Actor / Actress" },
    },
    {
      path: "/rental",
      name: "rental",
      component: RentalListView,
      meta: { routeTitle: "Rental List" },
    },
    {
      path: "/rental/:id(\\d+)",
      name: "rentalDetail",
      component: RentalDetailView,
      meta: { routeTitle: "Rental" },
    },
    {
      path: "/customer/:id(\\d+)",
      name: "customerDetail",
      component: CustomerDetailView,
      meta: { routeTitle: "Customer" },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  document.title =
    (to.meta.routeTitle ? to.meta.routeTitle + " - " : "") +
    "Rental Manager - zizaimai";
  next();
});

export default router;
