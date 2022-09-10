<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="ancho">
        <a-select
          label-in-value
          :default-value="{ key: 'Nombre' }"
          style="width: 150px;margin-right:5px;"
          @change="cambioSELECT"
        >
          <a-select-option value="Nombre">
            Nombre
          </a-select-option>
          <a-select-option value="Codigo">
            Codigo
          </a-select-option>
          <a-select-option value="Telefono">
            Telefono
          </a-select-option>
          <a-select-option value="Telefono Interno">
            Telefono Interno
          </a-select-option>
          <a-select-option value="Correo Electronido">
            Correo Electronido
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
        <Carta
          v-for="d in sucursales"
          :key="d.ID"
          @actualizar="actualizar_data($event)"
          :data="d"
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
      b: "Nombre",
      busqueda: "",
      consulta: gql`
        query {
          sucursales {
            ID
            Nombre
            CodigoSucursal
            Telefono
            Direccion
            TelfInterno
            Correo
            Region
          }
        }
      `,
      consultaLIKE: gql`
        query sucursalesLIKE($Busqueda: String!, $Tipo: String!) {
          sucursalesLIKE(Busqueda: $Busqueda, Tipo: $Tipo) {
            ID
            Nombre
            CodigoSucursal
            Telefono
            Direccion
            TelfInterno
            Correo
            Region
          }
        }
      `,
      sucursales: [],
      c_s: true,
      permiso: null
    };
  },
  components: { Button, Carta },
  methods: {
    actualizar_data(a) {
      if (a) {
        this.buscar();
      }
    },
    async buscar() {
      if (this.busqueda != "" && this.busqueda != " ") {
        this.c_s = true;
        await this.$apollo
          .query({
            query: this.consultaLIKE,
            variables: {
              Busqueda: this.busqueda,
              Tipo: this.b
            },
            fetchPolicy: "network-only"
          })
          .then(result => {
            this.sucursales = result.data.sucursalesLIKE;
            this.c_s = false;
            this.$socket.emit("Sumar_Linea", true);
          });
      } else {
        this.obtenerSucursal();
      }
    },
    recibir_INFO(a) {
      if (a != null) {
        this.$router.push("/Sucursal/" + a.ID);
      }
    },
    async obtenerSucursal() {
      this.c_s = true;
      await this.$apollo
        .query({
          query: this.consulta,
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.sucursales = result.data.sucursales;
          this.c_s = false;
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    cambioSELECT(a) {
      this.b = a.key;
    }
  },
  mounted() {},
  async created() {
    if (localStorage.id_cuenta == null) {
      this.$router.push("/");
    } else {
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
            Code: "P4"
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          if (result.data.saber_permiso != null) {
            if (result.data.saber_permiso.Respuesta != null) {
              this.permiso = result.data.saber_permiso.Respuesta;
              this.obtenerSucursal();
            } else {
              this.permiso = false;
            }
          } else {
            this.permiso = false;
          }
        });
    }
  }
};
</script>
