<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo"></div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1" @click="seleccion('Extintores')">
          <a-icon type="unordered-list" />
          <span>Extintores</span>
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
        <ListExtintor v-if="elemento[0] == 'Extintores'" />
        <AddExtintor v-else-if="elemento[0] == 'Registrar Extintor'" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import AddExtintor from "./AddExtintor.vue";
import ListExtintor from "./ListExtintor.vue";
import Nav from "./Nav.vue";
export default {
  data() {
    return {
      collapsed: false,
      nav: "Extintores",
      elemento: null
    };
  },
  components: { Nav, AddExtintor, ListExtintor },
  methods: {
    seleccion(a) {
      this.nav = a;
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
