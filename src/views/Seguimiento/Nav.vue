<template>
  <div style="display:flex;">
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="Seguimiento">
        <a-icon type="form" />Seguimiento
      </a-menu-item>
      <a-menu-item key="Nuevo Seguimiento">
        <a-icon type="plus" />Agregar Seguimiento
      </a-menu-item>
      <a-menu-item key="Nuevo Instantaneo">
        <a-icon type="plus" />Agregar Instantaneo
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: ["Seguimiento"]
    };
  },
  props: {
    nav: {
      type: String
    }
  },
  watch: {
    current: {
      immediate: true,
      handler(val, oldVal) {
        //nuevo--anterior
        if (val != null && oldVal != null) {
          this.transmitir_Seccion();
        }
      }
    },
    nav: {
      immediate: true,
      handler(val, oldVal) {
        if (val != null && oldVal != null) {
          if (val == "Seguimiento") {
            this.current = ["Seguimiento"];
          } else if (val == "Nuevo Seguimiento") {
            this.current = ["Nuevo Seguimiento"];
          } else if (val == "Reporte Seguimiento") {
            this.current = ["Reporte Seguimiento"];
          }
        }
      }
    }
  },
  methods: {
    transmitir_Seccion() {
      this.$emit("update", this.current);
    }
  },
  mounted() {
    this.transmitir_Seccion();
  }
};
/*
<a-menu-item key="Historico">
  <a-icon type="ordered-list" />Historico
</a-menu-item>
*/
</script>
