<template>
  <a-layout id="components-layout-demo-top-side-2">
    <a-layout-header class="header">
      <div class="logo" />
      <a-menu
        theme="dark"
        mode="horizontal"
        :selected-keys="p_key"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item
          key="1"
          @click="
            () => {
              tipo = 'Cuentas';
              sub = 'Listar Cuentas';
              key = ['1'];
              open = ['sub1'];
              p_key = ['1'];
            }
          "
        >
          Cuentas
        </a-menu-item>
        <a-menu-item
          key="3"
          @click="
            () => {
              tipo = 'Rangos';
              sub = 'Listar Rangos';
              key = ['9'];
              open = ['sub3'];
              p_key = ['3'];
            }
          "
        >
          Rangos
        </a-menu-item>
        <a-menu-item key="4" @click="
            () => {
              tipo = 'Admin';
              sub = 'Panel';
              key = ['11'];
              open = ['sub4'];
              p_key = ['4'];
            }">Admin</a-menu-item>
        <a-menu-item key="5" @click="
            () => {
              tipo = 'Control de Discos';
              sub = 'Panel';
              key = ['26'];
              open = ['sub5'];
              p_key = ['5'];
            }">Control de Discos</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          mode="inline"
          :selected-keys="key"
          :open-keys="open"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-sub-menu
            key="sub1"
            @click="
              () => {
                tipo = 'Cuentas';
                open = ['sub1'];
                p_key = ['1'];
              }
            "
          >
            <span slot="title"> <a-icon type="user" />Cuentas </span>
            <a-menu-item
              key="1"
              @click="
                () => {
                  sub = 'Listar Cuentas';
                  key = ['1'];
                }
              "
            >
              Listar Cuentas
            </a-menu-item>
            <a-menu-item
              key="2"
              @click="
                () => {
                  sub = 'Registrar Cuentas';
                  key = ['2'];
                }
              "
            >
              Registrar Cuentas
            </a-menu-item>
            <a-menu-item
              key="22"
              @click="
                () => {
                  sub = 'Control de Asistencia';
                  key = ['22'];
                }
              "
            >
              Control de Asistencia
            </a-menu-item>
            <a-menu-item key="23" @click="
                () => {
                  sub = 'Trabajadores';
                  key = ['23'];
                }">Trabajadores</a-menu-item>
            <a-menu-item key="24" @click="
                () => {
                  sub = 'Asistencia Mes';
                  key = ['24'];
                }">Asistencia Mes</a-menu-item>
            <a-menu-item key="25" @click="
                () => {
                  sub = 'Asistencia Anual';
                  key = ['25'];
                }">Asistencia Anual</a-menu-item>
          </a-sub-menu>
          <a-sub-menu
            key="sub3"
            @click="
              () => {
                tipo = 'Rangos';
                open = ['sub3'];
                p_key = ['3'];
              }
            "
          >
            <span slot="title"> <a-icon type="notification" />Rangos </span>
            <a-menu-item key="9" @click="
                () => {
                  sub = 'Listar Rangos';
                  key = ['9'];
                }">Listar Rangos</a-menu-item>
            <a-menu-item key="10" @click="
                () => {
                  sub = 'Registrar Rango';
                  key = ['10'];
                }">Registrar Rango</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>{{ tipo }}</a-breadcrumb-item>
          <a-breadcrumb-item>{{ sub }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '24px',
            margin: 0,
            minHeight: '280px'
          }"
        >
          <ListaCuenta v-if="key[0] == '1'" />
          <ListaRangos v-else-if="key[0] == '9'" />
          <CrearRango v-else-if="key[0] == '10'" />
          <PanelAdmin v-else-if="key[0] == '11'" />
          <CrearCuenta v-else-if="key[0] == '2'" />
          <ControlAsistencia v-else-if="key[0] == '22'" />
          <Trabajadores v-else-if="key[0] == '23'" />
          <AsistenciaMensual v-else-if="key[0] == '24'" />
          <AsistenciaAnual v-else-if="key[0] == '25'" />
          <PanelDiscos v-else-if="key[0] == '26'" />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import ListaCuenta from "./ListaCuenta.vue";
import ListaRangos from "./ListaRangos.vue";
import CrearRango from "./CrearRango.vue";
import PanelAdmin from "./PanelAdmin.vue";
import CrearCuenta from "./CrearCuenta.vue";
import ControlAsistencia from "./ControlAsistencia.vue";
import Trabajadores from "./Trabajadores.vue";
import AsistenciaAnual from "./AsistenciaAnual.vue";
import AsistenciaMensual from "./AsistenciaMensual.vue";
import PanelDiscos from "./PanelDiscos.vue";
export default {
  data() {
    return {
      collapsed: false,
      tipo: "Cuentas",
      sub: "Lista de Cuentas",
      key: ["1"],
      open: ["sub1"],
      p_key: ["1"]
    };
  },
  components: { PanelDiscos, AsistenciaMensual, ListaCuenta, ListaRangos, CrearRango, PanelAdmin, CrearCuenta, ControlAsistencia,Trabajadores, AsistenciaAnual }
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
