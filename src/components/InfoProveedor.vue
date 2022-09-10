<template>
  <div class="infoProveedor" style="width:100%;">
    <b-container class="bv-example-row">
      <b-row>
        <b-col cols="4">
          <b-card>
            <EditarAPI
              @actualizar="fn_update"
              tipo="editProveedor"
              :id="Data.ID"
              :consulta="consulta_Nombre"
              :titulo="'Nombre'"
              :valor="Data.Nombre"
              @valor="Data.Nombre = $event"
              columna="Nombre"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editProveedor"
              :id="Data.ID"
              :consulta="consulta_Telefono"
              :titulo="'Teléfono'"
              :valor="Data.Telefono"
              @valor="Data.Telefono = $event"
              columna="Telefono"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editProveedor"
              :id="Data.ID"
              :consulta="consulta_Direccion"
              :titulo="'Dirección'"
              :valor="Data.Direccion"
              @valor="Data.Direccion = $event"
              columna="Direccion"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editProveedor"
              :id="Data.ID"
              :consulta="consulta_Correo"
              :titulo="'Correo Electronico'"
              :valor="Data.Correo"
              @valor="Data.Correo = $event"
              columna="Correo"
            />
          </b-card>
        </b-col>
        <b-col cols="8" v-if="Data != null">
          <b-overlay :show="load" rounded="sm">
            <b-row v-if="Data != null">
              <b-col
                cols="6"
                v-if="Data.Productos != null && Data.Productos.length > 0"
                class="mb-1"
              >
                <InfoExtra
                  v-if="Data.Productos.length > 0"
                  :accion="
                    () => $router.push('/Productos/Proveedor/' + Data.ID)
                  "
                  icono="basket-fill"
                  titulo="Productos"
                  :valor="Data.Productos.length"
                />
              </b-col>
              <b-col
                cols="6"
                v-if="Data.Extintores != null && Data.Extintores.length > 0"
                class="mb-1"
              >
                <InfoExtra
                  v-if="Data.Extintores.length > 0"
                  :accion="
                    () => $router.push('/Extintores/Proveedor/' + Data.ID)
                  "
                  icono="exclamation-diamond"
                  titulo="Extintores"
                  :valor="Data.Extintores.length"
                />
              </b-col>
            </b-row>
          </b-overlay>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import gql from "graphql-tag";
import EditarAPI from "../components/EditarAPI.vue";
import InfoExtra from "../components/InfoExtra.vue";
export default {
  name: "infoProveedor",
  data() {
    return {
      load: false,
      consulta_Nombre: gql`
        mutation editProveedor($ID: Int!, $Nombre: String) {
          editProveedor(ID: $ID, Nombre: $Nombre) {
            Respuesta
          }
        }
      `,
      consulta_Telefono: gql`
        mutation editProveedor($ID: Int!, $Telefono: String) {
          editProveedor(ID: $ID, Telefono: $Telefono) {
            Respuesta
          }
        }
      `,
      consulta_Direccion: gql`
        mutation editProveedor($ID: Int!, $Direccion: String) {
          editProveedor(ID: $ID, Direccion: $Direccion) {
            Respuesta
          }
        }
      `,
      consulta_Correo: gql`
        mutation editProveedor($ID: Int!, $Correo: String) {
          editProveedor(ID: $ID, Correo: $Correo) {
            Respuesta
          }
        }
      `
    };
  },
  components: { EditarAPI, InfoExtra },
  props: {
    Data: {
      type: Object
    }
  },
  methods: {
    fn_update(a) {
      if (a) {
        this.$emit("actualizar", true);
      }
    }
  }
};
</script>
