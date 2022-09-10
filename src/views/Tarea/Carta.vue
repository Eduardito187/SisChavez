<template>
  <div @click.right="edit_click()" v-on:dblclick="(counter += 1), edit_click()" style="display:inline-block;margin:1%;" :style="{width: max ? '100%' : '48%',height: '240px',overflow: 'hidden',position: 'relative',borderRadius: '2px',padding: '4px',background: '#fafafa',border: '3px solid '+Border}">
    <b-card no-body class="scroll" style="height:100%;overflow-x: hidden;">
      <b-row>
        <b-col md="6">
          <p style="margin:0px;">
            <b>Codigo: </b><small>{{ data.Codigo }}</small>
          </p>
          <p style="margin:0px;">
            <b>Detalle: </b><small>{{ data.Detalle }}</small>
          </p>
          <p style="margin:0px;" v-if="data.Pospuesta != null">
            <b>Pospuesta: </b><small>{{ data.Pospuesta }}</small>
          </p>
          <p style="margin:0px;">
            <b>Sucursal: </b><small>{{data.Sucursal.Region!=null?data.Sucursal.Region+' - ':''}}{{data.Sucursal.Nombre}}({{data.Sucursal.CodigoSucursal}})</small>
          </p>
          <p v-if="Estado=='Finalizado'" style="margin:0px;">
            <b>Conclusion: </b><small>{{data.Conclusion}}</small>
          </p>
          <p v-else style="margin:0px;">
            <b>Direccion Sucursal: </b><small>{{data.Sucursal.Direccion}}</small>
          </p>
        </b-col>
        <b-col md="6">
          <b-card-body>
            <b-row v-if="data.Responsable!=null" style="margin-bottom:2px;">
              <b-col v-if="To_ID == data.Solicitante.ID && Estado!='Finalizado' || To_ID == data.Responsable.ID && Estado!='Finalizado'" md="12" style="margin-bottom:4px;">
                <a-button icon="check" size="small" @click="PosponerOpen()">Posponer</a-button>
              </b-col>
              <b-col v-if="To_ID == data.Solicitante.ID && Estado!='Finalizado' || To_ID == data.Responsable.ID && Estado!='Finalizado'" md="12" style="margin-bottom:4px;">
                <a-button icon="poweroff" size="small" @click="Realizada_Tarea()">Realizada</a-button>
              </b-col>
              <b-col v-if="Estado=='En Proceso' || Estado=='Finalizado'" md="12" style="margin-bottom:4px;">
                <p style="margin:0px;" v-if="data.FechaInicio != null">
                  <b>Inicio: </b><small>{{ data.FechaInicio }}</small>
                </p>
                <p style="margin:0px;" v-if="data.FechaInicio != null">
                  <b v-if="Estado=='Finalizado'">Fin: <small>{{data.FechaFinalizacion}}</small></b>
                  <b v-else>Activo: <small style="color:green;">{{TIME}}</small></b>
                </p>
              </b-col>
            </b-row>
            <b-row style="margin-bottom:4px;">
              <b-col md="6">
                <small style="display:flex;"><b>Prioridad:</b></small>
              </b-col>
              <b-col md="6">
                <b-progress
                  style="width:50px;display:flex;"
                  :value="100"
                  :variant="prioridad"
                ></b-progress>
              </b-col>
            </b-row>
            <Personas :a="data.Solicitante" tipo="Tarea" @actualizar="actualizar_data($event)" :ID="data.ID" :b="data.Responsable"/>
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
    <a-drawer width="640" placement="right" :closable="false" :visible="edit" @close="editClose" >
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
        Tarea
      </p>
      <a-row>
        <a-col :span="12">
          <b-form-group class="col-md-11" label="Detalle:" label-for="Detalle" label-cols-sm="12" label-align-sm="right" >
            <b-form-textarea id="Detalle" v-model="Detalle" placeholder="Detalle.." rows="3" max-rows="3"></b-form-textarea>
          </b-form-group>
        </a-col>
        <a-col :span="12">
          <b-form-group class="col-md-11" label="Descripcion:" label-for="Descripcion" label-cols-sm="12" label-align-sm="right" >
            <a-radio-group v-model="Estado" @change="check_op">
              <a-radio value="Pendiente">
                Pendiente
              </a-radio>
              <a-radio value="En Proceso">
                En Proceso
              </a-radio>
              <a-radio value="Finalizado">
                Finalizado
              </a-radio>
            </a-radio-group>
          </b-form-group>
        </a-col>
        <a-col :span="24">
          <b-form-group v-if="Estado=='Finalizado'" class="col-md-11" label="Conclusion:" label-cols-sm="12" label-align-sm="right" >
            <small>{{data.Conclusion}}</small>
          </b-form-group>
        </a-col>
        <a-col :span="24">
          <a-button @click="editar()" class="mt-2" type="primary" :loading="validacionR" icon="check" >Editar</a-button >
          <a-button v-if="permiso1" @click="eliminar_data()" class="mt-2" style="margin-left:10px;" type="danger" icon="delete" >Eliminar</a-button >
        </a-col>
      </a-row>
    </a-drawer>
    <a-drawer width="640" placement="right" :closable="false" :visible="posp" @close="PosponerClose" >
      <p
        :style="[{fontSize: '16px',color: 'rgba(0,0,0,0.85)',lineHeight: '24px',display: 'block',marginBottom: '16px'},{ marginBottom: '24px' }]">
        --
      </p>
      <p :style="{fontSize: '16px',color: 'rgba(0,0,0,0.85)',lineHeight: '24px',display: 'block',marginBottom: '16px'}">
        Posponer Tarea
      </p>
      <a-row>
        <a-col :span="12">
          <b-form-group class="col-md-11" label="Motivo:" label-for="Motivo" label-cols-sm="12" label-align-sm="right" >
            <b-form-textarea id="Motivo" v-model="data.Pospuesta" placeholder="Motivo.." rows="3" max-rows="3" ></b-form-textarea>
          </b-form-group>
        </a-col>
        <a-col :span="12">
          <b-form-group class="col-md-11" label="Fecha:" label-for="Fecha" label-cols-sm="12" label-align-sm="right" >
            <b-form-datepicker id="Fecha" v-model="Fecha"></b-form-datepicker>
          </b-form-group>
        </a-col>
        <a-col :span="24" v-if="Fecha!=''">
          <a-button @click="Posponer_Tarea()" class="mt-2" type="primary" :loading="validacionR" icon="check" >Posponer Tarea</a-button>
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>
<script>
import gql from "graphql-tag";
import Personas from "./Personas.vue";
export default {
  data() {
    return {
      prioridad: "danger",
      edit: false,
      validacionR: false,
      Detalle: "",
      Estado: null,
      permiso: false,
      permiso1:false,
      counter: 0,
      To_ID:0,
      Fecha:"",
      posp:false,
      Border:"black",
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
      anho:"",
      mes:"",
      dia:"",
      TIME:"",
    };
  },
  components: { Personas },
  props: {
    max: {
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  methods: {
    async eliminar_data(){
      const add = gql`
        mutation delTareas(
          $ID: Int!
        ) {
          delTareas(
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
          if (result.data.delTareas.Respuesta) {
            this.$message.success("Seguimiento Eliminado.");
          }
          this.$socket.emit("Sumar_Linea", true);
          this.$emit('eliminar',this.data.ID);
        });
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
    check_op(a) {
      console.log(a);
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
    PosponerOpen() {
      this.posp = true;
    },
    PosponerClose() {
      this.posp = false;
    },
    edit_click() {
      if (this.permiso) {
        this.editOpen();
      }
    },
    async Posponer_Tarea(){
      const add = gql`
        mutation PosponerTarea($Fecha: String!, $Motivo: String!, $ID: Int!, $Persona: Int!) {
          PosponerTarea(Fecha: $Fecha, Motivo: $Motivo, ID: $ID, Persona: $Persona) {
            Respuesta
          }
        }
      `;
      this.validacionR = true;
      await this.$apollo
        .mutate({
          mutation: add,
          variables: {
            ID:parseInt(this.data.ID),
            Persona:parseInt(localStorage.id_cuenta),
            Fecha:this.Fecha,
            Motivo:this.data.Pospuesta
          }
        })
        .then(result => {
          if (result.data.PosponerTarea.Respuesta) {
            this.validacionR = false;
            this.$socket.emit("Sumar_Linea", true);
            this.actualizar_data(true);
            this.Estado="En Proceso";
            this.enPoceso();
          }
        });
    },
    async Realizada_Tarea(){
      const add = gql`
        mutation TareaRealizado($ID: Int!, $Persona: Int!, $Conclusion:String!) {
          TareaRealizado(ID: $ID, Persona: $Persona, Conclusion: $Conclusion) {
            Respuesta
          }
        }
      `;
      let conclu = prompt("Conclusion de la Tarea:", "");

      if (conclu != null) {
        this.validacionR = true;
        await this.$apollo.mutate({
            mutation: add,
            variables: {
              ID:parseInt(this.data.ID),
              Persona:parseInt(localStorage.id_cuenta),
              Conclusion:conclu
            }
          })
          .then(result => {
            if (result.data.TareaRealizado.Respuesta) {
              this.validacionR = false;
              this.$socket.emit("Sumar_Linea", true);
              this.actualizar_data(true);
              this.Estado="Finalizado";
            }
          });
      }
      
    },
    async editar() {
      const add = gql`
        mutation editTareas($Estado: String!, $Detalle: String!, $ID: Int!) {
          editTareas(Estado: $Estado, Detalle: $Detalle, ID: $ID) {
            Respuesta
          }
        }
      `;
      this.validacionR = true;
      await this.$apollo
        .mutate({
          mutation: add,
          variables: {
            Estado: this.Estado,
            Detalle: this.Detalle,
            ID: parseInt(this.data.ID)
          }
        })
        .then(result => {
          if (result.data.editTareas.Respuesta) {
            this.$message.success("Edicion Exitosa");
            this.validacionR = false;
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    },
    obtener_dif() {
      var fecha = new Date();
      var inicio =this.obt_mes_enlish(this.mes) +" " +this.dia +" " +this.anho +" 00:00:00 GMT-0400";
      var f = new Date(inicio);
      var time = fecha-f;
      var min = parseInt(time / (1000 * 60));
      let dias_R = 0;
      if (min >=0) {
        while (min <= 0) {
          min += 1440;
          dias_R += 1;
        }
        dias_R+=1;
        this.TIME="Dia "+dias_R;
      } else {
        this.TIME="ERROR_MIN";
      }
    },
    enPoceso(){
      this.anho = parseInt(this.data.FechaInicio.substring(0, 4));
      this.mes = parseInt(this.data.FechaInicio.substring(5, 7));
      this.dia = parseInt(this.data.FechaInicio.substring(8, 10));
      this.obtener_dif();
    }
  },
  async created() {
    this.To_ID=parseInt(localStorage.id_cuenta);
    if (this.data != null) {
      this.Estado = this.data.Estado;
      this.Detalle = this.data.Detalle;
      if (this.data.Sucursal.Region!=null) {
        if (this.data.Sucursal.Region!="") {
          for (let i = 0; i < this.Colores.length; i++) {
            if (this.Colores[i]["Region"]==this.data.Sucursal.Region) {
              this.Border=this.Colores[i]["Color"];
              i=this.Colores.length;
            }
          }
        }
      }
      if (this.Estado == "En Proceso") {
        this.enPoceso();
      }
      if (this.data.Prioridad != null) {
        if (this.data.Prioridad.Nombre == "Alta") {
          this.prioridad = "danger";
        } else if (this.data.Prioridad.Nombre == "Baja") {
          this.prioridad = "success";
        } else if (this.data.Prioridad.Nombre == "Media") {
          this.prioridad = "warning";
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
              Code: "P39"
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
              Code: "P60"
            },
            fetchPolicy: "network-only"
          })
          .then(result => {
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
    }
  }
};
</script>