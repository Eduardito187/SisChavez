<template>
  <div class="SucursalInfo">
    <b-overlay :show="load" rounded="sm">
      <b-row v-if="sucursal != null">
        <b-col cols="6" v-if="sucursal.Extintor != null" class="mb-1">
          <InfoExtra
            :accion="() => $router.push('/Extintores/Sucursal/' + id_sucursal)"
            icono="briefcase"
            titulo="Extintores"
            :valor="sucursal.Extintor.length"
          />
        </b-col>
        <b-col cols="6" v-if="sucursal.Seguimiento != null" class="mb-1">
          <InfoExtra
            :accion="() => null"
            icono="archive"
            titulo="Seguimientos"
            :valor="sucursal.Seguimiento.length"
          />
        </b-col>
        <b-col cols="6" v-if="sucursal.Guardias != null" class="mb-1">
          <InfoExtra
            :accion="() => null"
            icono="shield-lock-fill"
            titulo="Empresa de Seguridad"
            :valor="sucursal.Guardias.length"
          />
        </b-col>
        <b-col cols="6" v-if="sucursal.Control_Llaves != null" class="mb-1">
          <InfoExtra
            :accion="() => null"
            icono="key"
            titulo="Control de Llaves"
            :valor="sucursal.Control_Llaves.length"
          />
        </b-col>
        <b-col cols="6" v-if="sucursal.Control_Diarios != null" class="mb-1">
          <InfoExtra
            :accion="() => null"
            icono="calendar-day"
            titulo="Control Diarios"
            :valor="sucursal.Control_Diarios.length"
          />
        </b-col>
        <b-col cols="6" v-if="sucursal.Tareas != null" class="mb-1">
          <InfoExtra
            :accion="() => null"
            icono="person"
            titulo="Tareas"
            :valor="sucursal.Tareas.length"
          />
        </b-col>
        <b-col cols="6" v-if="sucursal.Producto_Lote != null" class="mb-1">
          <InfoExtra
            :accion="() => null"
            icono="cart3"
            titulo="Productos"
            :valor="sucursal.Producto_Lote.length"
          />
        </b-col>
      </b-row>
    </b-overlay>
  </div>
</template>

<script>
import InfoExtra from "../components/InfoExtra.vue";
import gql from "graphql-tag";
export default {
  name: "SucursalInfo",
  data() {
    return {
      consulta: gql`
        query sucursales($ID: Int!) {
          sucursal(ID: $ID) {
            Extintor {
              ID
            }
            Seguimiento {
              ID
            }
            Guardias {
              ID
            }
            Control_Llaves {
              ID
            }
            Control_Diarios {
              ID
            }
            Tareas {
              ID
            }
            Producto_Lote {
              ID
            }
          }
        }
      `,
      sucursal: null,
      load: false
    };
  },
  components: { InfoExtra },
  props: {
    id_sucursal: {
      type: Number
    }
  },
  methods: {
    async obtenerInfo() {
      this.load = true;
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            ID: this.id_sucursal
          }
        })
        .then(result => {
          this.sucursal = result.data.sucursal;
          this.load = false;
        });
    }
  },
  created() {
    this.obtenerInfo();
  }
};
</script>
