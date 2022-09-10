<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="ancho">
       <b-form-group label-cols-lg="8" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-8" >
          <div class="d-flex justify-content-between mb-2">
            <b-form-group class="col-md-2" label="Tipo:" label-for="Tipo" label-cols-sm="2" label-align-sm="right" >
              <a-select label-in-value :default-value="{ key: 'Responsable' }" style="width: 180px;" @change="cambioSELECT" >
                <a-select-option value="Solicitante">
                  Solicitante
                </a-select-option>
                <a-select-option value="Autorizador">
                  Autorizador
                </a-select-option>
                <a-select-option value="Codigo Seguimiento">
                  Codigo Seguimiento
                </a-select-option>
                <a-select-option value="Codigo Sucursal">
                  Codigo Sucursal
                </a-select-option>
                <a-select-option value="Nombre Sucursal">
                  Nombre Sucursal
                </a-select-option>
                <a-select-option value="Responsable">
                  Responsable
                </a-select-option>
              </a-select>
            </b-form-group>
            <b-form-group class="col-md-2" label="Estado:" label-for="Estado" label-cols-sm="2" label-align-sm="right" >
              <a-select label-in-value :default-value="{ key: '' }" style="width: 150px;margin-left:5px;margin-right:5px;" @change="cambioSELECTSTATE" >
                <a-select-option value="Pendiente">
                  Pendiente
                </a-select-option>
                <a-select-option value="Iniciado">
                  Iniciado
                </a-select-option>
                <a-select-option value="Finalizado">
                  Finalizado
                </a-select-option>
              </a-select>
            </b-form-group>
            <b-form-group class="col-md-2" label="Mes:" label-for="Mes" label-cols-sm="2" label-align-sm="right" >
              <a-select label-in-value :default-value="{ key: '' }" style="width: 150px;margin-right:5px;" @change="cambioSELECTSTATEMES" >
                <a-select-option value="1">
                  Enero
                </a-select-option>
                <a-select-option value="2">
                  Febrero
                </a-select-option>
                <a-select-option value="3">
                  Marzo
                </a-select-option>
                <a-select-option value="4">
                  Abril
                </a-select-option>
                <a-select-option value="5">
                  Mayo
                </a-select-option>
                <a-select-option value="6">
                  Junio
                </a-select-option>
                <a-select-option value="7">
                  Julio
                </a-select-option>
                <a-select-option value="8">
                  Agosto
                </a-select-option>
                <a-select-option value="9">
                  Septiembre
                </a-select-option>
                <a-select-option value="10">
                  Octubre
                </a-select-option>
                <a-select-option value="11">
                  Noviembre
                </a-select-option>
                <a-select-option value="12">
                  Diciembre
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
          :data="d"
          @actualizar="actualizar_data($event)"
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
      b: "Responsable",
      ESTADO:"",
      MES:"",
      data: [],
      data_Filtro: [],
      permiso: null,
      consulta: gql`
        query {
          seguimientos3M {
            ID
            Codigo
            FechaCreacion
            FechaInicio
            FechaFin
            Solicitante
            Descripcion
            Autorizacion
            Carpeta
            Conclusion
            Estado
            Tipo
            FechaAsignado
            Creador {
              ID
              usuario
              nombre
              foto
            }
            Responsable {
              ID
              usuario
              nombre
              foto
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
            Prioridad {
              ID
              Nombre
              Descripcion
            }
          }
        }
      `,
      consultaLIKE: gql`
        query seguimientosLIKE3M($Busqueda: String!, $Tipo: String!, $MES:String!, $ESTADO:String!) {
          seguimientosLIKE3M(Busqueda: $Busqueda, Tipo: $Tipo, MES:$MES, ESTADO:$ESTADO) {
            ID
            Codigo
            FechaCreacion
            FechaInicio
            FechaFin
            Solicitante
            Descripcion
            Autorizacion
            Carpeta
            Conclusion
            Estado
            Tipo
            Creador {
              ID
              usuario
              nombre
              foto
            }
            Responsable {
              ID
              usuario
              nombre
              foto
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
            Prioridad {
              ID
              Nombre
              Descripcion
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
          this.aplicando_filtros();
        }
      }
    },
    cambioSELECT(a) {
      this.b = a.key;
    },
    cambioSELECTSTATEMES(a){
      this.MES = a.key;
    },
    cambioSELECTSTATE(a) {
      this.ESTADO = a.key;
    },
    actualizar_data(a) {
      if (a != null) {
        if (a) {
          this.buscar();
        }
      }
    },
    async buscar() {
      if (this.MES.length>0 && this.ESTADO.length>0 && this.b.length>0) {
        this.validacionR = true;
        await this.$apollo
          .query({
            query: this.consultaLIKE,
            variables: {
              Busqueda: this.busqueda,
              Tipo: this.b,
              MES: this.MES,
              ESTADO: this.ESTADO
            },
            fetchPolicy: "network-only"
          })
          .then(result => {
            this.data = result.data.seguimientosLIKE3M;
            this.validacionR = false;
            this.$socket.emit("Sumar_Linea", true);
            this.aplicando_filtros();
          });
      }
    },
    aplicando_filtros(){
      this.data_Filtro=this.data;
      /*
      if (this.ESTADO=="Pendiente" || this.ESTADO=="Iniciado" || this.ESTADO=="Finalizado") {
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
    async obtenerData() {
      this.validacionR = true;
      await this.$apollo
        .query({
          query: this.consulta,
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.seguimientos3M;
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
          Code: "P7"
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
};
</script>
