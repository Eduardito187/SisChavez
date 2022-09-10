<template>
  <div class="vnt" :style="{ height: alto - 70 + 'px', marginTop: '67px' }">
    <div
      class="main__chat_window"
      :style="{ height: alto - 140 + 'px', overflowY: 'scroll' }"
    >
      <div v-for="m in mensajes" :key="m.ID" class="message">
        <Mensaje :mensaje="m" :id_Cuenta="id_Cuenta" :Cuenta="Cuenta" />
      </div>
    </div>
    <div class="main__message_container">
      <input type="text" v-model="texto" @focus="blur_fnct()" @blur="focus_fnct()" autocomplete="off" placeholder="Mensaje aqui..." />
      <div @click="enviar_mensaje()" class="options__button">
        <a-icon type="mail" />
      </div>
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";
import Mensaje from "./Mensaje.vue";
export default {
  data() {
    return {
      data: [],
      alto: window.innerHeight,
      consulta: gql`mutation EnviarMSG($De:Int!,$Para:Int!,$Texto:String!) {
          EnviarMSG(De:$De,Para:$Para,Texto:$Texto) {
            ID
            Texto
            Fecha
            Leido
            F_Leido
            De{
              ID
              nombre
              foto
            }
            Para{
              ID
              nombre
              foto
            }
          }
        }
      `,
      visible: false,
      mensajes: [],
      texto:""
    };
  },
  components: { Mensaje },
  props: {
    id_Cuenta: {
      type: [String, Number]
    },
    Cuenta: {
      type: Object
    }
  },
  methods: {
    blur_fnct(){
      this.$socket.emit("Estados", {estado:"Escribiendo...",sala:this.Cuenta.ID + "__ROOM__ESTADO__" + this.id_Cuenta})
    },
    focus_fnct(){
      this.$socket.emit("Estados", {estado:"",sala:this.Cuenta.ID + "__ROOM__ESTADO__" + this.id_Cuenta})
    },
    async obtenerData() {
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            ID: parseInt(this.id_Cuenta)
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.cuenta_menos;
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    cerrar_data() {
      this.$emit("cerrar", false);
    },
    async enviar_mensaje() {
      let x=this.texto
      this.texto=""
      await this.$apollo
        .mutate({
          mutation: this.consulta,
          variables: {
            De:parseInt(this.id_Cuenta),
            Para:parseInt(this.Cuenta.ID),
            Texto:x
          }
        })
        .then(result => {
          if (result.data.EnviarMSG!=null) {
            this.mensajes.push(result.data.EnviarMSG)
            this.$socket.emit("AlmacenMensajes", {mensaje:result.data.EnviarMSG,de:this.id_Cuenta,para:this.Cuenta.ID})
          }
        });
    }
  },
  async created() {
    window.addEventListener("resize", () => {
      this.alto = window.innerHeight;
    });
    if (this.id_Cuenta != null && this.Cuenta.ID != null) {
      this.sockets.subscribe(
        this.id_Cuenta + "__ROOM__NUEVO__" + this.Cuenta.ID,
        data => {
          if (data != null) {
            this.mensajes.push(data)
            this.$emit("nuevo_msg",data)
          }
        }
      );
      this.sockets.subscribe(
        this.id_Cuenta + "__ROOM__ESTADO__" + this.Cuenta.ID,
        data => {
          if (data != null) {
            this.$emit("estado",data)
          }
        }
      );
      this.sockets.subscribe(
        this.id_Cuenta + "__ROOM__" + this.Cuenta.ID,
        data => {
          if (data != null) {
            this.mensajes = data;
          }
        }
      );
      this.$socket.emit("Recopilar_Chat_INI", {
        DE: parseInt(this.id_Cuenta),
        PARA: parseInt(this.Cuenta.ID)
      });
    }
  },
  beforeDestroy() {
    if (this.id_Cuenta != null && this.Cuenta.ID != null) {
      this.sockets.unsubscribe(this.id_Cuenta + "__ROOM__" + this.Cuenta.ID);
    }
  }
};
</script>
<style>
.vnt {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
}
.main__chat_window {
  background-color: #3e96f8;
  overflow-y: scroll;
}

.main__chat_window::-webkit-scrollbar {
  display: none;
}
.options__button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);
  height: 50px;
  border-radius: 5px;
  color: var(--main-light);
  font-size: 1.2rem;
  width: 50px;
  margin: 0 0.5rem;
  cursor: pointer;
}
.main__message_container {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
.main__message_container > input {
  height: 50px;
  flex: 1;
  font-size: 1rem;
  border-radius: 5px;
  padding-left: 20px;
  border: none;
}
.message {
  padding: 5px;
}
</style>
