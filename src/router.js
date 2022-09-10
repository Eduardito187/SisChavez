import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Inicio from "./views/Inicio.vue";
import Sucursales from "./views/Sucursal/Sucursales";
import Extintores from "./views/Extintor/Extintores";
import Proveedores from "./views/Proveedor/Proveedores";
import CrearControl from "./views/ControlDiario/CrearControl";
import CrearEmpresa from "./views/Empresa/CrearEmpresa";
import AsignarHorario from "./views/Empresa/AsignarHorario";
import CrearGuardia from "./views/Empresa/CrearGuardia";
import Inventario from "./views/Lote/Inventario";
import Recepcion from "./views/Recepcion/Recepcion";
import Tarea from "./views/Tarea/Tarea";
import ControlDiario from "./views/ControlDiario/ControlDiario";
import Seguridad from "./views/Empresa/Seguridad";
import LLaves from "./views/Llaves/LLaves";
import Seguimiento from "./views/Seguimiento/Seguimiento";
import Admin from "./views/Admin/Admin";
import MiPerfil from "./views/MiPerfil";
import V404 from "./views/V404";
import Reportes from "./views/Reportes/Reportes";
import VistaRecargo from "./views/Extintor/VistaRecargo";

/*
"production": "vue-cli-service serve --mode production",
*/
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "*",
      name: "404",
      component: V404
    },
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/Inicio",
      name: "inicio",
      component: Inicio
    },
    {
      path: "/Recargar",
      name: "Recargar",
      component: VistaRecargo
    },
    {
      path: "/Sucursales",
      name: "sucursales",
      component: Sucursales
    },
    {
      path: "/Reportes",
      name: "Reportes",
      component: Reportes
    },
    {
      path: "/Extintores",
      name: "extintores",
      component: Extintores
    },
    {
      path: "/Proveedores",
      name: "proveedores",
      component: Proveedores
    },
    {
      path: "/CrearControl",
      name: "crearcontrol",
      component: CrearControl
    },
    {
      path: "/CrearEmpresa",
      name: "crearempresa",
      component: CrearEmpresa
    },
    {
      path: "/AsignarHorario",
      name: "asignarhorario",
      component: AsignarHorario
    },
    {
      path: "/CrearGuardia",
      name: "crearguardia",
      component: CrearGuardia
    },
    {
      path: "/Inventario",
      name: "inventario",
      component: Inventario
    },
    {
      path: "/Recepcion",
      name: "recepcion",
      component: Recepcion
    },
    {
      path: "/Tarea",
      name: "tarea",
      component: Tarea
    },
    {
      path: "/ControlDiario",
      name: "ControlDiario",
      component: ControlDiario
    },
    {
      path: "/Seguridad",
      name: "Seguridad",
      component: Seguridad
    },
    {
      path: "/LLaves",
      name: "LLaves",
      component: LLaves
    },
    {
      path: "/Seguimiento",
      name: "Seguimiento",
      component: Seguimiento
    },
    {
      path: "/Admin",
      name: "Admin",
      component: Admin,
      meta: { title: "Chavez | Admin" }
    },
    {
      path: "/MiPerfil",
      name: "MiPerfil",
      component: MiPerfil
    }
  ],
  linkActiveClass: "active"
});
