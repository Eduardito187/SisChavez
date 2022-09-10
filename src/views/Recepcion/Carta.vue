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
      <small><a-icon type="calendar" /> {{ data.Fecha }}</small>
    </p>
    <p>
      <small><a-icon type="font-size" /> {{ Entregado }}</small>
    </p>
    <p>
      <small>{{ Descripcion }}</small>
    </p>
    <div v-if="data.Cuenta != null" style="margin-top: 16px">
      <a-button type="primary" @click="showDrawer">
        Responsable
      </a-button>
    </div>
    <a-drawer
      :title="data.Cuenta.nombre"
      placement="right"
      :closable="false"
      :visible="visible"
      :get-container="false"
      :wrap-style="{ position: 'absolute' }"
      @close="onClose"
    >
      <a-card-meta :title="data.Cuenta.nombre" :description="''">
        <a-avatar slot="avatar" :src="data.Cuenta.foto" />
      </a-card-meta>
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
        Recepcion
      </p>
      <a-row>
        <a-col :span="12">
          <b-form-group
            class="col-md-11"
            label="Entregado:"
            label-for="Entregado"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <b-form-textarea
              id="Entregado"
              v-model="Entregado"
              placeholder="Entregado.."
              rows="3"
              max-rows="3"
            ></b-form-textarea>
          </b-form-group>
        </a-col>
        <a-col :span="12">
          <b-form-group
            class="col-md-11"
            label="Descripcion:"
            label-for="Descripcion"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <b-form-textarea
              id="Descripcion"
              v-model="Descripcion"
              placeholder="Descripcion.."
              rows="3"
              max-rows="3"
            ></b-form-textarea>
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
      permiso: false,
      edit: false,
      Entregado: "",
      Descripcion: "",
      validacionR: false,
      counter: 0
    };
  },
  props: {
    max: {
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  methods: {
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
    },
    async editar() {
      const add = gql`
        mutation editRecepcion(
          $Entregado: String!
          $Descripcion: String!
          $ID: Int!
        ) {
          editRecepcion(
            Entregado: $Entregado
            Descripcion: $Descripcion
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
            Entregado: this.Entregado,
            Descripcion: this.Descripcion,
            ID: parseInt(this.data.ID)
          }
        })
        .then(result => {
          if (result.data.editRecepcion.Respuesta) {
            this.$message.success("Edicion Exitosa");
            this.validacionR = false;
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    }
  },
  async created() {
    this.Entregado = this.data.Entregado;
    this.Descripcion = this.data.Descripcion;
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
          Code: "P27"
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
