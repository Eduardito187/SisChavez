<template>
  <div class="llavetime">
    <b-overlay :show="c_s" rounded="sm">
      <a-select
        default-value=""
        v-model="valor"
        style="width: 100%;"
        @change="change()"
      >
        <a-select-option v-for="d in valores" :key="d.text" :value="d.value">
          {{ d.text }}
        </a-select-option>
      </a-select>
    </b-overlay>
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: "llavetime",
  data() {
    return {
      valor: null,
      c_s: false,
      valores: [],
      consulta: gql`
        query empresa_guardia_sucursal_llave_empresa($Empresa: Int!) {
          empresa_guardia_sucursal_llave_empresa(Empresa: $Empresa) {
            ID
            Ingreso
            Salida
            Sucursal {
              ID
              Nombre
            }
          }
        }
      `
    };
  },
  props: {
    Empresa: {
      type: [String, Number]
    }
  },
  watch: {
    Empresa: {
      immediate: true,
      handler(val, oldVal) {
        //nuevo--anterior
        if (val != null && oldVal != null) {
          if (val != oldVal) {
            if (this.Empresa != null) {
              this.valor = null;
              this.consultar();
            }
          }
        }
      }
    }
  },
  methods: {
    change() {
      this.$emit("change", this.valor);
    },
    async consultar() {
      this.c_s = true;
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            Empresa: this.Empresa
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.asignar_valores(result.data);
          this.c_s = false;
          this.change();
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    asignar_valores(obj) {
      let x = [];
      this.valores = [];
      x = obj.empresa_guardia_sucursal_llave_empresa;
      for (let index = 0; index < x.length; index++) {
        this.valores.push({
          value: x[index]["ID"],
          text:
            x[index]["Ingreso"] +
            "/" +
            x[index]["Salida"] +
            " -- " +
            x[index]["Sucursal"]["Nombre"]
        });
      }
    }
  },
  created() {
    if (this.Empresa != null) {
      this.consultar();
    }
  }
};
</script>
