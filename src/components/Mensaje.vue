<template>
  <div style="width:100%;">
    <div v-if="mensaje.De.ID == Cuenta.ID" style="width:100%;display: flex; justify-content: flex-start;" >
      <div style="width: auto;max-width: 70%;height:auto;background-color:white;padding:5px;border-bottom-right-radius: 5px;border-top-left-radius: 5px;border-top-right-radius: 5px;border-bottom-left-radius: 0px;" >
        <small>{{ mensaje.Texto }}</small>
      </div>
    </div>
    <div v-else style="width:100%;display: flex; justify-content: flex-end;">
      <div style="width: auto;max-width: 70%;height:auto;background-color:white;padding:5px;border-top-left-radius: 5px;border-bottom-left-radius: 5px;border-bottom-right-radius: 0px;border-top-right-radius: 5px;" >
        <small>{{ mensaje.Texto }}</small>
      </div>
    </div>
    <a-drawer :width="320" placement="right" :closable="false" :visible="visible" @close="onClose" >
    </a-drawer>
  </div>
</template>
<script>
//mensaje.De.ID == Cuenta.ID => PARA MI
//mensaje.Para.ID == Cuenta.ID => De MI
import gql from "graphql-tag";
export default {
  data() {
    return {
      data: [],
      visible: false
    };
  },
  props: {
    mensaje: {
      type: Object
    },
    id_Cuenta: {
      type: [String, Number]
    },
    Cuenta: {
      type: Object
    }
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    async obtenerData() {},
    cerrar_data() {
      this.$emit("cerrar", false);
    }
  },
  async created() {
    if (this.id_Cuenta != null) {
      //this.obtenerData()
    }
  }
};
</script>
