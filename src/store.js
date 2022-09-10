import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    messages: []
  },
  mutations: {
    setMessages(state, messages) {
      state.messages = messages;
    },
    addMessage(state, newMessage) {
      state.messages.push(newMessage);
    }
  },
  actions: {
    SOCKET_init(context, messages) {
      context.commit("setMessages", messages);
    },
    SOCKET_serverMessage(context, newMessage) {
      context.commit("addMessage", newMessage);
    },
    addMessage(context, newMessage) {
      console.log(context);
    }
  },
  getters: {}
});

export default store;
