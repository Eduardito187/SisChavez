<template>
  <div>
    <div v-if="permiso" class="ancho">
      <b-overlay :show="c_s" rounded="sm">
        <div class="ancho">
          <a-select
            label-in-value
            :default-value="{ key: 'Peso' }"
            style="width: 150px;margin-right:5px;"
            @change="cambioSELECT"
          >
            <a-select-option value="Peso">
              Peso
            </a-select-option>
            <a-select-option value="Tipo">
              Tipo
            </a-select-option>
            <a-select-option value="Recargo">
              Recargo
            </a-select-option>
            <a-select-option value="Sucursal">
              Sucursal
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
          <CartaExtintor
            v-for="d in data"
            :key="d.ID"
            :max="false"
            :extintor="d"
            @evento_info="recibir_INFO"
          />
        </div>
      </b-overlay>
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
const axios = require("axios");
import gql from "graphql-tag";
import CartaExtintor from "../../components/CartaExtintor.vue";
export default {
  components: {
    CartaExtintor
  },
  data() {
    return {
      b: "Peso",
      busqueda: "",
      permiso: null,
      consulta: gql`
        query {
          extintores {
            ID
            Codigo
            PH
            Peso
            Recargo
            Observacion
            Extintores {
              ID
              Fecha
              Tipo
              Cantidad
              Creacion
              Sucursal {
                Region
              }
            }
          }
        }
      `,
      consultaLIKE: gql`
        query extintoresLIKE($Busqueda: String!, $Tipo: String!) {
          extintoresLIKE(Busqueda: $Busqueda, Tipo: $Tipo) {
            ID
            Codigo
            PH
            Peso
            Recargo
            Observacion
            Extintores {
              ID
              Fecha
              Tipo
              Cantidad
              Creacion
              Sucursal {
                ID
                Nombre
                CodigoSucursal
                Telefono
                Direccion
                TelfInterno
                Correo
                Region
              }
              Proveedor {
                ID
                Nombre
                Telefono
                Direccion
                Correo
              }
            }
          }
        }
      `,
      data: [],
      c_s: false
    };
  },
  methods: {
    cambioSELECT(a) {
      this.b = a.key;
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
            this.data = result.data.extintoresLIKE;
            this.c_s = false;
            this.$socket.emit("Sumar_Linea", true);
          });
      } else {
        this.obtenerData();
      }
    },
    recibir_INFO(a) {
      if (a != null) {
        this.$router.push("/Extintor/" + a.ID);
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
          this.data = result.data.extintores;
          this.c_s = false;
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    async infoID() {
      await this.$apollo
        .query({
          query: this.consultaLIKE,
          variables: {
            Busqueda: this.$route.params.id,
            Tipo: this.$route.params.tipo
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.extintoresLIKE;
          this.c_s = false;
          this.$socket.emit("Sumar_Linea", true);
        });
    }
  },
  async created() {
    if (this.$route.params.tipo != null && this.$route.params.id != null) {
      this.c_s = true;
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
            Code: "P19"
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          if (result.data.saber_permiso != null) {
            if (result.data.saber_permiso.Respuesta != null) {
              this.permiso = result.data.saber_permiso.Respuesta;
              this.infoID();
            } else {
              this.permiso = false;
            }
          } else {
            this.permiso = false;
          }
        });
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
            Code: "P19"
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
  },
  async mounted() {
    if (localStorage.id_cuenta == null) {
      this.$router.push("/");
    }
  }
};
</script>
