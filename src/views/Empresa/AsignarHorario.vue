<template>
  <div class="asignarhorario columna">
    <div class="col-md-12" style="margin-top:60px;">
      <div class="columna fondo abajo">
        <div class="ancho">
          <div class="columna d-flex justify-content-center">
            <div class="col-md-6">
              <div class="vue-tempalte">
                <b-card bg-variant="light">
                  <b-overlay :show="validacionR" rounded="sm">
                    <b-form-group
                      label-cols-lg="12"
                      label="Asignacion de Horario"
                      label-size="lg"
                      label-class="font-weight-bold pt-0"
                      class="mb-0 col-md-12"
                    >
                      <div class="d-flex justify-content-between">
                        <b-form-group
                          class="col-md-5"
                          label="Sucursal:"
                          label-cols-sm="12"
                          label-align-sm="right"
                        >
                          <ComboNombre
                            tipo="sucursales"
                            @change="Sucursal = $event"
                          />
                        </b-form-group>
                        <b-form-group
                          class="col-md-5"
                          label="Empresa de Seguridad:"
                          label-cols-sm="12"
                          label-align-sm="right"
                        >
                          <ComboNombre
                            tipo="empresa_guardia"
                            @change="Empresa = $event"
                          />
                        </b-form-group>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <b-form-group
                          class="col-md-5"
                          label="Direccion:"
                          label-for="Direccion"
                          label-cols-sm="12"
                          label-align-sm="right"
                        >
                          <b-form-timepicker
                            v-model="Ingreso"
                            id="Ingreso"
                            :state="Ingreso != '' ? true : false"
                            class="mb-2"
                          ></b-form-timepicker>
                        </b-form-group>
                        <b-form-group
                          class="col-md-5"
                          label="Correo Electronico:"
                          label-for="Correo"
                          label-cols-sm="12"
                          label-align-sm="right"
                        >
                          <b-form-timepicker
                            v-model="Salida"
                            id="Salida"
                            :state="Salida != '' ? true : false"
                            class="mb-2"
                          ></b-form-timepicker>
                        </b-form-group>
                      </div>
                      <b-button
                        @click="registrar()"
                        :disabled="validacionR"
                        pill
                        variant="primary"
                        >Registrar</b-button
                      >
                    </b-form-group>
                  </b-overlay>
                </b-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
import ComboNombre from "../../components/ComboNombre.vue";
import gql from "graphql-tag";
export default {
  name: "asignarhorario",
  data() {
    return {
      validacionR: false,
      Sucursal: null,
      Empresa: null,
      Ingreso: "",
      Salida: ""
    };
  },
  components: { ComboNombre },
  methods: {
    async registrar() {
      const add = gql`
        mutation addEmpresaGuardiaSucursal(
          $Sucursal: Int!
          $Empresa: Int!
          $Ingreso: String!
          $Salida: String!
        ) {
          addEmpresaGuardiaSucursal(
            Sucursal: $Sucursal
            Empresa: $Empresa
            Ingreso: $Ingreso
            Salida: $Salida
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
            Sucursal: this.Sucursal,
            Empresa: this.Empresa,
            Ingreso: this.Ingreso,
            Salida: this.Salida
          }
        })
        .then(result => {
          if (result.data.addEmpresaGuardiaSucursal.Respuesta) {
            this.validacionR = false;
            this.Sucursal = "";
            this.Empresa = "";
            this.Ingreso = "";
            this.Salida = "";
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    }
  },
  mounted() {}
};
</script>
