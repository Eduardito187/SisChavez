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
                  label="Registrar Recepcion"
                  label-size="lg"
                  label-class="font-weight-bold pt-0"
                  class="mb-0 col-md-12"
                >
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group
                      class="col-md-5"
                      label="Entregado:"
                      label-for="Entregado"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <b-form-textarea
                        id="Entregado"
                        v-model="Entregado"
                        placeholder="Entregado.."
                        rows="3"
                        max-rows="3"
                      ></b-form-textarea>
                    </b-form-group>
                    <b-form-group
                      class="col-md-5"
                      label="Descripcion:"
                      label-for="Descripcion"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <b-form-textarea
                        id="Descripcion"
                        v-model="Descripcion"
                        placeholder="Descripcion.."
                        rows="3"
                        max-rows="3"
                      ></b-form-textarea>
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
      Entregado: "",
      Descripcion: "",
      id_cuenta: null,
      permiso: null
    };
  },
  methods: {
    async registrar() {
      const add = gql`
        mutation addRecepcion(
          $Responsable: Int!
          $Entregado: String!
          $Descripcion: String!
        ) {
          addRecepcion(
            Responsable: $Responsable
            Entregado: $Entregado
            Descripcion: $Descripcion
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
            Responsable: this.id_cuenta,
            Entregado: this.Entregado,
            Descripcion: this.Descripcion
          }
        })
        .then(result => {
          if (result.data.addRecepcion.Respuesta) {
            this.validacionR = false;
            this.Entregado = "";
            this.Descripcion = "";
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    }
  },
  async created() {
    if (localStorage.id_cuenta != null) {
      this.id_cuenta = parseInt(localStorage.id_cuenta);
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
            Cuenta: this.id_cuenta,
            Code: "P26"
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
