<template>
  <div
    @click.right="edit_click()"
    v-on:dblclick="(counter += 1), edit_click()"
    style="display:inline-block;margin:1%;"
    :style="{
      width: max ? '100%' : '48%',
      height: '240px',
      overflow: 'hidden',
      position: 'relative',
      borderRadius: '2px',
      padding: '4px',
      background: '#fafafa',
      border: '3px solid '+Border
    }"
  >
    <b-card no-body class="overflow-hidden" style="height:100%;padding:4px;">
      <b-row no-gutters>
        <b-col md="12">
         <p v-if="extintor.Codigo!= null && extintor.Codigo!=0" style="margin:0px;">
            <b>Codigo: </b><small>{{ extintor.Codigo }}</small>
          </p>
          <p v-if="extintor.PH!= null && extintor.PH!=0" style="margin:0px;">
            <b>PH: </b><small>{{ extintor.PH }}</small>
          </p>
          <p style="margin:0px;">
            <b>Recargo: </b><small>{{ extintor.Recargo }}</small>
          </p>
          <p style="margin:0px;">
            <b>Tipo: </b><small>{{ extintor.Extintores.Tipo }}</small>
          </p>
          <p v-if="datos.Proveedor != null" style="margin:0px;">
            <b>Proveedor: </b><small>{{ datos.Proveedor.Nombre }}</small>
          </p>
          <p v-if="datos.Sucursal != null" style="margin:0px;">
            <b>Sucursal: </b><small>{{ datos.Sucursal.Nombre }}({{datos.Sucursal.CodigoSucursal}})</small
            >
          </p>
        </b-col>
        <b-col md="12">
          <b-card-body>
            <b-row no-gutters>
              <b-card-text>Registrado el <b>{{ extintor.Extintores.Fecha }}</b> con un peso de <b>{{ extintor.Peso }}</b></b-card-text>
            </b-row>
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
    <a-drawer title="Multi-level drawer" :width="ancho * 0.9" :closable="false" :visible="visible" @close="onClose" >
      <b-card bg-variant="light">
        <b-form-group label-cols-lg="12" label="Actualizar Extintor" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
          <div class="d-flex justify-content-between">
            <b-form-group class="col-md-5" label="Codigo:" label-for="Codigo" label-cols-sm="12" label-align-sm="right" >
              <b-form-input id="Codigo" type="number" v-model="extintor.Codigo" ></b-form-input>
            </b-form-group>
            <b-form-group class="col-md-5" label="PH:" label-for="PH" label-cols-sm="12" label-align-sm="right" >
              <b-form-input id="PH" type="number" v-model="extintor.PH" ></b-form-input>
            </b-form-group>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <b-form-group class="col-md-5" label="Observacion:" label-for="Observacion" label-cols-sm="12" label-align-sm="right" >
              <b-form-textarea id="Observacion" v-model="extintor.Observacion" placeholder="Observacion.." rows="3" max-rows="3" ></b-form-textarea>
            </b-form-group>
            <b-form-group class="col-md-5" label="Fecha de Recargo:" label-for="Recargo" label-cols-sm="12" label-align-sm="right" >
              <b-form-datepicker id="Recargo" v-model="extintor.Recargo" ></b-form-datepicker>
            </b-form-group>
          </div>
          <b-button @click="actualizar()" :disabled="upd" pill variant="primary">Actualizar</b-button>
        </b-form-group>
      </b-card>
      <div style="margin-top:5px;">
        <a-button-group>
          <a-button @click="op_mas('Proveedor')">Proveedor</a-button>
          <a-button @click="op_mas('Sucursal')">Sucursal</a-button>
        </a-button-group>
      </div>
      <a-drawer title="Two-level Drawer" :width="ancho * 0.45" :closable="false" :visible="childrenDrawer" @close="onChildrenDrawerClose" >
        <div v-if="mas == 'Proveedor'">
          <b-card no-body class="overflow-hidden" style="padding:10px;">
            <b-row no-gutters>
              <b-col md="12">
                <p style="margin:0px;">
                  <b>Nombre: </b><small>{{ datos.Proveedor.Nombre }}</small>
                </p>
                <p style="margin:0px;">
                  <b>Correo: </b><small>{{ datos.Proveedor.Correo }}</small>
                </p>
                <p style="margin:0px;">
                  <b>Telefono: </b><small>{{ datos.Proveedor.Telefono }}</small>
                </p>
              </b-col>
              <b-col md="12">
                <p style="margin:0px;">
                  <b>Direccion: </b
                  ><small>{{ datos.Proveedor.Direccion }}</small>
                </p>
              </b-col>
            </b-row>
          </b-card>
        </div>
        <div v-else-if="mas == 'Sucursal'">
          <b-card no-body class="overflow-hidden" style="padding:10px;">
            <b-row no-gutters>
              <b-col md="12">
                <p style="margin:0px;">
                  <b>Nombre: </b><small>{{ datos.Sucursal.Nombre }}</small>
                </p>
                <p style="margin:0px;">
                  <b>Codigo Sucursal: </b
                  ><small>{{ datos.Sucursal.CodigoSucursal }}</small>
                </p>
                <p style="margin:0px;">
                  <b>Correo: </b><small>{{ datos.Sucursal.Correo }}</small>
                </p>
              </b-col>
              <b-col md="12">
                <p style="margin:0px;">
                  <b>Telefono: </b><small>{{ datos.Sucursal.Telefono }}</small>
                </p>
                <p style="margin:0px;">
                  <b>Telefono Interno: </b
                  ><small>{{ datos.Sucursal.TelfInterno }}</small>
                </p>
                <p style="margin:0px;">
                  <b>Direccion: </b
                  ><small>{{ datos.Sucursal.Direccion }}</small>
                </p>
              </b-col>
            </b-row>
          </b-card>
        </div>
      </a-drawer>
    </a-drawer>
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      visible: false,
      tipos: [{ value: "ABC", text: "ABC" }, { value: "CO2", text: "CO2" }],
      childrenDrawer: false,
      counter: 0,
      permiso: false,
      upd: false,
      datos: [],
      mas: "",
      ancho: window.innerWidth,
      consulta_info: gql`
        query extintor($ID: Int!) {
          extintor(ID: $ID) {
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
            Proveedor {
              ID
              Nombre
              Telefono
              Direccion
              Correo
            }
          }
        }
      `,
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
    };
  },
  props: {
    extintor: {
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
      let cod;
      let ph;
      if (this.extintor.Codigo==null || this.extintor.Codigo=="" || this.extintor.Codigo==" ") {
        cod=0;
      }else{
        cod=parseInt(this.extintor.Codigo);
      }
      if (this.extintor.PH==null || this.extintor.PH=="" || this.extintor.PH==" ") {
        ph=0;
      }else{
        ph=parseInt(this.extintor.PH);
      }
      const add = gql`
        mutation UpdateExtintorLlave(
          $ID: Int!
          $Codigo: Int
          $PH: Int
          $Observacion: String!
          $Recargo: String!
        ) {
          UpdateExtintorLlave(
            ID: $ID
            Codigo: $Codigo
            PH: $PH
            Observacion: $Observacion
            Recargo: $Recargo
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
            ID: parseInt(this.extintor.ID),
            Codigo:cod,
            PH:ph,
            Observacion: this.extintor.Observacion,
            Recargo: this.extintor.Recargo
          }
        })
        .then(result => {
          if (result.data.UpdateExtintorLlave.Respuesta) {
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
            ID: parseInt(this.extintor.Extintores.ID)
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          if (result.data.extintor != null) {
            this.datos = result.data.extintor;
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
    if (this.extintor != null) {
      if (this.extintor.Extintores.Sucursal.Region!=null) {
        if (this.extintor.Extintores.Sucursal.Region!="") {
          for (let i = 0; i < this.Colores.length; i++) {
            if (this.Colores[i]["Region"]==this.extintor.Extintores.Sucursal.Region) {
              this.Border=this.Colores[i]["Color"];
              i=this.Colores.length;
            }
          }
        }
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
            Code: "P21"
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
