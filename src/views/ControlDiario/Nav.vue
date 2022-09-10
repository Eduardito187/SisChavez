<template>
  <div style="display:flex;">
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="Control Diario" v-if="nav == 'Control Diario'">
        <a-icon type="form" />Control Diario
      </a-menu-item>
      <a-menu-item
        key="Nuevo Control Diario"
        v-if="nav == 'Nuevo Control Diario'"
      >
        <a-icon type="plus" />Agregar Control Diario
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
          } else if (val == "Nuevo Control Diario") {
            this.current = ["Nuevo Control Diario"];
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
