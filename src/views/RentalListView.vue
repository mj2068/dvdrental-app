<script setup lang="ts">
import type { TableColumnType, TableProps } from 'ant-design-vue';
import axios from 'axios';
import { usePagination } from 'vue-request';
import type { FilmRecord } from './FilmListView.vue';

interface RentalsQueryParams {
  customerId?: number;
  staffId?: number;
  filmId?: number;
  storeId?: number;
  isReturned?: boolean;
  isPaid?: boolean;
  returnStart?: Date;
  returnEnd?: Date;
  rentalStart?: Date;
  rentalEnd?: Date;
  page?: number;
  size?: number;
  sorts?: string[];
}

interface CustomerRecord {
  id: number;
  active: number;
  activebool: boolean;
  // implement later :p
  address: any;
  address_id: number;
  create_date: Date;
  email: string;
  last_name: string;
  first_name: string;
  last_update: Date;
  store_id: number;
}

interface InventoryRecord {
  id: number;
  film_id: number;
  film: FilmRecord;
  last_update: Date;
  // implatement later
  store: any;
  store_id: number;
}

interface PaymentRecord {}

interface StaffRecord {
  active: boolean;
  // implement later
  address: any;
  address_id: number;
  email: string;
  first_name: string;
  last_name: string;
  id: number;
  last_update: Date;
  password: string;
  store_id: number;
  username: string;
}

interface RentalRecord {
  id: number;
  customer_id: number;
  customer: CustomerRecord;
  inventory_id: number;
  inventory: InventoryRecord;
  last_update: Date;
  payments: PaymentRecord[];
  rental_date: Date;
  return_date: Date;
  staff_id: number;
  staff: StaffRecord;
}

interface RentalsQueryResult {
  data: RentalRecord[];
  gross: number;
  page: number;
  pages: number;
  size: number;
  total: number;
}

const columns: TableColumnType<RentalRecord>[] = [
  {
    key: 'rental_id',
    dataIndex: 'id',
    title: 'Id',
    width: 80,
    sorter: { multiple: 1 },
  },
  {
    key: 'customer_name',
    title: 'Customer',
  },
  {
    key: 'inventory_film_title',
    dataIndex: ['inventory', 'film', 'title'],
    title: 'Film',
    width: 200,
  },
  {
    key: 'inventory_id',
    dataIndex: 'inventory_id',
    title: 'Inventory Id',
    sorter: { multiple: 2 },
  },
  {
    key: 'rental_date',
    dataIndex: 'rental_date',
    title: 'Rental Date',
    sorter: { multiple: 3 },
  },
  {
    key: 'return_date',
    dataIndex: 'return_date',
    title: 'Return Date',
    sorter: { multiple: 4 },
  },
  {
    key: 'payments',
    title: 'Payments',
  },
  {
    key: 'inventory_store_id',
    dataIndex: ['inventory', 'store_id'],
    title: 'Store Id',
  },
  { key: 'staff_name', title: 'Staff' },
];

async function queryRentals(params?: RentalsQueryParams | URLSearchParams) {
  const result = await axios.get<RentalsQueryResult>('/rental', { params });
  return result.data;
}

const { run, data, pageSize, current, total, loading } = usePagination(
  queryRentals,
  {
    pagination: {
      currentKey: 'page',
      pageSizeKey: 'size',
      totalKey: 'total',
      totalPageKey: 'pages',
    },
  }
);

const onTableChange: TableProps<RentalRecord>['onChange'] = function (
  pagination: { pageSize?: number; current?: number },
  _filters,
  sorter
) {
  const sorts = [];
  if (sorter) {
    if (Array.isArray(sorter)) {
      for (const s of sorter) {
        sorts.push(`${s.columnKey},${s.order === 'ascend' ? '0' : '1'}`);
      }
    } else {
      if (sorter.column) {
        sorts.push(
          `${sorter.columnKey},${sorter.order === 'ascend' ? '0' : '1'}`
        );
      }
    }
  }

  run({ page: pagination.current, size: pagination.pageSize, sorts });
};
</script>

<template>
  <a-divider></a-divider>
  <a-table
    :columns="columns"
    row_key="id"
    :data-source="data?.data"
    :loading="loading"
    :pagination="{
      current,
      pageSize,
      total,
      showQuickJumper: true,
    }"
    v-on:change="onTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'customer_name'">
        <router-link :to="`/customer/${record.customer.id}`"
          >{{ record.customer.first_name }}
          {{ record.customer.last_name }}
        </router-link>
      </template>
      <template v-if="column.key === 'inventory_film_title'"
        ><router-link :to="`/film/${record.inventory.film_id}`">{{
          record.inventory.film.title
        }}</router-link></template
      >
      <template v-if="column.key === 'staff_name'"
        ><router-link :to="`/staff/${record.staff.id}`"
          >{{ record.staff.first_name }}
          {{ record.staff.last_name }}</router-link
        ></template
      >
    </template>
  </a-table>
</template>
