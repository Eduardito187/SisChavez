<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo"></div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['2']">
        <a-menu-item key="2" @click="seleccion('Lotes')">
          <a-icon type="dropbox" />
          <span>Lotes</span>
        </a-menu-item>
        <a-menu-item key="1" @click="seleccion('Productos')">
          <a-icon type="shopping" />
          <span>Productos</span>
        </a-menu-item>
        <a-menu-item key="3" @click="seleccion('Salientes')">
          <a-icon type="home" />
          <span>Salientes</span>
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
        <Producto :nav="nav" @update="elemento = $event" />
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
        <ListProducto v-if="elemento[0] == 'Productos'" />
        <AddProducto v-else-if="elemento[0] == 'NuevoProducto'" />
        <ListAlmacen v-else-if="elemento[0] == 'Lotes'" />
        <AddLote v-else-if="elemento[0] == 'NuevoLote'" />
        <AddSalida v-else-if="elemento[0] == 'NuevaSalida'" />
        <ListaSalida v-else-if="elemento[0] == 'Salidas'" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>

import AddSalida from "./AddSalida.vue";
import AddProducto from "./AddProducto.vue";
import AddLote from "./AddLote.vue";
import Producto from "./Producto.vue";
import ListProducto from "./ListProducto.vue";
import ListAlmacen from "./ListAlmacen.vue";
import ListaSalida from "./ListaSalida.vue";
export default {
  data() {
    return {
      collapsed: false,
      nav: "Lotes",
      elemento: null
    };
  },
  components: { Producto, AddProducto, ListProducto, ListAlmacen, AddLote, AddSalida, ListaSalida },
  methods: {
    seleccion(a) {
      if (this.elemento != null) {
        if (a != this.elemento[0]) {
          if (a == "Productos") {
            this.elemento = ["Productos"];
          } else if (a == "Lotes") {
            this.elemento = ["Lotes"];
          } else if (a == "Salientes") {
            this.elemento = ["Salidas"];
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
