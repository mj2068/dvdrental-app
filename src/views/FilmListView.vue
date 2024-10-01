<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import axios from "axios";
import { usePagination } from "vue-request";
import { useRoute } from "vue-router";

import type {
  TableColumnsType,
  TableColumnType,
  TablePaginationConfig,
  TableProps,
} from "ant-design-vue";
import type {
  SorterResult,
  SortOrder,
} from "ant-design-vue/es/table/interface";
import type { FilmRecord, MPAARating } from "@/types/records/film";
import InputNumberRange from "@/components/InputNumberRange.vue";
import { QuestionCircleFilled } from "@ant-design/icons-vue";

interface QueryParams {
  [key: string]: any;
  offset?: number;
  limit?: number;
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
  (
    [
      {
        key: "film_id",
        dataIndex: "film_id",
        title: "ID",
        width: 60,
        sorter: true,
      },
      {
        key: "title",
        dataIndex: "title",
        title: "Title",
        ellipsis: true,
        sorter: true,
        width: "12rem",
      },
      {
        key: "description",
        dataIndex: "description",
        title: "Description",
        ellipsis: true,
        width: "12rem",
      },
      {
        key: "release_year",
        dataIndex: "release_year",
        title: "Release Year",
        sorter: true,
        width: "6rem",
      },
      {
        key: "rating",
        dataIndex: "rating",
        title: "Rating",
        sorter: true,
        width: "6rem",
      },
      {
        key: "length",
        dataIndex: "length",
        title: "Length",
        sorter: true,
        width: "6rem",
      },
      {
        key: "cast_count",
        dataIndex: "cast_count",
        title: "Cast Count",
        sorter: true,
        width: "6rem",
      },
      {
        key: "rental_rate",
        dataIndex: "rental_rate",
        title: "Rental Rate",
        sorter: true,
        width: "6rem",
      },
      {
        key: "rental_duration",
        dataIndex: "rental_duration",
        title: "Rental Duration",
        sorter: true,
        width: "6rem",
      },
      {
        key: "replacement_cost",
        dataIndex: "replacement_cost",
        title: "Replacement Cost",
        sorter: true,
        width: "8rem",
        // sortOrder: currentSorter.value.order,
      },
      {
        key: "action",
        title: "Action",
        width: "12rem",
        align: "center",
      },
    ] as TableColumnsType<FilmRecord>
  )
    /**
     * this map call adds the sortOrder property to each column with sorter
     * property set to `true`.
     * the reason is, i found out if you don't add sortOrder to all column with
     * sorter set to true, the ones without sortOrder wouldn't function.
     *
     * 2024年10月1日 15点48分：
     * this is for programmatically control sorting
     */
    .map((col: TableColumnType<FilmRecord>) => {
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
    "http://localhost:8000/film/",
    { params }
  );
  return result.data;
}

const { run, data, loading, total } = usePagination(queryData, {
  manual: true,
  pagination: {
    pageSizeKey: "limit",
    totalKey: "total",
  },
});

const pagination = computed<TablePaginationConfig>(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
  showTotal: (total: number, range: number[]) =>
    `${range[0]}-${range[1]} (Total: ${total})`,
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
      ["ascend", 1],
      ["descend", 2],
    ]).get(currentSorter.value.order);
  }

  if (route.query.actor_id) {
    params.actor_id = route.query.actor_id;
  }

  filterLengthMin.value && (params.lengthMin = filterLengthMin.value);
  filterLengthMax.value && (params.lengthMax = filterLengthMax.value);

  filterRating.value && (params.rating = filterRating.value);

  filterSearchTitle.value && (params.searchTitle = filterSearchTitle.value);

  rentalRateMin.value && (params.rentalRateMin = rentalRateMin);
  rentalRateMax.value && (params.rentalRateMax = rentalRateMax);

  replacementCostMin.value && (params.replacementCostMin = replacementCostMin);
  replacementCostMax.value && (params.replacementCostMax = replacementCostMax);

  releaseYearMin.value && (params.releaseYearMin = releaseYearMin);
  releaseYearMax.value && (params.releaseYearMax = releaseYearMax);

  run(params);
}

const onTableChange: TableProps<FilmRecord>["onChange"] = function (
  pagination: { pageSize?: number; current?: number },
  _filters,
  sorter
) {
  // console.log(pagination);
  // console.log(sorter);

  currentSorter.value = sorter as SorterResult<FilmRecord>;
  current.value = pagination.current!;
  pageSize.value = pagination.pageSize!;

  runWithCurrent();
};

function programmaticalSort(order: SortOrder) {
  currentSorter.value.columnKey = sortColumn.value;
  currentSorter.value.field = sortColumn.value;
  currentSorter.value.order = order;

  runWithCurrent();
}

const sortColumn = ref("");

const filterLengthMin = ref();
const filterLengthMax = ref();

const mpaaRatingOptions: { value: MPAARating | ""; text: string }[] = [
  { value: "G", text: "G" },
  { value: "PG", text: "PG" },
  { value: "PG-13", text: "PG-13" },
  { value: "R", text: "R" },
  { value: "NC-17", text: "NC-17" },
];
const filterRating = ref<MPAARating | "">();

const filterSearchTitle = ref<string>();

const rentalRateMin = ref();
const rentalRateMax = ref();

const replacementCostMin = ref();
const replacementCostMax = ref();

const releaseYearMin = ref();
const releaseYearMax = ref();

function clearFilters() {
  filterSearchTitle.value = "";
  filterRating.value = "";
  filterLengthMin.value = "";
  filterLengthMax.value = "";
  rentalRateMin.value = "";
  rentalRateMax.value = "";
  replacementCostMin.value = "";
  replacementCostMax.value = "";
  releaseYearMin.value = "";
  releaseYearMax.value = "";

  runWithCurrent();
}
</script>

<template>
  <a-flex class="filters-container" vertical gap="8">
    <a-flex class="filters-options-container" wrap="wrap" gap="16">
      <a-flex class="filter-option">
        <span class="filter-input-label no-shrink">Search Title: </span>
        <a-input v-model:value="filterSearchTitle" />
      </a-flex>
      <a-flex class="filter-option">
        <span class="filter-input-label">Rating: </span>
        <a-select v-model:value="filterRating" allow-clear style="flex-grow: 1">
          <a-select-option
            v-for="o in mpaaRatingOptions"
            :key="o.value"
            :value="o.value"
            >{{ o.text }}
          </a-select-option>
        </a-select>
      </a-flex>
      <a-flex class="filter-option">
        <span class="filter-input-label">Length: </span>
        <a-input-group compact style="display: flex">
          <a-input v-model:value="filterLengthMin" />
          <a-input
            placeholder="~"
            disabled
            style="pointer-events: none; text-align: center; width: 2rem"
            class="no-shrink"
          />
          <a-input v-model:value="filterLengthMax" />
        </a-input-group>
      </a-flex>
      <a-flex class="filter-option">
        <span class="filter-option-label no-shrink">Rental Rate:</span>
        <InputNumberRange
          v-model:min="rentalRateMin"
          v-model:max="rentalRateMax"
        />
      </a-flex>
      <a-flex class="filter-option">
        <span class="filter-option-label no-shrink">Replacement Cost:</span>
        <InputNumberRange
          v-model:min="replacementCostMin"
          v-model:max="replacementCostMax"
        />
      </a-flex>
      <a-flex class="filter-option">
        <span class="filter-option-label no-shrink">Release Year:</span>
        <InputNumberRange
          v-model:min="releaseYearMin"
          v-model:max="releaseYearMax"
        />
      </a-flex>
    </a-flex>

    <a-flex class="filter-buttons-container" justify="end">
      <a-space>
        <a-button @click="runWithCurrent" type="primary">Refresh</a-button>
        <a-button @click="clearFilters">Clear</a-button>
      </a-space>
    </a-flex>
  </a-flex>

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
        <a-space>
          <a style="color: darkgreen">Edit</a>
          <a-popconfirm
            ok-text="Yes"
            cancel-text="Cancel"
            @confirm="console.log"
            @cancel="console.log"
          >
            <template #icon
              ><QuestionCircleFilled style="color: red"
            /></template>
            <template #title>
              <p>Are you sure to delete this film?</p>
              <p>{{ `Title: ${record.title}` }}</p>
              <p>{{ `ID: ${record.film_id}` }}</p>
            </template>
            <a :href="'#'" style="color: red">Delete</a>
          </a-popconfirm>
        </a-space>
      </template>
      <template v-else-if="column.key === 'title'">
        <router-link :to="`/film/${record.film_id}`">{{ value }}</router-link>
      </template>
    </template>
  </a-table>
</template>

<style scoped>
.filters-container {
  margin-inline: 2rem;
}

.filter-option {
  align-items: center;
  gap: 0.5rem;
  width: 20rem;
  min-width: 12rem;
}

.filter-input-label,
.filter-option-label {
  font-weight: bold;
}
</style>
