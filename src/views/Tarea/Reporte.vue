<template>
  <div>
    <div v-if="permiso" class="ancho">
      <b-jumbotron header="Reporte de Tarea" class="mb-2">
        <div class="d-flex justify-content-between">
          <b-form-group class="col-md-3" label="Tipo:" label-for="Tipo" label-cols-sm="12" label-align-sm="right" >
            <b-form-select id="Tipo" class="form-control" v-model="Tipo" :options="tipos" ></b-form-select>
          </b-form-group>
          <b-form-group class="col-md-3" label="Estado:" label-for="Estado" label-cols-sm="12" label-align-sm="right" >
            <b-form-select id="Estado" class="form-control" v-model="Estado" :options="estados" ></b-form-select>
          </b-form-group>
          <b-form-group class="col-md-1" label="Mes:" label-for="Mes" label-cols-sm="12" label-align-sm="right" >
            <a-input-number id="Mes" v-model="mes" :min="1" :max="12" @change="onChange_mes" />
          </b-form-group>
          <b-form-group class="col-md-1" label="Año:" label-for="Año" label-cols-sm="12" label-align-sm="right" >
            <a-input-number id="Año" v-model="anho" :min="2021" :max="2100" @change="onChange_anho" />
          </b-form-group>
          <b-form-group v-if="Tipo != null" class="col-md-2" label="Buscador:" label-for="Buscador" label-cols-sm="12" label-align-sm="right">
            <a-button @click="realizar_busqueda()">Buscar</a-button>
          </b-form-group>
        </div>
      </b-jumbotron>
      <a-table :columns="columnas" :data-source="infor_d" :footer="null" :pagination="false" :scroll="{ x: 2000, y: 500 }" bordered >
        <template slot="name" slot-scope="text">
          <a>{{ text }}</a>
        </template>
      </a-table>
      <b-jumbotron v-if="infor_d.length>0">
        <hr class="my-4" />
        <a-button icon="arrow-down" @click="descargar()">Exportar Datos</a-button>
      </b-jumbotron>
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
import ComboNombre from "../../components/ComboNombre.vue";
import XLSX from "xlsx";
export default {
    data() {
        return {
            Tipo:null,
            Estado:"",
            tipos: [{ value:"Fecha de Creacion", text:"Fecha de Creacion" }, { value:"Fecha Pospuesta", text:"Fecha Pospuesta" },{value:"Eliminado",text:"Eliminado"}],
            estados: [{ value:"Pendiente", text:"Pendiente" }, { value:"En Proceso", text:"En Proceso" }, { value:"Finalizado", text:"Finalizado"}],
            mes: 1,
            anho: 2021,
            info: [],
            permiso: null,
            columnas: [
                {
                    title: "FechaCreacion",
                    dataIndex: "FechaCreacion",
                    fixed: 'left',
                    width: 150,
                    customRender: this.renderContent
                },
                {
                    title: "FechaPospuesta",
                    dataIndex: "FechaPospuesta",
                    fixed: 'left',
                    width: 150,
                    customRender: this.renderContent
                },
                {
                    title: "Codigo",
                    dataIndex: "Codigo",
                    fixed: 'left',
                    width: 120,
                    customRender: this.renderContent
                },
                {
                    title: "Fecha Inicio",
                    dataIndex: "FechaInicio",
                    width: 200,
                    customRender: this.renderContent
                },
                {
                    title: "Fecha Finalizacion",
                    dataIndex: "FechaFinalizacion",
                    width: 200,
                    customRender: this.renderContent
                },
                {
                    title: "Solicitante",
                    dataIndex: "Solicitante",
                    width: 200,
                    customRender: this.renderContent
                },
                {
                    title: "Responsable",
                    dataIndex: "Responsable",
                    width: 200,
                    customRender: this.renderContent
                },
                {
                    title: "Sucursal",
                    dataIndex: "Sucursal",
                    width: 200,
                    customRender: this.renderContent
                },
                {
                    title: "Detalle",
                    dataIndex: "Detalle",
                    customRender: this.renderContent
                },
                {
                    title: "Pospuesta",
                    dataIndex: "Pospuesta",
                    customRender: this.renderContent
                },
                {
                    title: "Prioridad",
                    dataIndex: "Prioridad",
                    fixed: 'right',
                    width: 100,
                    customRender: this.renderContent
                },
                {
                    title: "Estado",
                    dataIndex: "Estado",
                    fixed: 'right',
                    width: 120,
                    customRender: this.renderContent
                }
            ],
            infor_d: [],
            consulta: gql`query tareas_reporte($Tipo: String!,$M: Int!,$Y: Int!,$Estado: String!) {
                tareas_reporte(Tipo:$Tipo,M:$M,Y:$Y,Estado:$Estado) {
                    ID
                    Codigo
                    Detalle
                    Estado
                    Pospuesta
                    FechaCreacion
                    FechaPospuesta
                    FechaInicio
                    FechaFinalizacion
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
                }
            }`
    };
  },
  components: { ComboNombre },
  methods: {
    async realizar_busqueda() {
      this.info = [];
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            Tipo: this.Tipo,
            Estado: this.Estado,
            M: parseInt(this.mes),
            Y: parseInt(this.anho)
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          if (result.data.tareas_reporte != null) {
            this.$socket.emit("Sumar_Linea", true);
            this.info = result.data.tareas_reporte;
            this.transformacion_data();
          }
        });
    },
    transformacion_data() {
        this.infor_d = [];
        for (let x = 0; x < this.info.length; x++) {
            let Responsable ="";
            let Sucursal ="";
            let Prioridad ="";
            let Solicitante ="";
            if (this.info[x]["Solicitante"]!=null) {
                if (this.info[x]["Solicitante"]["nombre"]!=null) {
                    Solicitante=this.info[x]["Solicitante"]["nombre"];
                }
            }
            if (this.info[x]["Responsable"]!=null) {
                if (this.info[x]["Responsable"]["nombre"]!=null) {
                    Responsable=this.info[x]["Responsable"]["nombre"];
                }
            }
            if (this.info[x]["Sucursal"]!=null) {
                if (this.info[x]["Sucursal"]["Nombre"]!=null) {
                    Sucursal=this.info[x]["Sucursal"]["Nombre"]+" ("+this.info[x]["Sucursal"]["CodigoSucursal"]+")";
                }
            }
            if (this.info[x]["Prioridad"]!=null) {
                if (this.info[x]["Prioridad"]["Nombre"]!=null) {
                    Prioridad=this.info[x]["Prioridad"]["Nombre"];
                }
            }
            this.infor_d.push({
                FechaCreacion:this.info[x]["FechaCreacion"],
                FechaPospuesta:this.info[x]["FechaPospuesta"],
                FechaInicio:this.info[x]["FechaInicio"],
                FechaFinalizacion:this.info[x]["FechaFinalizacion"],
                Codigo:this.info[x]["Codigo"],
                Solicitante:Solicitante,
                Responsable:Responsable,
                Sucursal:Sucursal,
                Detalle:this.info[x]["Detalle"],
                Pospuesta:this.info[x]["Pospuesta"],
                Prioridad:Prioridad,
                Estado:this.info[x]["Estado"]
            });
        }
    },
    descargar() {
      const data = XLSX.utils.json_to_sheet(this.infor_d);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, data, "Reporte");
      let d = new Date();
      XLSX.writeFile(wb, d + ".xlsx");
    },
    onChange_mes(a) {
      this.mes = a;
    },
    onChange_anho(a) {
      this.anho = a;
    },
    renderContent(value, row, index) {
      const obj = {
        children: value,
        attrs: {}
      };
      return obj;
    },
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
          Code: "P7"
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
