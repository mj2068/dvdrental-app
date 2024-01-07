<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useRequest } from 'vue-request';
import type { CustomerRecord } from '@/types/records/customer';

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
const { run, data } = useRequest(requestCustomer, { manual: true });

onMounted(function () {
  run();
});
</script>

<template>
  <a-divider></a-divider>

  <div class="main-content-container">
    <a-descriptions
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
      <a-descriptions-item label="Country">{{
        data?.address?.country
      }}</a-descriptions-item>
      <a-descriptions-item label="City">{{
        data?.address?.city
      }}</a-descriptions-item>
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
      <a-descriptions-item label="Rentals">
        <p v-for="rental in data?.rentals" :key="rental.id">{{ rental.id }}</p>
      </a-descriptions-item>
      <a-descriptions-item label="Payments">
        <p v-for="payment in data?.payments" :key="payment.id">
          {{ payment.id }}
        </p>
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
