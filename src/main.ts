import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import AFrame from "aframe";

console.log(AFrame.version);

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
