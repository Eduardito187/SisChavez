<template>
  <div>
    <div class="ancho">
      <div v-if="permiso" class="columna d-flex justify-content-center">
        <div class="col-md-6">
          <div class="vue-tempalte">
            <b-card bg-variant="light">
              <b-overlay :show="validacionR" rounded="sm">
                <b-form-group label-cols-lg="12" label="Nuevo Seguimiento" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group class="col-md-5" label="Codigo:" label-for="Codigo" label-cols-sm="12" label-align-sm="right" >
                      <b-form-input id="Codigo" type="text" v-model="Codigo" ></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-5" label="Responsable:" label-for="Responsable" label-cols-sm="12" label-align-sm="right" >
                      <ComboNombre tipo="cuentas" @change="Responsable = $event" />
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group class="col-md-5" label="Solicitante:" label-for="Solicitante" label-cols-sm="12" label-align-sm="right" >
                      <b-form-input id="Solicitante" type="text" v-model="Solicitante" ></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-5" label="Autorizador:" label-for="Autorizador" label-cols-sm="12" label-align-sm="right" >
                      <b-form-input id="Autorizador" type="text" v-model="Autorizador" ></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group class="col-md-5" label="Sucursal:" label-for="Sucursales" label-cols-sm="12" label-align-sm="right" >
                      <ComboNombre tipo="sucursales" @change="Sucursal = $event" />
                    </b-form-group>
                    <b-form-group class="col-md-5" label="Prioridad:" label-for="Prioridad" label-cols-sm="12" label-align-sm="right" >
                      <ComboNombre tipo="prioridad" @change="Prioridad = $event" />
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
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
                  <Button
                    v-if="Sucursal != null && Prioridad != null"
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
import { Gestion } from "../../Config/Configuracion";
export default {
  data() {
    return {
      validacionR: false,
      Codigo: "",
      Descripcion: "",
      Sucursal: null,
      Prioridad: null,
      Responsable: null,
      ID_Cuenta: null,
      Solicitante: "",
      Autorizador: "",
      permiso: null,
      Year: Gestion
    };
  },
  components: { ComboNombre, Button },
  methods: {
    async registrar() {
      const add = gql`
        mutation addSeguimiento(
          $Codigo: String!
          $Descripcion: String!
          $Sucursal: Int!
          $Prioridad: Int!
          $Responsable: Int
          $Creador: Int!
          $Solicitante: String!
          $Autorizador: String!
        ) {
          addSeguimiento(
            Codigo: $Codigo
            Descripcion: $Descripcion
            Sucursal: $Sucursal
            Prioridad: $Prioridad
            Responsable: $Responsable
            Creador: $Creador
            Solicitante: $Solicitante
            Autorizador: $Autorizador
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
            Codigo:Codigo.length> 0?"CITE " + this.Codigo + "-" + this.Year:"",
            Descripcion: this.Descripcion,
            Sucursal: parseInt(this.Sucursal),
            Prioridad: parseInt(this.Prioridad),
            Responsable: this.Responsable != null ? parseInt(this.Responsable) : null,
            Creador: parseInt(this.ID_Cuenta),
            Solicitante: this.Solicitante,
            Autorizador: this.Autorizador
          }
        })
        .then(result => {
          if (result.data.addSeguimiento.Respuesta) {
            this.$message.success("Registro Exitoso");
            this.validacionR = false;
            this.Codigo = "";
            this.Descripcion = "";
            this.Solicitante = "";
            this.Autorizador = "";
            this.$socket.emit("Sumar_Linea", true);
            this.$socket.emit("NuevoRegistro", true);
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
          Code: "P8"
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
