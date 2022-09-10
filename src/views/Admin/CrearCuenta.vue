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
                  label="Nueva Cuenta"
                  label-size="lg"
                  label-class="font-weight-bold pt-0"
                  class="mb-0 col-md-12"
                >
                  <div class="d-flex justify-content-between">
                    <b-form-group
                      class="col-md-5"
                      label="Rango:"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <ComboNombre tipo="rangos" @change="Rango = $event" />
                    </b-form-group>
                    <b-form-group
                      class="col-md-5"
                      label="Usuario:"
                      label-for="Usuario"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <b-form-input
                        id="Usuario"
                        type="text"
                        v-model="Usuario"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group
                      class="col-md-5"
                      label="Contraseña:"
                      label-for="Contra"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <b-form-input
                        id="Contra"
                        type="password"
                        v-model="Contra"
                      ></b-form-input>
                    </b-form-group>
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
export default {
  data() {
    return {
      validacionR: false,
      Rango: null,
      Usuario: "",
      Contra: "",
      Nombre: "",
      permiso: null
    };
  },
  components: { ComboNombre },
  methods: {
    async registrar() {
      const add = gql`
        mutation addCuenta(
          $RangoID: Int!
          $usuario: String!
          $contra: String!
          $nombre: String!
        ) {
          addCuenta(
            RangoID: $RangoID
            usuario: $usuario
            contra: $contra
            nombre: $nombre
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
            RangoID: this.Rango,
            usuario: this.Usuario,
            contra: this.Contra,
            nombre: this.Nombre
          }
        })
        .then(result => {
          if (result.data.addCuenta.Respuesta) {
            this.validacionR = false;
            this.Rango = null;
            this.Usuario = "";
            this.Contra = "";
            this.Nombre = "";
            this.$socket.emit("nueva_cuenta", true);
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    }
  },
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
          Code: "P41"
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
