<template>
  <div class="inicio columna">
    <div class="col-md-12" style="margin-top:60px;">
      <div class="columna">
        <div style="background-color:white;border-radius:3px;height:100vh;justify-content:center;align-items:center;">
          <h1 style="text-align: center;line-height:100vh;font-style: oblique;font-weight:bold;font-size:60px;">SisChavez</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  name: "inicio",
  data() {
    return {
    };
  },
  components: {},
  methods: {
  },
  sockets: {
    connect(data) {
      console.log(data);
    }
  },
  created() {
    document.title = "Chavez | Inicio";
    if (localStorage.id_cuenta == null) {
      this.$router.push("/");
    }
  },
  mounted() {},
};
</script>
