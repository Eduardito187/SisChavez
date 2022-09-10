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
    <p style="margin:0px;">
      <small
        ><a-icon type="calendar" /> Recibido el {{ data.FechaInicio }}</small
      >
    </p>
    <p style="margin:0px;">{{ Entrega }}</p>
    <p style="margin:0px;">{{ Observacion }}</p>
    <div v-if="data.Sucursal != null" style="margin-top: 4px;">
      <a-button type="primary" @click="showDrawer('Sucursal')">
        Sucursal
      </a-button>
    </div>
    <div v-if="data.Responsable != null" style="margin-top: 4px;">
      <a-button type="primary" @click="showDrawer('Responsable')">
        Responsable
      </a-button>
    </div>
    <div v-if="data.FechaDevolucion == null" style="margin-top: 4px;">
      <a-button type="danger" @click="Finalizar()">
        Finalizar
      </a-button>
    </div>
    <a-drawer
      :title="'Recibido el ' + data.FechaInicio"
      placement="bottom"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <div class="ancho" style="padding:5px;" v-if="tipo == 'Sucursal'">
        <p style="padding:0px;">
          <CartaSucursal
            :max="false"
            :sucursal="data.Sucursal"
            @evento_info="recibir_INFO"
          />
        </p>
      </div>
      <div class="ancho" style="padding:5px;" v-if="tipo == 'Responsable'">
      <a-card-meta
          v-if="data.Responsable != null"
          :title="data.Responsable.nombre"
          :description="''"
        >
          <a-avatar slot="avatar" :size="70" :src="data.Responsable.foto" />
        </a-card-meta>
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
        Control de Llaves
      </p>
      <a-row>
        <a-col :span="12">
          <b-form-group
            class="col-md-11"
            label="Entrega:"
            label-for="Entrega"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <b-form-textarea
              id="Entrega"
              v-model="Entrega"
              placeholder="Entrega.."
              rows="3"
              max-rows="3"
            ></b-form-textarea>
          </b-form-group>
        </a-col>
        <a-col :span="12">
          <b-form-group
            class="col-md-11"
            label="Observacion:"
            label-for="Observacion"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <b-form-textarea
              id="Observacion"
              v-model="Observacion"
              placeholder="Observacion.."
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
import CartaSucursal from "../../components/CartaSucursal.vue";
export default {
  data() {
    return {
      visible: false,
      tipo: "",
      consulta: gql`
        query control_llave($ID: Int!) {
          control_llave(ID: $ID) {
            ID
            FechaDevolucion
          }
        }
      `,
      counter: 0,
      edit: false,
      Entrega: "",
      Observacion: "",
      validacionR: false,
      permiso: false
    };
  },
  components: { CartaSucursal },
  props: {
    max: {
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  methods: {
    async editar() {
      const add = gql`
        mutation editControlLLAVES(
          $Entrega: String!
          $Observacion: String!
          $ID: Int!
        ) {
          editControlLLAVES(
            Entrega: $Entrega
            Observacion: $Observacion
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
            Entrega: this.Entrega,
            Observacion: this.Observacion,
            ID: parseInt(this.data.ID)
          }
        })
        .then(result => {
          if (result.data.editControlLLAVES.Respuesta) {
            this.$message.success("Edicion Exitosa");
            this.validacionR = false;
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    },
    edit_click() {
      if (this.permiso) {
        this.editOpen();
      }
    },
    recibir_INFO(a) {
      if (a != null) {
        this.$router.push("/Sucursal/" + a.ID);
      }
    },
    showDrawer(a) {
      this.visible = true;
      this.tipo = a;
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
    async obtenerData() {
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            ID: parseInt(this.data.ID)
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          if (result.data.control_llave != null) {
            this.$emit("actualizar", result.data.control_llave);
          }
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    async Finalizar() {
      const add = gql`
        mutation ControlLLAVES_FIN($ID: Int!) {
          ControlLLAVES_FIN(ID: $ID) {
            Respuesta
          }
        }
      `;
      this.validacionR = true;
      await this.$apollo
        .mutate({
          mutation: add,
          variables: {
            ID: parseInt(this.data.ID)
          }
        })
        .then(result => {
          if (result.data.ControlLLAVES_FIN.Respuesta) {
            this.$message.success("Control Finalizado");
            this.obtenerData();
            this.validacionR = false;
          }
          this.$socket.emit("Sumar_Linea", true);
        });
    }
  },
  async created() {
    this.Entrega = this.data.Entrega;
    this.Observacion = this.data.Observacion;
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
          Code: "P3"
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
