<template>
  <div class="ComboNombre">
    <b-overlay :show="c_s" rounded="sm">
      <a-select default-value="" v-model="valor" show-search placeholder=".." option-filter-prop="children" style="width: 100%;" :filter-option="filterOption" @focus="handleFocus" @blur="handleBlur" @change="change()" >
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
  name: "ComboNombre",
  data() {
    return {
      valor: null,
      c_s: false,
      valores: [],
      guardia: gql`
        query guardias_suc_empr(
          $Horario: Int!
          $Sucursal: Int!
          $Empresa: Int!
        ) {
          guardias_suc_empr(
            Horario: $Horario
            Sucursal: $Sucursal
            Empresa: $Empresa
          ) {
            Guardia_Sucursal {
              Guardia {
                ID
                Nombre
                Telefono
                Precio
              }
            }
          }
        }
      `
    };
  },
  props: {
    tipo: {
      type: String
    },
    dato: {
      type: [String, Number]
    },
    Sucursal: {
      type: [String, Number]
    },
    Empresa: {
      type: [String, Number]
    },
    Horario: {
      type: [String, Number]
    }
  },
  watch: {
    Sucursal: {
      immediate: true,
      handler(val, oldVal) {
        //nuevo--anterior
        if (val != null && oldVal != null) {
          if (val != oldVal) {
            if (this.Empresa != null && this.Horario != 0) {
              this.consultar();
            }
          }
        }
      }
    },
    Empresa: {
      immediate: true,
      handler(val, oldVal) {
        //nuevo--anterior
        if (val != null && oldVal != null) {
          if (val != oldVal) {
            if (this.Sucursal != null && this.Horario != 0) {
              this.consultar();
            }
          }
        }
      }
    },
    Horario: {
      immediate: true,
      handler(val, oldVal) {
        //nuevo--anterior
        console.log(val, oldVal);
        if (val != null && oldVal != null) {
          if (val != oldVal) {
            if (this.Sucursal != null && this.Empresa != null && this.Horario != 0) {
              this.consultar();
            }
          }
        }
      }
    }
  },
  methods: {
    handleBlur() {
      console.log('blur');
    },
    handleFocus() {
      console.log('focus');
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    change() {
      this.$emit("change", this.valor);
    },
    async consultar() {
      this.c_s = true;
      await this.$apollo
        .query({
          query: this.guardia,
          variables: {
            Sucursal: parseInt(this.Sucursal),
            Empresa: parseInt(this.Empresa),
            Horario: parseInt(this.Horario)
          }
        })
        .then(result => {
          this.asignar_valores(result.data);
          this.c_s = false;
          if (this.dato != null) {
            this.valor = this.dato;
          }
        });
    },
    asignar_valores(obj) {
      let x = [];
      this.valores = [];
      if (obj.guardias_suc_empr != null) {
        x = obj.guardias_suc_empr.Guardia_Sucursal;
        for (let index = 0; index < x.length; index++) {
          if (x[index]["Guardia"] != null) {
            this.valores.push({
              value: x[index]["Guardia"]["ID"],
              text: x[index]["Guardia"]["Nombre"]
            });
          }
        }
      }
    }
  },
  mounted() {
    this.consultar();
  }
};
</script>
