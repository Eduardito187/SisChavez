import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {URL_SISCHAVEZ} from "./Config/Configuracion";
import { createProvider } from "./vue-apollo";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueSocketIO from "vue-socket.io";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import VueSocketio from "vue-socket.io-extended";
import io from "socket.io-client";


Vue.use(Antd);

library.add(faUserSecret);

import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);

Vue.component("apexchart", VueApexCharts);

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles.css";
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: io(URL_SISCHAVEZ),
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);
//import {io} from "socket.io"
new Vue({
  sockets: {
    connecting() {
      console.log("on connection");
    },
    disconnect() {
      console.log("Socket to break off");
    },
    connect_failed() {
      cosnole.log("connection failed");
    },
    connect() {
      console.log("socket connected");
    }
  },
  store,
  router,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount("#app");
