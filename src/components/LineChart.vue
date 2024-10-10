<template>
  <a-flex style="flex-grow: 1">
    <canvas ref="lineChart"></canvas>
  </a-flex>
</template>

<script setup lang="ts">
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

// Define props
const props = defineProps<{
  data: Array<{ date: string; value: number }>;
  color?: string; // New prop for line color
  bgColor?: string;
}>();

const lineChart = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const ctx = lineChart.value?.getContext("2d");

  // Extract labels and data from the props
  const labels = props.data.map((item) => item.date);
  const values = props.data.map((item) => item.value);

  // Create the chart
  new Chart(ctx!, {
    type: "line", // You can change this to 'bar', 'pie', etc.
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total Amount",
          data: values,
          borderColor: props.color || "rgba(75, 192, 192, 1)", // Use the color prop or default
          backgroundColor: props.bgColor || "rgba(75, 192, 192, 0.2)", // Semi-transparent background
          fill: true,
          tension: 0.1, // Smoothness of the line
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allow the chart to fill the container
      plugins: {
        legend: {
          display: false, // Turn off the legend
        },
      },
      scales: {
        x: {
          ticks: {
            autoSkip: true, // Automatically skip labels
            maxTicksLimit: 10, // Maximum number of ticks
            maxRotation: 0,
            callback: function (value, index, ticks) {
              // Get the actual date string from the labels array
              const dateString = labels[index];
              // Assuming the date is in ISO format (e.g., "2023-05-15")
              const date = new Date(dateString);
              const month = (date.getMonth() + 1).toString().padStart(2, "0");
              const day = date.getDate().toString().padStart(2, "0");
              return `${month}/${day}`;
            },
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false,
          },
        },
      },
    },
  });
});
</script>

<style scoped></style>
