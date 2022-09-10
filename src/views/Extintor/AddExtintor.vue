<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="columna d-flex justify-content-center">
        <div class="col-md-12">
          <div class="vue-tempalte">
            <b-card bg-variant="light">
              <b-overlay :show="validacionR" rounded="sm">
                <b-form-group label-cols-lg="12" label="Nuevo Extintor" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
                  <b-button v-if="Sucursal != null && Proveedor != null" @click="registrar()" style="position:absolute;top:5px;right:5px;" :disabled="validacionR" pill variant="primary" >Registrar</b-button >
                  
                  <div class="d-flex justify-content-between">
                    <b-form-group class="col-md-5" label="Sucursal:" label-for="Sucursal" label-cols-sm="12" label-align-sm="right" >
                      <ComboNombre tipo="sucursales" @change="Sucursal = $event" />
                    </b-form-group>
                    <b-form-group class="col-md-5" label="Proveedor:" label-for="Proveedor" label-cols-sm="12" label-align-sm="right" >
                      <ComboNombre tipo="proveedor" @change="Proveedor = $event" />
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between">
                    <b-form-group class="col-md-5" label="Tipo:" label-for="tipo" label-cols-sm="12" label-align-sm="right" >
                      <b-form-select id="tipo" class="form-control" v-model="tipo" :options="tipos" ></b-form-select>
                    </b-form-group>
                  </div>

                  <b-card bg-variant="light" style="margin:5px;">
                    <b-form-group label-cols-lg="12" label="Datos Extintores" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
                      <div class="d-flex justify-content-between">
                        <b-form-group class="col-md-3" label="Codigo:" label-for="Codigo" label-cols-sm="12" label-align-sm="right" >
                          <b-form-input id="Codigo" type="number" v-model="Codigo" ></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-md-3" label="PH:" label-for="PH" label-cols-sm="12" label-align-sm="right" >
                          <b-form-input id="PH" type="number" v-model="PH" ></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-md-4" label="Peso:" label-for="Peso" label-cols-sm="12" label-align-sm="right" >
                          <b-form-input id="Peso" v-model="Peso"></b-form-input>
                        </b-form-group>
                      </div>
                      <div class="d-flex justify-content-between">
                        <b-form-group class="col-md-4" label="Fecha de Recargo:" label-for="Recargo" label-cols-sm="12" label-align-sm="right" >
                          <b-form-datepicker id="Recargo" v-model="Recargo" ></b-form-datepicker>
                        </b-form-group>
                        <b-form-group class="col-md-4" label="Observacion:" label-for="Observacion" label-cols-sm="12" label-align-sm="right" >
                          <b-form-textarea id="Observacion" v-model="Observacion" placeholder="Observacion.." rows="3" max-rows="3" ></b-form-textarea>
                        </b-form-group>
                        <b-form-group class="col-md-3" label-align-sm="right" style="position:relative;" >
                          <b-button @click="agregar_extintor()" style="position:absolute;bottom:10px;right:10px;" pill variant="primary" >Agregar</b-button >
                        </b-form-group>
                      </div>
                      <b-card bg-variant="light" style="margin:5px;">
                        <b-form-group v-for="d in Extintores" :key="d.ID" label-cols-lg="12" :label="'#'+d.ID" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
                          <div class="d-flex justify-content-between">
                            <b-form-group class="col-md-3" label="Codigo:" label-for="Codigo" label-cols-sm="12" label-align-sm="right" >
                              <b-form-input id="Codigo" type="number" v-model="d.Codigo" ></b-form-input>
                            </b-form-group>
                            <b-form-group class="col-md-3" label="PH:" label-for="PH" label-cols-sm="12" label-align-sm="right" >
                              <b-form-input id="PH" type="number" v-model="d.PH" ></b-form-input>
                            </b-form-group>
                            <b-form-group class="col-md-4" label="Peso:" label-for="Peso" label-cols-sm="12" label-align-sm="right" >
                              <b-form-input id="Peso" v-model="d.Peso"></b-form-input>
                            </b-form-group>
                          </div>
                          <div class="d-flex justify-content-between">
                            <b-form-group class="col-md-4" label="Fecha de Recargo:" label-for="Recargo" label-cols-sm="12" label-align-sm="right" >
                              <b-form-datepicker id="Recargo" v-model="d.Recargo" ></b-form-datepicker>
                            </b-form-group>
                            <b-form-group class="col-md-4" label="Observacion:" label-for="Observacion" label-cols-sm="12" label-align-sm="right" >
                              <b-form-textarea id="Observacion" v-model="d.Observacion" placeholder="Observacion.." rows="3" max-rows="3" ></b-form-textarea>
                            </b-form-group>
                          </div>
                        </b-form-group>
                      </b-card>
                    </b-form-group>
                  </b-card>
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
              <a-result status="403" title="403" sub-title="Usted no tiene permiso para esta seccion." />
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
import ComboNombre from "../../components/ComboNombre.vue";
export default {
  data() {
    return {
      validacionR: false,
      Peso: "",
      tipo: "",
      tipos: [{ value: "ABC", text: "ABC" }, { value: "CO2", text: "CO2" }],
      Observacion: "",
      Recargo: "",
      Sucursal: null,
      Proveedor: null,
      permiso: null,
      Codigo: "",
      PH: "",
      Extintores:[]
    };
  },
  components: { ComboNombre },
  methods: {
    agregar_extintor(){
      if (this.Peso!="" && this.Recargo!="") {
        this.Extintores.push({
          "ID":this.Extintores.length+1,
          "Codigo":this.Codigo,
          "PH":this.PH,
          "Peso":this.Peso,
          "Recargo":this.Recargo,
          "Observacion":this.Observacion
        });
        this.Codigo="";
        this.PH="";
        this.Peso="";
        this.Recargo="";
        this.Observacion="";
      }
    },
    async registrar() {
      const add = gql`
        mutation addExtintor(
          $Tipo: String!
          $Cantidad: Int!
          $Sucursal: Int!
          $Proveedor: Int!
        ) {
          addExtintor(
            Tipo: $Tipo
            Cantidad: $Cantidad
            Sucursal: $Sucursal
            Proveedor: $Proveedor
          ) {
            Cantidad
          }
        }
      `;
      this.validacionR = true;
      await this.$apollo
        .mutate({
          mutation: add,
          variables: {
            Tipo: this.tipo,
            Cantidad: this.Extintores.length,
            Sucursal: parseInt(this.Sucursal),
            Proveedor: parseInt(this.Proveedor),
          }
        })
        .then(result => {
          if (result.data.addExtintor.Cantidad>0) {
            this.Sucursal = null;
            this.Proveedor = null;
            this.tipo = "";
            this.$socket.emit("Sumar_Linea", true);
            this.ingresar_extintores_db(result.data.addExtintor.Cantidad);
          }
        });
    },
    async ingresar_extintores_db(id){
      const add = gql`
        mutation AddExtintorLlave(
          $Codigo: Int
          $PH: Int
          $Peso: String!
          $Recargo: String!
          $Llave: Int!
          $Observacion: String
        ) {
          AddExtintorLlave(
            Codigo: $Codigo
            PH: $PH
            Peso: $Peso
            Recargo: $Recargo
            Llave: $Llave
            Observacion: $Observacion
          ) {
            Respuesta
          }
        }
      `;
      for (let index = 0; index < this.Extintores.length; index++) {
        await this.$apollo
        .mutate({
          mutation: add,
          variables: {
            Codigo: parseInt(this.Extintores[index]["Codigo"]),
            PH: parseInt(this.Extintores[index]["PH"]),
            Peso: this.Extintores[index]["Peso"],
            Recargo: this.Extintores[index]["Recargo"],
            Llave: parseInt(id),
            Observacion: this.Extintores[index]["Observacion"]
          }
        })
        .then(result => {
          if (result.data.AddExtintorLlave.Respuesta) {
            this.$socket.emit("Sumar_Linea", true);
          }
        });
      }
      this.validacionR = false;
      this.Extintores=[];
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
            Code: "P20"
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
