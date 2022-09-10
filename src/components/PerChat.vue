<template>
  <div>
    <div
      @click="showDrawer()"
      style="width:100%;padding:5px;height:auto;background-color:white;text-aling:left;display:flex;border-bottom-left-radius: 3px;border-bottom-right-radius: 3px;"
    >
      <a-avatar
        style="display:flex;margin-left:5px;cursor:pointer;"
        slot="avatar"
        :size="50"
        :src="Cuenta.foto"
      />
      <div style="display:flex;margin-left:5px;height:50px;width:230px;position:relative;">
        <b style="cursor:pointer;position:absolute;left:0px;top:0px;z-index:10;">
          {{Cuenta.nombre}}
          <a-icon type="message" :style="{color:state?'green':'red'}" />
        </b>
        <b v-if="estado!=''" style="cursor:pointer;position:absolute;left:0px;top:25px;z-index:1000;color:green;font-size:12px;">{{estado}}</b>
      </div>
    </div>
    <a-drawer
      :width="720"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <CuerpoChat :id_Cuenta="id_Cuenta" :Cuenta="Cuenta" @estado="update_estado($event)" @nuevo_msg="recibir_msg($event)" />
    </a-drawer>
  </div>
</template>
<script>
import gql from "graphql-tag";
import CuerpoChat from "./CuerpoChat.vue";
export default {
  data() {
    return {
      data: [],
      consulta: gql`
        query cuenta_menos($ID: Int!) {
          cuenta_menos(ID: $ID) {
            ID
            nombre
            foto
          }
        }
      `,
      visible: false,
      estado:"",
      state:false,
    };
  },
  components: { CuerpoChat },
  props: {
    id_Cuenta: {
      type: [String, Number]
    },
    Cuenta: {
      type: Object
    }
  },
  methods: {
    update_estado(a){
      if (a!=null) {
        this.estado=a
      }
    },
    recibir_msg(a){
      if (this.visible==false) {
        this.$notification.open({
          message: a.De.nombre,
          description: a.Texto,
          onClick: () => {
            this.showDrawer()
          },
          placement: "bottomRight",
          icon: <img style={{width: 40 + 'px',height: 40 + 'px',borderRadius: 40 / 2 + 'px'}} src={a.De.foto} />
        });
      }
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
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
    }
  },
  async created() {
    if (this.id_Cuenta != null) {
      //this.obtenerData()
      
    }
    if (this.Cuenta!=null) {
      this.$socket.emit("Si_Conectado", this.Cuenta.ID)
      this.sockets.subscribe(
        this.Cuenta.ID + "Persona",
        data => {
          if (data != null) {
            this.state=data
          }
        }
      );
    }
  },
  beforeDestroy() {
    if (this.id_Cuenta != null && this.Cuenta.ID != null) {
      this.sockets.unsubscribe(this.Cuenta.ID + "Persona");
    }
  }
};
</script>
