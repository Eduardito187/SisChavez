<template>
  <div style="display:flex;">
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="Recepcion">
        <a-icon type="unordered-list" />Recepcion
      </a-menu-item>
      <a-menu-item key="Registrar Recepcion">
        <a-icon type="plus" />Registrar Recepcion
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: ["Recepcion"]
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
          if (val == "Recepciones") {
            this.current = ["Recepcion"];
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
