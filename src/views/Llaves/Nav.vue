<template>
  <div style="display:flex;">
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="Control de Llaves">
        <a-icon type="form" />Control de Llaves
      </a-menu-item>
      <a-menu-item key="Nuevo Control de Llaves">
        <a-icon type="plus" />Agregar Control de Llaves
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: ["Control de Llaves"]
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
          if (val == "Control de Llaves") {
            this.current = ["Control de Llaves"];
          } else if (val == "Nuevo Control de Llaves") {
            this.current = ["Nuevo Control de Llaves"];
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
