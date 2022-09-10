import Vue from "vue";
import VueSocketIO from "vue-socket.io";
import {URL_SISCHAVEZ} from "./Configuracion";
import store from "./store";

const socket = new VueSocketIO({
  debug: true,
  connection: URL_SISCHAVEZ,
  vuex: {
    store,
    actionPrefix: "SOCKET_"
  },
  options: { transports: ["websocket"] }
});

Vue.use(socket);
