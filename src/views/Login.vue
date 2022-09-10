<template>
  <div class="login App">
    <div class="vertical-center">
      <div class="inner-block">
        <div class="vue-tempalte">
          <h3>Inicio de Sesión</h3>
          <b-alert :show="dismissCountDown" dismissible variant="warning" @dismissed="dismissCountDown = 0" @dismiss-count-down="countDownChanged" >
            <small>{{ err }}</small>
            <b-progress variant="warning" :max="dismissSecs" :value="dismissCountDown" height="4px" ></b-progress>
          </b-alert>
          <div class="form-group">
            <label>Usuario</label>
            <input type="text" class="form-control form-control-lg" v-model="usuario" />
          </div>

          <div class="form-group mb-2">
            <label>Contraseña</label>
            <input type="password" v-on:keyup.13="event_enter" class="form-control form-control-lg" v-model="contra" />
          </div>

          <button type="submit" @click="validarLogin()" class="btn btn-dark btn-lg btn-block" >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
import gql from "graphql-tag";
import {URL_APICHAVEZ} from "./../Configuracion";

export default {
  name: "login",
  components: {},
  data() {
    return {
      usuario: "",
      contra: "",
      validacion: {},
      err: null,
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false
    };
  },
  methods: {
    event_enter(){
     this.validarLogin();
    },
    async validarLogin() {
      this.err = null;
      axios
        .post(URL_APICHAVEZ+"nogph.php", {
          case: 0,
          usuraio: this.usuario,
          contra: this.contra
        })
        .then(response => {
          if (response.data.estado) {
            localStorage.id_cuenta = response.data.id_cuenta;
            this.$router.push("/Inicio");
            this.$socket.emit("Sumar_Linea", true);
          } else {
            this.err = "Datos erroneos";
            this.showAlert();
          }
        })
        .catch(error => {
          this.err = error;
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    }
  },
  created() {
    document.title = "Chavez | Login";
  },
  mounted() {
    if (localStorage.id_cuenta != null) {
      this.$router.push("/Inicio");
    } else {
      this.$router.push("/");
    }
  }
};
</script>
