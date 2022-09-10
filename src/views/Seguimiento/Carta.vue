<template>
  <div
    @click.right="edit_click()"
    v-on:dblclick="(counter += 1), edit_click()"
    style="display:inline-block;margin:1%;text-align: left;"
    :style="{
      width: max ? '100%' : '48%',
      height: '300px',
      overflow: 'hidden',
      position: 'relative',
      border: '3px solid ' + Border,
      borderRadius: '2px',
      padding: '4px',
      background: '#fafafa'
    }"
  >
    <b-card no-body class="scroll" style="height:100%;overflow-x: hidden;">
      <b-row no-gutters>
        <b-col md="6">
          <p style="margin:0px;">
            <b>Codigo: </b><small>{{ Codigo }}</small>
          </p>
          <p style="margin:0px;">
            <b>Sucursal: </b
            ><small
              >{{
                data.Sucursal.Region != null
                  ? data.Sucursal.Region + " - "
                  : ""
              }}{{ data.Sucursal.Nombre }}({{
                data.Sucursal.CodigoSucursal
              }})</small
            >
          </p>
          <p style="margin:0px;">
            <b>Descripcion: </b><small>{{ Descripcion }}</small>
          </p>
          <Archivos :ID="data.ID" :Carpeta="data.Carpeta" />
          <p style="margin:0px;" v-if="data.Conclusion != null">
            <b>Conclusion: </b>
          </p>
          <pre
            v-if="data.Conclusion != null"
            style="font-family: monospace;white-space: pre-line;margin: 1em 0;height:auto;"
            >{{ data.Conclusion }}</pre
          >
        </b-col>
        <b-col md="6">
          <b-card-body>
            <p style="margin:0px;">
              <b>Tipo: </b>
                <b style="color:blue; font-size: 15px;" v-if="data.Tipo=='Instantaneo'">Instantaneo</b>
                <b style="color:red; font-size: 15px;" v-else>Seguimiento</b>
            </p>
            <p style="margin:0px;">
              <b>Estado: </b
              ><a-tag :color="retorno_color(data.Estado)">{{
                data.Estado
              }}</a-tag>
            </p>
            <p style="margin:0px;">
              <b>Solicitante: </b><small>{{ Solicitante }}</small>
            </p>
            <p style="margin:0px;">
              <b>Autorizador: </b><small>{{ Autorizador }}</small>
            </p>
            <b-row class="mb-1">
              <b-col md="6">
                <small style="display:flex;margin-top:5px;"
                  ><b>Prioridad:</b></small
                >
              </b-col>
              <b-col md="6">
                <b-progress
                  style="width:50px;display:flex;margin-top:5px;"
                  :value="100"
                  :variant="prioridad"
                ></b-progress>
                <div
                  v-if="R != ''"
                  style="position:absolute;z-index:100;top:0px;right:-7px;"
                >
                  <a-tag color="red">
                    {{ R }}
                  </a-tag>
                </div>
              </b-col>
            </b-row>
            <Personas
              v-if="data.Responsable != null"
              :a="data.Creador"
              tipo="Seguimiento"
              @actualizar="actualizar_data($event)"
              :ID="data.ID"
              :b="data.Responsable"
            />
            <template v-if="data.Responsable!=null">
               <a-button
              v-if="data.Estado == 'Pendiente' && permiso == true && data.Responsable.ID==mi_cuenta"
              icon="check"
              @click="iniciar_Seg"
              >Iniciar Seguimiento</a-button
            >
            <a-button
              v-if="data.Estado == 'Iniciado' && permiso == true && data.Responsable.ID==mi_cuenta"
              icon="check"
              @click="Finalizar_Seg"
              >Finalizar Seguimiento</a-button
            >
            </template>
            
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
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
        Seguimiento
      </p>
      <a-row>
        <a-col :span="12">
          <b-form-group
            class="col-md-11"
            label="Solicitante:"
            label-for="Solicitante"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <b-form-input
              id="Solicitante"
              type="text"
              v-model="Solicitante"
            ></b-form-input>
          </b-form-group>
        </a-col>
        <a-col :span="12">
          <b-form-group
            class="col-md-11"
            label="Autorizador:"
            label-for="Autorizador"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <b-form-input
              id="Autorizador"
              type="text"
              v-model="Autorizador"
            ></b-form-input>
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
        <a-col :span="12">
          <b-form-group
            class="col-md-11"
            label="Responsable:"
            label-for="Responsable"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <ComboNombre :dato="N_RESPONSABLE == null ? '' : N_RESPONSABLE" tipo="resposables" @change="RESPONSABLE = $event" />
            <b-button style="margin-top:15px;" @click="AsignarResponsable()" pill variant="success"><small>Asignar</small></b-button>
          </b-form-group>
        </a-col>
        <a-col v-if="Codigo == null && permiso" :span="12" style="margin-top:15px;">
          <p style="margin:0px;" class="mt-2">
            <b>Codigo: </b><b-button @click="update_codigo()" pill variant="primary"><small>Ingresar Codigo</small></b-button>
          </p>
        </a-col>
        <a-col :span="24">
          <a-button @click="editar()" class="mt-2" type="primary" :loading="validacionR" icon="check" >Editar</a-button >
          <a-button v-if="permiso1" @click="eliminar_data()" class="mt-2" style="margin-left:10px;" type="danger" icon="delete" >Eliminar</a-button >
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>
<script>
import gql from "graphql-tag";
import Archivos from "./Archivos.vue";
import Personas from "../Tarea/Personas.vue";
import ComboNombre from "../../components/ComboNombre.vue";
import { Gestion } from "../../Configuracion";
export default {
  data() {
    return {
      edit: false,
      prioridad: "danger",
      mi_cuenta:0,
      permiso: false,
      counter: 0,
      validacionR: false,
      Solicitante: "",
      Autorizador: "",
      Descripcion: "",
      permiso1: false,
      Codigo: null,
      anho: "",
      mes: "",
      dia: "",
      d: 0,
      RESPONSABLE: null,
      N_RESPONSABLE: null,
      Year:Gestion,
      Ini: gql`
        mutation Seguimiento_Inicio($ID: Int!) {
          Seguimiento_Inicio(ID: $ID) {
            Respuesta
          }
        }
      `,
      Fin: gql`
        mutation Seguimiento_Fin($ID: Int!, $Conclusion: String!) {
          Seguimiento_Fin(ID: $ID, Conclusion: $Conclusion) {
            Respuesta
          }
        }
      `,
      intervalo: "",
      R: "",
      Border: "Black",
      Colores:[
        {Region:"La Paz",Color:"#2D48FA"},
        {Region:"Santa Cruz",Color:"#57FF5F"},
        {Region:"Beni",Color:"#9AF5F4"},
        {Region:"Oruro",Color:"#F5E79B"},
        {Region:"Cochabamba",Color:"#EB4AEB"},
        {Region:"Tarija",Color:"#EBB010"},
        {Region:"Pando",Color:"#006625"},
        {Region:"Chuquisaca",Color:"#EFFF0D"},
        {Region:"Potosi",Color:"#D67A43"}
      ],
    };
  },
  components: { Personas, Archivos, ComboNombre },
  props: {
    max: {
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  methods: {
    async AsignarResponsable() {
      if (this.RESPONSABLE != null) {
        const add = gql`
          mutation AsignarResponsable($ID: Int!, $Responsable: Int!) {
            AsignarResponsable(ID: $ID, Responsable: $Responsable) {
              Respuesta
            }
          }
        `;
        await this.$apollo
          .mutate({
            mutation: add,
            variables: {
              ID: parseInt(this.data.ID),
              Responsable: parseInt(this.RESPONSABLE)
            }
          })
          .then(result => {
            if (result.data.AsignarResponsable.Respuesta) {
              this.$socket.emit("Sumar_Linea", true);
              this.actualizar_data(true);
              this.$notification.open({
                message: "Seguimiento",
                description: "Se asigno el seguimiento exitosamente.",
                onClick: () => {
                  //
                },
                placement: "bottomRight"
              });
            }
          });
      } else {
        alert("Sin responsable seleccionado.");
      }
    },
    retorno_color(a) {
      if (a == "Pendiente") {
        return "orange";
      } else if (a == "Finalizado") {
        return "black";
      } else {
        //Iniciado
        return "green";
      }
    },
    async iniciar_Seg() {
      this.validacionR = true;
      await this.$apollo
        .mutate({
          mutation: this.Ini,
          variables: {
            ID: parseInt(this.data.ID)
          }
        })
        .then(result => {
          if (result.data.Seguimiento_Inicio.Respuesta) {
            this.actualizar_data(true);
          }
          this.validacionR = false;
        });
    },
    async Finalizar_Seg() {
      var a = prompt("Conclusion", "");
      if (a != null) {
        this.validacionR = true;
        await this.$apollo
          .mutate({
            mutation: this.Fin,
            variables: {
              ID: parseInt(this.data.ID),
              Conclusion: a
            }
          })
          .then(result => {
            if (result.data.Seguimiento_Fin != null) {
              if (result.data.Seguimiento_Fin.Respuesta) {
                this.actualizar_data(true);
              }
              this.$socket.emit("Sumar_Linea", true);
            }
            this.validacionR = false;
          });
      }
    },
    async update_codigo() {
      var a = prompt("Nueva Codigo", "");
      if (a != null) {
        await this.$apollo
          .mutate({
            mutation: gql`
              mutation Seguimiento_Codigo_Add($ID: Int!, $Codigo: String) {
                Seguimiento_Codigo_Add(ID: $ID, Codigo: $Codigo) {
                  Respuesta
                }
              }
            `,
            variables: {
              ID: parseInt(this.data.ID),
              Codigo:a.length>0 ?"CITE " + a + "-" + this.Year:""
            }
          })
          .then(result => {
            if (result.data.Seguimiento_Codigo_Add != null) {
              if (
                result.data.Seguimiento_Codigo_Add.Respuesta != null &&
                result.data.Seguimiento_Codigo_Add.Respuesta
              ) {
                this.$notification.open({
                  message: "Seguimiento",
                  description: "Codigo Ingresado.",
                  onClick: () => {
                    console.log("Notification Clicked!");
                  },
                  placement: "bottomRight"
                });
                this.Codigo =a.length>0 ?"CITE " + a + "-" + this.Year:"";
                this.$socket.emit("Sumar_Linea", true);
                this.$socket.emit("NuevoRegistro", true);
              }
            }
          });
      }
    },
    async editar() {
      const add = gql`
        mutation editSeguimiento(
          $Solicitante: String!
          $Autorizacion: String!
          $Descripcion: String!
          $ID: Int!
        ) {
          editSeguimiento(
            Solicitante: $Solicitante
            Autorizacion: $Autorizacion
            Descripcion: $Descripcion
            ID: $ID
          ) {
            Respuesta
          }
        }
      `;
      this.validacionR = true;
      await this.$apollo.mutate({
          mutation: add,
          variables: {
            Solicitante: this.Solicitante,
            Autorizacion: this.Autorizador,
            Descripcion: this.Descripcion,
            ID: parseInt(this.data.ID)
          }
        })
        .then(result => {
          if (result.data.editSeguimiento.Respuesta) {
            this.$message.success("Edicion Exitosa");
          }
          this.validacionR = false;
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    async eliminar_data(){
      const add = gql`
        mutation delSeguimiento(
          $ID: Int!
        ) {
          delSeguimiento(
            ID: $ID
          ) {
            Respuesta
          }
        }
      `;
      await this.$apollo.mutate({
          mutation: add,
          variables: {
            ID: parseInt(this.data.ID)
          }
        })
        .then(result => {
          if (result.data.delSeguimiento.Respuesta) {
            this.$message.success("Seguimiento Eliminado.");
          }
          this.$socket.emit("Sumar_Linea", true);
          this.$emit('eliminar',this.data.ID);
        });
    },
    edit_click() {
      if (this.permiso) {
        this.editOpen();
      }
    },
    actualizar_data(a) {
      if (a) {
        this.$emit("actualizar", a);
      }
    },
    editOpen() {
      this.edit = true;
    },
    editClose() {
      this.edit = false;
    },
    obt_mes_enlish(mes) {
      if (mes == 1) {
        return "Jan";
      } else if (mes == 2) {
        return "Feb";
      } else if (mes == 3) {
        return "Mar";
      } else if (mes == 4) {
        return "Apr";
      } else if (mes == 5) {
        return "May";
      } else if (mes == 6) {
        return "Jun";
      } else if (mes == 7) {
        return "Jul";
      } else if (mes == 8) {
        return "Aug";
      } else if (mes == 9) {
        return "Sep";
      } else if (mes == 10) {
        return "Oct";
      } else if (mes == 11) {
        return "Nov";
      } else if (mes == 12) {
        return "Dec";
      }
    },
    obtener_dif() {
      var fecha = new Date();
      var inicio =this.obt_mes_enlish(this.mes) +" " +this.dia +" " +this.anho +" 23:59:00 GMT-0400";
      var f = new Date(inicio);
      var fecha_fin =this.obt_mes_enlish(this.mes) +" " +this.dia +" " +this.anho +" 23:59:00 GMT-0400";
      var f1 = new Date(fecha_fin);
      f1.setDate(f1.getDate() + this.d);
      var time = f1 - fecha;
      var min = parseInt(time / (1000 * 60));
      let dias_R = 0;
      if (min <= 0) {
        if (this.data.FechaFin == null) {
          while (min <= 0) {
            min += 1440;
            dias_R += 1;
          }
          if (dias_R > 0) {
            this.R = "R " + dias_R.toString() + "D";
          } else {
            this.R = "";
          }
        } else {
          this.R = "";
          this.pausarintervalo();
        }
      } else {
        this.R = "";
        this.pausarintervalo();
      }
    },
    pausarintervalo() {
      clearInterval(this.intervalo);
    },
    iniciointervalo() {
      this.intervalo = setInterval(() => {
        this.obtener_dif();
      }, 60000);
    }
  },
  async created() {
    this.mi_cuenta=parseInt(localStorage.id_cuenta);
    if (this.data != null) {
      this.Solicitante = this.data.Solicitante;
      this.Autorizador = this.data.Autorizacion;
      this.Descripcion = this.data.Descripcion;
      this.Codigo = this.data.Codigo;
      if (this.data.Sucursal.Region != null) {
        if (this.data.Sucursal.Region != "") {
          for (let i = 0; i < this.Colores.length; i++) {
            if (this.Colores[i]["Region"] == this.data.Sucursal.Region) {
              this.Border = this.Colores[i]["Color"];
              i = this.Colores.length;
            }
          }
        }
      }
      if (this.data.Responsable != null) {
        if (this.data.Responsable.ID != null && this.data.Responsable.nombre != null) {
          this.RESPONSABLE = this.data.Responsable.ID;
          this.N_RESPONSABLE = this.data.Responsable.nombre;
        }
      }

      if (this.data.Prioridad != null) {
        if (this.data.FechaInicio != null) {
          this.anho = parseInt(this.data.FechaInicio.substring(0, 4));
          this.mes = parseInt(this.data.FechaInicio.substring(5, 7));
          this.dia = parseInt(this.data.FechaInicio.substring(8, 10));
        }
        if (this.data.Prioridad.Nombre == "Alta") {
          this.prioridad = "danger";
          this.d = 11;
        } else if (this.data.Prioridad.Nombre == "Baja") {
          this.prioridad = "success";
          this.d = 15;
        } else if (this.data.Prioridad.Nombre == "Media") {
          this.prioridad = "warning";
          this.d = 20;
        }
        if (this.data.FechaInicio != null) {
          this.obtener_dif();
          this.iniciointervalo();
        }
      }
      await this.$apollo.query({
          query: gql`
            query saber_permiso($Cuenta: Int!, $Code: String!) {
              saber_permiso(Cuenta: $Cuenta, Code: $Code) {
                Respuesta
              }
            }
          `,
          variables: {
            Cuenta: parseInt(localStorage.id_cuenta),
            Code: "P9"
          },
          fetchPolicy: "network-only"
        }).then(result => {
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
      await this.$apollo.query({
          query: gql`
            query saber_permiso($Cuenta: Int!, $Code: String!) {
              saber_permiso(Cuenta: $Cuenta, Code: $Code) {
                Respuesta
              }
            }
          `,
          variables: {
            Cuenta: parseInt(localStorage.id_cuenta),
            Code: "P59"
          },
          fetchPolicy: "network-only"
        }).then(result => {
          if (result.data.saber_permiso != null) {
            if (result.data.saber_permiso.Respuesta != null) {
              this.permiso1 = result.data.saber_permiso.Respuesta;
            } else {
              this.permiso1 = false;
            }
          } else {
            this.permiso1 = false;
          }
        });
    }
  },
  beforeDestroy() {
    this.pausarintervalo();
  }
};
</script>
