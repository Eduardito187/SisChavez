<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo"></div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1" @click="seleccion('Control Diario')">
          <a-icon type="form" />
          <span>Control Diario</span>
        </a-menu-item>
        <a-menu-item key="2" @click="seleccion('Empresa de Seguridad')">
          <a-icon type="security-scan" />
          <span>Empresa de Seguridad</span>
        </a-menu-item>
        <a-menu-item key="3" @click="seleccion('Guardia')">
          <a-icon type="property-safety" />
          <span>Guardia</span>
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
        <AddDiario v-if="elemento[0] == 'Nuevo Control Diario'" />
        <AddEmpresa v-else-if="elemento[0] == 'Nuevo Empresa de Seguridad'" />
        <AddGuardia v-else-if="elemento[0] == 'Nuevo Guardia'" />
        <ListDiario v-else-if="elemento[0] == 'Control Diario'" />
        <ListEmpresa v-else-if="elemento[0] == 'Empresa de Seguridad'" />
        <ListGuardia v-else-if="elemento[0] == 'Guardia'" />
        <AddHorario v-else-if="elemento[0] == 'Nuevo Horario'" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
//
import Nav from "./Nav.vue";
import AddDiario from "./AddDiario.vue";
import AddHorario from "./AddHorario.vue";
import AddEmpresa from "./AddEmpresa.vue";
import AddGuardia from "./AddGuardia.vue";
import ListDiario from "./ListDiario.vue";
import ListEmpresa from "./ListEmpresa.vue";
import ListGuardia from "./ListGuardia.vue";
export default {
  data() {
    return {
      collapsed: false,
      nav: "Control Diario",
      elemento: null
    };
  },
  components: {
    Nav,
    AddDiario,
    AddEmpresa,
    AddGuardia,
    ListDiario,
    ListEmpresa,
    ListGuardia,
    AddHorario,
  },
  methods: {
    seleccion(a) {
      if (this.elemento != null) {
        if (a != this.elemento[0]) {
          if (a == "Control Diario") {
            this.elemento = ["Control Diario"];
          } else if (a == "Empresa de Seguridad") {
            this.elemento = ["Empresa de Seguridad"];
          } else if (a == "Guardia") {
            this.elemento = ["Guardia"];
          }
          this.nav = a;
        }
      }
    }
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
