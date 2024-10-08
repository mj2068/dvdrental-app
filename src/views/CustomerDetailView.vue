<script setup lang="ts">
import axios from "axios";
import { useRoute } from "vue-router";
import { useRequest } from "vue-request";
import useGlobalStore from "@/stores/global";

import type { TableColumnType } from "ant-design-vue";
import type { CustomerRecord } from "@/types/records/customer";
import type { RentalRecord } from "@/types/records/rental";
import type { PaymentRecord } from "@/types/records/payment";

interface CustomerDetailResponse {
  data: CustomerRecord;
  message?: string;
}

const route = useRoute();

async function requestCustomer() {
  const result = await axios.get<CustomerDetailResponse>(
    `/customer/${route.params.id}`,
  );
  return result.data.data;
}
const { run, data, loading } = useRequest(requestCustomer, { manual: true });
onMounted(() => run());
watch(
  () => data.value?.full_name,
  (newV) => {
    document.title = newV + " - " + document.title;
  },
);

const rentalsTableColumns: TableColumnType<RentalRecord>[] = [
  { key: "id", dataIndex: "id", title: "ID", sorter: (a, b) => a.id - b.id },
  {
    key: "inventory_film_title",
    dataIndex: ["inventory", "film", "title"],
    title: "Film",
    sorter: (a, b) =>
      a.inventory!.film.title.localeCompare(b.inventory!.film.title),
  },
  {
    key: "inventory_film_rental_rate",
    dataIndex: ["inventory", "film", "rental_rate"],
    title: "Rate",
    sorter: (a, b) =>
      a.inventory!.film.rental_rate - b.inventory!.film.rental_rate,
  },
  {
    key: "rental_date",
    dataIndex: "rental_date",
    title: "Rental Date",
    sorter: (a, b) =>
      new Date(a.rental_date).getTime() - new Date(b.rental_date).getTime(),
  },
  {
    key: "return_data",
    dataIndex: "return_date",
    title: "Return Date",
    sorter: (a, b) =>
      new Date(a.rental_date).getTime() - new Date(b.rental_date).getTime(),
  },
  { key: "payments", title: "Payments", align: "right" },
];

const paymentsTableColumns: TableColumnType<PaymentRecord>[] = [
  { key: "id", dataIndex: "id", title: "ID" },
  {
    key: "rental_id",
    dataIndex: ["rental", "id"],
    title: "Rental ID",
  },
  {
    key: "rental_inventory_film_title",
    dataIndex: ["rental", "inventory", "film", "title"],
    title: "Film",
  },
  { key: "payment_data", dataIndex: "payment_date", title: "Date" },
  { key: "staff_id", dataIndex: "staff_id", title: "Staff ID" },
  { key: "amount", dataIndex: "amount", title: "Amount", align: "right" },
];

const globalStore = useGlobalStore();
const computedColumn = computed(() => (globalStore.isMinWidth768Px ? 2 : 1));
</script>

<template>
  <h2>Customer Detail</h2>
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
    :column="computedColumn"
    bordered
    :label-style="{ width: '8rem' }"
  >
    <template #title>{{ data?.full_name }}</template>
    <template v-slot:extra>
      <a-button type="primary">Edit</a-button>
    </template>
    <a-descriptions-item label="Customer ID">
      {{ data?.id }}
    </a-descriptions-item>
    <a-descriptions-item label="Status">
      <a-badge v-if="data?.active === 1" status="success" text="ACTIVE" />
      <a-badge v-else status="error" text="INACTIVE" />
    </a-descriptions-item>
    <a-descriptions-item label="Email">{{ data?.email }}</a-descriptions-item>
    <a-descriptions-item label="Phone">
      {{ data?.address?.phone }}
    </a-descriptions-item>
    <a-descriptions-item label="Country"></a-descriptions-item>
    <a-descriptions-item label="City"></a-descriptions-item>
    <a-descriptions-item label="District">
      {{ data?.address?.district }}
    </a-descriptions-item>
    <a-descriptions-item label="Postal Code">
      {{ data?.address?.postal_code }}
    </a-descriptions-item>
    <a-descriptions-item label="Address">
      {{ data?.address?.address }}
    </a-descriptions-item>
    <a-descriptions-item label="Address2">
      {{ data?.address?.address2 }}
    </a-descriptions-item>
    <a-descriptions-item label="Rentals" :span="computedColumn">
      <a-table
        size="middle"
        :data-source="data?.rentals!"
        :columns="rentalsTableColumns"
        :pagination="{ showTotal: (total) => `Total: ${total}` }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'id'">
            <IDLink :to="`/rental/${record.id}`">
              {{ record.id }}
            </IDLink>
          </template>
          <template v-if="column.key === 'inventory_film_title'">
            <IDLink :to="`/film/${record.inventory.film.film_id}`">
              {{ record.inventory.film.title }}
            </IDLink>
          </template>
          <template v-else-if="column.key === 'payments'">
            <a-space>
              <template #split>
                <a-divider type="vertical"></a-divider>
              </template>
              <template v-if="record.payments.length">
                <span v-for="payment in record.payments" :key="payment.id">
                  {{ payment.amount }}
                </span>
              </template>
              <template v-else>
                <span style="color: darkred">UNPAID</span>
              </template>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-descriptions-item>
    <a-descriptions-item label="Payments" :span="computedColumn">
      <a-table
        size="middle"
        :data-source="data?.payments!"
        :columns="paymentsTableColumns"
        :pagination="{
          showTotal: (total) => `Total: ${total}`,
        }"
      >
        <template v-slot:bodyCell="{ column, record }">
          <template v-if="column.key === 'id'">{{ record.id }}</template>
          <template v-else-if="column.key === 'rental_id'">
            <IDLink :to="`/rental/${record.rental_id}`">
              {{ record.rental_id }}
            </IDLink>
          </template>
          <template v-if="column.key === 'rental_inventory_film_title'">
            <IDLink :to="`/film/${record.rental.inventory.film.film_id}`">
              {{ record.rental.inventory.film.title }}
            </IDLink>
          </template>
        </template>
      </a-table>
    </a-descriptions-item>
  </a-descriptions>
</template>