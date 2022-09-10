<template>
  <div
    class="CartaSucursal"
    style="display:inline-block;margin:1%;"
    :style="{ width: max ? '100%' : '31%' }"
  >
    <div @click="verInfo()" class="tarjeta">
      <b-card :title="sucursal.Nombre" :sub-title="sucursal.CodigoSucursal">
        <b-card-text>{{ sucursal.Direccion }}</b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: "CartaSucursal",
  data() {
    return {};
  },
  props: {
    sucursal: {
      type: Object
    },
    max: {
      type: Boolean
    }
  },
  methods: {
    verInfo() {
      this.$emit("evento_info", this.sucursal);
    }
  }
};
</script>
