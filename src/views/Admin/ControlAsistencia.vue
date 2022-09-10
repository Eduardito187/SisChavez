<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="columna d-flex justify-content-center">
        <div class="col-md-6">
          <div class="vue-tempalte">
            <b-card bg-variant="light">
              <b-overlay :show="validacionR" rounded="sm">
                <b-form-group label-cols-lg="12" label="Control de Asistencia" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
                    <div class="d-flex justify-content-between mb-2">
                        <b-form-group class="col-md-5" label="Trabajador:" label-for="Trabajador" label-cols-sm="12" label-align-sm="right" >
                            <ComboNombre tipo="trabajadores" @change="Trabajador=$event" />
                        </b-form-group>
                        <b-form-group class="col-md-5" label="Tipo:" label-for="Tipo" label-cols-sm="12" label-align-sm="right" >
                            <a-radio-group v-model="Tipo" @change="check_op">
                                <a-radio value="Libre">
                                    Libre
                                </a-radio>
                                <a-radio value="Baja Medica">
                                    Baja Medica
                                </a-radio>
                                <a-radio value="Permiso">
                                    Permiso
                                </a-radio>
                                <a-radio value="Falta">
                                    Falta
                                </a-radio>
                            </a-radio-group>
                        </b-form-group>
                    </div>
                    <div v-if="Tipo=='Permiso' || Tipo=='Falta'" class="d-flex justify-content-between mb-2">
                        <b-form-group class="col-md-11" label="Motivo:" label-for="Motivo" label-cols-sm="12" label-align-sm="right" >
                            <b-form-textarea id="Motivo" v-model="Motivo" placeholder="Motivo.." rows="3" max-rows="3" ></b-form-textarea>
                        </b-form-group>
                    </div>
                    <b-button v-if="Trabajador!=null" @click="registrar()" :disabled="validacionR" pill variant="primary" >Registrar</b-button >
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
import ComboNombre from "./../../components/ComboNombre.vue" ;
export default {
    data() {
        return {
            validacionR: false,
            permiso: null,
            Trabajador:null,
            Tipo:null,
            Motivo:""
        };
    },
    components:{ComboNombre},
    methods: {
        check_op(a) {
        console.log(a);
        },
        async registrar() {
            const add = gql`
                mutation AddControlAsistencia($Trabajador: Int!,$Tipo: String!,$Motivo: String!) {
                    AddControlAsistencia(Trabajador: $Trabajador,Tipo: $Tipo,Motivo: $Motivo) {
                        Respuesta
                    }
                }
            `;
            this.validacionR = true;
            await this.$apollo
            .mutate({
            mutation: add,
            variables: {
                Trabajador:this.Trabajador,
                Tipo:this.Tipo,
                Motivo:this.Motivo
            }
            })
            .then(result => {
            if (result.data.AddControlAsistencia.Respuesta) {
                this.validacionR = false;
                this.$socket.emit("Sumar_Linea", true);
                this.Trabajador=null;
                this.Tipo="";
                this.Motivo="";
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
            Code: "P55"
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
