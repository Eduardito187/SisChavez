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
                      label="Ingreso:"
                      label-for="Ingreso"
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
                      label="Salida:"
                      label-for="Salida"
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
      Sucursal: null,
      Empresa: null,
      Ingreso: "",
      Salida: "",
      permiso: null
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
          Code: "P35"
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
