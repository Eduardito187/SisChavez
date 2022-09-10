<template>
  <div>
    <div
      @click="cerrar_data()"
      style="width:100%;padding:5px;height:auto;background-color:#57B8EB;border-top-left-radius: 3px;border-top-right-radius: 3px;"
    >
      <span style="cursor: pointer;">
        Cerrar
      </span>
    </div>
    <div
      style="width:100%;height:auto;max-height:350px;border-bottom-left-radius: 3px;border-bottom-right-radius: 3px;background-color:white;"
    >
      <PerChat
        v-for="d in data"
        :key="d.ID"
        :id_Cuenta="id_Cuenta"
        :Cuenta="d"
      />
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";
import PerChat from "./PerChat.vue";
export default {
  data() {
    return {
      data: [],
      consulta: gql`
        query cuenta_menos($ID: Int!) {
          cuenta_menos(ID: $ID) {
            ID
            nombre
            foto
          }
        }
      `
    };
  },
  components: { PerChat },
  props: {
    id_Cuenta: {
      type: [String, Number]
    }
  },
  methods: {
    async obtenerData() {
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            ID: parseInt(this.id_Cuenta)
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.cuenta_menos;
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    cerrar_data() {
      this.$emit("cerrar", false);
    }
  },
  async created() {
    if (this.id_Cuenta != null) {
      this.obtenerData();
    }
  }
};
</script>
