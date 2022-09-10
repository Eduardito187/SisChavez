<template>
  <div
    @click.right="edit_click()"
    v-on:dblclick="(counter += 1), edit_click()"
    style="display:inline-block;margin:1%;"
    :style="{
      width: max ? '100%' : '31%',
      height: '200px',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid #ebedf0',
      borderRadius: '2px',
      padding: '4px',
      background: '#fafafa'
    }"
  >
    <b-card no-body class="overflow-hidden" style="height:100%;">
      <b-row no-gutters>
        <b-col md="12">
          <p style="margin:0px;">
            <b>Nombre: </b><small>{{ proveedor.Nombre }}</small>
          </p>
          <p style="margin:0px;">
            <b>Correo: </b><small>{{ proveedor.Correo }}</small>
          </p>
          <p style="margin:0px;">
            <b>Telefono: </b><small>{{ proveedor.Telefono }}</small>
          </p>
        </b-col>
        <b-col md="12">
          <p style="margin:0px;">
            <b>Direccion: </b><small>{{ proveedor.Direccion }}</small>
          </p>
        </b-col>
      </b-row>
    </b-card>
    <a-drawer
      title="Multi-level drawer"
      :width="ancho * 0.9"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <b-card bg-variant="light">
        <b-form-group
          label-cols-lg="12"
          label="Actualizar Proveedor"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0 col-md-12"
        >
          <div class="d-flex justify-content-between">
            <b-form-group
              class="col-md-5"
              label="Nombre"
              label-for="Nombre"
              label-cols-sm="12"
              label-align-sm="right"
            >
              <b-form-input
                id="Nombre"
                v-model="proveedor.Nombre"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              class="col-md-5"
              label="Telefono:"
              label-for="Telefono"
              label-cols-sm="12"
              label-align-sm="right"
            >
              <b-form-input
                id="Telefono"
                v-model="proveedor.Telefono"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <b-form-group
              class="col-md-5"
              label="Direccion:"
              label-for="Direccion"
              label-cols-sm="12"
              label-align-sm="right"
            >
              <b-form-textarea
                id="Direccion"
                v-model="proveedor.Direccion"
                placeholder="Direccion.."
                rows="3"
                max-rows="3"
              ></b-form-textarea>
            </b-form-group>
            <b-form-group
              class="col-md-5"
              label="Correo Electronico:"
              label-for="Correo"
              label-cols-sm="12"
              label-align-sm="right"
            >
              <b-form-input
                id="Correo"
                v-model="proveedor.Correo"
              ></b-form-input>
            </b-form-group>
          </div>
          <b-button @click="actualizar()" :disabled="upd" pill variant="primary"
            >Actualizar</b-button
          >
        </b-form-group>
      </b-card>
      <div style="margin-top:5px;">
        <a-button-group>
          <a-button @click="op_mas('Productos')">Productos</a-button>
        </a-button-group>
      </div>
      <a-drawer
        title="Two-level Drawer"
        :width="ancho * 0.95"
        :closable="false"
        :visible="childrenDrawer"
        @close="onChildrenDrawerClose"
      >
        <div v-if="mas == 'Productos'">
          <Articulo
            v-for="d in datos.Productos"
            :key="d.ID"
            :data="d"
            :max="false"
          />
        </div>
      </a-drawer>
    </a-drawer>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Articulo from "./../views/Lote/Articulo.vue";
export default {
  data() {
    return {
      visible: false,
      childrenDrawer: false,
      counter: 0,
      permiso: false,
      upd: false,
      datos: [],
      mas: "",
      ancho: window.innerWidth,
      consulta_info: gql`
        query proveedor($ID: Int!) {
          proveedor(ID: $ID) {
            ID
            Nombre
            Telefono
            Direccion
            Correo
            Productos {
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
          }
        }
      `
    };
  },
  components: { Articulo },
  props: {
    proveedor: {
      type: Object
    },
    max: {
      type: Boolean
    }
  },
  methods: {
    recopilar_info(a) {
      if (a) {
        this.obtener_data();
      }
    },
    op_mas(a) {
      this.mas = a;
      this.showChildrenDrawer();
    },
    async actualizar() {
      const add = gql`
        mutation editProveedor(
          $ID: Int!
          $Nombre: String!
          $Telefono: String!
          $Direccion: String!
          $Correo: String!
        ) {
          editProveedor(
            ID: $ID
            Nombre: $Nombre
            Telefono: $Telefono
            Direccion: $Direccion
            Correo: $Correo
          ) {
            Respuesta
          }
        }
      `;
      this.validacionR = true;
      await this.$apollo
        .mutate({
          mutation: add,
          variables: {
            ID: parseInt(this.data.ID),
            Nombre: this.proveedor.Nombre,
            Telefono: this.proveedor.Telefono,
            Direccion: this.proveedor.Direccion,
            Correo: this.proveedor.Correo
          }
        })
        .then(result => {
          if (result.data.editProveedor.Respuesta) {
            this.$message.success("Edicion Exitosa");
            this.validacionR = false;
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    showChildrenDrawer() {
      this.childrenDrawer = true;
    },
    onChildrenDrawerClose() {
      this.childrenDrawer = false;
    },
    async obtener_data() {
      await this.$apollo
        .query({
          query: this.consulta_info,
          variables: {
            ID: parseInt(this.proveedor.ID)
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          if (result.data.proveedor != null) {
            this.datos = result.data.proveedor;
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    },
    edit_click() {
      if (this.permiso) {
        this.showDrawer();
      }
    }
  },
  async created() {
    window.addEventListener("resize", () => {
      this.ancho = window.innerWidth;
    });
    if (this.proveedor != null) {
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
            Code: "P24"
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          if (result.data.saber_permiso != null) {
            if (result.data.saber_permiso.Respuesta != null) {
              this.permiso = result.data.saber_permiso.Respuesta;
              this.obtener_data();
            } else {
              this.permiso = false;
            }
          } else {
            this.permiso = false;
          }
        });
    }
  }
};
</script>
