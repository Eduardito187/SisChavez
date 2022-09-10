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
                        @ID="ID_HORARIO = $event"
                        :id_sucursal="Sucursal"
                        :id_empresa="Empresa"
                      />
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group
                      v-if="Sucursal != null && Empresa != null && ID_HORARIO != 0" style="margin-top:5px;"
                      class="col-md-5"
                      label="Guardia:"
                      label-for="Guardia"
                      label-cols-sm="12"
                      label-align-sm="right"
                    >
                      <ComboGuardia
                        :Sucursal="Sucursal"
                        :Empresa="Empresa"
                        :Horario="ID_HORARIO"
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
import ComboGuardia from "../../components/ComboGuardia.vue";
import IngresoSalida from "./IngresoSalida.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      validacionR: false,
      Sucursal: null,
      Empresa: null,
      Guardia: null,
      Llegada: "",
      Observacion: "",
      Retraso: 0,
      permiso: null,
      ID_HORARIO: 0
    };
  },
  components: { ComboNombre, IngresoSalida, ComboGuardia },
  methods: {
    async registrar() {
      if (this.ID_HORARIO != 0) {
        const add = gql`
          mutation addControl(
            $Sucursal: Int!
            $Empresa: Int!
            $Guardia: Int!
            $Calculo: Int!
            $Observacion: String!
            $GS: Int!
          ) {
            addControl(
              Sucursal: $Sucursal
              Empresa: $Empresa
              Guardia: $Guardia
              Calculo: $Calculo
              Observacion: $Observacion
              GS: $GS
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
              Observacion: this.Observacion,
              GS: parseInt(this.ID_HORARIO)
            }
          })
          .then(result => {
            if (result.data.addControl.Respuesta) {
              this.validacionR = false;
              this.Llegada = "";
              this.Observacion = "";
              this.Retraso = 0;
              this.$socket.emit("Sumar_Linea", true);
            }
          });
      }
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
