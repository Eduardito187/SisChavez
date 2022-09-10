<template>
  <div>
    <div v-if="permiso" class="ancho">
      <b-jumbotron header="Reporte de Control Diario" class="mb-2">
        <div class="d-flex justify-content-between">
          <b-form-group
            class="col-md-3"
            label="Sucursal:"
            label-for="Nombre"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <ComboNombre tipo="sucursales" @change="Sucursal = $event" />
            <a-checkbox :checked="sin_s" @change="CheckChange">
              Null
            </a-checkbox>
          </b-form-group>
          <b-form-group
            class="col-md-3"
            label="Empresa:"
            label-for="Empresa"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <ComboNombre tipo="empresa_guardia" @change="Empresa = $event" />
          </b-form-group>
          <b-form-group
            class="col-md-1"
            label="Mes:"
            label-for="Mes"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <a-input-number
              id="Mes"
              v-model="mes"
              :min="1"
              :max="12"
              @change="onChange_mes"
            />
          </b-form-group>
          <b-form-group
            class="col-md-1"
            label="Año:"
            label-for="Año"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <a-input-number
              id="Año"
              v-model="anho"
              :min="2021"
              :max="2100"
              @change="onChange_anho"
            />
          </b-form-group>
          <b-form-group
            v-if="
              (Sucursal != null && Empresa != null) ||
                (sin_s == true && Empresa != null)
            "
            class="col-md-2"
            label="Buscador:"
            label-for="Buscador"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <a-button @click="realizar_busqueda()">Buscar</a-button>
          </b-form-group>
        </div>
      </b-jumbotron>
      <a-table
        :columns="columnas"
        :data-source="infor_d"
        :footer="null"
        :pagination="false"
        bordered
      >
        <template slot="name" slot-scope="text">
          <a>{{ text }}</a>
        </template>
      </a-table>
      <b-jumbotron>
        <hr class="my-4" />
        <a-button icon="arrow-down" @click="descargar()"
          >Exportar Datos</a-button
        >
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
      Sucursal: null,
      Empresa: null,
      mes: 1,
      anho: 2021,
      info: [],
      sin_s: false,
      permiso: null,
      columnas: [
        {
          title: "Guardia",
          dataIndex: "Guardia",
          customRender: this.renderContent
        },
        {
          title: "Sucursal",
          dataIndex: "Sucursal",
          customRender: this.renderContent
        },
        {
          title: "Empresa",
          dataIndex: "Empresa",
          customRender: this.renderContent
        },
        {
          title: "Tiempo",
          dataIndex: "Tiempo",
          customRender: this.renderContent
        },
        {
          title: "SubTotal",
          dataIndex: "SubTotal",
          customRender: this.renderContent
        }
      ],
      infor_d: [],
      consulta: gql`
        query control_diarios_reporte(
          $Sucursal: Int!
          $Empresa: Int!
          $M: Int!
          $Y: Int!
          $Check: Boolean!
        ) {
          control_diarios_reporte(
            Sucursal: $Sucursal
            Empresa: $Empresa
            M: $M
            Y: $Y
            Check: $Check
          ) {
            ID
            Calculo
            Fecha
            Empresa {
              Nombre
            }
            Sucursal {
              Nombre
            }
            Guardia {
              Nombre
              Precio
            }
          }
        }
      `
    };
  },
  components: { ComboNombre },
  methods: {
    CheckChange(e) {
      this.sin_s = e.target.checked;
    },
    async realizar_busqueda() {
      if (this.Sucursal == null) {
        this.Sucursal = 0;
      }
      this.info = [];
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            Sucursal: parseInt(this.Sucursal),
            Empresa: parseInt(this.Empresa),
            M: parseInt(this.mes),
            Y: parseInt(this.anho),
            Check: this.sin_s
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          if (result.data.control_diarios_reporte != null) {
            this.$socket.emit("Sumar_Linea", true);
            this.info = result.data.control_diarios_reporte;
            this.transformacion_data();
          }
        });
    },
    ubicar_guardia_data(guardia) {
      let f = false;
      for (let x = 0; x < this.infor_d.length; x++) {
        if (guardia == this.infor_d[x]["Guardia"]) {
          x = this.infor_d.length;
          f = true;
        }
      }
      return f;
    },
    ubicar_guardia_datos(guardia) {
      let a = {
        Tiempo: 0,
        SubTotal: 0
      };
      //Precio
      //(min/t)*p
      for (let x = 0; x < this.info.length; x++) {
        if (guardia == this.info[x]["Guardia"]["Nombre"]) {
          if (this.info[x]["Calculo"] > 0) {
            a.Tiempo += this.info[x]["Calculo"];
            //retraso/60 * precio
            let aux = this.info[x]["Guardia"]["Precio"];
            aux = aux / 30 / 8;
            a.SubTotal += (this.info[x]["Calculo"] / 60) * aux;
          }
        }
      }
      return a;
    },
    transformacion_data() {
      this.infor_d = [];
      for (let x = 0; x < this.info.length; x++) {
        if (!this.ubicar_guardia_data(this.info[x]["Guardia"]["Nombre"])) {
          let f = this.ubicar_guardia_datos(this.info[x]["Guardia"]["Nombre"]);
          this.infor_d.push({
            Empresa: this.info[x]["Empresa"]["Nombre"],
            Guardia: this.info[x]["Guardia"]["Nombre"],
            Sucursal: this.info[x]["Sucursal"]["Nombre"],
            Tiempo: f.Tiempo.toString(),
            SubTotal: f.SubTotal.toFixed(2).toString()
          });
        }
      }
      this.infor_d.push({
        Empresa: "Datos Totales:",
        Guardia: "",
        Sucursal: "",
        Tiempo: this.sumTotal("TTiempo"),
        SubTotal: this.sumTotal("TSub")
      });
      /*
            
                {
                    title: 'Home phone',
                    colSpan: 2,
                    dataIndex: 'tel',
                    customRender: (value, row, index) => {
                    const obj = {
                        children: value,
                        attrs: {},
                    };
                    if (index === 2) {
                        obj.attrs.rowSpan = 2;
                    }
                    // These two are merged into above cell
                    if (index === 3) {
                        obj.attrs.rowSpan = 0;
                    }
                    return obj;
                    },
                },
            */
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
      if (value == "Datos Totales:") {
        obj.attrs.colSpan = 3;
      }
      if (value == "") {
        obj.attrs.colSpan = 0;
      }
      return obj;
    },
    sumTotal(tipo) {
      let v = 0;
      for (let x = 0; x < this.infor_d.length; x++) {
        if (tipo == "TTiempo") {
          if (
            this.infor_d[x]["Tiempo"] != "TTiempo" &&
            this.infor_d[x]["Tiempo"] != null
          ) {
            v += parseInt(this.infor_d[x]["Tiempo"]);
          } else {
            v += 0;
          }
        } else if (tipo == "TSub") {
          if (
            this.infor_d[x]["SubTotal"] != "TSub" &&
            this.infor_d[x]["SubTotal"] != null
          ) {
            v += parseFloat(this.infor_d[x]["SubTotal"]);
          } else {
            v += 0;
          }
        }
      }
      if (tipo == "TSub") {
        v = v.toFixed(2);
      }
      return v.toString();
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
          Code: "P34"
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
