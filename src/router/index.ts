import FilmListView from '@/views/FilmListView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FilmDetailView from '../views/FilmDetailView.vue';
import ActorListView from '../views/ActorListView.vue';
import ActorDetailView from '../views/ActorDetailView.vue';
import RentalListView from '@/views/RentalListView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/film',
      name: 'film',
      component: FilmListView,
    },
    {
      path: '/film/:id(\\d+)',
      name: 'filmDetail',
      component: FilmDetailView,
      props: true,
    },
    {
      path: '/actor',
      name: 'actor',
      component: ActorListView,
    },
    {
      path: '/actor/:actorId(\\d+)',
      name: 'actorDetail',
      component: ActorDetailView,
    },
    {
      path: '/rental',
      name: 'rental',
      component: RentalListView,
    },
  ],
});

export default router;
