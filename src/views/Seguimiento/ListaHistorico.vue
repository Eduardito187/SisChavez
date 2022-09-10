<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="ancho">
        <a-select label-in-value :default-value="{ key: 'Solicitante' }" style="width: 180px;margin-right:5px;" @change="cambioSELECT" >
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
        <a-input-search
          v-model="busqueda"
          placeholder="..."
          style="width: 200px"
          @search="buscar"
        />
        <a-select label-in-value :default-value="{ key: '' }" style="width: 150px;margin-left:5px;" @change="cambioSELECTSTATE" >
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
      </div>
      <div class="ancho">
        <Carta
          v-for="d in data_Filtro"
          :key="d.ID"
          :data="d"
          @actualizar="actualizar_data($event)"
          :max="false"
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
      b: "Solicitante",
      ESTADO:"",
      data: [],
      data_Filtro: [],
      permiso: null,
      consulta: gql`
        query {
          seguimientos {
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
        query seguimientosLIKE($Busqueda: String!, $Tipo: String!) {
          seguimientosLIKE(Busqueda: $Busqueda, Tipo: $Tipo) {
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
    cambioSELECT(a) {
      this.b = a.key;
    },
    cambioSELECTSTATE(a) {
      this.ESTADO = a.key;
      this.aplicando_filtros();
    },
    actualizar_data(a) {
      if (a != null) {
        if (a) {
          this.buscar();
        }
      }
    },
    async buscar() {
      if (this.busqueda != "" && this.busqueda != " ") {
        this.validacionR = true;
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
            this.data = result.data.seguimientosLIKE;
            this.validacionR = false;
            this.$socket.emit("Sumar_Linea", true);
            this.aplicando_filtros();
          });
      } else {
        this.obtenerData();
      }
    },
    aplicando_filtros(){
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
    },
    async obtenerData() {
      this.validacionR = true;
      await this.$apollo
        .query({
          query: this.consulta,
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.seguimientos;
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
