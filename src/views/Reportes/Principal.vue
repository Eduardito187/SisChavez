<template>
  <a-layout id="components-layout-demo-top-side-2">
    <a-layout-header class="header">
      <div class="logo" />
      <a-menu theme="dark" mode="horizontal" :selected-keys="p_key" :style="{ lineHeight: '64px' }">
        <a-menu-item key="1" @click="p_key = ['1']">Seguimientos</a-menu-item>
        <a-menu-item key="2" @click=" p_key = ['2']">Tareas</a-menu-item>
        <a-menu-item key="3" @click="p_key = ['3']">Extintores</a-menu-item>
        <a-menu-item key="4" @click="p_key = ['4']">Guardias</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content :style="{background: '#fff',padding: '24px',margin: 0,minHeight: '280px'}">
          <ReporteSeguimiento v-if="p_key[0] == '1'" />
          <ReporteTareas v-if="p_key[0] == '2'" />
          <ReporteDiario v-if="p_key[0] == '4'" />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import ReporteSeguimiento from "./../Seguimiento/Reporte.vue";
import ReporteTareas from "./../Tarea/Reporte.vue";
import ReporteDiario from "./../Empresa/ReporteDiario.vue";
export default {
  data() {
    return {
      collapsed: false,
      p_key: ["1"]
    };
  },
  components: { ReporteSeguimiento,ReporteTareas,ReporteDiario }
};
</script>

<style>
#components-layout-demo-top-side-2 .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 28px 16px 0;
  float: left;
}
</style>
