<script setup lang="ts">
import type { RentalRecord } from "@/types/records/rental";
import axios from "axios";
import { useRequest } from "vue-request";
import { useRoute } from "vue-router";
import useGlobalStore from "@/stores/global";

const route = useRoute();

interface RentalDetailResponse {
  data: RentalRecord;
  message?: string | null;
}

async function requestRental() {
  const result = await axios.get<RentalDetailResponse>(
    `/rental/${route.params.id}`,
  );
  return result.data.data;
}
const { run, data, loading } = useRequest(requestRental, { manual: true });
onMounted(() => run());
document.title = "Rental Detail" + " - " + document.title;

const globalStore = useGlobalStore();
const computedColumn = computed(() => (globalStore.isMinWidth768Px ? 2 : 1));
</script>

<template lang="pug">
h2 Rental Detail
a-flex(
  v-if="loading",
  justify="center",
  align="center",
  style="margin-top: 4rem; min-height: 300px; background-color: rgba(220 220 220 / 0.1); border-radius: 8px; border: 1px solid rgba(200 200 200 / 0.3)"
)
  a-spin
a-descriptions(
  v-else,
  :column="computedColumn",
  bordered,
  :label-style="{ width: '8rem' }"
)
  template(#extra)
    a-button(type="primary") Edit
  template(#title).
    Rental by {{ data?.customer?.full_name }} on film {{ data?.inventory?.film.title }}
  a-descriptions-item(label="Rental ID") {{ data?.id }}
  a-descriptions-item(label="Customer")
    IDLink(v-if="data", :to="`/customer/${data?.customer?.id}`") {{ data?.customer?.full_name }}
  a-descriptions-item(label="Film Title")
    IDLink(v-if="data", :to="`/film/${data?.inventory?.film_id}`") {{ data?.inventory?.film.title }}
  a-descriptions-item(label="Staff") {{ data?.staff?.full_name }}
  a-descriptions-item(label="Inventory ID") {{ data?.inventory?.id }}
  a-descriptions-item(label="Store ID") {{ data?.inventory?.store_id }}
  a-descriptions-item(label="Rental Date") {{ data?.rental_date }}
  a-descriptions-item(label="Return Date") {{ data?.return_date ?? "NOT RETURNED" }}
  a-descriptions-item(label="Payments", :span="computedColumn")
    a-list(:data-source="data?.payments") 
      template(#header)
        a-row(
          style="width: 100%; padding-left: 24px; padding-right: 24px; font-weight: bold"
        ) 
          a-col(:span="3") ID
          a-col(:span="9") Customer
          a-col(:span="9") Date
          a-col(:span="3") Amount
      template(#renderItem="{ item }")
        a-list-item
          a-row(style="width: 100%") 
            a-col(:span="3") {{ item.id }}
            a-col(:span="9") 
              IDLink(:to="`/customer/${item.customer.id}`") {{ item.customer.full_name }}
            a-col(:span="9") {{ new Date(item.payment_date).toLocaleString() }}
            a-col(:span="3", style="text-align: right") {{ item.amount }}
      template(#footer)
        a-row(
          style="width: 100%; padding-left: 24px; padding-right: 24px; font-weight: bold"
        )
          a-col(:span="24", style="text-align: right")
            span(style="font-weight: bold") Total: {{ data?.payments.reduce((p, c) => p + c.amount, 0).toFixed(2) }}
</template>

<style scoped lang="scss"></style>
