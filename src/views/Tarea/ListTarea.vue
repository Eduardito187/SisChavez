<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="ancho">
       <b-form-group label-cols-lg="8" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-8" >
          <div class="d-flex justify-content-between mb-2">
            <b-form-group class="col-md-2" label="Tipo:" label-for="Tipo" label-cols-sm="2" label-align-sm="right" >
              <a-select label-in-value :default-value="{ key: 'Codigo Tarea' }" style="width: 150px;" @change="cambioSELECT" >
                <a-select-option value="Codigo Tarea">
                  Codigo Tarea
                </a-select-option>
                <a-select-option value="Codigo Sucursal">
                  Codigo Sucursal
                </a-select-option>
                <a-select-option value="Nombre Sucursal">
                  Nombre Sucursal
                </a-select-option>
              </a-select>
            </b-form-group>
            <b-form-group class="col-md-2" label="Estado:" label-for="Estado" label-cols-sm="2" label-align-sm="right" >
              <a-select label-in-value :default-value="{ key: '' }" style="width: 150px;margin-left:5px;" @change="cambioSELECTSTATE" >
                <a-select-option value="Pendiente">
                  Pendiente
                </a-select-option>
                <a-select-option value="En Proceso">
                  En Proceso
                </a-select-option>
                <a-select-option value="Finalizado">
                  Finalizado
                </a-select-option>
              </a-select>
            </b-form-group>
            <b-form-group class="col-md-2" label="Mes:" label-for="Mes" label-cols-sm="2" label-align-sm="right" >
              <a-select label-in-value :default-value="{ key: '' }" style="width: 150px;margin-left:5px;margin-right:5px;" @change="cambioSELECTSTATEMES" >
                <a-select-option v-for="m in MESES" :value="m.ID">
                  {{m.MES}}
                </a-select-option>
              </a-select>
            </b-form-group>
            <b-form-group class="col-md-2" label="Busqueda:" label-for="Busqueda" label-cols-sm="2" label-align-sm="right" >
              <a-input-search v-model="busqueda" placeholder="..." style="width: 200px" @search="buscar" />
            </b-form-group>
          </div>
        </b-form-group>
      </div>
      <div class="ancho">
        <Carta
          v-for="d in data_Filtro"
          :key="d.ID"
          @actualizar="actualizar_data($event)"
          :data="d"
          :max="false"
          @eliminar="eliminar_elemento($event)"
        />
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
import Carta from "./Carta.vue";
import { Button } from "ant-design-vue";
export default {
  data() {
    return {
      validacionR: false,
      busqueda: "",
      b: "Codigo Tarea",
      data: [],
      permiso: null,
      ESTADO:"",
      MES:0,
      data_Filtro:[],
      MESES:[
        {"MES" : "Enero", "ID" : 1},
        {"MES" : "Febrero", "ID" : 2},
        {"MES" : "Marzo", "ID" : 3},
        {"MES" : "Abril", "ID" : 4},
        {"MES" : "Mayo", "ID" : 5},
        {"MES" : "Junio", "ID" : 6},
        {"MES" : "Julio", "ID" : 7},
        {"MES" : "Agosto", "ID" : 8},
        {"MES" : "Septiembre", "ID" : 9},
        {"MES" : "Octubre", "ID" : 10},
        {"MES" : "Noviembre", "ID" : 11},
        {"MES" : "Diciembre", "ID" : 12}
      ],
      consulta: gql`
        query {
          tareas {
            ID
            FechaInicio
            FechaFinalizacion
            Codigo
            Detalle
            Estado
            Pospuesta
            Conclusion
            Solicitante {
              ID
              nombre
              foto
              Rango {
                ID
                Nombre
              }
            }
            Responsable {
              ID
              nombre
              foto
              Rango {
                ID
                Nombre
              }
            }
            Prioridad {
              ID
              Nombre
              Descripcion
            }
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
            Area {
              ID
              codArea
              Nombre
            }
          }
        }
      `,
      consultaLike: gql`
        query tareasLIKE($Busqueda: String!, $Tipo: String!,$ESTADO: String!,$MES: String!) {
          tareasLIKE(Busqueda: $Busqueda, Tipo: $Tipo, ESTADO:$ESTADO, MES:$MES) {
            ID
            FechaInicio
            FechaFinalizacion
            Codigo
            Detalle
            Estado
            Pospuesta
            Conclusion
            Solicitante {
              ID
              nombre
              foto
              Rango {
                ID
                Nombre
              }
            }
            Responsable {
              ID
              nombre
              foto
              Rango {
                ID
                Nombre
              }
            }
            Prioridad {
              ID
              Nombre
              Descripcion
            }
            Sucursal {
              ID
              Nombre
              CodigoSucursal
              Telefono
              Direccion
              TelfInterno
              Correo
            }
            Area {
              ID
              codArea
              Nombre
            }
          }
        }
      `
    };
  },
  components: { Button, Carta },
  watch: {},
  methods: {
    eliminar_elemento(id){
      for (let index = 0; index < this.data.length; index++) {
        if (id==this.data[index]["ID"]) {
          this.data.splice(index,1);
        }
      }
    },
    actualizar_data(a) {
      if (a) {
        this.buscar();
      }
    },
    cambioSELECTSTATE(a) {
      this.ESTADO = a.key;
    },
    cambioSELECTSTATEMES(a){
      this.MES = a.key;
    },
    cambioSELECT(a) {
      this.b = a.key;
    },
    aplicando_filtros(){
      this.data_Filtro=this.data;
      /*
      if (this.ESTADO=="Pendiente" || this.ESTADO=="En Proceso" || this.ESTADO=="Finalizado") {
        this.data_Filtro=[];
        for (let index = 0; index < this.data.length; index++) {
          if (this.data[index]["Estado"]==this.ESTADO) {
            this.data_Filtro.push(this.data[index]);
          }
        }
      }else{
        this.data_Filtro=this.data;
      }
      */
    },
    async buscar() {
      if (this.MES>0 && this.ESTADO.length>0 && this.b.length>0) {
        this.validacionR = true;
        await this.$apollo
          .query({
            query: this.consultaLike,
            variables: {
              Busqueda: this.busqueda,
              Tipo: this.b,
              ESTADO: this.ESTADO,
              MES: String(this.MES)
            },
            fetchPolicy: "network-only"
          })
          .then(result => {
            this.data = result.data.tareasLIKE;
            this.validacionR = false;
            this.$socket.emit("Sumar_Linea", true);
            this.aplicando_filtros();
          });
      }
    },
    async obtenerData() {
      this.validacionR = true;
      await this.$apollo
        .query({
          query: this.consulta,
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.tareas;
          this.validacionR = false;
          this.$socket.emit("Sumar_Linea", true);
            this.aplicando_filtros();
        });
    }
  },
  mounted() {},
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
          Code: "P37"
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        if (result.data.saber_permiso != null) {
          if (result.data.saber_permiso.Respuesta != null) {
            this.permiso = result.data.saber_permiso.Respuesta;
            if (this.permiso) {
              //this.obtenerData();
            }
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
