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
  cast_count: number;
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
      key: 'rating',
      dataIndex: 'rating',
      title: 'Rating',
      sorter: true,
    },
    {
      key: 'length',
      dataIndex: 'length',
      title: 'Length',
      sorter: true,
    },
    {
      key: 'cast_count',
      dataIndex: 'cast_count',
      title: 'Cast Count',
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
      sorter: true,
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
    'http://localhost:8000/film/',
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
    `第 ${range[0]}-${range[1]} 条（共 ${total} 条）`,
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

  filterLengthMin.value && (params.lengthMin = filterLengthMin.value);
  filterLengthMax.value && (params.lengthMax = filterLengthMax.value);

  filterRating.value && (params.rating = filterRating.value);

  filterSearchTitle.value && (params.searchTitle = filterSearchTitle.value);

  run(params);
}

const onTableChange: TableProps<FilmRecord>['onChange'] = function (
  pagination: { pageSize?: number; current?: number },
  _filters,
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

const filterLengthMin = ref();
const filterLengthMax = ref();

const mpaaRatingOptions: { value: MPAARating | ''; text: string }[] = [
  { value: 'G', text: 'G' },
  { value: 'PG', text: 'PG' },
  { value: 'PG-13', text: 'PG-13' },
  { value: 'R', text: 'R' },
  { value: 'NC-17', text: 'NC-17' },
];
const filterRating = ref<MPAARating | ''>();

const filterSearchTitle = ref<string>();
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

  <a-divider></a-divider>

  <div style="display: flex; justify-content: center">
    <a-row :gutter="[24, 24]" style="width: 80%">
      <a-col :span="8">
        <span class="filter-input-label">Length: </span>
        <!-- vertical-align: middle somehow made the last span vertically align -->
        <div style="width: 75%; display: inline-block; vertical-align: middle">
          <a-input-group compact>
            <a-input
              v-model:value="filterLengthMin"
              style="width: 40%"
            ></a-input>
            <a-input
              placeholder="~"
              disabled
              style="pointer-events: none; text-align: center; width: 40px"
            ></a-input>
            <a-input
              v-model:value="filterLengthMax"
              style="width: 40%"
            ></a-input>
          </a-input-group>
        </div>
      </a-col>

      <a-col :span="8">
        <span class="filter-input-label">Rating: </span>
        <a-select v-model:value="filterRating" style="width: 70%" allow-clear>
          <ASelectOption
            v-for="o in mpaaRatingOptions"
            :value="o.value"
            :key="o.value"
            >{{ o.text }}
          </ASelectOption>
        </a-select>
      </a-col>

      <a-col :span="8">
        <span class="filter-input-label">Search Title: </span>
        <a-input v-model:value="filterSearchTitle" style="width: 70%"></a-input>
      </a-col>
    </a-row>
  </div>
  <div style="display: flex; justify-content: center">
    <a-row style="width: 80%; margin-top: 16px">
      <a-button @click="runWithCurrent">refresh</a-button>
    </a-row>
  </div>
  <a-divider></a-divider>

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

<style scoped>
span.filter-input-label {
  font-weight: bold;
}
</style>
