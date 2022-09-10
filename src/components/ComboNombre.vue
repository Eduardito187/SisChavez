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
      resposables: gql`
        query {
          ResponsablesHabil {
            ID
            nombre
          }
        }
      `,
      encargados: gql`
        query {
          Encargados {
            ID
            Nombre
            Apellido
            CI
          }
        }
      `,
      trabajadores: gql`
        query {
          Trabajadores {
            ID
            Nombre
            Apellido
            CI
          }
        }
      `,
      cuentas: gql`
        query {
          cuentas {
            ID
            nombre
          }
        }
      `,
      sucursales: gql`
        query {
          sucursales {
            ID
            Nombre
          }
        }
      `,
      proveedor: gql`
        query {
          proveedores {
            ID
            Nombre
          }
        }
      `,
      prioridad: gql`
        query {
          prioridades {
            ID
            Nombre
          }
        }
      `,
      lotes: gql`
        query {
          lotes {
            ID
            Nombre
          }
        }
      `,
      guardia: gql`
        query {
          guardias {
            ID
            Nombre
          }
        }
      `,
      empresa_guardia: gql`
        query {
          empresa_guardias {
            ID
            Nombre
          }
        }
      `,
      rangos: gql`
        query {
          rangos {
            ID
            Nombre
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
    async consultar(a) {
      this.c_s = true;
      await this.$apollo
        .query({
          query: a,
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.asignar_valores(result.data);
          this.c_s = false;
          if (this.dato != null) {
            this.valor = this.dato;
          }
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    asignar_valores(obj) {
      let x = [];
      this.valores = [];
      if (this.tipo == "sucursales") {
        x = obj.sucursales;
      } else if (this.tipo == "proveedor") {
        x = obj.proveedores;
      } else if (this.tipo == "prioridad") {
        x = obj.prioridades;
      } else if (this.tipo == "lotes") {
        x = obj.lotes;
      } else if (this.tipo == "guardia") {
        x = obj.guardias;
      } else if (this.tipo == "empresa_guardia") {
        x = obj.empresa_guardias;
      } else if (this.tipo == "rangos") {
        x = obj.rangos;
      } else if (this.tipo == "cuentas") {
        x = obj.cuentas;
      } else if (this.tipo == "trabajadores"){
        x=obj.Trabajadores;
      } else if (this.tipo == "encargados"){
        x=obj.Encargados;
      } else if (this.tipo == "resposables"){
        x=obj.ResponsablesHabil;
      }
      let t = "";
      for (let index = 0; index < x.length; index++) {
        if (x[index]["Nombre"] != null) {
          t = x[index]["Nombre"];
        } else if (x[index]["nombre"] != null) {
          t = x[index]["nombre"];
        }
        if (x[index]["Apellido"]!=null) {
          t=t+" "+x[index]["Apellido"];
        }
        this.valores.push({ value: x[index]["ID"], text: t });
      }
    }
  },
  created() {
    if (this.tipo == "sucursales") {
      this.consultar(this.sucursales);
    } else if (this.tipo == "proveedor") {
      this.consultar(this.proveedor);
    } else if (this.tipo == "prioridad") {
      this.consultar(this.prioridad);
    } else if (this.tipo == "lotes") {
      this.consultar(this.lotes);
    } else if (this.tipo == "guardia") {
      this.consultar(this.guardia);
    } else if (this.tipo == "empresa_guardia") {
      this.consultar(this.empresa_guardia);
    } else if (this.tipo == "rangos") {
      this.consultar(this.rangos);
    } else if (this.tipo == "cuentas") {
      this.consultar(this.cuentas);
    } else if (this.tipo == "trabajadores"){
      this.consultar(this.trabajadores);
    } else if(this.tipo == "encargados"){
      this.consultar(this.encargados);
    } else if(this.tipo == "resposables"){
      this.consultar(this.resposables);
    }
  }
};
</script>
