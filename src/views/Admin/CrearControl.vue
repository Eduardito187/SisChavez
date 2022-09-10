<template>
  <div class="crearcontrol columna">
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
                      label="Control Diario"
                      label-size="lg"
                      label-class="font-weight-bold pt-0"
                      class="mb-0 col-md-12"
                    >
                      <div class="d-flex justify-content-between">
                        <b-form-group
                          class="col-md-5"
                          label="Sucursal:"
                          label-for="Nombre"
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
                          label="Empresa:"
                          label-for="Empresa"
                          label-cols-sm="12"
                          label-align-sm="right"
                        >
                          <ComboNombre
                            tipo="empresa_guardia"
                            @change="Empresa = $event"
                          />
                          <IngresoSalida
                            v-if="Sucursal != null && Empresa != null"
                            :Llegada="Llegada"
                            @tiempo="Retraso = $event"
                            :id_sucursal="Sucursal"
                            :id_empresa="Empresa"
                          />
                        </b-form-group>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <b-form-group
                          class="col-md-5"
                          label="Guardia:"
                          label-for="Guardia"
                          label-cols-sm="12"
                          label-align-sm="right"
                        >
                          <ComboNombre
                            tipo="guardia"
                            @change="Guardia = $event"
                          />
                        </b-form-group>
                        <b-form-group
                          class="col-md-5"
                          label="Retraso:"
                          label-cols-sm="12"
                          label-align-sm="right"
                        >
                          <b>{{ Retraso }} minutos</b>
                        </b-form-group>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <b-form-group
                          class="col-md-5"
                          label="Observacion:"
                          label-for="Observacion"
                          label-cols-sm="12"
                          label-align-sm="right"
                        >
                          <b-form-textarea
                            id="Observacion"
                            v-model="Observacion"
                            placeholder="Observacion.."
                            rows="3"
                            max-rows="3"
                          ></b-form-textarea>
                        </b-form-group>
                        <b-form-group
                          class="col-md-5"
                          label="Llegada:"
                          label-for="Llegada"
                          label-cols-sm="12"
                          label-align-sm="right"
                        >
                          <b-form-timepicker
                            v-model="Llegada"
                            id="Llegada"
                            :state="Llegada != '' ? true : false"
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
import IngresoSalida from "./IngresoSalida.vue";
import gql from "graphql-tag";
export default {
  name: "crearcontrol",
  data() {
    return {
      validacionR: false,
      Sucursal: null,
      Empresa: null,
      Guardia: null,
      Llegada: "",
      Observacion: "",
      Retraso: 0
    };
  },
  components: { ComboNombre, IngresoSalida },
  methods: {
    async registrar() {
      const add = gql`
        mutation addControl(
          $Sucursal: Int!
          $Empresa: Int!
          $Guardia: Int!
          $Calculo: Int!
          $Observacion: String!
        ) {
          addControl(
            Sucursal: $Sucursal
            Empresa: $Empresa
            Guardia: $Guardia
            Calculo: $Calculo
            Observacion: $Observacion
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
            Guardia: this.Guardia,
            Calculo: this.Retraso,
            Observacion: this.Observacion
          }
        })
        .then(result => {
          if (result.data.addControl.Respuesta) {
            this.validacionR = false;
            this.Sucursal = null;
            this.Empresa = null;
            this.Guardia = null;
            this.Llegada = "";
            this.Observacion = "";
            this.Retraso = 0;
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    }
  },
  mounted() {}
};
</script>
