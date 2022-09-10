<template>
  <div
    style="width:300px;height:auto;border-radius:3px;border-bottom-left-radius: 3px;border-bottom-right-radius: 3px;"
  >
    <div
      v-show="!show"
      @click="show = true"
      style="width:100%;padding:5px;height:auto;background-color:#57B8EB;border-radius:3px;"
    >
      <span style="cursor: pointer;">
        Chat Chavez <b v-if="t_c > 0">{{ t_c }}</b>
      </span>
    </div>
    <RoomChat v-show="show" @cerrar="show = $event" :id_Cuenta="id_Cuenta" />
  </div>
</template>

<script>
import gql from "graphql-tag";
import RoomChat from "./RoomChat.vue";
export default {
  data() {
    return {
      t_c: 0,
      show: false
    };
  },
  components: { RoomChat },
  props: {
    id_Cuenta: {
      type: [String, Number]
    }
  },
  methods: {},
  created() {
    this.$socket.emit("Cuentas_Activas", true);
    this.sockets.subscribe("Cuentas_Activas_CHAT", data => {
      this.t_c = data;
    });
  },
  beforeDestroy() {
    this.sockets.unsubscribe("Cuentas_Activas_CHAT");
  }
};
</script>
