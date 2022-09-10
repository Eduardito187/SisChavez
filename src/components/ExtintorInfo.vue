<template>
  <div class="SucursalInfo">
    <b-overlay :show="load" rounded="sm">
      <b-row v-if="data != null">
        <b-col cols="6" v-if="data.Sucursal != null" class="mb-1">
          <Carta
            @actualizar="actualizar_data($event)"
            :data="data.Sucursal"
            :max="true"
          />
        </b-col>
        <b-col cols="6" v-if="data.Proveedor != null" class="mb-1">
          <CartaProveedor
            :max="true"
            :proveedor="data.Proveedor"
            @evento_info="recibir_INFO_Proveedor"
          />
        </b-col>
      </b-row>
    </b-overlay>
  </div>
</template>

<script>
import CartaProveedor from "./CartaProveedor.vue";
import CartaSucursal from "./CartaSucursal.vue";
import Carta from "./../views/Sucursal/Carta.vue";
import gql from "graphql-tag";
export default {
  name: "SucursalInfo",
  data() {
    return {
      consulta: gql`
        query extintor($ID: Int!) {
          extintor(ID: $ID) {
            Sucursal {
              ID
              Nombre
              CodigoSucursal
              Telefono
              Direccion
              TelfInterno
              Correo
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
      `,
      data: null,
      load: false
    };
  },
  components: { CartaProveedor, CartaSucursal, Carta },
  props: {
    id: {
      type: Number
    }
  },
  methods: {
    actualizar_data(a) {
      if (a) {
        this.obtenerInfo();
      }
    },
    recibir_INFO_Sucursal(a) {
      if (a != null) {
        this.$router.push("/Sucursal/" + a.ID);
      }
    },
    recibir_INFO_Proveedor(a) {
      if (a != null) {
        this.$router.push("/Proveedor/" + a.ID);
      }
    },
    async obtenerInfo() {
      this.load = true;
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            ID: this.id
          }
        })
        .then(result => {
          this.data = result.data.extintor;
          this.load = false;
        });
    }
  },
  created() {
    this.obtenerInfo();
  }
};
</script>
