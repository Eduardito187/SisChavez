<template>
  <div class="EditarAPI sumer">
    <b-overlay :show="validacionR" rounded="sm">
      <b-card class="radius pointer">
        <b style="position:absolute;z-index:10;top:-3px;left:0"
          >{{ titulo }}:</b
        >
        <div
          v-if="columna == 'Tipo' && tipo == 'editExtintor'"
          class="col-md-12"
        >
          <div class="col-md-12 mt-1 mb-1">
            <b-form-select
              v-model="valor"
              class="form-control"
              :options="tipos"
            ></b-form-select>
          </div>
          <div class="col-md-12">
            <b-button @click="editar(valor)" variant="primary"
              >Actualizar {{ titulo }}</b-button
            >
          </div>
        </div>
        <b-card-text
          v-else-if="
            columna != 'Recargo' &&
              columna != 'Sucursal' &&
              columna != 'Proveedor'
          "
          @click="editar_dato()"
          >{{ valor }}</b-card-text
        >
        <div v-if="columna == 'Recargo'" class="col-md-12">
          <b-form-datepicker
            class="mt-1 mb-1"
            v-model="valor"
          ></b-form-datepicker>
          <b-button @click="editar(valor)" variant="primary"
            >Actualizar {{ titulo }}</b-button
          >
        </div>
        <ComboNombre
          v-if="columna == 'Sucursal'"
          tipo="sucursales"
          :dato="valor"
          @change="editar($event)"
        />
        <ComboNombre
          v-if="columna == 'Proveedor'"
          tipo="proveedor"
          :dato="valor"
          @change="editar($event)"
        />
      </b-card>
    </b-overlay>
  </div>
</template>

<script>
import ComboNombre from "./ComboNombre.vue";
export default {
  name: "EditarAPI",
  data() {
    return {
      validacionR: false,
      tipos: [{ value: "ABC", text: "ABC" }, { value: "CO2", text: "CO2" }]
    };
  },
  components: { ComboNombre },
  props: {
    id: {
      type: Number
    },
    titulo: {
      type: String
    },
    valor: {
      type: [String, Number]
    },
    consulta: {
      type: Object
    },
    tipo: {
      type: String
    },
    columna: {
      type: String
    }
  },
  methods: {
    saber_variables(a) {
      let x;
      if (this.tipo == "editSucursal") {
        if (this.columna == "Nombre") {
          x = { ID: this.id, Nombre: a };
        } else if (this.columna == "CodigoSucursal") {
          x = { ID: this.id, CodigoSucursal: a };
        } else if (this.columna == "Telefono") {
          x = { ID: this.id, Telefono: a };
        } else if (this.columna == "Direccion") {
          x = { ID: this.id, Direccion: a };
        } else if (this.columna == "TelfInterno") {
          x = { ID: this.id, TelfInterno: a };
        } else if (this.columna == "Correo") {
          x = { ID: this.id, Correo: a };
        }
      } else if (this.tipo == "editProveedor") {
        if (this.columna == "Nombre") {
          x = { ID: this.id, Nombre: a };
        } else if (this.columna == "Telefono") {
          x = { ID: this.id, Telefono: a };
        } else if (this.columna == "Direccion") {
          x = { ID: this.id, Direccion: a };
        } else if (this.columna == "Correo") {
          x = { ID: this.id, Correo: a };
        }
      } else if (this.tipo == "editExtintor") {
        if (this.columna == "Peso") {
          x = { ID: this.id, Peso: a };
        } else if (this.columna == "Tipo") {
          x = { ID: this.id, Tipo: a };
        } else if (this.columna == "Cantidad") {
          x = { ID: this.id, Cantidad: parseInt(a) };
        } else if (this.columna == "Observacion") {
          x = { ID: this.id, Observacion: a };
        } else if (this.columna == "Recargo") {
          x = { ID: this.id, Recargo: a };
        } else if (this.columna == "Sucursal") {
          x = { ID: this.id, Sucursal: parseInt(a) };
        } else if (this.columna == "Proveedor") {
          x = { ID: this.id, Proveedor: parseInt(a) };
        }
      }
      return x;
    },
    editar_dato() {
      var a = prompt(this.titulo, this.valor);
      if (a != null) {
        if (a != this.valor) {
          this.editar(a);
        }
      }
    },
    async editar(a) {
      this.validacionR = true;
      await this.$apollo
        .mutate({
          mutation: this.consulta,
          variables: this.saber_variables(a)
        })
        .then(result => {
          if (result.data != null) {
            if (this.tipo == "editSucursal") {
              if (result.data.editSucursal.Respuesta) {
                this.validacionR = false;
                this.$emit("actualizar", true);
                this.$emit("valor", a);
              }
            } else if (this.tipo == "editProveedor") {
              if (result.data.editProveedor.Respuesta) {
                this.validacionR = false;
                this.$emit("actualizar", true);
                this.$emit("valor", a);
              }
            } else if (this.tipo == "editExtintor") {
              if (result.data.editExtintor.Respuesta) {
                this.validacionR = false;
                this.$emit("actualizar", true);
                this.$emit("valor", a);
              }
            }
          }
        });
    }
  }
};
</script>
