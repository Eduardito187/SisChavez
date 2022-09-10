<template>
  <b-card
    no-body
    class="overflow-hidden"
    style="display:inline-block;margin:1%;"
    :style="{
      width: max ? '100%' : '31%',
      height: '80px',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid #ebedf0',
      borderRadius: '2px',
      padding: '4px',
      background: '#fafafa'
    }"
  >
    <b-row no-gutters>
      <b-col md="12" style="margin:4px;">
        <a-card-meta
          v-if="data != null"
          @click.right="showDrawer()"
          v-on:dblclick="(counter += 1), showDrawer()"
          :title="data.nombre"
          :description="''"
        >
          <a-avatar slot="avatar" :size="70" :src="data.foto" />
        </a-card-meta>
      </b-col>
    </b-row>
    <a-drawer
      :width="ancho * 0.9"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <p :style="[pStyle, pStyle2]">--</p>
      <p :style="pStyle">Cuenta</p>
      <a-row>
        <a-col :span="12">
          <p style="margin:0px;">
            <b>Usuario: </b><small>{{ data.usuario }}</small>
          </p>
          <p style="margin:0px;">
            <b>Rango: </b><small>{{ data.Rango.Nombre }}</small>
          </p>
        </a-col>
        <a-col :span="12">
          <p style="margin:0px;">
            <b>Nombre: </b><small>{{ data.nombre }}</small>
          </p>
          <p v-if="permiso" style="margin:0px;">
            <b>Contraseña: </b
            ><b-button @click="update_pwd()" pill variant="primary"
              ><small>Cambiar</small></b-button
            >
          </p>
        </a-col>
      </a-row>
      <a-divider />
      <p :style="pStyle">Control de Llaves</p>
      <a-row v-if="datos.Controles_Llaves != null">
        <a-col v-if="datos.Controles_Llaves.length > 0" :span="24">
          <Ctrllaves :data="datos.Controles_Llaves" />
        </a-col>
      </a-row>
      <a-divider />
      <p :style="pStyle">Recepcion</p>
      <a-row v-if="datos.Recepcion != null">
        <a-col v-if="datos.Recepcion.length > 0" :span="24">
          <CtrlRecepcion :data="datos.Recepcion" />
        </a-col>
      </a-row>
      <a-divider />
      <p :style="pStyle">Seguimientos (Creado)</p>
      <a-row v-if="datos.Seguimientos_Creados != null">
        <a-col v-if="datos.Seguimientos_Creados.length > 0" :span="24">
          <CtrlSeg :data="datos.Seguimientos_Creados" />
        </a-col>
      </a-row>
      <a-divider />
      <p :style="pStyle">Seguimientos (Responsable)</p>
      <a-row v-if="datos.Seguimientos != null">
        <a-col v-if="datos.Seguimientos.length > 0" :span="24">
          <CtrlSeg :data="datos.Seguimientos" />
        </a-col>
      </a-row>
      <a-divider />
      <p :style="pStyle">Tareas (Solicitante)</p>
      <a-row v-if="datos.Tareas_Solicitante != null">
        <a-col v-if="datos.Tareas_Solicitante.length > 0" :span="24">
          <CtrlTarea :data="datos.Tareas_Solicitante" />
        </a-col>
      </a-row>
      <a-divider />
      <p :style="pStyle">Tareas (Responsable)</p>
      <a-row v-if="datos.Tareas_Responsable != null">
        <a-col v-if="datos.Tareas_Responsable.length > 0" :span="24">
          <CtrlTarea :data="datos.Tareas_Responsable" />
        </a-col>
      </a-row>
    </a-drawer>
  </b-card>
</template>
<script>
import gql from "graphql-tag";
import Personas from "../Tarea/Personas.vue";
import Ctrllaves from "./Ctrllaves.vue";
import CtrlRecepcion from "./CtrlRecepcion.vue";
import CtrlSeg from "./CtrlSeg.vue";
import CtrlTarea from "./CtrlTarea.vue";
export default {
  components: { Personas, Ctrllaves, CtrlRecepcion, CtrlSeg,CtrlTarea },
  props: {
    max: {
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      visible: false,
      pStyle: {
        fontSize: "16px",
        color: "rgba(0,0,0,0.85)",
        lineHeight: "24px",
        display: "block",
        marginBottom: "16px"
      },
      pStyle2: {
        marginBottom: "24px"
      },
      permiso: false,
      counter: 0,
      ancho: window.innerWidth,
      datos: [],
      consulta: gql`query cuenta($ID: String!) {
          cuenta(ID: $ID) {
            Controles_Llaves {
              ID
              FechaInicio
              FechaDevolucion
              Entrega
              Observacion
              Sucursal {
                ID
                Nombre
                CodigoSucursal
                Telefono
                Direccion
                TelfInterno
                Correo
                Region
              }
              Responsable {
                ID
                usuario
                nombre
                foto
              }
            }
            Recepcion {
              ID
              Fecha
              Responsable
              Entregado
              Descripcion
              Cuenta {
                ID
                usuario
                nombre
                foto
              }
            }
            Seguimientos {
              ID
              Codigo
              FechaCreacion
              FechaInicio
              FechaFin
              Solicitante
              Descripcion
              Autorizacion
              Carpeta
              Conclusion
              Estado
              Creador {
                ID
                usuario
                nombre
                foto
              }
              Responsable {
                ID
                usuario
                nombre
                foto
              }
              Sucursal {
                ID
                Nombre
                CodigoSucursal
                Telefono
                Direccion
                TelfInterno
                Correo
                Region
              }
              Prioridad {
                ID
                Nombre
                Descripcion
              }
            }
            Seguimientos_Creados {
              ID
              Codigo
              FechaCreacion
              FechaInicio
              FechaFin
              Solicitante
              Descripcion
              Autorizacion
              Carpeta
              Conclusion
              Estado
              Creador {
                ID
                usuario
                nombre
                foto
              }
              Responsable {
                ID
                usuario
                nombre
                foto
              }
              Sucursal {
                ID
                Nombre
                CodigoSucursal
                Telefono
                Direccion
                TelfInterno
                Correo
                Region
              }
              Prioridad {
                ID
                Nombre
                Descripcion
              }
            }
            Tareas_Solicitante {
              ID
              FechaInicio
              FechaFinalizacion
              Codigo
              Detalle
              Estado
              Pospuesta
              Conclusion
              Solicitante {
                ID
                nombre
                foto
                Rango {
                  ID
                  Nombre
                }
              }
              Responsable {
                ID
                nombre
                foto
                Rango {
                  ID
                  Nombre
                }
              }
              Prioridad {
                ID
                Nombre
                Descripcion
              }
              Sucursal {
                ID
                Nombre
                CodigoSucursal
                Telefono
                Direccion
                TelfInterno
                Correo
                Region
              }
            }
            Tareas_Responsable {
              ID
              FechaInicio
              FechaFinalizacion
              Codigo
              Detalle
              Estado
              Pospuesta
              Conclusion
              Solicitante {
                ID
                nombre
                foto
                Rango {
                  ID
                  Nombre
                }
              }
              Responsable {
                ID
                nombre
                foto
                Rango {
                  ID
                  Nombre
                }
              }
              Prioridad {
                ID
                Nombre
                Descripcion
              }
              Sucursal {
                ID
                Nombre
                CodigoSucursal
                Telefono
                Direccion
                TelfInterno
                Correo
                Region
              }
            }
          }
        }
      `
    };
  },
  methods: {
    async update_pwd() {
      var a = prompt("Nueva Contraseña", "");
      if (a != null) {
        await this.$apollo
          .mutate({
            mutation: gql`
              mutation SetPWD($ID: Int!, $contra: String) {
                SetPWD(ID: $ID, contra: $contra) {
                  Respuesta
                }
              }
            `,
            variables: {
              ID: parseInt(this.data.ID),
              contra: a
            }
          })
          .then(result => {
            if (result.data.SetPWD != null) {
              if (
                result.data.SetPWD.Respuesta != null &&
                result.data.SetPWD.Respuesta
              ) {
                this.$notification.open({
                  message: this.data.nombre,
                  description: "Contraseña actualizada.",
                  onClick: () => {
                    console.log("Notification Clicked!");
                  },
                  placement: "bottomRight"
                });
              }
              this.$socket.emit("Sumar_Linea", true);
            }
          });
      }
    },
    showDrawer() {
      if (this.permiso) {
        this.visible = true;
      }
    },
    onClose() {
      this.visible = false;
    },
    actualizar_info(a) {
      if (a != null) {
        this.datos = [];
        this.obtenerData();
      }
    },
    async obtenerData() {
      this.validacionR = true;
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            ID: this.data.ID.toString()
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.datos = result.data.cuenta;
          this.validacionR = false;
          this.$socket.emit("Sumar_Linea", true);
        });
    }
  },
  async created() {
    window.addEventListener("resize", () => {
      this.ancho = window.innerWidth;
    });
    this.obtenerData();
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
          Code: "P42"
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
