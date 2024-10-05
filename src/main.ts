import { createApp } from "vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

import App from "./App.vue";
import router from "./router";
import axios from "axios";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Antd);

axios.defaults.baseURL = import.meta.env.DEV
  ? "http://localhost:8000"
  : "https://zizaimai.space/api";
axios.defaults.paramsSerializer = { indexes: null };

app.mount("#app");
