<script setup lang="ts">
import axios from 'axios';
import { useRequest } from 'vue-request';
import type { ActorRecord } from './ActorListView.vue';
import type { FilmRecord } from './FilmListView.vue';
import { UserOutlined } from '@ant-design/icons-vue';

/** ************ types ************ */
interface QueryFilmDetailParams {}

export interface FilmDetailRecord extends FilmRecord {
  cast: ActorRecord[];
}

interface QueryResultFilmDetail {
  result: FilmDetailRecord;
}

// props from route(props: true)
const props = defineProps<{
  id: string;
}>();

async function getFilmDetail(params: QueryFilmDetailParams) {
  const result = await axios.get<QueryResultFilmDetail>(
    `http://localhost:8000/film/${props.id}`,
    { params }
  );
  return result.data;
}
const { data } = useRequest(getFilmDetail);
</script>

<template>
  <a-descriptions :title="data?.result.title" :bordered="true" :column="2">
    <a-descriptions-item label="Descriptsion" :span="2">{{
      data?.result.description
    }}</a-descriptions-item>
    <a-descriptions-item label="Release Year" :span="1">{{
      data?.result.release_year
    }}</a-descriptions-item>
    <a-descriptions-item label="Categories" :span="1">
      <template v-for="category in data?.result.categories">{{
        category.name
      }}</template>
    </a-descriptions-item>
    <a-descriptions-item label="Length" :span="1"
      >{{ data?.result.length }}min</a-descriptions-item
    >
    <a-descriptions-item label="Language" :span="1">{{
      data?.result.language.name
    }}</a-descriptions-item>
    <a-descriptions-item label="Rating" :span="1">{{
      data?.result.rating
    }}</a-descriptions-item>
    <a-descriptions-item label="Special Features" :span="1">
      <a-space>
        <template #split>
          <a-divider type="vertical" />
        </template>
        <template v-for="feature in data?.result.special_features">{{
          feature
        }}</template>
      </a-space>
    </a-descriptions-item>
    <a-descriptions-item
      label="Cast"
      :span="2"
      :content-style="{ display: 'block' }"
    >
      <p v-for="member in data?.result.cast" :key="member.actor_id">
        <router-link :to="`/actor/${member.actor_id}`">
          <a-avatar style="margin-right: 8px" size="small">
            <template v-slot:icon><user-outlined /></template>
          </a-avatar>
          {{ member.full_name }}</router-link
        >
      </p>
    </a-descriptions-item>
    <a-descriptions-item label="fulltext" :span="2">{{
      data?.result.fulltext
    }}</a-descriptions-item>
  </a-descriptions>
</template>
