<template>
  <div>
    <div class="ancho">
      <div class="columna d-flex">
        <div class="col-md-6">
          <div class="vue-tempalte">
            <b-card v-if="permiso" bg-variant="light">
              <b-overlay :show="validacionR" rounded="sm">
                <b-form-group label-cols-lg="12" label="Agregar Trabajador" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
                    <div class="d-flex justify-content-between mb-2">
                        <b-form-group class="col-md-5" label="Nombre:" label-for="Nombre" label-cols-sm="12" label-align-sm="right" >
                            <b-form-input id="Nombre" type="text" v-model="Nombre" ></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-md-5" label="Apellido:" label-for="Apellido" label-cols-sm="12" label-align-sm="right" >
                            <b-form-input id="Apellido" type="text" v-model="Apellido" ></b-form-input>
                        </b-form-group>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <b-form-group class="col-md-5" label="CI:" label-for="CI" label-cols-sm="12" label-align-sm="right" >
                            <b-form-input id="CI" type="text" v-model="CI" ></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-md-5" label="Puesto:" label-for="Puesto" label-cols-sm="12" label-align-sm="right" >
                            <b-form-select id="Puesto" class="form-control" v-model="Puesto" :options="Puestos" ></b-form-select>
                        </b-form-group>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <b-form-group class="col-md-5" label="Contratacion:" label-for="Contratacion" label-cols-sm="12" label-align-sm="right" >
                            <b-form-datepicker id="Contratacion" v-model="Fecha"></b-form-datepicker>
                        </b-form-group>
                        <b-form-group v-if="Puesto!='Analista Monitoreo' && Puesto!='Analista Seguridad' && Puesto!='Encargado Seguridad'" class="col-md-5" label="Supervisor:" label-for="Supervisor" label-cols-sm="12" label-align-sm="right" >
                            <ComboNombre tipo="encargados" @change="Supervisor=$event" />
                        </b-form-group>
                    </div>
                    <b-button @click="registrar()" :disabled="validacionR" pill variant="primary" >Registrar</b-button >
                </b-form-group>
              </b-overlay>
            </b-card>
            <b-card v-else-if="permiso == false" bg-variant="light">
              <a-result
                status="403"
                title="403"
                sub-title="Usted no tiene permiso para esta seccion."
              />
            </b-card>
            <a-spin v-else size="large" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="vue-tempalte">
            <div v-if="permiso1" class="ancho" style="padding:5px;">
                <CartaTrabajador v-for="d in Trabajadores" @update="update_component($event)" :key="d.ID" :data="d" :max="true" />
            </div>
            <b-card v-else-if="permiso1 == false" bg-variant="light">
              <a-result
                status="403"
                title="403"
                sub-title="Usted no tiene permiso para esta seccion."
              />
            </b-card>
            <a-spin v-else size="large" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";
import CartaTrabajador from "./CartaTrabajador.vue";
import ComboNombre from "./../../components/ComboNombre.vue" ;
export default {
    data() {
        return {
            validacionR: false,
            permiso: null,
            permiso1: null,
            Supervisor:null,
            Nombre:"",
            Apellido:"",
            CI:"",
            Puesto:"",
            Puestos:[{ value:"Aux. Seguridad", text:"Aux. Seguridad" },{ value:"Aux. Monitoreo", text:"Aux. Monitoreo" },{ value:"Analista Monitoreo", text:"Analista Monitoreo" },{ value:"Analista Seguridad", text:"Analista Seguridad" },{ value:"Encargado Seguridad", text:"Encargado Seguridad"}],
            Fecha:"",
            Trabajadores:[],
            consulta:gql`
                query {
                    Trabajadores {
                        ID
                        Nombre
                        Apellido
                        CI
                        Puesto
                        FechaContratacion
                        Supervisor {
                            ID
                            Nombre
                            Apellido
                            CI
                            Puesto
                            FechaContratacion
                        }
                    }
                }
            `
        };
    },
    components:{ComboNombre,CartaTrabajador},
    methods: {
        update_component(a){
            if (a) {
                if (this.permiso1) {
                    this.realizar_consulta();
                }
            }
        },
        check_op(a) {
            console.log(a);
        },
        async registrar() {
            if (this.Puesto=='Analista Monitoreo' || this.Puesto=='Analista Seguridad' || this.Puesto=='Encargado Seguridad') {
                this.Supervisor=0;
            }
            if (this.Supervisor!=null) {
                const add = gql`
                    mutation AddTrabajador($Supervisor: Int!,$Nombre: String!,$Apellido: String!,$CI:String!,$Puesto:String!,$FechaContratacion:String!) {
                        AddTrabajador(Supervisor:$Supervisor,Nombre:$Nombre,Apellido:$Apellido,CI:$CI,Puesto:$Puesto,FechaContratacion:$FechaContratacion) {
                            Respuesta
                        }
                    }
                `;
                this.validacionR = true;
                await this.$apollo
                .mutate({
                mutation: add,
                variables: {
                    Nombre:this.Nombre,
                    Apellido:this.Apellido,
                    CI:this.CI,
                    Puesto:this.Puesto,
                    FechaContratacion:this.Fecha,
                    Supervisor:parseInt(this.Supervisor)
                }
                })
                .then(result => {
                if (result.data.AddTrabajador.Respuesta) {
                    this.validacionR = false;
                    this.$socket.emit("Sumar_Linea", true);
                    this.Supervisor=null;
                    this.Nombre="";
                    this.Apellido="";
                    this.CI="";
                    this.Puesto="";
                    this.Fecha="";
                    if (this.permiso1) {
                        this.realizar_consulta();
                    }
                }
                });
            }
        },
        async realizar_consulta(){
            await this.$apollo
            .query({
                query:this.consulta,
                fetchPolicy: "network-only"
            })
            .then(result => {
                this.$socket.emit("Sumar_Linea", true);
                if (result.data.Trabajadores != null) {
                    this.Trabajadores=result.data.Trabajadores;
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
            Code: "P52"
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
            Code: "P51"
            },
            fetchPolicy: "network-only"
        })
        .then(result => {
            if (result.data.saber_permiso != null) {
                if (result.data.saber_permiso.Respuesta != null) {
                    this.permiso1 = result.data.saber_permiso.Respuesta;
                    this.realizar_consulta();
                } else {
                    this.permiso1 = false;
                }
            } else {
                this.permiso1 = false;
            }
        });
    }
};
</script>
