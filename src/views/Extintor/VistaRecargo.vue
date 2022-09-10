<template>
    <div class="VistaRecargo columna" style="background-color:white;">
        <div class="col-md-12" style="margin-top:60px;">
            <div class="columna fondo abajo">
                <div v-if="permiso" class="ancho">
                    <b-overlay :show="c_s" rounded="sm">
                        <div class="ancho">
                            <Recargador v-for="d in data" :key="d.ID" :data="d" @eliminar="recargado($event)" />
                        </div>
                    </b-overlay>
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
        </div>
    </div>
</template>

<script>
import gql from "graphql-tag";
import Recargador from "./Recargador.vue";
export default {
    name: "VistaRecargo",
    components: {
        Recargador
    },
    data() {
        return {
            permiso:null,
            c_s:true,
            data:[],
            consulta: gql`query {
                extintoresRecargo {
                    ID
                    Codigo
                    PH
                    Peso
                    Recargo
                    Observacion
                    Extintores {
                        ID
                        Fecha
                        Tipo
                        Cantidad
                        Creacion
                        Sucursal {
                            ID
                            Nombre
                            CodigoSucursal
                            Telefono
                            Direccion
                            TelfInterno
                            Correo
                            Region
                        }
                        Proveedor {
                            ID
                            Nombre
                            Telefono
                            Direccion
                            Correo
                        }
                    }
                }
            }
            `,
        };
    },
    methods: {
        recargado(ID){
            for (let index = 0; index < this.data.length; index++) {
                if (this.data[index]["ID"]==ID) {
                    this.data.splice(index,1);
                }
            }
        },
        async obtener_data(){
            await this.$apollo.query({
                query: this.consulta,
                fetchPolicy: "network-only"
            })
            .then(result => {
                this.data = result.data.extintoresRecargo;
                this.c_s = false;
                this.$socket.emit("Sumar_Linea", true);
            });
        }
    },
    async mounted() {
        if (localStorage.id_cuenta == null) {
            this.$router.push("/");
        }
    },
    async created(){
        await this.$apollo.query({
          query: gql`
            query saber_permiso($Cuenta: Int!, $Code: String!) {
              saber_permiso(Cuenta: $Cuenta, Code: $Code) {
                Respuesta
              }
            }
          `,
          variables: {
            Cuenta: parseInt(localStorage.id_cuenta),
            Code: "P21"
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          if (result.data.saber_permiso != null) {
            if (result.data.saber_permiso.Respuesta != null) {
              this.permiso = result.data.saber_permiso.Respuesta;
              this.obtener_data();
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
