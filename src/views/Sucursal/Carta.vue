<template>
  <div
    @click.right="edit_click()"
    v-on:dblclick="(counter += 1), edit_click()"
    style="display:inline-block;margin:1%;"
    :style="{
      width: max ? '100%' : '48%',
      height: '200px',
      overflow: 'hidden',
      position: 'relative',
      borderRadius: '2px',
      padding: '4px',
      background: '#fafafa',
      border: '3px solid '+Border,
    }"
  >
    <b-card no-body class="overflow-hidden" style="height:100%;">
      <b-row no-gutters>
        <b-col md="12">
          <p style="margin:0px;">
            <b>Nombre: </b><small>{{ data.Nombre }}</small>
          </p>
          <p style="margin:0px;">
            <b>Codigo Sucursal: </b><small>{{data.Region!=null?data.Region+' - ':''}}{{data.Nombre}}({{data.CodigoSucursal}})</small>
          </p>
          <p style="margin:0px;">
            <b>Correo: </b><small>{{ data.Correo }}</small>
          </p>
        </b-col>
        <b-col md="12">
          <p style="margin:0px;">
            <b>Telefono: </b><small>{{ data.Telefono }}</small>
          </p>
          <p style="margin:0px;">
            <b>Telefono Interno: </b><small>{{ data.TelfInterno }}</small>
          </p>
          <p style="margin:0px;">
            <b>Direccion: </b><small>{{ data.Direccion }}</small>
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
          label="Actualizar Sucursal"
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
              <b-form-input id="Nombre" v-model="data.Nombre"></b-form-input>
            </b-form-group>

            <b-form-group
              class="col-md-5"
              label="Codigo:"
              label-for="CodigoSucursal"
              label-cols-sm="12"
              label-align-sm="right"
            >
              <b-form-input
                id="CodigoSucursal"
                v-model="data.CodigoSucursal"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="d-flex justify-content-between">
            <b-form-group
              class="col-md-5"
              label="Telefono:"
              label-for="Telefono"
              label-cols-sm="12"
              label-align-sm="right"
            >
              <b-form-input
                id="Telefono"
                v-model="data.Telefono"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              class="col-md-5"
              label="Telefono Interno:"
              label-for="TelfInterno"
              label-cols-sm="12"
              label-align-sm="right"
            >
              <b-form-input
                id="TelfInterno"
                v-model="data.TelfInterno"
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
                v-model="data.Direccion"
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
              <b-form-input id="Correo" v-model="data.Correo"></b-form-input>
            </b-form-group>
          </div>
          <b-button @click="actualizar()" :disabled="upd" pill variant="primary"
            >Actualizar</b-button
          >
        </b-form-group>
      </b-card>
      <div style="margin-top:5px;">
        <a-button-group>
          <a-button @click="op_mas('Seguimientos')">Seguimientos</a-button>
          <a-button @click="op_mas('Tareas')">Tareas</a-button>
        </a-button-group>
      </div>
      <div style="margin-top:5px;">
        <a-button-group>
          <a-button @click="op_mas('Empresa de Seguridad')"
            >Empresa de Seguridad</a-button
          >
          <a-button @click="op_mas('Control de Llaves')"
            >Control de Llaves</a-button
          >
        </a-button-group>
      </div>
      <div style="margin-top:5px;">
        <a-button-group>
          <a-button @click="op_mas('Controles Diarios')"
            >Controles Diarios</a-button
          >
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
        <div v-if="mas == 'Tareas'">
          <CartaTarea
            v-for="d in sucursal.Tareas"
            :key="d.ID"
            @actualizar="update_data($event)"
            :data="d"
            :max="false"
          />
        </div>
        <div v-else-if="mas == 'Seguimientos'">
          <CartaSeguimiento
            v-for="d in sucursal.Seguimiento"
            :key="d.ID"
            :data="d"
            @actualizar="actualizar_data($event)"
            :max="false"
          />
        </div>
        <div v-else-if="mas == 'Empresa de Seguridad'">
          <div v-for="d in sucursal.Guardias" :key="d.ID">
            <a-divider>Empresa de Seguridad</a-divider>
            <b-table
              striped
              hover
              :items="[d.Empresa]"
              :fields="['Nombre', 'Telefono', 'Correo', 'Supervisores']"
            ></b-table>
            <a-divider>Guardias</a-divider>
            <b-table
              striped
              hover
              :items="retorno_data_table(d.Guardia_Sucursal)"
              :fields="['Nombre', 'Telefono', 'Precio']"
            ></b-table>
            <a-divider />
          </div>
        </div>
        <div v-else-if="mas == 'Control de Llaves'">
          <CartaLlaves
            v-for="d in sucursal.Control_Llaves"
            :key="d.ID"
            @actualizar="update_data($event)"
            :data="d"
            :max="false"
          />
        </div>
        <div v-else-if="mas == 'Controles Diarios'">
          <ListDiario :data="sucursal.Control_Diarios" />
        </div>
        <div v-else-if="mas == 'Productos'">
          <Articulo
            v-for="d in sucursal.Producto_Lote"
            :key="d.ID"
            :data="d.Producto"
            :max="false"
            :Cantidad="d.Cantidad"
            :Fecha="d.FechaSalida"
          />
        </div>
      </a-drawer>
    </a-drawer>
  </div>
</template>
<script>
import gql from "graphql-tag";
import Articulo from "./../Lote/Articulo.vue";
import ListDiario from "./ListDiario.vue";
import ListGuardia from "./ListGuardia.vue";
import CartaLlaves from "./../Llaves/Carta.vue";
import CartaTarea from "./../Tarea/Carta.vue";
import CartaSeguimiento from "./../Seguimiento/Carta.vue";
export default {
  name: "CartaSucursal",
  data() {
    return {
      visible: false,
      childrenDrawer: false,
      counter: 0,
      permiso: false,
      upd: false,
      sucursal: [],
      mas: "",
      Border: "black",
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
      ancho: window.innerWidth,
      consulta_info: gql`
        query sucursal($ID: Int!) {
          sucursal(ID: $ID) {
            Seguimiento {
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
            Guardias {
              ID
              Ingreso
              Salida
              Empresa {
                ID
                Nombre
                Telefono
                Direccion
                Correo
                Supervisores
              }
              Guardia_Sucursal {
                Guardia {
                  ID
                  Nombre
                  Telefono
                  Precio
                }
              }
            }
            Control_Llaves {
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
                contra
                nombre
                foto
              }
            }
            Control_Diarios {
              ID
              Calculo
              Observacion
              Fecha
              Empresa {
                ID
                Nombre
                Telefono
                Direccion
                Correo
                Supervisores
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
              Guardia {
                ID
                Nombre
                Telefono
                Precio
              }
              Tiempo {
                ID
                Ingreso
                Salida
              }
            }
            Tareas {
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
              }
            }
            Producto_Lote {
              ID
              FechaSalida
              Cantidad
              Producto {
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
        }
      `
    };
  },
  components: {
    Articulo,
    CartaTarea,
    ListGuardia,
    CartaLlaves,
    ListDiario,
    CartaSeguimiento
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
    retorno_data_table(a) {
      let x = [];
      for (let index = 0; index < a.length; index++) {
        if (a[index]["Guardia"] != null) {
          x.push({
            Nombre: a[index]["Guardia"]["Nombre"],
            Telefono: a[index]["Guardia"]["Telefono"],
            Precio: a[index]["Guardia"]["Precio"]
          });
        }
      }
      return x;
    },
    op_mas(a) {
      this.mas = a;
      this.showChildrenDrawer();
    },
    async actualizar() {
      const add = gql`
        mutation editSucursal(
          $ID: Int!
          $Nombre: String!
          $CodigoSucursal: String!
          $Telefono: String!
          $TelfInterno: String!
          $Direccion: String!
          $Correo: String!
        ) {
          editSucursal(
            ID: $ID
            Nombre: $Nombre
            CodigoSucursal: $CodigoSucursal
            Telefono: $Telefono
            TelfInterno: $TelfInterno
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
            Nombre: this.data.Nombre,
            CodigoSucursal: this.data.CodigoSucursal,
            Telefono: this.data.Telefono,
            TelfInterno: this.data.TelfInterno,
            Direccion: this.data.Direccion,
            Correo: this.data.Correo
          }
        })
        .then(result => {
          if (result.data.editSucursal.Respuesta) {
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
    actualizar_data(a) {
      if (a) {
        this.$emit("actualizar", a);
      }
    },
    edit_click() {
      if (this.permiso) {
        this.showDrawer();
      }
    },
    update_data(a) {
      if (a) {
        this.obtener_data();
      }
    },
    async obtener_data() {
      await this.$apollo
        .query({
          query: this.consulta_info,
          variables: {
            ID: parseInt(this.data.ID)
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          if (result.data.sucursal != null) {
            this.sucursal = result.data.sucursal;
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    }
  },
  async created() {
    window.addEventListener("resize", () => {
      this.ancho = window.innerWidth;
    });
    if (this.data != null) {
      if (this.data.Region!=null) {
        if (this.data.Region!="") {
          for (let i = 0; i < this.Colores.length; i++) {
            if (this.Colores[i]["Region"]==this.data.Region) {
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
            Code: "P6"
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
