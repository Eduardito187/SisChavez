<template>
  <div>
    <div class="ancho">
      <div v-if="permiso" class="ancho">
        <Lote v-for="d in data" :key="d.ID" :data="d" :max="false" />
      </div>
      <div v-else-if="permiso == false" class="ancho">
        <div class="columna d-flex justify-content-center">
          <div class="col-md-6">
            <div class="vue-tempalte">
              <b-card bg-variant="light">
                <a-result
                  status="403"
                  title="403"
                  sub-title="Usted no tiene permiso para esta seccion."
                />
              </b-card>
            </div>
          </div>
        </div>
      </div>
      <a-spin v-else size="large" />
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";
import Lote from "./Lote.vue";
import { Button } from "ant-design-vue";
export default {
  data() {
    return {
      validacionR: false,
      data: [],
      permiso: null,
      consulta: gql`
        query {
          lotes {
            ID
            Nombre
          }
        }
      `
    };
  },
  components: { Button, Lote },
  watch: {},
  methods: {
    async obtenerData() {
      this.validacionR = true;
      await this.$apollo
        .query({
          query: this.consulta,
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.lotes;
          this.validacionR = false;
          this.$socket.emit("Sumar_Linea", true);
        });
    }
  },
  mounted() {},
  async created() {
    await this.$apollo
      .query({
        query: gql`
          query saber_permiso($Cuenta: Int!, $Code: String!) {
            saber_permiso(Cuenta: $Cuenta, Code: $Code) {
              Respuesta
            }
          }
        `,
        variables: {
          Cuenta: parseInt(localStorage.id_cuenta),
          Code: "P10"
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        if (result.data.saber_permiso != null) {
          if (result.data.saber_permiso.Respuesta != null) {
            this.permiso = result.data.saber_permiso.Respuesta;
            this.obtenerData();
          } else {
            this.permiso = false;
          }
        } else {
          this.permiso = false;
        }
      });
  }
};
</script>
