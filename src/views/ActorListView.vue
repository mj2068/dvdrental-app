<script setup lang="ts">
import type {
  AutoCompleteProps,
  TableColumnType,
  TableProps,
} from "ant-design-vue";
import type { DefaultOptionType, LabeledValue } from "ant-design-vue/es/select";
import type { SorterResult } from "ant-design-vue/es/table/interface";
import axios from "axios";
import { computed, ref } from "vue";
import { usePagination } from "vue-request";
import { QuestionCircleTwoTone } from "@ant-design/icons-vue";

export interface ActorRecord {
  actor_id: number;
  first_name: string;
  last_name: string;
  last_update: Date;
  full_name: string;
  film_count: number;
}

interface ActorQueryParams {
  current: number;
  pageSize: number;
  [key: string]: any;
}

interface ActorQueryResult {
  results: ActorRecord[];
  current: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

const columns = computed<TableColumnType<ActorRecord>[]>(() => {
  return [
    {
      key: "actor_id",
      title: "ID",
      dataIndex: "actor_id",
      sorter: true,
      align: "center",
      width: "6rem",
    },
    {
      key: "first_name",
      title: "First Name",
      dataIndex: "first_name",
      sorter: true,
      customCell: () => ({ colspan: 2, align: "center" }),
      width: "12rem",
    },
    {
      key: "last_name",
      title: "Last Name",
      dataIndex: "last_name",
      sorter: true,
      customCell: () => ({ colspan: 0 }),
      width: "12rem",
    },
    // {
    //   key: 'name',
    //   title: 'Name',
    //   // dataIndex: 'first_name',
    //   customRender({ record }) {
    //     return record.first_name + ' ' + record.last_name;
    //   },
    //   sorter: true,
    // },
    {
      key: "film_count",
      title: "Film Count",
      dataIndex: "film_count",
      align: "center",
      sorter: true,
      width: "8rem",
    },
    {
      key: "last_update",
      title: "Last Update",
      dataIndex: "last_update",
      sorter: true,
      align: "center",
    },
    {
      key: "action",
      title: "Action",
      align: "center",
      customCell: () => ({ align: "right" }),
      width: "10rem",
    },
  ];
});

async function queryActor(params: ActorQueryParams) {
  const result = await axios.get<ActorQueryResult>("/actor", { params });
  return result.data;
}

const { run, data, current, pageSize, total } = usePagination(queryActor, {
  pagination: {},
});

const onTableChange: TableProps<ActorRecord>["onChange"] = function (
  pagination: { current?: number; pageSize?: number },
  _filters,
  sorter
) {
  // changePagination(pagination.current!, pagination.pageSize!);

  // console.log(sorter);
  run({
    current: pagination.current!,
    pageSize: pagination.pageSize!,
    sortField: (sorter as SorterResult<ActorRecord>).field,
    sortOrder: new Map([
      ["ascend", 1],
      ["descend", 2],
    ]).get((sorter as SorterResult<ActorRecord>).order!),
    searchName: actorNameSearchFilter.value || undefined,
    filmCountMin: filmCountMin.value || undefined,
    filmCountMax: filmCountMax.value || undefined,
  });
};

function onFiltersRefresh() {
  run({
    current: current.value,
    pageSize: pageSize.value,
    searchName: actorNameSearchFilter.value || undefined,
    filmCountMin: filmCountMin.value || undefined,
    filmCountMax: filmCountMax.value || undefined,
  });
}

function onClearFilters() {
  actorNameSearchFilter.value = "";
  actorNameSearchResult.value = [];
  filmCountMin.value = "";
  filmCountMax.value = "";
}

const actorNameSearchFilter = ref<string>();
const actorNameSearchResult = ref<AutoCompleteProps["options"]>([]);
let actorNameSearchTimerID: number | null = null;
function onActorNameFilterSearch(value: string) {
  if (!value) {
    actorNameSearchResult.value = [];
    return;
  }

  if (actorNameSearchTimerID) {
    clearTimeout(actorNameSearchTimerID);
    actorNameSearchTimerID = null;
  }

  async function find() {
    const result = await axios.get<string[]>("/actor/actor_search", {
      params: { search_phrase: value || null },
    });
    if (result.data) {
      actorNameSearchResult.value = result.data.map((name) => ({
        value: name,
        label: name,
      }));
    }
  }

  // debouncing timer
  actorNameSearchTimerID = setTimeout(find, 300);
}

const onActorNameFilterSelect: AutoCompleteProps["onSelect"] = function (
  _value: string | number | LabeledValue,
  option: DefaultOptionType
) {
  // once a value is selected, make the options list only has selected one
  actorNameSearchResult.value = [option];
};

const filmCountMin = ref();
const filmCountMax = ref();
</script>

<template>
  <a-flex class="filters-container" vertical gap="8">
    <a-flex class="filter-options-container" wrap="wrap" gap="16">
      <a-flex class="filter-option">
        <span class="filter-input-label">Search Name:</span>
        <a-auto-complete
          :options="actorNameSearchResult"
          v-model:value="actorNameSearchFilter"
          @search="onActorNameFilterSearch"
          @select="onActorNameFilterSelect"
          style="min-width: 12rem; flex-grow: 1"
        />
      </a-flex>
      <a-flex class="filter-option">
        <span class="filter-input-label no-shrink">Film Count Range:</span>
        <InputNumberRange
          v-model:min="filmCountMin"
          v-model:max="filmCountMax"
        />
      </a-flex>
    </a-flex>

    <a-flex class="filter-buttons" justify="end">
      <a-space>
        <a-button @click="onFiltersRefresh" type="primary">Refresh</a-button>
        <a-button @click="onClearFilters">Clear</a-button>
      </a-space>
    </a-flex>
  </a-flex>

  <a-divider />

  <a-table
    v-bind:data-source="data?.results"
    :columns="columns"
    :pagination="{
      current,
      pageSize,
      total,
      showTotal(total, range) {
        return `${range[0]}-${range[1]} (Total: ${total})`;
      },
    }"
    v-on:change="onTableChange"
  >
    <template v-slot:bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a-space>
          <a style="color: darkgreen">Edit</a>
          <a-popconfirm
            placement="topRight"
            ok-text="Yes"
            cancel-text="Cancel"
            @confirm="console.log"
            @cancel="console.log"
          >
            <template #icon>
              <question-circle-two-tone two-tone-color="red" />
            </template>
            <template #title>
              <p>Confirm DELETE?</p>
              <p>{{ `${record.full_name}` }}</p>
              <p>{{ `ID: ${record.actor_id}` }}</p>
            </template>
            <a :href="'#'" style="color: red">Delete</a>
          </a-popconfirm>
        </a-space>
      </template>
      <template v-else-if="column.key === 'first_name'">
        <router-link :to="`/actor/${record.actor_id}`"
          >{{ record.first_name }} {{ record.last_name }}</router-link
        >
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
}

.filter-input-label {
  font-weight: bold;
}
</style>
