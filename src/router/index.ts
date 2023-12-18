import FilmListView from '@/views/FilmListView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FilmDetailView from '../views/FilmDetailView.vue';

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
  ],
});

export default router;
