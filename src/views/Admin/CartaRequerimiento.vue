<template>
  <b-card @click.right="showDrawer()" v-on:dblclick="(counter += 1), showDrawer()" no-body class="overflow-hidden" style="display:inline-block;margin:1%;" :style="{width: max ? '100%' : '48%',height: '240px',overflow: 'hidden',position: 'relative',border: '1px solid #ebedf0',borderRadius: '2px',padding: '4px',background: '#fafafa'}">
    <b-row no-gutters >
        <b-col md="12">
          <p style="margin:0px;">
            <b>Requerimiento Fiscal: </b><small>{{ data.ReqFiscal }}</small>
          </p>
          <p style="margin:0px;">
            <b>Creacion: </b><small>{{ data.Fecha }}</small>
          </p>
          <p style="margin:0px;">
            <b>Cantidad de Discos: </b><small>{{ data.CantidadDiscos }}</small>
          </p>
          <p style="margin:0px;">
            <b>Finalizacion: </b><small>{{ data.FechaFinalizacion }}</small>
          </p>
        </b-col>
        <b-col md="12">
            <p style="margin:0px;">
              <b>Sucursal: </b><small>{{ data.Sucursal.Nombre }}</small>
            </p>
            <p style="margin:0px;">
              <b>Cod Sucursal: </b><small>{{ data.Sucursal.CodigoSucursal }}</small>
            </p>
            <p v-if="data.Salida!=null" style="margin:0px;">
              <b>Fecha de Entrega: </b><small>{{ data.Salida.FechaEntrega }}</small>
            </p>
            <p v-if="data.Salida!=null" style="margin:0px;">
              <b>Nombre: </b><small>{{ data.Salida.Nombre }}</small>
            </p>
            <p v-if="data.Salida!=null" style="margin:0px;">
              <b>Detalle: </b><small>{{ data.Salida.Detalle }}</small>
            </p>
            <a-button v-if="data.Salida==null" type="primary" @click="showDrawer()" icon="check" >Registrar Salida</a-button>
        </b-col>
    </b-row>
    <a-drawer :width="450" placement="right" :closable="false" :visible="visible" @close="onClose" >
        <p :style="[pStyle, pStyle2]">--</p>
        <p :style="pStyle">Requerimientos Fiscales Salida</p>
        <a-row>
            <div class="vue-tempalte">
                <b-card bg-variant="light">
                    <b-overlay rounded="sm">
                        <b-form-group label-cols-lg="12" label="Salida del Requerimiento" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
                            <div class="d-flex justify-content-between mb-2">
                                <b-form-group class="col-md-5" label="Nombre:" label-for="Nombre" label-cols-sm="12" label-align-sm="right" >
                                    <b-form-input id="Nombre" type="text" v-model="Nombre" ></b-form-input>
                                </b-form-group>
                                <b-form-group class="col-md-5" label="Detalle:" label-for="Detalle" label-cols-sm="12" label-align-sm="right" >
                                    <b-form-textarea id="Detalle" v-model="Detalle" placeholder="Detalle.." rows="3" max-rows="3" ></b-form-textarea>
                                </b-form-group>
                            </div>
                            <a-button type="primary" @click="Registrar_Salida()" icon="check" >Registrar</a-button>
                        </b-form-group>
                    </b-overlay>
                </b-card>
            </div>
        </a-row>
    </a-drawer>
  </b-card>
</template>
<script>
import gql from "graphql-tag";
export default {
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
        ancho: window.innerWidth,
        permiso: false,
        Nombre:"",
        Detalle:"",
        counter: 0,
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
              }
              Prioridad {
                ID
                Nombre
                Descripcion
              }
            }
            Tareas_Solicitante {
              ID
              Codigo
              Detalle
              Estado
              Pospuesta
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
              }
            }
            Tareas_Responsable {
              ID
              Codigo
              Detalle
              Estado
              Pospuesta
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
    async Registrar_Salida(){
        await this.$apollo
          .mutate({
            mutation: gql`
              mutation addSalidaControlDisco($Control:Int!,$Nombre:String!,$Detalle:String!) {
                addSalidaControlDisco(Control: $Control, Nombre: $Nombre, Detalle:$Detalle) {
                  Respuesta
                }
              }
            `,
            variables: {
                Control:parseInt(this.data.ID),
                Nombre:this.Nombre,
                Detalle:this.Detalle
            }
          })
          .then(result => {
            if (result.data.addSalidaControlDisco.Respuesta != null) {
                this.$emit('actualizar',true);
            }
            this.$socket.emit("Sumar_Linea", true);
          });
    },
    showDrawer() {
        if (this.data.Salida==null) {
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
          Code: "P57"
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
