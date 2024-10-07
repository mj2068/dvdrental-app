<script lang="ts" setup>
import axios from "axios";
import { useRequest } from "vue-request";
import { useRoute } from "vue-router";
import type { ActorRecord } from "./ActorListView.vue";
import type { FilmDetailRecord } from "./FilmDetailView.vue";
import { PictureOutlined, UserOutlined } from "@ant-design/icons-vue";
import { watch } from "vue";

interface QueryActorDetailParams {}
// not import FilmRecord from FilmList because want to practice Omit...
type FilmRecord = Omit<FilmDetailRecord, "cast">;
interface QueryActorDetailResult extends ActorRecord {
  films: FilmRecord[];
}

const route = useRoute();
// console.log(route.params);

async function queryActor(params: QueryActorDetailParams) {
  const result = await axios.get<QueryActorDetailResult>(
    `/actor/${route.params.actorId}`,
    { params },
  );

  return result.data;
}
const { data, loading } = useRequest(queryActor);
watch(
  () => data.value?.full_name,
  (newV) => {
    document.title = newV + " - " + document.title;
  },
);
</script>

<template>
  <h2>Actor / Actress Detail</h2>
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
    :title="data?.full_name"
    :column="1"
    :bordered="true"
    :label-style="{ width: '200px' }"
  >
    <template #extra>
      <a-button type="primary">Edit</a-button>
    </template>
    <a-descriptions-item label="Image" :label-style="{ width: '8rem' }">
      <a-flex vertical gap="8" align="center">
        <div style="padding: 8px; background-color: #eee; border-radius: 8px">
          <UserOutlined style="font-size: 5rem; color: #bbb" />
        </div>
        <a-button size="small">Change</a-button>
      </a-flex>
    </a-descriptions-item>
    <a-descriptions-item label="Film Count" :label-style="{ width: '8rem' }">
      {{ data?.film_count }}
    </a-descriptions-item>
    <a-descriptions-item label="Appeared In" :label-style="{ width: '8rem' }">
      <a-flex gap="16" wrap="wrap">
        <span v-for="film in data?.films" :key="film.film_id">
          <router-link :to="`/film/${film.film_id}`">
            <a-avatar size="small" style="margin-right: 8px">
              <template #icon><picture-outlined /></template>
            </a-avatar>
            {{ film.title }}
          </router-link>
        </span>
      </a-flex>
    </a-descriptions-item>
  </a-descriptions>
</template>
