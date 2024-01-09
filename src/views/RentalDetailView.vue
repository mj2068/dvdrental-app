<script setup lang="ts">
import type { RentalRecord } from '@/types/records/rental';
import axios from 'axios';
import { onMounted } from 'vue';
import { useRequest } from 'vue-request';
import { useRoute } from 'vue-router';

const route = useRoute();

interface RentalDetailResponse {
  data: RentalRecord;
  message?: string | null;
}

async function requestRental() {
  const result = await axios.get<RentalDetailResponse>(
    `/rental/${route.params.id}`
  );
  return result.data.data;
}
const { run, data, loading } = useRequest(requestRental, { manual: true });

onMounted(function () {
  run();
});
</script>

<template lang="pug">
a-divider 
div.main-content-container
  div(v-if="loading" style="display: flex; justify-content: center")
    a-spin 
  a-descriptions(
    v-else
    :column="2"
    bordered
    :label-style="{ width: '15%', fontWeight: 'bold' }"
    :content-style="{ width: '35%' }"
  )
    template(#title).
      {{ data?.customer?.full_name }}'s
      rental(id: {{ data?.id }}) on {{ data?.inventory?.film.title }}
    a-descriptions-item(label="Customer")
      IDLink(:to="`/customer/${data?.customer?.id}`") {{ data?.customer?.full_name }}
    a-descriptions-item(label="Staff") {{ data?.staff?.full_name }}
    a-descriptions-item(label="Inventory ID") {{  data?.inventory?.id }}
    a-descriptions-item(label="Store ID") {{ data?.inventory?.store_id }}
    a-descriptions-item(label="Film ID")
      IDLink(:to="`/film/${data?.inventory?.film_id}`") {{ data?.inventory?.film_id }}
    a-descriptions-item(label="Film Title") {{ data?.inventory?.film.title }}
    a-descriptions-item(label="Rental Date") {{ data?.rental_date }}
    a-descriptions-item(label="Return Date") {{ data?.return_date ?? "NOT RETURNED" }}
    a-descriptions-item(label="Payments" :span="2")
      a-list(:data-source="data?.payments") 
        template(#header)
          a-row(style="width: 100%; padding-left: 24px; padding-right: 24px; font-weight: bold") 
            a-col(:span="6") id
            a-col(:span="6") customer
            a-col(:span="6") date
            a-col(:span="6") amount
        template(#renderItem="{ item }")
          a-list-item
            a-row(style="width: 100%") 
              a-col(:span="6") {{ item.id }}
              a-col(:span="6") 
                IDLink(:to="`/customer/${item.customer.id}`") {{ item.customer.full_name }}
              a-col(:span="6") {{ item.payment_date }}
              a-col(:span="6") {{ item.amount }} 
              
        template(#footer)
          a-row(style="width: 100%; padding-left: 24px; padding-right: 24px; font-weight: bold")
            a-col(:span="6" :offset="18")
              span(style="font-weight: bold") {{ data?.payments.reduce((p, c) => p + c.amount, 0).toFixed(2) }}          
</template>

<style scoped lang="css">
.main-content-container {
  width: 80%;
  margin: auto;
}
</style>
