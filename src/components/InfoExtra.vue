<template>
  <div class="InfoExtra">
    <b-card no-body class="overflow-hidden" style="max-width: 540px;">
      <b-row no-gutters @click="accion_click()">
        <b-col md="3" class="pointer">
          <div class="vertical-center centro">
            <b-icon
              :icon="icono"
              variant="success"
              font-scale="5"
              class="rounded-circle p-2"
            ></b-icon>
          </div>
        </b-col>
        <b-col md="9" class="pointer">
          <b-card border-variant="success" :header="titulo" align="center">
            <b-card-text>{{ valor }}</b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: "InfoExtra",
  data() {
    return {};
  },
  props: {
    id_sucursal: {
      type: Number
    },
    icono: {
      type: String
    },
    titulo: {
      type: String
    },
    valor: {
      type: Number
    },
    accion: {
      type: Function
    }
  },
  methods: {
    accion_click() {
      if (this.valor > 0) {
        if (this.accion != null) {
          this.accion();
        }
      }
    }
  }
};
</script>
