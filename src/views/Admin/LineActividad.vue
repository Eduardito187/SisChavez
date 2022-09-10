<template>
  <div>
    <apexchart
      v-if="series != null"
      ref="chart_activy"
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    />
    <h1 @click="incrementar()">Sumar</h1>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
export default {
  data() {
    return {
      series: [
        {
          name: "Actividades",
          data: [0, 0, 0, 0, 0, 0, 0]
        }
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: false
          },
          animations: {
            enabled: true,
            easing: "linear",
            dynamicAnimation: {
              speed: 1000
            }
          },
          zoom: {
            enabled: false
          }
        },
        colors: ["#77B6EA", "#545454"],
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          text: "Actividades",
          align: "left"
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5
          }
        },
        markers: {
          size: 1
        },
        xaxis: {
          categories: [
            "Domingo",
            "Lunes",
            "Martes",
            "Miercoles",
            "Jueves",
            "Viernes",
            "Sabado"
          ],
          title: {
            text: "Semana"
          }
        },
        yaxis: {
          title: {
            text: "Actividades"
          }
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      }
    };
  },
  components: { apexchart: VueApexCharts },
  methods: {
    Saber_DATA() {
      this.$socket.emit("Line_Actividad", true);
    },
    incrementar() {
      this.$socket.emit("Sumar_Linea", true);
    }
  },
  sockets: {
    connect(data) {
      //
    }
  },
  created() {},
  mounted() {
    this.Saber_DATA();
    this.sockets.subscribe("Panel_Actividad_Line", data => {
      if (data != null) {
        if (data.length == 7) {
          let x = [
            data[0]["cantidad"],
            data[1]["cantidad"],
            data[2]["cantidad"],
            data[3]["cantidad"],
            data[4]["cantidad"],
            data[5]["cantidad"],
            data[6]["cantidad"]
          ];
          this.series[0]["data"] = x;
          this.$refs.chart_activy.updateSeries([
            {
              data: x
            }
          ]);
        }
      }
    });
    this.sockets.subscribe("Agregar_Data_Line", data => {
      if (data != null) {
        let x = this.series[0]["data"];
        if (data == "Domingo") {
          x[0] += 1;
        } else if (data == "Lunes") {
          x[1] += 1;
        } else if (data == "Martes") {
          x[2] += 1;
        } else if (data == "Miercoles") {
          x[3] += 1;
        } else if (data == "Jueves") {
          x[4] += 1;
        } else if (data == "Viernes") {
          x[5] += 1;
        } else if (data == "Sabado") {
          x[6] += 1;
        }
        this.$refs.chart_activy.updateSeries([
          {
            data: x
          }
        ]);
        this.series[0]["data"] = x;
      }
    });
  },
  beforeDestroy() {
    this.sockets.unsubscribe("Panel_Actividad_Line");
    this.sockets.unsubscribe("Agregar_Data_Line");
  }
};
</script>
