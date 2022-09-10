<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo"></div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1" @click="seleccion('Seguimiento')">
          <a-icon type="shopping" />
          <span>Seguimiento</span>
        </a-menu-item>
        <a-menu-item :selectable="false" style="background-color:white;">
          <span style="margin: 0 auto;color:red;">
            <b style="font-size:1.6rem;">CITE {{CITE}}-{{YEAR}}</b>
          </span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0;display:flex;">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <Nav :nav="nav" @update="elemento = $event" />
      </a-layout-header>
      <a-layout-content
        v-if="elemento != null"
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px'
        }"
      >
        <Lista v-if="elemento[0] == 'Seguimiento'" />
        <Registrar v-else-if="elemento[0] == 'Nuevo Seguimiento'" />
        <RegInstantaneo v-else-if="elemento[0] == 'Nuevo Instantaneo'" />
        <ListaHistorico v-else-if="elemento[0] == 'Historico'" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import Registrar from "./Registrar.vue";
import RegInstantaneo from "./RegistrarInst.vue";
import Lista from "./Lista.vue";
import Nav from "./Nav.vue";
import ListaHistorico from "./ListaHistorico.vue";
import { Gestion } from "../../Configuracion";
export default {
  data() {
    return {
      collapsed: false,
      nav: "Seguimiento",
      elemento: null,
      CITE: "--",
      YEAR: Gestion
    };
  },
  components: { Nav, Lista, Registrar,RegInstantaneo,ListaHistorico },
  methods: {
    seleccion(a) {
      if (this.elemento != null) {
        if (a != this.elemento[0]) {
          this.nav = a;
        }
      }
    }
  },
  created() {
    if (localStorage.id_cuenta == null) {
      this.$router.push("/");
    } else {
      this.sockets.subscribe("CITE_SIGUIENTE", data => {
        this.CITE = data.CITE;
      });
    }
    this.$socket.emit("NuevoRegistro", true);
  },
  beforeDestroy() {
    this.sockets.unsubscribe("CITE_SIGUIENTE");
  }
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
