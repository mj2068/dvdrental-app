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

axios.defaults.baseURL = import.meta.env.DEV
  // ? "http://localhost:8000"
  ? "https://zizaimai.space/api/dvdrental"
  : "https://zizaimai.space/api/dvdrental";
console.log("in dev mode, baseURL: ", axios.defaults.baseURL);
axios.defaults.paramsSerializer = { indexes: null };
