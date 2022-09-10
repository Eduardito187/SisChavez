<template>
  <div class="vue-tempalte">
    <b-card bg-variant="light">
      <b-form-group
        label-cols-lg="12"
        label-size="lg"
        label-class="font-weight-bold pt-0"
        class="mb-0 col-md-12"
      >
        <div class="d-flex justify-content-between">
          <b-form-group
            class="col-md-12"
            label="Persona:"
            label-for="Persona"
            label-cols-sm="12"
            label-align-sm="right"
          >
            <ComboNombre tipo="cuentas" @change="$emit('Valor', $event)" />
          </b-form-group>
        </div>
      </b-form-group>
    </b-card>
  </div>
</template>
<script>
import ComboNombre from "../../components/ComboNombre.vue";
export default {
  data() {
    return {
      Persona: null,
      validacionR: false
    };
  },
  components: { ComboNombre },
  methods: {
    async registrar() {}
  },
  mounted() {}
};
</script>
