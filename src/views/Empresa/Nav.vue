<template>
  <div style="display:flex;">
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="Control Diario" v-if="nav == 'Control Diario'">
        <a-icon type="form" />Control Diario
      </a-menu-item>
      <a-menu-item key="Nuevo Control Diario" v-if="nav == 'Control Diario'">
        <a-icon type="plus" />Agregar Control Diario
      </a-menu-item>
      <a-menu-item key="Nuevo Horario" v-if="nav == 'Control Diario'">
        <a-icon type="plus" />Agregar Horario
      </a-menu-item>
      <a-menu-item
        key="Empresa de Seguridad"
        v-if="nav == 'Empresa de Seguridad'"
      >
        <a-icon type="security-scan" />Empresa de Seguridad
      </a-menu-item>
      <a-menu-item
        key="Nuevo Empresa de Seguridad"
        v-if="nav == 'Empresa de Seguridad'"
      >
        <a-icon type="plus" />Agregar Empresa de Seguridad
      </a-menu-item>
      <a-menu-item key="Guardia" v-if="nav == 'Guardia'">
        <a-icon type="property-safety" />Guardia
      </a-menu-item>
      <a-menu-item key="Nuevo Guardia" v-if="nav == 'Guardia'">
        <a-icon type="plus" />Agregar Guardia
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: ["Control Diario"]
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
          if (val == "Control Diario") {
            this.current = ["Control Diario"];
          } else if (val == "Empresa de Seguridad") {
            this.current = ["Empresa de Seguridad"];
          } else if (val == "Guardia") {
            this.current = ["Guardia"];
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
</script>
