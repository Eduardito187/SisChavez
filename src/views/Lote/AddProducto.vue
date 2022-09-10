<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="columna d-flex justify-content-center">
        <div class="col-md-6">
          <div class="vue-tempalte">
            <b-card bg-variant="light">
              <b-overlay :show="validacionR" rounded="sm">
                <b-form-group
                  label-cols-lg="12"
                  label="Registrar Producto"
                  label-size="lg"
                  label-class="font-weight-bold pt-0"
                  class="mb-0 col-md-12"
                >
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group
                      class="col-md-5"
                      label="Nombre:"
                      label-for="Nombre"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <b-form-input
                        id="Nombre"
                        type="text"
                        v-model="Nombre"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      class="col-md-5"
                      label="Factura:"
                      label-for="Factura"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <b-form-input
                        id="Factura"
                        type="text"
                        v-model="Factura"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group
                      class="col-md-5"
                      label="Modelo:"
                      label-for="Modelo"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <b-form-input
                        id="Modelo"
                        type="text"
                        v-model="Modelo"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      class="col-md-5"
                      label="Costo:"
                      label-for="Costo"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <a-input-number id="Costo" v-model="Costo" :min="1" />
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group
                      class="col-md-5"
                      label="Cantidad:"
                      label-for="Cantidad"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <a-input-number
                        id="Cantidad"
                        v-model="Cantidad"
                        :min="1"
                      />
                    </b-form-group>
                    <b-form-group
                      class="col-md-5"
                      label="Proveedor:"
                      label-for="Proveedor"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <ComboNombre
                        tipo="proveedor"
                        @change="Proveedor = $event"
                      />
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group
                      class="col-md-5"
                      label="Lote:"
                      label-for="Lote"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <ComboNombre tipo="lotes" @change="Lote = $event" />
                    </b-form-group>
                  </div>
                  <Button
                    @click="registrar()"
                    type="primary"
                    :loading="validacionR"
                    icon="check"
                    >Registrar</Button
                  >
                </b-form-group>
              </b-overlay>
            </b-card>
          </div>
        </div>
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
import ComboNombre from "../../components/ComboNombre.vue";
import gql from "graphql-tag";
import { Button } from "ant-design-vue";
export default {
  data() {
    return {
      validacionR: false,
      Nombre: "",
      Factura: "",
      Modelo: "",
      Proveedor: null,
      Costo: 0,
      Cantidad: 1,
      Lote: null,
      permiso: null
    };
  },
  components: { ComboNombre, Button },
  methods: {
    async registrar() {
      const add = gql`
        mutation addProducto(
          $Factura: String!
          $Nombre: String!
          $Modelo: String!
          $Proveedor: Int!
          $Costo: Int!
          $Cantidad: Int!
          $Lote: Int!
        ) {
          addProducto(
            Factura: $Factura
            Nombre: $Nombre
            Modelo: $Modelo
            Proveedor: $Proveedor
            Costo: $Costo
            Cantidad: $Cantidad
            Lote: $Lote
          ) {
            Respuesta
          }
        }
      `;
      this.validacionR = true;
      await this.$apollo
        .mutate({
          mutation: add,
          variables: {
            Factura: this.Factura,
            Nombre: this.Nombre,
            Modelo: this.Modelo,
            Proveedor: parseInt(this.Proveedor),
            Costo: parseInt(this.Costo),
            Cantidad: parseInt(this.Cantidad),
            Lote: parseInt(this.Lote)
          }
        })
        .then(result => {
          if (result.data.addProducto.Respuesta) {
            this.$message.success("Producto Registrado");
            this.$socket.emit("Sumar_Linea", true);
            this.validacionR = false;
            this.Factura = "";
            this.Nombre = "";
            this.Modelo = "";
            this.Proveedor = null;
            this.Costo = 0;
            this.Cantidad = 0;
            this.Lote = null;
          }
        });
    }
  },
  mounted() {},
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
          Code: "P14"
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        if (result.data.saber_permiso != null) {
          if (result.data.saber_permiso.Respuesta != null) {
            this.permiso = result.data.saber_permiso.Respuesta;
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
