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

interface RecentRentalsResponseItem {
  rental_id: number;
  rental_date: string;
  customer_id: number;
  customer_name: string;
  film_id: number;
  film_title: string;
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
} = useRequest<OverviewResponse>(getOverview, { manual: true });
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
    { params: { start_date: "2005-1-1" } },
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
    { params: { start_date: "2005-1-1" } },
  );
  return result.data;
}
const {
  data: dailyPaymentsData,
  loading: dailyPaymentsLoading,
  run: runDailyPayments,
} = useRequest(getDailyPayments, { manual: true });

async function getRecentRentals() {
  const result = await axios.get<RecentRentalsResponseItem[]>(
    "/stats/recent-rentals",
    { params: { limit: 10 } },
  );
  return result.data;
}
const {
  data: recentRentalsData,
  loading: recentRentalsLoading,
  run: runRecentRentals,
} = useRequest(getRecentRentals, { manual: true });

onMounted(() => {
  runOverview();
  runTopFilms();
  runDailyRentals();
  runDailyPayments();
  runRecentRentals();
});
</script>

<template>
  <a-flex>
    <a-space
      direction="vertical"
      size="middle"
      style="width: 200px; font-weight: bold; padding-top: 1.5rem"
    >
      <RouterLink to="/film">Film List</RouterLink>
      <RouterLink to="/actor">Actor / Actress List</RouterLink>
      <RouterLink to="/rental">Rental List</RouterLink>
    </a-space>

    <div class="layout">
      <div
        style="
          font-size: 1.5rem;
          font-weight: 600;
          grid-column: 1/5;
          height: auto;
        "
        class="card"
      >
        Dashboard
      </div>
      <div style="display: grid" class="card card-color-1 daily-info-container">
        <a-flex
          vertical
          align="center"
          justify="center"
          style="border-bottom: 1px solid #ccc; position: relative"
        >
          <p
            style="
              margin-bottom: 0;
              width: 100%;
              position: absolute;
              left: 0;
              top: 0;
            "
            class="gray-text"
          >
            Daily Rentals
          </p>
          <a-flex align="center" style="flex-grow: 1">
            <p style="font-size: 2.5rem; font-weight: 600; margin-bottom: 0">
              {{ dailyRentalsData?.[dailyRentalsData.length - 1].rental_count }}
            </p>
          </a-flex>
        </a-flex>
        <a-flex
          vertical
          align="center"
          justify="center"
          style="position: relative"
        >
          <p
            class="gray-text"
            style="
              margin-bottom: 0;
              width: 100%;
              position: absolute;
              top: 4px;
              left: 0;
            "
          >
            Daily Payments
          </p>
          <a-flex align="center" style="flex-grow: 1">
            <p style="font-size: 2.5rem; font-weight: 600; margin-bottom: 0">
              {{
                dailyPaymentsData?.[dailyPaymentsData.length - 1].total_amount
              }}
            </p>
          </a-flex>
        </a-flex>
      </div>

      <a-flex justify="center" class="card card-color-2 overview-container">
        <ListSpaceBetween :items="overviewItems" title="Overview" />
      </a-flex>

      <a-flex justify="center" class="card card-color-3 top-rentals-container">
        <ListSpaceBetween :items="topFilmsItems" title="Top Rentals">
          <template #label="{ item }">
            <router-link :to="`/film/${item.key}`">
              {{ item.label }}
            </router-link>
          </template>
        </ListSpaceBetween>
      </a-flex>
      <a-flex
        justify="center"
        class="card card-color-4 recent-rentals-container"
      >
        <ScrollingBoard
          :texts="recentRentalsData?.map(() => '') ?? []"
          title="Recent Rentals"
        >
          <template #item="{ index }">
            <span>
              <router-link
                :to="`/customer/${recentRentalsData?.[index].customer_id}`"
              >
                {{ recentRentalsData?.[index].customer_name }}
              </router-link>
              <router-link
                :to="`/rental/${recentRentalsData?.[index].rental_id}`"
              >
                rented
              </router-link>
              <router-link :to="`/film/${recentRentalsData?.[index].film_id}`">
                {{ recentRentalsData?.[index].film_title }}
              </router-link>
            </span>
          </template>
        </ScrollingBoard>
      </a-flex>

      <a-flex
        vertical
        class="card card-color-5"
        style="grid-column: 1 / 3; height: 300px"
      >
        <p
          style="
            font-size: 1rem;
            font-weight: 600;
            text-align: center;
            width: 100%;
            margin-bottom: 0;
          "
        >
          Payments History
        </p>
        <LineChart
          v-if="dailyPaymentsData"
          :data="
            dailyPaymentsData?.map((item) => ({
              date: item.date,
              value: item.total_amount,
            })) ?? []
          "
          color="rgba(75, 192, 75, 1)"
          bgColor="rgba(75, 192, 75, 0.2)"
        />
        <a-flex v-else justify="center" align="center" style="height: 100%">
          <a-spin />
        </a-flex>
      </a-flex>
      <a-flex
        vertical
        class="card card-color-6"
        style="grid-column: 3 / 5; height: 300px"
      >
        <p
          style="
            font-size: 1rem;
            font-weight: 600;
            text-align: center;
            width: 100%;
            margin-bottom: 0;
          "
        >
          Rentals History
        </p>
        <LineChart
          v-if="dailyRentalsData"
          :data="
            dailyRentalsData?.map((item) => ({
              date: item.date,
              value: item.rental_count,
            })) ?? []
          "
        />
        <a-flex v-else justify="center" align="center" style="flex-grow: 1">
          <a-spin />
        </a-flex>
      </a-flex>
    </div>
    <!-- layout -->
  </a-flex>
</template>

<style lang="css" scoped>
.layout {
  display: grid;
  grid-template-columns: repeat(4, minmax(250px, 1fr));
  grid-gap: 1rem;
  margin: 0 auto;
  width: 100%;
}

.card {
  border-radius: 4px;
  padding: 16px;
  height: 240px;
}

/* Diverse warm color classes with 0.2 transparency */
.card-color-1 {
  background-color: rgba(255, 87, 34, 0.05);
} /* Deep Orange */
.card-color-2 {
  background-color: rgba(255, 193, 7, 0.05);
} /* Amber */
.card-color-3 {
  background-color: rgba(233, 30, 99, 0.05);
} /* Pink */
.card-color-4 {
  background-color: rgba(156, 39, 176, 0.05);
} /* Purple */
.card-color-5 {
  background-color: rgba(0, 150, 136, 0.05);
} /* Teal */
.card-color-6 {
  background-color: rgba(76, 175, 80, 0.05);
} /* Green */
</style>
