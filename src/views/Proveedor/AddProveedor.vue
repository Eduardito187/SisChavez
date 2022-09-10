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
                  label="Nuevo Proveedor"
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
                      <b-form-input id="Nombre" v-model="Nombre"></b-form-input>
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
                        v-model="Telefono"
                      ></b-form-input>
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
                      <b-form-textarea
                        id="Direccion"
                        v-model="Direccion"
                        placeholder="Direccion.."
                        rows="3"
                        max-rows="3"
                      ></b-form-textarea>
                    </b-form-group>
                    <b-form-group
                      class="col-md-5"
                      label="Correo:"
                      label-for="Correo"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <b-form-input id="Correo" v-model="Correo"></b-form-input>
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
import gql from "graphql-tag";
export default {
  data() {
    return {
      validacionR: false,
      Nombre: "",
      Telefono: "",
      Direccion: "",
      Correo: "",
      permiso: null
    };
  },
  methods: {
    async registrar() {
      const add = gql`
        mutation addProveedor(
          $Nombre: String!
          $Telefono: String!
          $Direccion: String!
          $Correo: String!
        ) {
          addProveedor(
            Nombre: $Nombre
            Telefono: $Telefono
            Direccion: $Direccion
            Correo: $Correo
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
            Direccion: this.Direccion,
            Correo: this.Correo
          }
        })
        .then(result => {
          if (result.data.addProveedor.Respuesta) {
            this.validacionR = false;
            this.Nombre = "";
            this.Telefono = "";
            this.Direccion = "";
            this.Correo = "";
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    }
  },
  async created() {
    if (localStorage.id_cuenta == null) {
      this.$router.push("/");
    } else {
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
            Code: "P23"
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
  }
};
</script>
