<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="ancho">
        <a-input-search
          v-model="busqueda"
          placeholder="..."
          style="width: 200px"
          @search="buscar"
        />
      </div>
      <div class="ancho">
        <Carta
          v-for="d in data"
          :key="d.ID"
          :data="d"
          @actualizar="actualizar_data($event)"
          :max="false"
        />
      </div>
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
</template>
<script>
import gql from "graphql-tag";
import Carta from "./Carta.vue";
import { Button } from "ant-design-vue";
export default {
  data() {
    return {
      validacionR: false,
      busqueda: "",
      b: "",
      permiso: null,
      data: [],
      consulta: gql`
        query {
          control_llaves {
            ID
            FechaInicio
            FechaDevolucion
            Entrega
            Observacion
            Sucursal {
              ID
              Nombre
              CodigoSucursal
              Telefono
              Direccion
              TelfInterno
              Correo
            }
            Responsable {
              ID
              usuario
              contra
              nombre
              foto
            }
          }
        }
      `,
      consultaLIKE: gql`
        query control_llavesLIKE($Busqueda: String!) {
          control_llavesLIKE(Busqueda: $Busqueda) {
            ID
            FechaInicio
            FechaDevolucion
            Entrega
            Observacion
            Sucursal {
              ID
              Nombre
              CodigoSucursal
              Telefono
              Direccion
              TelfInterno
              Correo
            }
            Responsable {
              ID
              usuario
              contra
              nombre
              foto
            }
          }
        }
      `
    };
  },
  components: { Button, Carta },
  watch: {},
  methods: {
    actualizar_data(a) {
      if (a != null) {
        for (let index = 0; index < this.data.length; index++) {
          if (this.data[index]["ID"] == a.ID) {
            this.data[index]["FechaDevolucion"] = a.FechaDevolucion;
            index = this.data.length;
          }
        }
      }
    },
    async buscar() {
      if (this.busqueda != "" && this.busqueda != " ") {
        this.validacionR = true;
        await this.$apollo
          .query({
            query: this.consultaLIKE,
            variables: {
              Busqueda: this.busqueda
            },
            fetchPolicy: "network-only"
          })
          .then(result => {
            this.data = result.data.control_llavesLIKE;
            this.validacionR = false;
            this.$socket.emit("Sumar_Linea", true);
          });
      } else {
        this.obtenerData();
      }
    },
    async obtenerData() {
      this.validacionR = true;
      await this.$apollo
        .query({
          query: this.consulta,
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.control_llaves;
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
          Code: "P1"
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        if (result.data.saber_permiso != null) {
          if (result.data.saber_permiso.Respuesta != null) {
            this.permiso = result.data.saber_permiso.Respuesta;
            this.$socket.emit("Sumar_Linea", true);
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
