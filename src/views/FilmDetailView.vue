<script setup lang="ts">
import axios from "axios";
import { useRequest } from "vue-request";
import type { ActorRecord } from "./ActorListView.vue";
import type { FilmRecord } from "@/types/records/film";
import { UserOutlined } from "@ant-design/icons-vue";
import useGlobalStore from "@/stores/global";

/** ************ types ************ */
interface QueryFilmDetailParams {}

export interface FilmDetailRecord extends FilmRecord {
  cast: ActorRecord[];
}

// props from route(props: true)
const props = defineProps<{
  id: string;
}>();

async function getFilmDetail(params: QueryFilmDetailParams) {
  const result = await axios.get<FilmDetailRecord>(`/film/${props.id}`, {
    params,
  });
  return result.data;
}

const { data, loading } = useRequest(getFilmDetail);
watch(
  () => data.value?.title,
  (newV) => {
    document.title = newV + " - " + document.title;
  },
);

const globalStore = useGlobalStore();
const computedColumn = computed(() => (globalStore.isMinWidth768Px ? 2 : 1));
</script>

<template>
  <h2>Film Detail</h2>
  <a-flex
    v-if="loading"
    align="center"
    justify="center"
    style="
      margin-top: 4rem;
      min-height: 300px;
      background-color: rgba(220 220 220 / 0.1);
      border-radius: 8px;
      border: 1px solid rgba(200 200 200 / 0.3);
    "
  >
    <a-spin />
  </a-flex>
  <a-descriptions
    v-else
    :title="data?.title"
    :bordered="true"
    :column="computedColumn"
    :label-style="{ width: '8rem' }"
  >
    <template #extra>
      <a-button type="primary">Edit</a-button>
    </template>
    <a-descriptions-item
      label="Image"
      :span="computedColumn"
    >
      <a-flex vertical gap="8" align="center">
        <a-skeleton-image />
        <a-button size="small">Change</a-button>
      </a-flex>
    </a-descriptions-item>
    <a-descriptions-item label="Description" :span="computedColumn">
      {{ data?.description }}
    </a-descriptions-item>
    <a-descriptions-item label="Cast" :span="computedColumn">
      <a-flex gap="16" wrap="wrap">
        <span v-for="member in data?.cast" :key="member.actor_id">
          <router-link :to="`/actor/${member.actor_id}`">
            <a-avatar style="margin-right: 4px" size="small">
              <template v-slot:icon><user-outlined /></template>
            </a-avatar>
            {{ member.full_name }}
          </router-link>
        </span>
      </a-flex>
    </a-descriptions-item>
    <a-descriptions-item label="Release Year">
      {{ data?.release_year }}
    </a-descriptions-item>
    <a-descriptions-item label="Categories">
      <template v-for="category in data?.categories">
        {{ category.name }}
      </template>
    </a-descriptions-item>
    <a-descriptions-item label="Length">
      {{ data?.length }}min
    </a-descriptions-item>
    <a-descriptions-item label="Language">
      {{ data?.language.name }}
    </a-descriptions-item>
    <a-descriptions-item label="Rating">
      {{ data?.rating }}
    </a-descriptions-item>
    <a-descriptions-item label="Special Features">
      <a-space>
        <template #split>
          <a-divider type="vertical" />
        </template>
        <template v-for="feature in data?.special_features">
          {{ feature }}
        </template>
      </a-space>
    </a-descriptions-item>
    <a-descriptions-item label="Keywords" :span="computedColumn">
      <a-flex gap="8" wrap="wrap">
        <a-tag
          v-for="(item, index) in data?.fulltext.split(' ').map((s) => {
            const match = s.match(/'(.*)'/);
            // console.log(match);
            return match;
          })"
          :key="index"
          :color="
            ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'][
              Math.floor(Math.random() * 7)
            ]
          "
          :bordered="false"
        >
          {{ item?.[1] }}
        </a-tag>
      </a-flex>
    </a-descriptions-item>
  </a-descriptions>
</template>

<style scoped></style>
