<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="ancho">
        <a-select
          label-in-value
          :default-value="{ key: 'Nombre' }"
          style="width: 120px;margin-right:5px;"
          @change="cambioSELECT"
        >
          <a-select-option value="Nombre">
            Nombre
          </a-select-option>
          <a-select-option value="Factura">
            Factura
          </a-select-option>
          <a-select-option value="Modelo">
            Modelo
          </a-select-option>
        </a-select>
        <a-input-search
          v-model="busqueda"
          placeholder="..."
          style="width: 200px"
          @search="buscar"
        />
      </div>
      <div class="ancho">
        <Articulo v-for="d in data" :key="d.ID" :data="d" :max="false" />
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
import Articulo from "./Articulo.vue";
import { Button } from "ant-design-vue";
export default {
  data() {
    return {
      validacionR: false,
      busqueda: "",
      b: "",
      data: [],
      permiso: null,
      consulta: gql`
        query {
          productos {
            ID
            Factura
            Nombre
            Modelo
            Costo
            Cantidad
            Proveedor {
              ID
              Nombre
              Telefono
              Direccion
              Correo
            }
          }
        }
      `,
      consultaLike: gql`
        query productosLIKE($Busqueda: String!, $Tipo: String!) {
          productosLIKE(Busqueda: $Busqueda, Tipo: $Tipo) {
            ID
            Factura
            Nombre
            Modelo
            Costo
            Cantidad
            Proveedor {
              ID
              Nombre
              Telefono
              Direccion
              Correo
            }
          }
        }
      `
    };
  },
  components: { Button, Articulo },
  watch: {},
  methods: {
    cambioSELECT(a) {
      this.b = a.key;
    },
    async buscar() {
      if (this.busqueda != "" && this.busqueda != " ") {
        this.validacionR = true;
        await this.$apollo
          .query({
            query: this.consultaLike,
            variables: {
              Busqueda: this.busqueda,
              Tipo: this.b
            },
            fetchPolicy: "network-only"
          })
          .then(result => {
            this.data = result.data.productosLIKE;
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
          this.data = result.data.productos;
          this.validacionR = false;
          this.$socket.emit("Sumar_Linea", true);
        });
    }
  },
  mounted() {
    this.obtenerData();
  },
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
          Code: "P13"
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
