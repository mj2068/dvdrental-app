<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import axios from 'axios';
import { usePagination } from 'vue-request';
import { useRoute } from 'vue-router';

import type {
  TableColumnType,
  TablePaginationConfig,
  TableProps,
} from 'ant-design-vue';

import type {
  SorterResult,
  SortOrder,
} from 'ant-design-vue/es/table/interface';

interface QueryParams {
  [key: string]: any;
  offset?: number;
  limit?: number;
}

export interface FilmRecord {
  film_id: number;
  title: string;
  description?: string;
  release_year: number;
  rental_rate: number;
  rental_duration: number;
  replacement_cost: number;
  length: number;
  language_id: number;
  rating: MPAARating;
  special_features: string[];
  last_update: Date;
  fulltext: string;
  language: LanguageRecord;
  categories: CategoryRecord[];
}

type MPAARating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

type Language =
  | 'English'
  | 'Italian'
  | 'Japanese'
  | 'Mandarin'
  | 'French'
  | 'German';

interface LanguageRecord {
  language_id: number;
  name: Language;
  last_update: Date;
}

type Category =
  | 'Action'
  | 'Animation'
  | 'Children'
  | 'Classics'
  | 'Comedy'
  | 'Documentary'
  | 'Drama'
  | 'Family'
  | 'Foreign'
  | 'Games'
  | 'Horror'
  | 'Music'
  | 'New'
  | 'Sci-Fi'
  | 'Sports'
  | 'Travel';

interface CategoryRecord {
  category_id: number;
  name: Category;
  last_update: Date;
}

interface QueryResultFilm {
  gross: number;
  total: number;
  limit: number;
  offset: number;
  results: FilmRecord[];
}

const current = ref(1);
const pageSize = ref(10);
const currentSorter = ref<SorterResult<FilmRecord>>({});

const columns = computed<TableColumnType<FilmRecord>[]>(() =>
  [
    {
      key: 'film_id',
      dataIndex: 'film_id',
      title: 'ID',
      width: 60,
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Title',
      ellipsis: true,
      width: 200,
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Description',
      ellipsis: true,
      width: 300,
    },
    {
      key: 'release_year',
      dataIndex: 'release_year',
      title: 'Release Year',
    },
    {
      key: 'length',
      dataIndex: 'length',
      title: 'Length',
      sorter: true,
    },
    {
      key: 'rental_rate',
      dataIndex: 'rental_rate',
      title: 'Rental Rate',
      sorter: true,
    },
    {
      key: 'rental_duration',
      dataIndex: 'rental_duration',
      title: 'Rental Duration',
    },
    {
      key: 'replacement_cost',
      dataIndex: 'replacement_cost',
      title: 'Replacement Cost',
      sorter: true,
      // sortOrder: currentSorter.value.order,
    },
    {
      key: 'action',
      title: 'Action',
      width: 80,
    },
  ]
    /**
     * this map call adds the sortOrder property to each column with sorter
     * property set to `true`.
     * the reason is, i found out if you don't add sortOrder to all column with
     * sorter set to true, the ones without sortOrder wouldn't function.
     */
    // eslint-disable-next-line prettier/prettier
    .map<TableColumnType<FilmRecord>>((col: TableColumnType<FilmRecord>) => {
      if (col.sorter) {
        col.sortOrder =
          currentSorter.value.columnKey === col.key
            ? currentSorter.value.order
            : undefined;
      }
      return col;
    })
);

const route = useRoute();

onMounted(() => runWithCurrent());

async function queryData(params?: QueryParams) {
  const result = await axios.get<QueryResultFilm>(
    'http://localhost:8000/film',
    { params }
  );
  return result.data;
}

const { run, data, loading, total } = usePagination(queryData, {
  manual: true,
  pagination: {
    pageSizeKey: 'limit',
    totalKey: 'total',
  },
});

const pagination = computed<TablePaginationConfig>(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
  showTotal: (total: number, range: number[]) =>
    `共 ${total} 条中的第 ${range[0]}-${range[1]} 条`,
  showSizeChanger: true,
  showQuickJumper: true,
}));

function runWithCurrent() {
  const params: QueryParams = {
    limit: pageSize.value,
    offset: (current.value - 1) * pageSize.value,
  };

  // sorter.field always there, sorter.order
  if (currentSorter.value.order) {
    params.sortField = currentSorter.value.field;
    params.sortOrder = new Map([
      ['ascend', 1],
      ['descend', 2],
    ]).get(currentSorter.value.order);
  }

  if (route.query.actor_id) {
    params.actor_id = route.query.actor_id;
  }

  run(params);
}

const onTableChange: TableProps<FilmRecord>['onChange'] = function (
  pagination: { pageSize?: number; current?: number },
  filters,
  sorter
) {
  // console.log(pagination);
  console.log(sorter);

  currentSorter.value = sorter as SorterResult<FilmRecord>;
  current.value = pagination.current!;
  pageSize.value = pagination.pageSize!;

  runWithCurrent();
};

function sort(order: SortOrder) {
  currentSorter.value.columnKey = sortColumn.value;
  currentSorter.value.field = sortColumn.value;
  currentSorter.value.order = order;

  runWithCurrent();
}

const sortColumn = ref('');
</script>

<template>
  <a-input v-model:value="sortColumn"></a-input>
  <AButton @click="sort('ascend')" :disabled="sortColumn === ''"
    >ascend</AButton
  >
  <AButton @click="sort('descend')" :disabled="sortColumn === ''"
    >descend</AButton
  >
  <a-button @click="console.log(sortColumn)">check</a-button>
  <a-table
    :columns="columns"
    row-key="film_id"
    :dataSource="data?.results"
    :loading="loading"
    :pagination="pagination"
    @change="onTableChange"
  >
    <template #bodyCell="{ column, record, value }">
      <template v-if="column.key === 'action'">
        <span>
          <a>delete</a>
        </span>
      </template>
      <template v-else-if="column.key === 'title'">
        <router-link :to="`/film/${record.film_id}`">{{ value }}</router-link>
      </template>
    </template>
  </a-table>
</template>
