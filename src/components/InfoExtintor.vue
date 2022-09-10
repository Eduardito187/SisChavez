<template>
  <div class="InfoExtintor" style="width:100%;">
    <b-container class="bv-example-row">
      <b-row>
        <b-col cols="4">
          <b-card>
            <EditarAPI
              @actualizar="fn_update"
              tipo="editExtintor"
              :id="Data.ID"
              :consulta="consulta_Peso"
              :titulo="'Peso'"
              :valor="Data.Peso"
              @valor="Data.Peso = $event"
              columna="Peso"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editExtintor"
              :id="Data.ID"
              :consulta="consulta_Tipo"
              :titulo="'Tipo'"
              :valor="Data.Tipo"
              @valor="Data.Tipo = $event"
              columna="Tipo"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editExtintor"
              :id="Data.ID"
              :consulta="consulta_Cantidad"
              :titulo="'Cantidad'"
              :valor="Data.Cantidad"
              @valor="Data.Cantidad = $event"
              columna="Cantidad"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editExtintor"
              :id="Data.ID"
              :consulta="consulta_Observacion"
              :titulo="'Observación'"
              :valor="Data.Observacion"
              @valor="Data.Observacion = $event"
              columna="Observacion"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editExtintor"
              :id="Data.ID"
              :consulta="consulta_Recargo"
              :titulo="'Recargo'"
              :valor="Data.Recargo"
              @valor="Data.Recargo = $event"
              columna="Recargo"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editExtintor"
              :id="Data.ID"
              :consulta="consulta_Sucursal"
              :titulo="'Sucursal'"
              :valor="Data.Sucursal.ID"
              @valor="Data.Sucursal = $event"
              columna="Sucursal"
            />
            <EditarAPI
              @actualizar="fn_update"
              tipo="editExtintor"
              :id="Data.ID"
              :consulta="consulta_Proveedor"
              :titulo="'Proveedor'"
              :valor="Data.Proveedor.ID"
              @valor="Data.Proveedor = $event"
              columna="Proveedor"
            />
          </b-card>
        </b-col>
        <b-col cols="8">
          <ExtintorInfo :id="Data.ID" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import gql from "graphql-tag";
import EditarAPI from "./EditarAPI.vue";
import ExtintorInfo from "./ExtintorInfo.vue";
export default {
  name: "InfoExtintor",
  data() {
    return {
      consulta_Peso: gql`
        mutation editExtintor($ID: Int!, $Peso: String) {
          editExtintor(ID: $ID, Peso: $Peso) {
            Respuesta
          }
        }
      `,
      consulta_Tipo: gql`
        mutation editExtintor($ID: Int!, $Tipo: String) {
          editExtintor(ID: $ID, Tipo: $Tipo) {
            Respuesta
          }
        }
      `,
      consulta_Cantidad: gql`
        mutation editExtintor($ID: Int!, $Cantidad: Int) {
          editExtintor(ID: $ID, Cantidad: $Cantidad) {
            Respuesta
          }
        }
      `,
      consulta_Observacion: gql`
        mutation editExtintor($ID: Int!, $Observacion: String) {
          editExtintor(ID: $ID, Observacion: $Observacion) {
            Respuesta
          }
        }
      `,
      consulta_Recargo: gql`
        mutation editExtintor($ID: Int!, $Recargo: String) {
          editExtintor(ID: $ID, Recargo: $Recargo) {
            Respuesta
          }
        }
      `,
      consulta_Sucursal: gql`
        mutation editExtintor($ID: Int!, $Sucursal: Int) {
          editExtintor(ID: $ID, Sucursal: $Sucursal) {
            Respuesta
          }
        }
      `,
      consulta_Proveedor: gql`
        mutation editExtintor($ID: Int!, $Proveedor: Int) {
          editExtintor(ID: $ID, Proveedor: $Proveedor) {
            Respuesta
          }
        }
      `
    };
  },
  components: { EditarAPI, ExtintorInfo },
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
