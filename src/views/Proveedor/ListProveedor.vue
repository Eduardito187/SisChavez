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
          <a-select-option value="Telefono">
            Telefono
          </a-select-option>
          <a-select-option value="Correo Electronico">
            Correo Electronico
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
        <CartaProveedor
          v-for="d in data"
          :key="d.ID"
          :max="false"
          :proveedor="d"
          @evento_info="recibir_INFO"
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
import CartaProveedor from "../../components/CartaProveedor.vue";
import { Button } from "ant-design-vue";
export default {
  data() {
    return {
      b: "Nombre",
      busqueda: "",
      consulta: gql`
        query {
          proveedores {
            ID
            Nombre
            Telefono
            Direccion
            Correo
          }
        }
      `,
      consultaLIKE: gql`
        query proveedoresLIKE($Busqueda: String!, $Tipo: String!) {
          proveedoresLIKE(Busqueda: $Busqueda, Tipo: $Tipo) {
            ID
            Nombre
            Telefono
            Direccion
            Correo
          }
        }
      `,
      data: [],
      c_s: true,
      permiso: null
    };
  },
  components: { Button, CartaProveedor },
  methods: {
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
            this.data = result.data.proveedoresLIKE;
            this.c_s = false;
            this.$socket.emit("Sumar_Linea", true);
          });
      } else {
        this.obtenerData();
      }
    },
    recibir_INFO(a) {
      if (a != null) {
        this.$router.push("/Proveedor/" + a.ID);
      }
    },
    async obtenerData() {
      this.c_s = true;
      await this.$apollo
        .query({
          query: this.consulta,
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.proveedores;
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
            Code: "P22"
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
  }
};
</script>
