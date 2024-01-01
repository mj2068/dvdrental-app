<script lang="ts" setup>
import axios from 'axios';
import { useRequest } from 'vue-request';
import { useRoute } from 'vue-router';
import type { ActorRecord } from './ActorListView.vue';
import type { FilmDetailRecord } from './FilmDetailView.vue';
import { PictureOutlined } from '@ant-design/icons-vue';

interface QueryActorDetailParams {}
// not import FilmRecord from FilmList because want to practice Omit...
type FilmRecord = Omit<FilmDetailRecord, 'cast'>;
interface QueryActorDetailResult extends ActorRecord {
  films: FilmRecord[];
}

const route = useRoute();
console.log(route.params);

async function queryActor(params: QueryActorDetailParams) {
  const result = await axios.get<QueryActorDetailResult>(
    `http://localhost:8000/actor/${route.params.actorId}`,
    {
      params,
    }
  );

  return result.data;
}
const { data } = useRequest(queryActor);
</script>

<template>
  <a-descriptions
    :title="data?.full_name"
    :column="1"
    :bordered="true"
    :label-style="{ width: '200px' }"
  >
    <template #extra>
      <a-button type="primary">btn1</a-button>
    </template>
    <a-descriptions-item label="Film Count">{{
      data?.film_count
    }}</a-descriptions-item>
    <a-descriptions-item label="Appeared In">
      <p v-for="film in data?.films" :key="film.film_id">
        <router-link :to="`/film/${film.film_id}`">
          <a-avatar size="small" style="margin-right: 8px">
            <template #icon><picture-outlined /></template>
          </a-avatar>
          {{ film.title }}</router-link
        >
      </p>
    </a-descriptions-item>
  </a-descriptions>
</template>
