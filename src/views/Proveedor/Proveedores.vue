<template>
  <div class="proveedores columna">
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
  name: "proveedores",
  data() {
    return {};
  },
  components: { Principal },
  methods: {},
  mounted() {
    if (localStorage.id_cuenta == null) {
      this.$router.push("/");
    }
  }
};
</script>
