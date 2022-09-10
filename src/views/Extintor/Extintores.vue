<template>
  <div class="extintores columna">
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
const axios = require("axios");
import gql from "graphql-tag";
import Principal from "./Principal.vue";
export default {
  name: "extintores",
  components: {
    Principal
  },
  data() {
    return {};
  },
  methods: {},
  async mounted() {
    if (localStorage.id_cuenta == null) {
      this.$router.push("/");
    }
  }
};
</script>
