<template>
  <div>
    <a-progress
      v-if="dato != null"
      :percent="porcentaje"
      :status="porcentaje != 100 ? 'active' : 'success'"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      dato: null,
      anho: null,
      dia: null,
      mes: null,
      porcentaje: 0
    };
  },
  props: {
    data: {
      type: Number
    },
    todo: {
      type: Array
    }
  },
  methods: {
    obt_mes_enlish(mes) {
      if (mes == 1) {
        return "Jan";
      } else if (mes == 2) {
        return "Feb";
      } else if (mes == 3) {
        return "Mar";
      } else if (mes == 4) {
        return "Apr";
      } else if (mes == 5) {
        return "May";
      } else if (mes == 6) {
        return "Jun";
      } else if (mes == 7) {
        return "Jul";
      } else if (mes == 8) {
        return "Aug";
      } else if (mes == 9) {
        return "Sep";
      } else if (mes == 10) {
        return "Oct";
      } else if (mes == 11) {
        return "Nov";
      } else if (mes == 12) {
        return "Dec";
      }
    },
    obtener_dif() {
      var fecha = new Date();
      var ingreso =
        this.obt_mes_enlish(this.mes) +
        " " +
        this.dia +
        " " +
        this.anho +
        " " +
        this.dato.Tiempo.Ingreso +
        " GMT-0400";
      var f = new Date(ingreso);
      var salida =
        this.obt_mes_enlish(this.mes) +
        " " +
        this.dia +
        " " +
        this.anho +
        " " +
        this.dato.Tiempo.Salida +
        " GMT-0400";
      var f1 = new Date(salida);
      var total_h = f1 - f;
      total_h = parseInt(total_h / (1000 * 60));
      if (total_h <= 0) {
        f1.setDate(f1.getDate() + 1);
        total_h = f1 - f;
        total_h = parseInt(total_h / (1000 * 60));
      }
      var time = f1 - fecha;
      var min = parseInt(time / (1000 * 60));
      if (min <= 0) {
        this.porcentaje = 100;
        this.pausarintervalo();
      } else {
        //(t/total)*100
        //tiempo transcurrido / total de horas en trabajo * 100%
        let x = total_h - min;
        this.porcentaje = parseInt((x / total_h) * 100);
      }
    },
    pausarintervalo() {
      clearInterval(this.intervalo);
    },
    iniciointervalo() {
      this.intervalo = setInterval(() => {
        this.obtener_dif();
      }, 60000);
    }
  },
  mounted() {
    for (let index = 0; index < this.todo.length; index++) {
      if (this.todo[index]["ID"] == this.data) {
        this.dato = this.todo[index];
        index = this.todo.length;
        this.anho = parseInt(this.dato.Fecha.substring(0, 4));
        this.mes = parseInt(this.dato.Fecha.substring(5, 7));
        this.dia = parseInt(this.dato.Fecha.substring(8, 10));
        this.obtener_dif();
        if (this.porcentaje != 100) {
          this.iniciointervalo();
        }
      }
    }
  },
  beforeDestroy() {
    this.pausarintervalo();
  }
};
</script>
