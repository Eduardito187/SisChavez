<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="columna d-flex justify-content-center">
        <div class="col-md-6">
          <div class="vue-tempalte">
            <b-overlay :show="validacionR" rounded="sm">
              <b-form-group label-cols-lg="12" label="Nueva Sucursal" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
                <div class="d-flex justify-content-between">
                  <b-form-group class="col-md-5" label="Nombre" label-for="Nombre" label-cols-sm="12" label-align-sm="right" >
                    <b-form-input id="Nombre" v-model="Nombre"></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-md-5" label="Codigo:" label-for="CodigoSucursal" label-cols-sm="12" label-align-sm="right" >
                    <b-form-input id="CodigoSucursal" v-model="CodigoSucursal" ></b-form-input>
                  </b-form-group>
                </div>
                <div class="d-flex justify-content-between">
                  <b-form-group class="col-md-5" label="Telefono:" label-for="Telefono" label-cols-sm="12" label-align-sm="right" >
                    <b-form-input id="Telefono" v-model="Telefono" ></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-md-5" label="Telefono Interno:" label-for="TelfInterno" label-cols-sm="12" label-align-sm="right">
                    <b-form-input id="TelfInterno" v-model="TelfInterno" ></b-form-input>
                  </b-form-group>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <b-form-group class="col-md-5" label="Direccion:" label-for="Direccion" label-cols-sm="12" label-align-sm="right" >
                    <b-form-textarea id="Direccion" v-model="Direccion" placeholder="Direccion.." rows="3" max-rows="3" ></b-form-textarea>
                  </b-form-group>
                  <div class="col-md-5">
                    <b-form-group class="col-md-12" label="Correo Electronico:" label-for="Correo" label-cols-sm="12" label-align-sm="right" >
                      <b-form-input id="Correo" v-model="Correo"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-12" label="Region:" label-for="Region" label-cols-sm="12" label-align-sm="right" >
                      <b-form-select id="Region" class="form-control" v-model="Region" :options="Regiones" ></b-form-select>
                    </b-form-group>
                  </div>
                </div>
                <b-button @click="registrarSucursal()" :disabled="validacionR" pill variant="primary" >Registrar</b-button >
              </b-form-group>
            </b-overlay>
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
      CodigoSucursal: "",
      Telefono: "",
      Direccion: "",
      TelfInterno: "",
      Correo: "",
      permiso: null,
      Region:'',
      Regiones:[
        {value:"La Paz",text:"La Paz"},
        {value:"Santa Cruz",text:"Santa Cruz"},
        {value:"Beni",text:"Beni"},
        {value:"Oruro",text:"Oruro"},
        {value:"Cochabamba",text:"Cochabamba"},
        {value:"Tarija",text:"Tarija"},
        {value:"Pando",text:"Pando"},
        {value:"Chuquisaca",text:"Chuquisaca"},
        {value:"Potosi",text:"Potosi"}
      ]
    };
  },
  methods: {
    async registrarSucursal() {
      const addSucursa = gql`
        mutation addSucursal(
          $Nombre: String!
          $CodigoSucursal: String!
          $Telefono: String!
          $Direccion: String!
          $TelfInterno: String!
          $Correo: String!
          $Region: String!
        ) {
          addSucursal(
            ID: 0
            Nombre: $Nombre
            CodigoSucursal: $CodigoSucursal
            Telefono: $Telefono
            Direccion: $Direccion
            TelfInterno: $TelfInterno
            Correo: $Correo
            Region: $Region
          ) {
            Respuesta
          }
        }
      `;
      this.validacionR = true;
      await this.$apollo
        .mutate({
          mutation: addSucursa,
          variables: {
            Nombre: this.Nombre,
            CodigoSucursal: this.CodigoSucursal,
            Telefono: this.Telefono,
            Direccion: this.Direccion,
            TelfInterno: this.TelfInterno,
            Correo: this.Correo,
            Region: this.Region
          }
        })
        .then(result => {
          if (result.data.addSucursal.Respuesta) {
            this.validacionR = false;
            this.Nombre = "";
            this.CodigoSucursal = "";
            this.Telefono = "";
            this.Direccion = "";
            this.TelfInterno = "";
            this.Correo = "";
            this.Region = "";
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
            Code: "P5"
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
