<script setup lang="ts">
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { usePagination, useRequest } from 'vue-request';
import dayjs from 'dayjs';

import type {
  AutoCompleteProps,
  RadioGroupProps,
  SelectProps,
  TableColumnType,
  TableProps,
} from 'ant-design-vue';
import type { FilmRecord } from './FilmListView.vue';
import type { Dayjs } from 'dayjs';
import type {
  LabeledValue,
  DefaultOptionType,
  SelectValue,
} from 'ant-design-vue/es/select';

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

interface PaymentRecord {
  amount: number;
  customer: CustomerRecord;
  customer_id: number;
  id: number;
  payment_date: Date;
  rental_id: number;
  staff: StaffRecord;
  staff_id: number;
}

interface StaffRecord {
  active: boolean;
  address_id: number;
  email: string;
  first_name: string;
  last_name: string;
  id: number;
  last_update: Date;
  password: string;
  store_id: number;
  username: string;

  address: AddressRecord | null;
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

export interface AddressRecord {}

interface RentalsQueryResult {
  data: RentalRecord[];
  gross: number;
  page: number;
  pages: number;
  size: number;
  total: number;
}

interface StaffsQueryResult {
  data: StaffRecord[];
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
    key: 'customer_last_name',
    title: 'Customer',
    sorter: { multiple: 8 },
    width: 240,
  },
  {
    key: 'title',
    dataIndex: ['inventory', 'film', 'title'],
    title: 'Film',
    sorter: { multiple: 7 },
    width: 240,
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
    sorter: { multiple: 5 },
  },
  {
    key: 'store_id',
    dataIndex: ['inventory', 'store_id'],
    title: 'Store Id',
    sorter: { multiple: 6 },
  },
  { key: 'staff_name', title: 'Staff' },
];

onMounted(function () {
  console.log('RentalListView - onMounted');

  // get staffs for the filter form
  staffsRequest.run();
});

async function queryRentals(params?: RentalsQueryParams) {
  const result = await axios.get<RentalsQueryResult>('/rental', { params });
  return result.data;
}

const { run, data, loading, pageSize, current, total, totalPage } =
  usePagination(queryRentals, {
    pagination: {
      currentKey: 'page',
      pageSizeKey: 'size',
      totalKey: 'total',
      totalPageKey: 'pages',
    },
    onAfter(_params) {
      /* ! DON'T EVER MODIFY `current` or `pageSize` here.
       * vue-request monitors them to trigger query.
       * modify them will risk infinite loop.
       *
       * 2024年1月4日 13点14分:
       * after some research, there's no other way. have to change `current`
       * here. so must make the logic and checks impeccable
       */
      if (
        // total return 0 if no data found
        total.value !== 0 &&
        // same idea, totalPage(pages) is 0 if and only if there is no data
        totalPage.value !== 0 &&
        // and current is greater than totalPage
        current.value > totalPage.value
      ) {
        // only then change `current` and let vue-request refresh
        current.value = 1;
      }
    },
  });

const sorts = ref<string[]>([]);
const onTableChange: TableProps<RentalRecord>['onChange'] = function (
  pagination: { pageSize?: number; current?: number },
  _filters,
  sorter
) {
  console.log(pagination);

  if (sorter) {
    sorts.value = [];
    if (!Array.isArray(sorter)) {
      if (sorter.column) {
        sorts.value.push(
          `${sorter.columnKey},${sorter.order === 'ascend' ? '0' : '1'}`
        );
      } else {
        sorts.value = [];
      }
    } else {
      for (const s of sorter) {
        sorts.value.push(`${s.columnKey},${s.order === 'ascend' ? '0' : '1'}`);
      }
    }
  }

  if (pagination.current) current.value = pagination.current;
  if (pagination.pageSize) pageSize.value = pagination.pageSize;

  runToRefresh();
};

function sumArrayToFixed(arrayNum: number[], precision: number = 2): string {
  return arrayNum.reduce((prev, curr) => prev + curr).toFixed(precision);
}

function runToRefresh() {
  run({
    page: current.value,
    size: pageSize.value,
    sorts: sorts.value,
    rentalStart: rentalDateRange.value?.[0]?.toDate(),
    rentalEnd: rentalDateRange.value?.[1]?.toDate(),
    returnStart: returnDateRange.value?.[0]?.toDate(),
    returnEnd: returnDateRange.value?.[1]?.toDate(),
    isReturned: isReturned.value,
    isPaid: isPaid.value,
    staffId: staffsFilterValue.value,
  });
}

type DatetimeRange = [Dayjs, Dayjs];

const rentalDateRange = ref<DatetimeRange>();
const returnDateRange = ref<DatetimeRange>();

const isReturnedFilterOptions: RadioGroupProps['options'] = [
  { label: 'All', value: undefined },
  { label: 'Returned', value: true },
  { label: 'Not returned', value: false },
];
const isReturned = ref<boolean | undefined>();

const isPaidFilterOptions: RadioGroupProps['options'] = [
  { label: 'All', value: undefined },
  { label: 'Paid', value: true },
  { label: 'Not paid', value: false },
];
const isPaid = ref<boolean | undefined>();

async function getStaffs(params?: any) {
  const result = await axios.get<StaffsQueryResult>('/staff', { params });
  return result.data;
}

const staffsRequest = useRequest(getStaffs, { manual: true });

const staffsFilterOptions = computed<SelectProps['options']>(() =>
  staffsRequest.data.value?.data.map((staff) => ({
    label: `${staff.first_name} ${staff.last_name}`,
    value: staff.id,
  }))
);
const staffsFilterValue = ref<number>();

function filterOptionsByLabel(input: string, option: any) {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const filmTitleFilterOptions = ref<AutoCompleteProps['options']>([]);
let filmTitleFilterSearchTimerId: number | null = null;
function onFilmTitleFilterSearch(value: string) {
  console.log(value);
  if (!value) {
    filmTitleFilterOptions.value = [];
    return;
  }
  if (filmTitleFilterSearchTimerId) {
    clearTimeout(filmTitleFilterSearchTimerId);
    filmTitleFilterSearchTimerId = null;
  }

  async function find() {
    /* 2024年1月6日 02点38分：
     * HAHAHA!!! i just realized this is so stupid...
     * here i make a request to the backend to get a list of film titles.
     * but this is really really stupid, it's only for practice purposes.
     * no need to request the whole list every time the input changes, just
     * store the list onec, and filter in the frontend, like the staff form.
     * and maybe i wanted to do this because i saw ant design example using
     * taobao api to search, but that's because taobao backend provided a good
     * and useful product title keyword filtering/suggestion api, and that list
     * is probably like billions long...
     */
    const result = await axios.get<string[]>('/film_search', {
      params: { title: value || null },
    });
    // console.log(result.data);
    if (result.data) {
      filmTitleFilterOptions.value = result.data.map((title) => ({
        value: title,
        label: title,
      }));
    }
  }
  filmTitleFilterSearchTimerId = setTimeout(find, 300);
}

const onFilmTitleFilterSelect: AutoCompleteProps['onSelect'] = function (
  _value: string | number | LabeledValue,
  option: DefaultOptionType
) {
  filmTitleFilterOptions.value = [option];
};

const onFilmTitleFilterChange: AutoCompleteProps['onChange'] = function (
  value
) {
  if (value) filmTitleFilterOptions.value = [];
};

function test2() {}
</script>

<template>
  <a-divider></a-divider>

  <div style="display: flex; justify-content: center">
    <a-row :gutter="[24, 8]" style="width: 80%">
      <a-col :span="12">
        <span class="filter-input-label">Rental Date: </span>
        <div style="width: 75%; display: inline-block; vertical-align: middle">
          <a-range-picker
            v-model:value="rentalDateRange"
            :default-picker-value="[dayjs('2005/05/01'), dayjs('2006/06/01')]"
            :show-time="{
              defaultValue: [
                dayjs('00:00:00', 'HH:mm:ss'),
                dayjs('23:59:59', 'HH:mm:ss'),
              ],
            }"
            :allow-empty="[true, true]"
          >
            <template #renderExtraFooter>
              <div style="text-align: right; margin-right: 12px">
                <a-button size="small" type="primary" @click="console.log"
                  >零点</a-button
                >
              </div>
            </template>
          </a-range-picker>
        </div>
      </a-col>
      <a-col :span="12">
        <span class="filter-input-label">Return Date: </span>
        <div style="width: 75%; display: inline-block; vertical-align: middle">
          <a-range-picker
            v-model:value="returnDateRange"
            :default-picker-value="[dayjs('2005/01/01'), dayjs('2005/06/01')]"
            :show-time="{
              defaultValue: [
                dayjs('00:00:00', 'HH:mm:ss'),
                dayjs('23:59:59', 'HH:mm:ss'),
              ],
            }"
            :allow-empty="[true, true]"
          >
            <template #renderExtraFooter>
              <div style="text-align: right; margin-right: 12px">
                <a-button size="small" type="primary" @click="console.log"
                  >零点</a-button
                >
              </div>
            </template>
          </a-range-picker>
        </div>
      </a-col>
      <a-col :span="8">
        <span class="filter-input-label">Return Status: </span>
        <a-radio-group
          v-model:value="isReturned"
          :options="isReturnedFilterOptions"
        ></a-radio-group>
      </a-col>
      <a-col :span="8">
        <span class="filter-input-label">Payment Status: </span>
        <a-radio-group
          v-model:value="isPaid"
          :options="isPaidFilterOptions"
        ></a-radio-group>
      </a-col>
      <a-col :span="8">
        <span class="filter-input-label">Staff: </span>
        <a-select
          :options="staffsFilterOptions"
          style="width: 75%"
          v-model:value="staffsFilterValue"
          allow-clear
          show-search
          :filter-option="filterOptionsByLabel"
        ></a-select>
      </a-col>
      <a-col :span="8">
        <span class="filter-input-label">Film Title: </span>
        <a-auto-complete
          style="width: 75%"
          @search="onFilmTitleFilterSearch"
          :options="filmTitleFilterOptions"
          @select="onFilmTitleFilterSelect"
        ></a-auto-complete>
      </a-col>
      <a-col :span="24" style="text-align: end">
        <a-space>
          <!-- <template #split><a-divider type="vertical" /></template> -->
          <a-button @click="test2">test2</a-button>
          <a-button @click="runToRefresh" type="primary">refresh</a-button>
        </a-space>
      </a-col>
    </a-row>
  </div>

  <!-- <div style="display: flex; justify-content: center">
    <a-row style="width: 80%; margin-top: 16px"> </a-row>
  </div> -->

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
      showSizeChanger: true,
      showTotal: (total: number, range: number[]) =>
        `第 ${range[0]}-${range[1]} 条（共 ${total} 条）`,
      responsive: true,
      position: ['bottomCenter'],
    }"
    v-on:change="onTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'customer_last_name'">
        <!-- <router-link :to="`/customer/${record.customer.id}`"> -->
        {{ record.customer.first_name }}
        {{ record.customer.last_name }}
        <!-- </router-link> -->
      </template>
      <template v-if="column.key === 'title'">
        <router-link :to="`/film/${record.inventory.film_id}`">
          {{ record.inventory.film.title }}
        </router-link>
      </template>
      <template v-if="column.key === 'staff_name'">
        <!-- <router-link :to="`/staff/${record.staff.id}`"> -->
        {{ record.staff.first_name }}
        {{ record.staff.last_name }}
        <!-- </router-link> -->
      </template>
      <template v-if="column.key === 'return_date'">
        {{ record.return_date ?? 'not returned' }}
      </template>
      <template v-if="column.key === 'payments'">
        <template v-if="0 === record.payments.length">未支付</template>
        <template v-else-if="1 === record.payments.length">{{
          record.payments[0].amount.toFixed(2)
        }}</template>
        <template v-else-if="1 < record.payments.length">
          {{
            sumArrayToFixed(
              record.payments.map((payment: PaymentRecord) => payment.amount)
            )
          }}
          <a-tag color="geekblue">{{ record.payments.length }}</a-tag>
        </template>
        <template v-else>未知</template>
      </template>
    </template>
  </a-table>
  <a-space>
    <template #split></template>
    <span>current: {{ current }}</span>
    <span>pageSize: {{ pageSize }}</span>
    <span>total: {{ total }}</span>
    <span>totalPage: {{ totalPage }}</span>
    <span>sorts: {{ sorts }}</span>
  </a-space>
</template>

<style lang="scss">
.filter-input-label {
  font-weight: bold;
}
</style>
