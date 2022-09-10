<template>
  <div class="crearguardia columna">
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
                      label="Registrar Guardia"
                      label-size="lg"
                      label-class="font-weight-bold pt-0"
                      class="mb-0 col-md-12"
                    >
                      <div class="d-flex justify-content-between">
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
                          label="Telefono:"
                          label-for="Telefono"
                          label-cols-sm="12"
                          label-align-sm="right"
                        >
                          <b-form-input
                            id="Telefono"
                            type="text"
                            v-model="Telefono"
                          ></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <b-form-group
                          class="col-md-5"
                          label="Precio:"
                          label-for="Precio"
                          label-cols-sm="12"
                          label-align-sm="right"
                        >
                          <b-form-input
                            id="Precio"
                            type="number"
                            v-model="Precio"
                          ></b-form-input>
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
                        </b-form-group>
                      </div>
                      <div
                        v-if="Empresa != null"
                        class="d-flex justify-content-between mb-2"
                      >
                        <b-form-group
                          class="col-md-12"
                          label="Empresa:"
                          label-for="Empresa"
                          label-cols-sm="12"
                          label-align-sm="right"
                        >
                          <LLAVETIME
                            tipo="empresa_guardia"
                            :Empresa="Empresa"
                            @change="LLAVE = $event"
                          />
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
import LLAVETIME from "./LLAVETIME.vue";
import gql from "graphql-tag";
export default {
  name: "crearguardia",
  data() {
    return {
      validacionR: false,
      Nombre: "",
      Telefono: "",
      Precio: 0,
      Empresa: null,
      LLAVE: null
    };
  },
  components: { ComboNombre, LLAVETIME },
  methods: {
    async registrar() {
      const add = gql`
        mutation addGuardia(
          $Nombre: String!
          $Telefono: String!
          $Precio: Int!
          $LLAVE: Int!
        ) {
          addGuardia(
            Nombre: $Nombre
            Telefono: $Telefono
            Precio: $Precio
            LLAVE: $LLAVE
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
            Nombre: this.Nombre,
            Telefono: this.Telefono,
            Precio: parseInt(this.Precio),
            LLAVE: parseInt(this.LLAVE)
          }
        })
        .then(result => {
          if (result.data.addGuardia.Respuesta) {
            this.validacionR = false;
            this.Nombre = "";
            this.Telefono = "";
            this.Precio = 0;
            this.Empresa = null;
            this.LLAVE = null;
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    }
  },
  mounted() {}
};
</script>
