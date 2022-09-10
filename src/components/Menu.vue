<template>
  <div>
    <a-menu
      style="width: 100%;"
      :open-keys.sync="openKeys"
      :selected-keys="key"
      mode="inline"
      @click="handleClick"
    >
      <a-menu-item key="0" @click="ir_url('/MiPerfil')">
        Mi Perfil
      </a-menu-item>
      <a-menu-item key="1" @click="ir_url('/LLaves')">
        Control de Llaves
      </a-menu-item>
      <a-menu-item key="2" @click="ir_url('/Sucursales')">
        Sucursales
      </a-menu-item>
      <a-menu-item key="3" @click="ir_url('/Seguimiento')">
        Seguimientos
      </a-menu-item>
      <a-menu-item key="4" @click="ir_url('/Inventario')">
        Almacen
      </a-menu-item>
      <a-menu-item key="5" @click="ir_url('/Extintores')">
        Extintores
      </a-menu-item>
      <a-menu-item key="6" @click="ir_url('/Proveedores')">
        Proveedores
      </a-menu-item>
      <a-menu-item key="7" @click="ir_url('/Recepcion')">
        Recepcion
      </a-menu-item>
      <a-menu-item key="8" @click="ir_url('/Seguridad')">
        Empresas de Seguridad
      </a-menu-item>
      <a-menu-item key="9" @click="ir_url('/Tarea')">
        Tareas
      </a-menu-item>
      <a-menu-item key="10" @click="ir_url('/Admin')">
        Administrativo
      </a-menu-item>
      <a-menu-item key="12" @click="ir_url('/Reportes')">
        Reportes
      </a-menu-item>
      <a-menu-item key="11" @click="cerrar_session()">
        Cerrar Sesión
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      openKeys: null,
      key: null
    };
  },
  watch: {
    openKeys(val) {
      console.log("openKeys", val);
    }
  },
  methods: {
    ir_url(a) {
      this.$router.push(a);
      switch (a) {
        case "/MiPerfil":
          this.key = ["0"];
          break;
        case "/LLaves":
          this.key = ["1"];
          break;
        case "/Sucursales":
          this.key = ["2"];
          break;
        case "/Seguimiento":
          this.key = ["3"];
          break;
        case "/Inventario":
          this.key = ["4"];
          break;
        case "/Extintores":
          this.key = ["5"];
          break;
        case "/Proveedores":
          this.key = ["6"];
          break;
        case "/Recepcion":
          this.key = ["7"];
          break;
        case "/Seguridad":
          this.key = ["8"];
          break;
        case "/Tarea":
          this.key = ["9"];
          break;
        case "/Admin":
          this.key = ["10"];
          break;
        case "/Reportes":
          this.key = ["12"];
          break;
        default:
          this.key = [""];
          break;
      }
    },
    handleClick(e) {
      console.log("click", e);
    },
    titleClick(e) {
      console.log("titleClick", e);
    },
    cerrar_session() {
      localStorage.removeItem("id_cuenta");
      //localStorage.id_cuenta=null
      this.$router.push("/");
    }
  },
  mounted() {
    switch (this.$route.name) {
      case "MiPerfil":
        this.key = ["0"];
        break;
      case "LLaves":
        this.key = ["1"];
        break;
      case "Sucursales":
        this.key = ["2"];
        break;
      case "Seguimiento":
        this.key = ["3"];
        break;
      case "Inventario":
        this.key = ["4"];
        break;
      case "Extintores":
        this.key = ["5"];
        break;
      case "Proveedores":
        this.key = ["6"];
        break;
      case "Recepcion":
        this.key = ["7"];
        break;
      case "Seguridad":
        this.key = ["8"];
        break;
      case "Tarea":
        this.key = ["9"];
        break;
      case "Admin":
        this.key = ["10"];
        break;
      case "Reportes":
        this.key = ["12"];
        break;
      default:
        this.key = [""];
        break;
    }
  }
};
</script>
