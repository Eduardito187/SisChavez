<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="ancho">
        <a-select label-in-value :default-value="{ key: 'Codigo Sucursal' }" style="width: 200px;margin-right:5px;" @change="cambioSELECT" >
            <a-select-option value="Codigo Sucursal">
                Codigo Sucursal
            </a-select-option>
            <a-select-option value="Requerimiento Fiscal">
                Requerimiento Fiscal
            </a-select-option>
        </a-select>
        <a-input-search v-model="busqueda" placeholder="..." style="width: 200px" @search="buscar" />
        <b-button @click="showDrawer()" style="margin-left:20px;" pill variant="primary">Agregar Registro</b-button>
      </div>
      <div class="ancho">
        <CartaRequerimiento v-for="d in discos" :key="d.ID" @actualizar="actualizar_data($event)" :data="d" :max="false" />
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
    <a-drawer :width="ancho * 0.9" placement="right" :closable="false" :visible="visible" @close="onClose" >
        <p :style="[pStyle, pStyle2]">--</p>
        <a-row>
          <div class="vue-tempalte">
            <b-card bg-variant="light">
              <b-overlay :show="validacionR" rounded="sm">
                <b-form-group label-cols-lg="12" label="Nuevo Control de Disco" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group class="col-md-5" label="Requerimiento Fiscal:" label-for="ReqFis" label-cols-sm="12" label-align-sm="right" >
                      <b-form-input id="ReqFis" type="text" v-model="ReqFis" ></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-5" label="Sucursal:" label-for="Sucursales" label-cols-sm="12" label-align-sm="right" >
                      <ComboNombre tipo="sucursales" @change="Sucursal = $event" />
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group class="col-md-5" label="Cantidad de Discos:" label-for="CantidadDiscos" label-cols-sm="12" label-align-sm="right" >
                      <a-input-number id="CantidadDiscos" v-model="CantidadDiscos" :min="1" />
                    </b-form-group>
                    <b-form-group class="col-md-5" label="Fecha de Finalizacion:" label-for="FechaFin" label-cols-sm="12" label-align-sm="right" >
                        <b-form-datepicker id="FechaFin" v-model="FechaFin" class="mb-2"></b-form-datepicker>
                    </b-form-group>
                  </div>
                  <a-button type="primary" @click="Registrar_Nuevo_DATO()" :loading="validacionR" icon="check" >Registrar</a-button>
                </b-form-group>
              </b-overlay>
            </b-card>
          </div>
        </a-row>
    </a-drawer>
  </div>
</template>
<script>
import CartaRequerimiento from "./CartaRequerimiento.vue";
import gql from "graphql-tag";
import ComboNombre from "./../../components/ComboNombre.vue";
export default {
    data() {
        return {
            ReqFis:"",
            Sucursal:null,
            FechaFin:"",
            CantidadDiscos:1,
            validacionR:false,
            b: "Codigo Sucursal",
            busqueda: "",
            consulta: gql`
                query {
                    ControlesDeDiscos {
                        ID
                        Fecha
                        CantidadDiscos
                        ReqFiscal
                        FechaFinalizacion
                        Sucursal {
                            ID
                            Nombre
                            CodigoSucursal
                            Telefono
                            Direccion
                            TelfInterno
                            Correo
                        }
                        Salida {
                            ID
                            FechaEntrega
                            Nombre
                            Detalle
                        }
                    }
                }
            `,
            consultaLIKE: gql`
                query ControlesDeDiscosLIKE($Busqueda: String!, $Tipo: String!) {
                    ControlesDeDiscosLIKE(Busqueda: $Busqueda, Tipo: $Tipo) {
                        ID
                        Fecha
                        CantidadDiscos
                        ReqFiscal
                        FechaFinalizacion
                        Sucursal {
                            ID
                            Nombre
                            CodigoSucursal
                            Telefono
                            Direccion
                            TelfInterno
                            Correo
                        }
                        Salida {
                            ID
                            FechaEntrega
                            Nombre
                            Detalle
                        }
                    }
                }
            `,
            discos: [],
            c_s: true,
            permiso: null,
            visible: false,
            pStyle: {
                fontSize: "16px",
                color: "rgba(0,0,0,0.85)",
                lineHeight: "24px",
                display: "block",
                marginBottom: "16px"
            },
            pStyle2: {
                marginBottom: "24px"
            },
            ancho: window.innerWidth,
        };
    },
    components:{CartaRequerimiento,ComboNombre},
    methods: {
        async Registrar_Nuevo_DATO(){
            const add = gql`
            mutation addControlDISCO($Sucursal: Int!,$CantidadDiscos: Int!,$ReqFiscal: String!,$FechaFin: String!) {
                addControlDISCO(Sucursal: $Sucursal,CantidadDiscos: $CantidadDiscos,ReqFiscal: $ReqFiscal,FechaFin: $FechaFin) {
                    Respuesta
                }
            }
            `;
            this.validacionR = true;
            await this.$apollo.mutate({
                mutation: add,
                variables: {
                    Sucursal:parseInt(this.Sucursal),
                    CantidadDiscos:parseInt(this.CantidadDiscos),
                    ReqFiscal:this.ReqFis,
                    FechaFin:this.FechaFin
                }
            })
            .then(result => {
                if (result.data.addControlDISCO.Respuesta) {
                    this.$message.success("Producto Registrado");
                    this.$socket.emit("Sumar_Linea", true);
                    this.validacionR = false;
                    this.CantidadDiscos=1;
                    this.ReqFis="";
                    this.FechaFin="";
                    this.buscar();
                }
            });
        },
        showDrawer() {
            this.visible = true;
        },
        onClose() {
            this.visible = false;
        },
        actualizar_data(a) {
            if (a) {
                this.buscar();
            }
        },
        async buscar() {
            if (this.busqueda != "" && this.busqueda != " ") {
                this.c_s = true;
                await this.$apollo
                .query({
                    query: this.consultaLIKE,
                    variables: {
                    Busqueda: this.busqueda,
                    Tipo: this.b
                    },
                    fetchPolicy: "network-only"
                })
                .then(result => {
                    this.discos = result.data.ControlesDeDiscosLIKE;
                    this.c_s = false;
                    this.$socket.emit("Sumar_Linea", true);
                });
            } else {
                this.obtenerInformacion();
            }
        },
        async obtenerInformacion() {
            this.c_s = true;
            await this.$apollo
                .query({
                query: this.consulta,
                fetchPolicy: "network-only"
                })
                .then(result => {
                    this.discos = result.data.ControlesDeDiscos;
                    this.c_s = false;
                    this.$socket.emit("Sumar_Linea", true);
                });
        },
        cambioSELECT(a) {
            this.b = a.key;
        }
    },
    mounted() {},
    async created() {
        window.addEventListener("resize", () => {
        this.ancho = window.innerWidth;
        });
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
                Code: "P57"
            },
            fetchPolicy: "network-only"
            })
            .then(result => {
            if (result.data.saber_permiso != null) {
                if (result.data.saber_permiso.Respuesta != null) {
                this.permiso = result.data.saber_permiso.Respuesta;
                this.obtenerInformacion();
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
