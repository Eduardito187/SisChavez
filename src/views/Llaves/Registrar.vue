<template>
  <div>
    <div class="ancho">
      <div v-if="permiso" class="columna d-flex justify-content-center">
        <div class="col-md-6">
          <div class="vue-tempalte">
            <b-card bg-variant="light">
              <b-overlay :show="validacionR" rounded="sm">
                <b-form-group
                  label-cols-lg="12"
                  label="Control de Llaves"
                  label-size="lg"
                  label-class="font-weight-bold pt-0"
                  class="mb-0 col-md-12"
                >
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group
                      class="col-md-5"
                      label="Entrega:"
                      label-for="Entrega"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <b-form-textarea
                        id="Entrega"
                        v-model="Entrega"
                        placeholder="Entrega.."
                        rows="3"
                        max-rows="3"
                      ></b-form-textarea>
                    </b-form-group>
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
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group
                      class="col-md-5"
                      label="Sucursales:"
                      label-for="Sucursales"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <ComboNombre
                        tipo="sucursales"
                        @change="Sucursal = $event"
                      />
                    </b-form-group>
                  </div>
                  <Button
                    v-if="Sucursal != null"
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
      <div
        v-else-if="permiso == false"
        class="columna d-flex justify-content-center"
      >
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
      <a-spin v-else size="large" />
    </div>
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
      Entrega: "",
      Observacion: "",
      Sucursal: null,
      ID_Cuenta: null,
      permiso: null
    };
  },
  components: { ComboNombre, Button },
  methods: {
    async registrar() {
      const add = gql`
        mutation addControlLLAVES(
          $Entrega: String!
          $Observacion: String!
          $Sucursal: Int!
          $Responsable: Int!
        ) {
          addControlLLAVES(
            Entrega: $Entrega
            Observacion: $Observacion
            Sucursal: $Sucursal
            Responsable: $Responsable
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
            Entrega: this.Entrega,
            Observacion: this.Observacion,
            Sucursal: parseInt(this.Sucursal),
            Responsable: this.ID_Cuenta
          }
        })
        .then(result => {
          if (result.data.addControlLLAVES.Respuesta) {
            this.$message.success("Registro Exitoso");
            this.validacionR = false;
            this.Entrega = "";
            this.Observacion = "";
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    }
  },
  mounted() {
    if (localStorage.id_cuenta != null) {
      this.ID_Cuenta = parseInt(localStorage.id_cuenta);
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
          Code: "P2"
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
