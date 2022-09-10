<template>
  <div
    @click.right="edit_click()"
    v-on:dblclick="(counter += 1), edit_click()"
    style="display:inline-block;margin:1%;"
    :style="{
      width: max ? '100%' : '31%',
      height: '100px',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid #ebedf0',
      borderRadius: '2px',
      padding: '4px',
      background: '#fafafa'
    }"
  >
    <p>
      <small><a-icon type="font-size" /> {{ Nombre }}</small>
    </p>
    <div v-if="ProductoLotes.length > 0" style="margin-top: 16px">
      <a-button type="primary" @click="showDrawer">
        Productos
      </a-button>
    </div>
    <a-drawer
      :title="'Productos en el Lote ' + Nombre"
      placement="bottom"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <div class="ancho" v-if="ProductoLotes.length > 0">
        <Articulo
          v-for="d in ProductoLotes"
          :key="d.ID"
          :data="d"
          :max="false"
        />
      </div>
    </a-drawer>
  </div>
</template>
<script>
import gql from "graphql-tag";
import Articulo from "./Articulo.vue";
export default {
  data() {
    return {
      visible: false,
      permiso: false,
      Nombre: "",
      counter:0,
      ProductoLotes:[],
      consulta: gql`query productos_disponibles($Lote: Int!) {
          productos_disponibles(Lote: $Lote) {
            ID
            Factura
            Nombre
            Modelo
            Costo
            Cantidad
            Proveedor {
              ID
              Nombre
              Telefono
              Direccion
              Correo
            }
          }
      }`
    };
  },
  components: { Articulo },
  props: {
    max: {
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    async edit_click() {
      if (this.permiso) {
        var a = prompt("Nueva Codigo", this.data.Nombre);
        if (a != null) {
          await this.$apollo
            .mutate({
              mutation: gql`
                mutation editLotes($ID: Int!, $Nombre: String) {
                  editLotes(ID: $ID, Nombre: $Nombre) {
                    Respuesta
                  }
                }
              `,
              variables: {
                ID: parseInt(this.data.ID),
                Nombre: a
              }
            })
            .then(result => {
              if (result.data.editLotes != null) {
                if (
                  result.data.editLotes.Respuesta != null &&
                  result.data.editLotes.Respuesta
                ) {
                  this.$notification.open({
                    message: "Lote",
                    description: "Lote editado.",
                    onClick: () => {
                      console.log("Notification Clicked!");
                    },
                    placement: "bottomRight"
                  });
                  this.Nombre = a;
                  this.$socket.emit("Sumar_Linea", true);
                }
              }
            });
        }
      }
    },
    async Recolectar_Producto(){
      await this.$apollo
      .query({
          query: this.consulta,
          variables: {
            Lote: parseInt(this.data.ID)
          },
          fetchPolicy: "network-only"
      }).then(result => {
          this.ProductoLotes = result.data.productos_disponibles;
      });
    }
  },
  async created() {
    this.Nombre = this.data.Nombre;
    if (this.data.ID!=null) {
      this.Recolectar_Producto();
    }
    await this.$apollo
      .query({
        query: gql`
          query saber_permiso($Cuenta: Int!, $Code: String!) {
            saber_permiso(Cuenta: $Cuenta, Code: $Code) {
              Respuesta
            }
          }
        `,
        variables: {
          Cuenta: parseInt(localStorage.id_cuenta),
          Code: "P12"
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        if (result.data.saber_permiso != null) {
          if (result.data.saber_permiso.Respuesta != null) {
            this.permiso = result.data.saber_permiso.Respuesta;
          } else {
            this.permiso = false;
          }
        } else {
          this.permiso = false;
        }
      });
  }
};
</script>
