<script setup lang="ts">
import type { TableColumnType, TableProps } from 'ant-design-vue';
import type { SorterResult } from 'ant-design-vue/es/table/interface';
import axios from 'axios';
import { computed } from 'vue';
import { usePagination } from 'vue-request';

interface ActorRecord {
  actor_id: number;
  first_name: string;
  last_name: string;
  last_update: string;
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
      key: 'actor_id',
      title: 'Id',
      dataIndex: 'actor_id',
      sorter: true,
    },
    {
      key: 'first_name',
      title: 'First Name',
      dataIndex: 'first_name',
      sorter: true,
      customCell: () => ({ colspan: 2, align: 'center' }),
    },
    {
      key: 'last_name',
      title: 'Last Name',
      dataIndex: 'last_name',
      sorter: true,
      customCell: () => ({ colspan: 0 }),
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
      key: 'last_update',
      title: 'Last Update',
      dataIndex: 'last_update',
      sorter: true,
    },
    {
      key: 'action',
      title: 'Action',
      align: 'center',
      customCell: () => ({ align: 'right' }),
    },
  ];
});

async function queryActor(params: ActorQueryParams) {
  const result = await axios.get<ActorQueryResult>(
    'http://localhost:8000/actor',
    { params }
  );
  return result.data;
}

const { run, data, current, pageSize, total } = usePagination(queryActor, {
  pagination: {},
});

const onTableChange: TableProps<ActorRecord>['onChange'] = function (
  pagination: { current?: number; pageSize?: number },
  filters,
  sorter
) {
  // changePagination(pagination.current!, pagination.pageSize!);

  console.log(sorter);
  run({
    current: pagination.current!,
    pageSize: pagination.pageSize!,
    sortField: (sorter as SorterResult<ActorRecord>).field,
    sortOrder: new Map([
      ['ascend', 1],
      ['descend', 2],
    ]).get((sorter as SorterResult<ActorRecord>).order!),
  });
};
</script>

<template>
  <a-table
    v-bind:data-source="data?.results"
    :columns="columns"
    :pagination="{
      current,
      pageSize,
      total,
      showTotal(total, range) {
        return `${range[0]}-${range[1]} / ${total}`;
      },
    }"
    v-on:change="onTableChange"
  >
    <template v-slot:bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">xxx</template>
      <template v-else-if="column.key === 'first_name'">
        <router-link :to="`/actor/${record.actor_id}`"
          >{{ record.first_name }} {{ record.last_name }}</router-link
        >
      </template>
    </template>
  </a-table>
</template>
