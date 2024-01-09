<script setup lang="ts">
import { onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useRequest } from 'vue-request';

import type { TableColumnType } from 'ant-design-vue';

import type { CustomerRecord } from '@/types/records/customer';
import type { RentalRecord } from '@/types/records/rental';
import type { PaymentRecord } from '@/types/records/payment';

interface CustomerDetailResponse {
  data: CustomerRecord;
  message?: string;
}

const route = useRoute();

async function requestCustomer() {
  const result = await axios.get<CustomerDetailResponse>(
    `/customer/${route.params.id}`
  );
  return result.data.data;
}
const { run, data, loading } = useRequest(requestCustomer, { manual: true });

onMounted(function () {
  run();
});

const rentalsTableColumns: TableColumnType<RentalRecord>[] = [
  { key: 'id', dataIndex: 'id', title: 'ID', sorter: (a, b) => a.id - b.id },
  {
    key: 'inventory_film_title',
    dataIndex: ['inventory', 'film', 'title'],
    title: 'Film',
    sorter: (a, b) =>
      a.inventory!.film.title.localeCompare(b.inventory!.film.title),
  },
  {
    key: 'inventory_film_rental_rate',
    dataIndex: ['inventory', 'film', 'rental_rate'],
    title: 'Rate',
    sorter: (a, b) =>
      a.inventory!.film.rental_rate - b.inventory!.film.rental_rate,
  },
  {
    key: 'rental_date',
    dataIndex: 'rental_date',
    title: 'Rental Date',
    sorter: (a, b) =>
      new Date(a.rental_date).getTime() - new Date(b.rental_date).getTime(),
  },
  {
    key: 'return_data',
    dataIndex: 'return_date',
    title: 'Return Date',
    sorter: (a, b) =>
      new Date(a.rental_date).getTime() - new Date(b.rental_date).getTime(),
  },
  { key: 'payments', title: 'Payments' },
];

const paymentsTableColumns: TableColumnType<PaymentRecord>[] = [
  { key: 'id', dataIndex: 'id', title: 'Payment ID' },
  {
    key: 'rental_id',
    dataIndex: ['rental', 'id'],
    title: 'Rental ID',
  },
  {
    key: 'rental_inventory_film_title',
    dataIndex: ['rental', 'inventory', 'film', 'title'],
    title: 'Film',
  },
  { key: 'amount', dataIndex: 'amount', title: 'Amount' },
  { key: 'payment_data', dataIndex: 'payment_date', title: 'Date' },
  { key: 'staff_id', dataIndex: 'staff_id', title: 'Staff ID' },
];
</script>

<template>
  <a-divider></a-divider>

  <div class="main-content-container">
    <div v-if="loading" style="display: flex; justify-content: center">
      <a-spin />
    </div>

    <a-descriptions
      v-else
      :title="data?.full_name"
      :column="2"
      bordered
      :label-style="{ width: '15%' }"
      :content-style="{ width: '35%' }"
    >
      <template v-slot:extra>
        <a-button disabled>edit</a-button>
      </template>
      <a-descriptions-item label="Customer ID" :span="2">{{
        data?.id
      }}</a-descriptions-item>
      <a-descriptions-item label="Status">
        <a-badge v-if="data?.active === 1" status="success" text="ACTIVE" />
        <a-badge v-else status="error" text="INACTIVE" />
      </a-descriptions-item>
      <a-descriptions-item label="Acitive Bool">{{
        data?.activebool
      }}</a-descriptions-item>
      <a-descriptions-item label="Email">{{ data?.email }}</a-descriptions-item>
      <a-descriptions-item label="Phone">{{
        data?.address?.phone
      }}</a-descriptions-item>
      <a-descriptions-item label="Country">...</a-descriptions-item>
      <a-descriptions-item label="City">...</a-descriptions-item>
      <a-descriptions-item label="District">{{
        data?.address?.district
      }}</a-descriptions-item>
      <a-descriptions-item label="Postal Code">{{
        data?.address?.postal_code
      }}</a-descriptions-item>
      <a-descriptions-item label="Address">{{
        data?.address?.address
      }}</a-descriptions-item>
      <a-descriptions-item label="Address2">{{
        data?.address?.address2
      }}</a-descriptions-item>
      <a-descriptions-item label="Rentals" :span="2">
        <a-table
          size="middle"
          :data-source="data?.rentals!"
          :columns="rentalsTableColumns"
          :pagination="{ showTotal: (total) => `Total: ${total}` }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'payments'">
              <a-space>
                <template #split>
                  <a-divider type="vertical"></a-divider>
                </template>
                <template v-if="record.payments.length">
                  <span v-for="payment in record.payments" :key="payment.id">{{
                    payment.amount
                  }}</span>
                </template>
                <template v-else>unpaid</template>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-descriptions-item>
      <a-descriptions-item label="Payments">
        <a-table
          size="middle"
          :data-source="data?.payments!"
          :columns="paymentsTableColumns"
          :pagination="{
            showTotal: (total) => `Total: ${total}`,
          }"
        ></a-table>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<style lang="css" scoped>
.main-content-container {
  width: 80%;
  margin: auto;
}
</style>
