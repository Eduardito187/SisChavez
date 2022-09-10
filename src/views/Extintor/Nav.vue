<template>
  <div style="display:flex;">
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="Extintores">
        <a-icon type="unordered-list" />Extintores
      </a-menu-item>
      <a-menu-item key="Registrar Extintor">
        <a-icon type="plus" />Registrar Extintor
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: ["Extintores"]
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
          if (val == "Tareas") {
            this.current = ["Tareas"];
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
