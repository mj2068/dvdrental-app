import { createApp } from "vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

import App from "./App.vue";
import router from "./router";
import axios from "axios";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(router);

app.use(Antd);

app.mount("#app");

// const devUrl = "http://localhost:8000";
const devUrl = "https://zizaimai.space/api/dvdrental";
axios.defaults.baseURL = import.meta.env.DEV
  ? devUrl
  : "https://zizaimai.space/api/dvdrental";
axios.defaults.paramsSerializer = { indexes: null };
