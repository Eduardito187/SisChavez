<template>
  <div>
    <div v-if="permiso" class="ancho">
      <b-jumbotron header="Asistencias Anual" class="mb-2">
        <div class="d-flex justify-content-between">
          <b-form-group class="col-md-3" label="Año:" label-for="Año" label-cols-sm="12" label-align-sm="right" >
            <a-input-number id="Año" v-model="anho" :min="2021" :max="2100" @change="onChange_anho" />
          </b-form-group>
          <b-form-group class="col-md-2" label="Buscador:" label-for="Buscador" label-cols-sm="12" label-align-sm="right">
            <a-button @click="realizar_busqueda()">Buscar</a-button>
          </b-form-group>
        </div>
      </b-jumbotron>
      <a-table :columns="columnas" :data-source="infor_d" :footer="null" :pagination="false" :scroll="{ x: 1210, y: 500 }" bordered >
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
            anho: 2021,
            info: [],
            permiso: null,
            columnas: [
                {
                    title: "Nombre",
                    dataIndex: "Nombre",
                    fixed: 'left',
                    width: 150,
                    customRender: this.renderContent
                },
                {
                    title: "Apellido",
                    dataIndex: "Apellido",
                    fixed: 'left',
                    width: 120,
                    customRender: this.renderContent
                },
                {
                    title: "CI",
                    dataIndex: "CI",
                    fixed: 'left',
                    width: 120,
                    customRender: this.renderContent
                },
                {
                    title: "Libre",
                    dataIndex: "Libre",
                    width: 110,
                    customRender: this.renderContent
                },
                {
                    title: "Baja Medica",
                    dataIndex: "BajaMedica",
                    width: 130,
                    customRender: this.renderContent
                },
                {
                    title: "Permisos",
                    dataIndex: "Permisos",
                    width: 110,
                    customRender: this.renderContent
                },
                {
                    title: "Faltas",
                    dataIndex: "Faltas",
                    width: 110,
                    customRender: this.renderContent
                },
                {
                    title: "Puesto",
                    dataIndex: "Puesto",
                    fixed: 'right',
                    width: 180,
                    customRender: this.renderContent
                },
                {
                    title: "Fecha de Contratacion",
                    dataIndex: "FechaContratacion",
                    fixed: 'right',
                    width: 180,
                    customRender: this.renderContent
                }
            ],
            infor_d: [],
            consulta: gql`query TablasControlesEn($Anho: Int!) {
                TablasControlesEn(Anho:$Anho) {
                    ID
                    Anho
                    Libre
                    BajaMedica
                    Permisos
                    Faltas
                    Trabajador {
                        ID
                        Nombre
                        Apellido
                        CI
                        Puesto
                        FechaContratacion
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
            Anho: this.anho
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          if (result.data.TablasControlesEn != null) {
            this.$socket.emit("Sumar_Linea", true);
            this.info = result.data.TablasControlesEn;
            this.transformacion_data();
          }
        });
    },
    transformacion_data() {
        this.infor_d = [];
        for (let x = 0; x < this.info.length; x++) {
            if (this.info[x]["Trabajador"]!=null) {
                this.infor_d.push({
                    "Nombre":this.info[x]["Trabajador"]["Nombre"],
                    "Apellido":this.info[x]["Trabajador"]["Apellido"],
                    "CI":this.info[x]["Trabajador"]["CI"],
                    "Libre":this.info[x]["Libre"],
                    "BajaMedica":this.info[x]["BajaMedica"],
                    "Permisos":this.info[x]["Permisos"],
                    "Faltas":this.info[x]["Faltas"],
                    "Puesto":this.info[x]["Trabajador"]["Puesto"],
                    "FechaContratacion":this.info[x]["Trabajador"]["FechaContratacion"]
                });
            }
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
          Code: "P54"
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
