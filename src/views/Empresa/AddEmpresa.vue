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
                  label="Nueva Empresa de Seguridad"
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
                      label="Direccion:"
                      label-for="Direccion"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <b-form-input
                        id="Direccion"
                        type="text"
                        v-model="Direccion"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      class="col-md-5"
                      label="Correo Electronico:"
                      label-for="Correo"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <b-form-input
                        id="Correo"
                        type="email"
                        v-model="Correo"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group
                      class="col-md-5"
                      label="Supervisores:"
                      label-for="Supervisores"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <b-form-input
                        id="Supervisores"
                        type="text"
                        v-model="Supervisores"
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
import gql from "graphql-tag";
export default {
  data() {
    return {
      validacionR: false,
      Nombre: "",
      Telefono: "",
      Direccion: "",
      Correo: "",
      Supervisores: "",
      permiso: null
    };
  },
  methods: {
    async registrar() {
      const add = gql`
        mutation addEmpresa(
          $Nombre: String!
          $Telefono: String!
          $Direccion: String!
          $Correo: String!
          $Supervisores: String!
        ) {
          addEmpresa(
            Nombre: $Nombre
            Telefono: $Telefono
            Direccion: $Direccion
            Correo: $Correo
            Supervisores: $Supervisores
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
            Correo: this.Correo,
            Supervisores: this.Supervisores
          }
        })
        .then(result => {
          if (result.data.addEmpresa.Respuesta) {
            this.$socket.emit("Sumar_Linea", true);
            this.validacionR = false;
            this.Nombre = "";
            this.Telefono = "";
            this.Direccion = "";
            this.Correo = "";
            this.Supervisores = "";
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
          Code: "P29"
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
