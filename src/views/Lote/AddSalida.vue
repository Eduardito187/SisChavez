<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="columna d-flex justify-content-center">
        <div class="col-md-6">
          <div class="vue-tempalte">
            <b-card bg-variant="light">
              <b-overlay :show="validacionR" rounded="sm">
                <b-form-group label-cols-lg="12" label="Sacar Producto" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group class="col-md-5" label="Lote:" label-for="Lote" label-cols-sm="12" label-align-sm="right" >
                      <ComboNombre tipo="lotes" @change="Lote = $event" />
                    </b-form-group>
                    <b-form-group class="col-md-5" label="Producto:" label-for="Producto" label-cols-sm="12" label-align-sm="right" >
                      <ComboProducto :Lote="Lote" @change="Producto = $event" @cantidad="L_Cantidad = $event" />
                    </b-form-group>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <b-form-group class="col-md-5" label="Sucursal:" label-for="Sucursal" label-cols-sm="12" label-align-sm="right" >
                      <ComboNombre tipo="sucursales" @change="Sucursal = $event" />
                    </b-form-group>
                    <b-form-group class="col-md-5" label="Cantidad:" label-for="Cantidad" label-cols-sm="12" label-align-sm="right" >
                      <a-input-number id="Cantidad" v-model="Cantidad" :min="1" :max="L_Cantidad" />
                    </b-form-group>
                  </div>
                  <Button @click="registrar()" type="primary" :loading="validacionR" icon="check">Registrar Salida</Button>
                </b-form-group>
              </b-overlay>
            </b-card>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="permiso == false" class="ancho">
      <div class="columna d-flex justify-content-center">
        <div class="col-md-6">
          <div class="vue-tempalte">
            <b-card bg-variant="light">
              <a-result
                status="403"
                title="403"
                sub-title="Usted no tiene permiso para esta seccion."
              />
            </b-card>
          </div>
        </div>
      </div>
    </div>
    <a-spin v-else size="large" />
  </div>
</template>
<script>
import ComboProducto from "./ComboProducto.vue";
import ComboNombre from "../../components/ComboNombre.vue";
import gql from "graphql-tag";
import { Button } from "ant-design-vue";
export default {
  data() {
    return {
        validacionR: false,
        Lote:null,
        Producto:null,
        Sucursal:null,
        Cantidad:1,
        L_Cantidad:0,
        permiso: null
    };
  },
  components: { ComboNombre, Button, ComboProducto },
  methods: {
    async registrar() {
      const add = gql`
        mutation SalidaProducto(
          $Lote: Int!
          $Producto: Int!
          $Responsable: Int!
          $Sucursal: Int!
          $Cantidad: Int!
        ) {
          SalidaProducto(
            Lote: $Lote
            Producto: $Producto
            Responsable: $Responsable
            Sucursal: $Sucursal
            Cantidad: $Cantidad
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
            Lote:parseInt(this.Lote),
            Producto:parseInt(this.Producto),
            Responsable:parseInt(localStorage.id_cuenta),
            Sucursal:parseInt(this.Sucursal),
            Cantidad:parseInt(this.Cantidad)
          }
        })
        .then(result => {
            this.$socket.emit("Sumar_Linea", true);
            if (result.data.SalidaProducto.Respuesta) {
                this.validacionR = false;
                this.Lote=null;
                this.Producto=null;
                this.Sucursal=null;
                this.Cantidad=0;
                this.$notification.open({
                    message: 'Almacen',
                    description:'Proceso Finalizado.',
                    onClick: () => {
                        console.log('Notification Clicked!');
                    },
                    placement:'bottomRight'
                })
            }else{
                this.$notification.open({
                    message: 'Almacen',
                    description:'Producto Agotado.',
                    onClick: () => {
                        console.log('Notification Clicked!');
                    },
                    placement:'bottomRight'
                });
            }
        });
    }
  },
  mounted() {},
  async created() {
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
          Code: "P17"
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
