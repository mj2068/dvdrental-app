<script setup lang="ts">
import useGlobalStore from "@/stores/global";
import { useRequest } from "vue-request";
import axios from "axios";

import type { ListItem } from "@/components/ListSpaceBetween.vue";

interface OverviewResponse {
  total_customers: number;
  total_films: number;
  total_actors: number;
  total_rentals: number;
  total_inventory: number;
}

interface TopFilmsResponseItem {
  film_id: number;
  title: string;
  rental_count: number;
}

interface DailyRentalsResponseItem {
  date: string;
  rental_count: number;
}

interface DailyPaymentsResponseItem {
  date: string;
  total_amount: number;
}

const globalStore = useGlobalStore();

async function getOverview() {
  const result = await axios.get<OverviewResponse>("/stats/overview");
  return result.data;
}
const {
  data: overviewData,
  loading: overviewLoading,
  run: runOverview,
} = useRequest<OverviewResponse>(getOverview, {
  manual: true,
});
const overviewItems = computed<ListItem[]>(() => {
  if (!overviewData.value) return [];
  return [
    {
      key: "total_customers",
      label: "Customers",
      content: overviewData.value.total_customers,
    },
    {
      key: "total_films",
      label: "Films",
      content: overviewData.value.total_films,
    },
    {
      key: "total_actors",
      label: "Actors",
      content: overviewData.value.total_actors,
    },
    {
      key: "total_rentals",
      label: "Rentals",
      content: overviewData.value.total_rentals,
    },
    {
      key: "total_inventory",
      label: "Inventory",
      content: overviewData.value.total_inventory,
    },
  ];
});

async function getTopFilms() {
  const result = await axios.get<TopFilmsResponseItem[]>(
    "/stats/top-rented-films",
  );
  return result.data;
}
const {
  data: topFilmsData,
  loading: topFilmsLoading,
  run: runTopFilms,
} = useRequest(getTopFilms, { manual: true });
const topFilmsItems = computed<ListItem[]>(() => {
  if (!topFilmsData.value) return [];
  return topFilmsData.value.slice(0, 5).map((film) => ({
    key: film.film_id.toString(),
    label: film.title,
    content: film.rental_count,
  }));
});

async function getDailyRentals() {
  const result = await axios.get<DailyRentalsResponseItem[]>(
    "/stats/daily-rentals",
    {
      params: {
        start_date: "2005-1-1",
      },
    },
  );
  return result.data;
}
const {
  data: dailyRentalsData,
  loading: dailyRentalsLoading,
  run: runDailyRentals,
} = useRequest(getDailyRentals, { manual: true });

async function getDailyPayments() {
  const result = await axios.get<DailyPaymentsResponseItem[]>(
    "/stats/daily-payments",
    {
      params: {
        start_date: "2005-1-1",
      },
    },
  );
  return result.data;
}
const {
  data: dailyPaymentsData,
  loading: dailyPaymentsLoading,
  run: runDailyPayments,
} = useRequest(getDailyPayments, { manual: true });

onMounted(() => {
  runOverview();
  runTopFilms();
  runDailyRentals();
  runDailyPayments();
});
</script>

<template>
  <a-flex vertical align="center">
    <a-space style="font-size: 1.1rem; font-weight: 600">
      <template #split>
        <a-divider type="vertical" />
      </template>
      <RouterLink to="/film">Film List</RouterLink>
      <RouterLink to="/actor">Actor / Actress List</RouterLink>
      <RouterLink to="/rental">Rental List</RouterLink>
    </a-space>

    <div class="layout">
      <a-flex justify="center">
        <h2>
          {{ dailyRentalsData?.[dailyRentalsData.length - 1].rental_count }}
        </h2>
      </a-flex>
      <a-flex justify="center">
        <h2>
          {{ dailyPaymentsData?.[dailyPaymentsData.length - 1].total_amount }}
        </h2>
      </a-flex>
      <a-flex justify="center">
        <ListSpaceBetween :items="overviewItems" title="Overview" />
      </a-flex>
      <a-flex justify="center">
        <ListSpaceBetween :items="topFilmsItems" title="Top Film Rentals">
          <template #label="{ item }">
            <router-link :to="`/film/${item.key}`">
              {{ item.label }}
            </router-link>
          </template>
        </ListSpaceBetween>
      </a-flex>
    </div>
  </a-flex>
</template>

<style lang="css" scoped>
.layout {
  display: grid;
  grid-template-columns: v-bind(
    'globalStore.isMinWidth768Px ? "1fr 1fr" : "1fr 1fr"'
  );
  width: 100%;
  grid-gap: 1rem;
}
</style>
