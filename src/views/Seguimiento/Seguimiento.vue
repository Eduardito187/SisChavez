<template>
  <div class="Seguimiento columna">
    <div class="col-md-12" style="margin-top:60px;">
      <div class="columna fondo abajo">
        <div class="ancho">
          <Principal />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Principal from "./Principal.vue";
export default {
  name: "Seguimiento",
  data() {
    return {
      validacionR: false
    };
  },
  components: { Principal },
  methods: {},
  mounted() {}
};
</script>
