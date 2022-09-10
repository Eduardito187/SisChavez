<template>
  <div style="display:flex;">
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="Productos" v-if="nav == 'Productos'">
        <a-icon type="shopping" />Productos
      </a-menu-item>
      <a-menu-item key="NuevoProducto" v-if="nav == 'Productos'">
        <a-icon type="plus" />Agregar Nuevo
      </a-menu-item>
      <a-menu-item key="Lotes" v-if="nav == 'Lotes'">
        <a-icon type="dropbox" />Lotes
      </a-menu-item>
      <a-menu-item key="NuevoLote" v-if="nav == 'Lotes'">
        <a-icon type="plus" />Agregar Nuevo
      </a-menu-item>
      <a-menu-item key="Salidas" v-if="nav == 'Salientes'">
        <a-icon type="plus" />Salidas
      </a-menu-item>
      <a-menu-item key="NuevaSalida" v-if="nav == 'Salientes'">
        <a-icon type="plus" />Nueva Salidas
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: ["Lotes"]
    };
  },
  props: {
    nav: {
      type: String
    }
  },
  watch: {
    current: {
      immediate: true,
      handler(val, oldVal) {
        //nuevo--anterior
        if (val != null && oldVal != null) {
          this.transmitir_Seccion();
        }
      }
    },
    nav: {
      immediate: true,
      handler(val, oldVal) {
        if (val != null && oldVal != null) {
          if (val == "Productos") {
            this.current = ["Productos"];
          } else if (val == "Lotes") {
            this.current = ["Lotes"];
          }else if (val=="Salientes"){
            this.current = ["Salidas"];
          }
        }
      }
    }
  },
  methods: {
    transmitir_Seccion() {
      this.$emit("update", this.current);
    }
  },
  mounted() {
    this.transmitir_Seccion();
  }
};
/*
Fecha de inicio automatica
Fecha Devolucion abierto como melaneo
Sucursal ellos seleccionan
Entrado ellos lo ponen
Observacion cuando se entrega
Responsable cuenta log


prodcuto lote al registrar

recepcion
fecha automatica
responsable log


tareas
estado ->"pendiente"->"en proceso"->"concluido"
*/
</script>
