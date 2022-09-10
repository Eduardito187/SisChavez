<template>
  <b-card @click.right="showDrawer()" v-on:dblclick="(counter += 1), showDrawer()" no-body class="overflow-hidden" style="display:inline-block;margin:1%;" :style="{width: max ? '100%' : '31%',height: '240px',overflow: 'hidden',position: 'relative',border: '1px solid #ebedf0',borderRadius: '2px',padding: '4px',background: '#fafafa'}">
    <b-row no-gutters >
        <b-col md="6">
          <p style="margin:0px;">
            <b>Nombre: </b><small>{{ data.Nombre }}</small>
          </p>
          <p style="margin:0px;">
            <b>Apellido: </b><small>{{ data.Apellido }}</small>
          </p>
          <p style="margin:0px;">
            <b>CI: </b><small>{{ data.CI }}</small>
          </p>
          <p style="margin:0px;">
            <b>Puesto: </b><small>{{ data.Puesto }}</small>
          </p>
          <p style="margin:0px;">
            <b>Contratacion: </b><small>{{ data.FechaContratacion }}</small>
          </p>
        </b-col>
        <b-col v-if="data.Supervisor!=null" md="6">
            <b>Supervisor:</b>
            <p v-if="data.Supervisor.Nombre!=null" style="margin:0px;">
                <b>Nombre: </b><small>{{ data.Supervisor.Nombre }}</small>
            </p>
            <p v-if="data.Supervisor.Apellido!=null" style="margin:0px;">
                <b>Apellido: </b><small>{{ data.Supervisor.Apellido }}</small>
            </p>
            <p v-if="data.Supervisor.CI!=null" style="margin:0px;">
                <b>CI: </b><small>{{ data.Supervisor.CI }}</small>
            </p>
            <p v-if="data.Supervisor.Puesto!=null" style="margin:0px;">
                <b>Puesto: </b><small>{{ data.Supervisor.Puesto }}</small>
            </p>
            <p v-if="data.Supervisor.FechaContratacion!=null" style="margin:0px;">
                <b>Contratacion: </b><small>{{ data.Supervisor.FechaContratacion }}</small>
            </p>
        </b-col>
    </b-row>
    <a-drawer :width="ancho * 0.9" placement="right" :closable="false" :visible="visible" @close="onClose" >
        <p :style="[pStyle, pStyle2]">--</p>
        <p :style="pStyle">Cuenta</p>
        <a-row v-if="permiso">
            <a-col :span="8">
                <b-form-group class="col-md-11" label="Nombre:" label-for="Nombre" label-cols-sm="12" label-align-sm="right" >
                    <b-form-input id="Nombre" type="text" v-model="data.Nombre" ></b-form-input>
                </b-form-group>
            </a-col>
            <a-col :span="8">
                <b-form-group class="col-md-11" label="Apellido:" label-for="Apellido" label-cols-sm="12" label-align-sm="right" >
                    <b-form-input id="Apellido" type="text" v-model="data.Apellido" ></b-form-input>
                </b-form-group>
            </a-col>
            <a-col :span="8">
                <b-form-group class="col-md-11" label="CI:" label-for="CI" label-cols-sm="12" label-align-sm="right" >
                    <b-form-input id="CI" type="text" v-model="data.CI" ></b-form-input>
                </b-form-group>
            </a-col>
            <a-col :span="8">
                <b-form-group class="col-md-11" label="Puesto:" label-for="Puesto" label-cols-sm="12" label-align-sm="right" >
                    <b-form-select id="Puesto" class="form-control" v-model="data.Puesto" :options="Puestos" ></b-form-select>
                </b-form-group>
            </a-col>
            <a-col :span="8">
                <b-form-group class="col-md-11" label="Contratacion:" label-for="Contratacion" label-cols-sm="12" label-align-sm="right" >
                    <b-form-datepicker id="Contratacion" v-model="data.FechaContratacion"></b-form-datepicker>
                </b-form-group>
            </a-col>
            <a-col :span="8">
                <b-form-group v-if="data.Puesto!='Analista Monitoreo' && data.Puesto!='Analista Seguridad' && data.Puesto!='Encargado Seguridad'" class="col-md-11" label="Supervisor:" label-for="Supervisor" label-cols-sm="12" label-align-sm="right" >
                    <ComboNombre tipo="encargados" :dato="Supervisor" @change="Supervisor=$event" />
                </b-form-group>
            </a-col>
            <b-button class="mt-2" @click="editar()" :disabled="validacionR" pill variant="primary" >Editar</b-button >
        </a-row>
        <b-button class="mt-2" @click="showChildrenDrawer()" pill variant="success" >Ver Calendario</b-button >
        <a-drawer title="Calendario" :width="ancho * 0.95" :closable="false" :visible="childrenDrawer" @close="onChildrenDrawerClose" >
            <Calendario :Trabajador="data.ID" />
      </a-drawer>
    </a-drawer>
  </b-card>
</template>
<script>
import gql from "graphql-tag";
import Calendario from "./Calendario.vue";
import ComboNombre from "./../../components/ComboNombre.vue" ;
export default {
  components: { ComboNombre, Calendario },
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
        validacionR:false,
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
      
        Supervisor:null,
        Nombre:"",
        Apellido:"",
        CI:"",
        Puesto:"",
        childrenDrawer:false,
        Puestos:[{ value:"Aux. Seguridad", text:"Aux. Seguridad" },{ value:"Aux. Monitoreo", text:"Aux. Monitoreo" },{ value:"Analista Monitoreo", text:"Analista Monitoreo" },{ value:"Analista Seguridad", text:"Analista Seguridad" },{ value:"Encargado Seguridad", text:"Encargado Seguridad"}],
        Fecha:"",
    };
  },
  methods: {
    showChildrenDrawer() {
      this.childrenDrawer = true;
    },
    onChildrenDrawerClose() {
      this.childrenDrawer = false;
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
      }
    },
    async editar(){
        if (this.data.Puesto=='Analista Monitoreo' || this.data.Puesto=='Analista Seguridad' || this.data.Puesto=='Encargado Seguridad') {
            this.Supervisor=0;
        }
        if (this.Supervisor!=null) {
            const add = gql`
                mutation EditTrabajador($ID: Int!,$Supervisor: Int!,$Nombre: String!,$Apellido: String!,$CI:String!,$Puesto:String!,$FechaContratacion:String!) {
                    EditTrabajador(ID:$ID,Supervisor:$Supervisor,Nombre:$Nombre,Apellido:$Apellido,CI:$CI,Puesto:$Puesto,FechaContratacion:$FechaContratacion) {
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
                Nombre:this.data.Nombre,
                Apellido:this.data.Apellido,
                CI:this.data.CI,
                Puesto:this.data.Puesto,
                FechaContratacion:this.data.FechaContratacion,
                Supervisor:parseInt(this.Supervisor)
            }
            })
            .then(result => {
            if (result.data.EditTrabajador.Respuesta) {
                this.validacionR = false;
                this.$socket.emit("Sumar_Linea", true);
                this.$emit('update',true);
            }
            });
        }
    }
  },
  async created() {
    window.addEventListener("resize", () => {
      this.ancho = window.innerWidth;
    });
    if (this.data.Supervisor!=null) {
        this.Supervisor=this.data.Supervisor.ID;
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
          Code: "P53"
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
