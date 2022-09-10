<template>
  <div class="BarraCuenta">
    <div style="width:auto;height:50px;">
      <img
        :style="{
          width: ancho + 'px',
          height: ancho + 'px',
          display: 'inline-block',
          marginRight: '5px',
          borderRadius: ancho / 2 + 'px'
        }"
        :src="foto"
      />
      <h5
        @click="() => $emit('click_ev', true)"
        :style="{
          display: 'inline-block',
          marginRight: '5px',
          color: '#808080',
          fontWeight: 'bold'
        }"
      >
        {{ nombre }}
      </h5>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: "BarraCuenta",
  data() {
    return {};
  },
  sockets: {
    connect(data) {
      //
    }
  },
  props: {
    foto: {
      type: String
    },
    nombre: {
      type: String
    },
    ancho: {
      type: Number
    },
    click: {
      type: Function
    }
  },
  mounted() {
    if (localStorage != null) {
      if (localStorage.id_cuenta != null) {
        this.$socket.emit("activo", { id: parseInt(localStorage.id_cuenta) });
      }
    }
  },
  async created(){
    await this.$apollo
      .query({
        query: gql`
          query saber_permiso($Cuenta: Int!, $Code: String!) {
            saber_permiso(Cuenta: $Cuenta, Code: $Code) {
              Respuesta
            }
          }
        `,
        variables: {
          Cuenta: parseInt(localStorage.id_cuenta),
          Code: "P58"
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        if (result.data.saber_permiso != null) {
          if (result.data.saber_permiso.Respuesta) {
            this.sockets.subscribe("Notificaciones_SISCHAVEZ_"+localStorage.id_cuenta, data => {
              if (data != null) {
                this.$notification.open({
                  message: data.Titulo,
                  description:data.Motivo,
                  onClick: () => {
                    this.$router.push("/Recargar");
                  },
                  placement:'bottomRight'
                });
              }
            });
            this.$socket.emit("Solicitar_Exintores_Por_Vencer", parseInt(localStorage.id_cuenta));
          }
        }
      });
  },
  beforeDestroy() {
    this.sockets.unsubscribe("Notificaciones_SISCHAVEZ_"+localStorage.id_cuenta);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
