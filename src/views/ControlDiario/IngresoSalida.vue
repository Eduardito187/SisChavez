<template>
  <div class="SucursalInfo">
    <b-overlay :show="load" rounded="sm">
      <b-row v-if="data != null">
        <b>{{ data.Ingreso }}/{{ data.Salida }}</b>
      </b-row>
    </b-overlay>
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: "SucursalInfo",
  data() {
    return {
      consulta: gql`
        query sucursales($Sucursal: Int!, $Empresa: Int!) {
          empresa_guardia_sucursal_llave(
            Sucursal: $Sucursal
            Empresa: $Empresa
          ) {
            Ingreso
            Salida
          }
        }
      `,
      data: null,
      load: false,
      time: 0
    };
  },
  props: {
    id_sucursal: {
      type: Number
    },
    id_empresa: {
      type: Number
    },
    Llegada: {
      type: String
    }
  },
  watch: {
    id_sucursal: {
      immediate: true,
      handler(val, oldVal) {
        //nuevo--anterior
        if (val != null && oldVal != null) {
          if (val != oldVal) {
            if (this.id_empresa != null) {
              this.obtenerInfo();
            }
          }
        }
      }
    },
    id_empresa: {
      immediate: true,
      handler(val, oldVal) {
        //nuevo--anterior
        if (val != null && oldVal != null) {
          if (val != oldVal) {
            if (this.id_sucursal != null) {
              this.obtenerInfo();
            }
          }
        }
      }
    },
    Llegada: {
      immediate: true,
      handler(val, oldVal) {
        //nuevo--anterior
        if (val != null && oldVal != null) {
          if (val != oldVal) {
            if (this.data != null) {
              this.calculo();
            }
          }
        }
      }
    }
  },
  methods: {
    async obtenerInfo() {
      this.load = true;
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            Sucursal: this.id_sucursal,
            Empresa: this.id_empresa
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.empresa_guardia_sucursal_llave;
          if (this.Llegada != "" && this.data != null) {
            this.calculo();
          }
          this.load = false;
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    async calculo() {
      if (this.data.Ingreso != null) {
        var fecha = "Oct 13 2000 " + this.Llegada + " GMT-0400";
        fecha = new Date(fecha);
        var cadf = "Oct 13 2000 " + this.data.Ingreso + " GMT-0400";
        var f1 = new Date(cadf);
        if (fecha != null && f1 != null) {
          var time = fecha - f1;
          var min = parseInt(time / (1000 * 60));
          if (min <= 0) {
            this.time = 0;
          } else {
            this.time = min;
          }
          this.$emit("tiempo", this.time);
          console.log(this.time);
        } else {
          this.$emit("tiempo", 0);
        }
      }
    }
  },
  created() {
    this.obtenerInfo();
  }
};
</script>
