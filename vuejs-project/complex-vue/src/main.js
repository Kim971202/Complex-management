import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import minxins from "./mixins";

// createApp(App).use(store).use(router).mount("#app");

const app = createApp(App);
app.use(store);
app.use(router);
app.mixin(minxins);
app.mount("#app");
