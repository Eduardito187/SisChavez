<template>
  <div class="InfoSucursal" style="width:100%;">
    <b-container class="bv-example-row">
      <b-row>
        <b-col cols="4">
          <b-card>
            <EditarAPI
              @actualizar="fn_update"
              tipo="editSucursal"
              :id="sucursal.ID"
              :consulta="consulta_Nombre"
              :titulo="'Nombre'"
              :valor="sucursal.Nombre"
              @valor="sucursal.Nombre = $event"
              columna="Nombre"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editSucursal"
              :id="sucursal.ID"
              :consulta="consulta_CodigoSucursal"
              :titulo="'Codigo Sucursal'"
              :valor="sucursal.CodigoSucursal"
              @valor="sucursal.CodigoSucursal = $event"
              columna="CodigoSucursal"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editSucursal"
              :id="sucursal.ID"
              :consulta="consulta_Telefono"
              :titulo="'Teléfono'"
              :valor="sucursal.Telefono"
              @valor="sucursal.Telefono = $event"
              columna="Telefono"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editSucursal"
              :id="sucursal.ID"
              :consulta="consulta_Direccion"
              :titulo="'Dirección'"
              :valor="sucursal.Direccion"
              @valor="sucursal.Direccion = $event"
              columna="Direccion"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editSucursal"
              :id="sucursal.ID"
              :consulta="consulta_TelfInterno"
              :titulo="'Teléfono Interno'"
              :valor="sucursal.TelfInterno"
              @valor="sucursal.TelfInterno = $event"
              columna="TelfInterno"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editSucursal"
              :id="sucursal.ID"
              :consulta="consulta_Correo"
              :titulo="'Correo Electronico'"
              :valor="sucursal.Correo"
              @valor="sucursal.Correo = $event"
              columna="Correo"
            />
          </b-card>
        </b-col>
        <b-col cols="8">
          <SucursalInfo :id_sucursal="sucursal.ID" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import gql from "graphql-tag";
import EditarAPI from "../components/EditarAPI.vue";
import SucursalInfo from "../components/SucursalInfo.vue";
export default {
  name: "InfoSucursal",
  data() {
    return {
      consulta_Nombre: gql`
        mutation editSucursal($ID: Int!, $Nombre: String) {
          editSucursal(ID: $ID, Nombre: $Nombre) {
            Respuesta
          }
        }
      `,
      consulta_CodigoSucursal: gql`
        mutation editSucursal($ID: Int!, $CodigoSucursal: String) {
          editSucursal(ID: $ID, CodigoSucursal: $CodigoSucursal) {
            Respuesta
          }
        }
      `,
      consulta_Telefono: gql`
        mutation editSucursal($ID: Int!, $Telefono: String) {
          editSucursal(ID: $ID, Telefono: $Telefono) {
            Respuesta
          }
        }
      `,
      consulta_Direccion: gql`
        mutation editSucursal($ID: Int!, $Direccion: String) {
          editSucursal(ID: $ID, Direccion: $Direccion) {
            Respuesta
          }
        }
      `,
      consulta_TelfInterno: gql`
        mutation editSucursal($ID: Int!, $TelfInterno: String) {
          editSucursal(ID: $ID, TelfInterno: $TelfInterno) {
            Respuesta
          }
        }
      `,
      consulta_Correo: gql`
        mutation editSucursal($ID: Int!, $Correo: String) {
          editSucursal(ID: $ID, Correo: $Correo) {
            Respuesta
          }
        }
      `
    };
  },
  components: { EditarAPI, SucursalInfo },
  props: {
    sucursal: {
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
