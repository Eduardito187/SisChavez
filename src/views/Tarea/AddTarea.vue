<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="columna d-flex justify-content-center">
        <div class="col-md-6">
          <div class="vue-tempalte">
            <b-card bg-variant="light">
              <b-overlay :show="validacionR" rounded="sm">
                <b-form-group label-cols-lg="12" label="Nueva Tarea" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group class="col-md-5">
                      <div class="ancho">
                        <b-form-group class="col-md-12" label="Codigo:" label-for="Codigo" label-cols-sm="12" label-align-sm="right" >
                          <b-form-input id="Codigo" type="text" v-model="Codigo" ></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-md-12" label="Sucursal:" label-for="Sucursal" label-cols-sm="12" label-align-sm="right" >
                          <ComboNombre tipo="sucursales" :Disabled="Area != null ? true : false" @change="Sucursal = $event" />
                        </b-form-group>
                      </div>
                    </b-form-group>
                    <b-form-group class="col-md-5" label="Detalle:" label-for="Detalle" label-cols-sm="12" label-align-sm="right" >
                      <b-form-textarea id="Detalle" v-model="Detalle" placeholder="Detalle.." rows="3" max-rows="3" ></b-form-textarea>
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group class="col-md-5" label="Prioridad:" label-for="Prioridad" label-cols-sm="12" label-align-sm="right" >
                      <ComboNombre tipo="prioridad" @change="Prioridad = $event" />
                    </b-form-group>
                    <b-form-group class="col-md-5" label="Area:" label-for="Area" label-cols-sm="12" label-align-sm="right" >
                      <ComboNombre tipo="areas" :Disabled="Sucursal != null ? true : false" @change="Area = $event" />
                    </b-form-group>
                  </div>
                  <b-button @click="registrar()" :disabled="validacionR" pill variant="primary">Registrar</b-button>
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
              <a-result status="403" title="403" sub-title="Usted no tiene permiso para esta seccion."/>
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
      Codigo: "",
      Sucursal: null,
      Detalle: "",
      Solicitante: null,
      Prioridad: null,
      id_cuenta: null,
      permiso: null,
      Area: null
    };
  },
  components: { ComboNombre },
  methods: {
    async registrar() {
      const add = gql`
        mutation addTareas(
          $Codigo: String!
          $Sucursal: Int!
          $Area: Int!
          $Detalle: String!
          $Solicitante: Int!
          $Prioridad: Int!
        ) {
          addTareas(
            Codigo: $Codigo
            Sucursal: $Sucursal
            Area: $Area
            Detalle: $Detalle
            Solicitante: $Solicitante
            Prioridad: $Prioridad
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
            Codigo: this.Codigo,
            Sucursal: this.Sucursal != null ? parseInt(this.Sucursal) : 0,
            Area: this.Area != null ? parseInt(this.Area) : 0,
            Detalle: this.Detalle,
            Solicitante: this.Solicitante,
            Prioridad: this.Prioridad
          }
        })
        .then(result => {
          if (result.data.addTareas.Respuesta) {
            this.validacionR = false;
            this.Codigo = "";
            this.Detalle = "";
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    }
  },
  async created() {
    if (localStorage.id_cuenta != null) {
      this.id_cuenta = parseInt(localStorage.id_cuenta);
      this.Solicitante = this.id_cuenta;
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
            Code: "P38"
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          if (result.data.saber_permiso != null) {
            if (result.data.saber_permiso.Respuesta != null) {
              this.permiso = result.data.saber_permiso.Respuesta;
              if (this.permiso) {
                
              }
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
