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
    <p>
      <small><a-icon type="info-circle" /> {{ Factura }}</small>
    </p>
    <p>
      <small><a-icon type="font-size" /> {{ Nombre }}</small>
    </p>
    <p>
      <small><a-icon type="shopping" /> {{ Modelo }}</small>
    </p>
    <div v-if="data.Proveedor != null" style="margin-top: 16px">
      <a-button type="primary" @click="showDrawer">
        Proveedor
      </a-button>
    </div>
    <div v-if="Cantidad != null && Fecha != null" style="position:absolute;z-index:100;top:0px;right:-7px;" >
      <a-tag color="green">
        {{ Fecha }} => U{{Cantidad}}
      </a-tag>
    </div>
    <a-drawer
      :title="data.Proveedor.Nombre"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <div class="col-md-12">
        <small><a-icon type="phone" /> {{ data.Proveedor.Telefono }}</small>
      </div>
      <div class="col-md-12">
        <small><a-icon type="container" /> {{ data.Proveedor.Correo }}</small>
      </div>
      <div class="col-md-12">
        <small><a-icon type="heat-map" /> {{ data.Proveedor.Direccion }}</small>
      </div>
    </a-drawer>
    <a-drawer
      width="640"
      placement="right"
      :closable="false"
      :visible="edit"
      @close="editClose"
    >
      <p
        :style="[
          {
            fontSize: '16px',
            color: 'rgba(0,0,0,0.85)',
            lineHeight: '24px',
            display: 'block',
            marginBottom: '16px'
          },
          { marginBottom: '24px' }
        ]"
      >
        --
      </p>
      <p
        :style="{
          fontSize: '16px',
          color: 'rgba(0,0,0,0.85)',
          lineHeight: '24px',
          display: 'block',
          marginBottom: '16px'
        }"
      >
        Producto
      </p>
      <a-row>
        <a-col :span="12">
          <b-form-group
            class="col-md-11"
            label="Factura:"
            label-for="Factura"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <b-form-input
              id="Factura"
              type="text"
              v-model="Factura"
            ></b-form-input>
          </b-form-group>
        </a-col>
        <a-col :span="12">
          <b-form-group
            class="col-md-11"
            label="Nombre:"
            label-for="Nombre"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <b-form-input
              id="Nombre"
              type="text"
              v-model="Nombre"
            ></b-form-input>
          </b-form-group>
        </a-col>
        <a-col :span="12">
          <b-form-group
            class="col-md-11"
            label="Modelo:"
            label-for="Modelo"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <b-form-input
              id="Modelo"
              type="text"
              v-model="Modelo"
            ></b-form-input>
          </b-form-group>
        </a-col>
        <a-col :span="24">
          <a-button
            @click="editar()"
            class="mt-2"
            type="primary"
            :loading="validacionR"
            icon="check"
            >Editar</a-button
          >
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>
<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      visible: false,
      Factura: "",
      Nombre: "",
      Modelo: "",
      edit: false,
      validacionR: false,
      counter: 0,
      permiso: false
    };
  },
  props: {
    max: {
      type: Boolean
    },
    data: {
      type: Object
    },
    Cantidad:{
      type:[Number,String]
    },
    Fecha:{
      type:String
    },
  },
  methods: {
    async editar() {
      const add = gql`
        mutation editProducto(
          $Factura: String!
          $Nombre: String!
          $Modelo: String!
          $ID: Int!
        ) {
          editProducto(
            Factura: $Factura
            Nombre: $Nombre
            Modelo: $Modelo
            ID: $ID
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
            Factura: this.Factura,
            Nombre: this.Nombre,
            Modelo: this.Modelo,
            ID: parseInt(this.data.ID)
          }
        })
        .then(result => {
          if (result.data.editProducto.Respuesta) {
            this.$message.success("Edicion Exitosa");
            this.validacionR = false;
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    },
    afterVisibleChange(val) {
      console.log("visible", val);
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    editOpen() {
      this.edit = true;
    },
    editClose() {
      this.edit = false;
    },
    edit_click() {
      if (this.permiso) {
        this.editOpen();
      }
    }
  },
  async created() {
    this.Factura = this.data.Factura;
    this.Nombre = this.data.Nombre;
    this.Modelo = this.data.Modelo;
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
          Code: "P15"
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
