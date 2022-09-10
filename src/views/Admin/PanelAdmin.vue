<template>
  <div>
    <div v-if="permiso" class="ancho">
      <div class="ancho">
        <b-container class="bv-example-row">
          <b-row>
            <b-col cols="6">
              <b-card>
                <a-row :gutter="16">
                  <a-col :span="24">
                    <a-card>
                      <a-statistic
                        title="Servidor activo desde"
                        :value="Fecha_Inicio"
                      />
                    </a-card>
                  </a-col>
                  <a-col :span="12">
                    <a-card>
                      <a-statistic
                        title="Actividades Hoy"
                        :value="a_hoy"
                        :precision="0"
                        suffix=""
                        :value-style="{ color: '#3f8600' }"
                        style="margin-right: 50px"
                      >
                        <template #prefix>
                          <a-icon type="arrow-up" />
                        </template>
                      </a-statistic>
                    </a-card>
                  </a-col>
                  <a-col :span="12">
                    <a-card>
                      <a-statistic
                        title="Actividades Ayer"
                        :value="a_ayer"
                        :precision="0"
                        suffix=""
                        class="demo-class"
                        :value-style="{ color: '#cf1322' }"
                      >
                        <template #prefix>
                          <a-icon type="arrow-down" />
                        </template>
                      </a-statistic>
                    </a-card>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="24">
                    <a-card>
                      <LineActividad />
                    </a-card>
                  </a-col>
                </a-row>
              </b-card>
            </b-col>
            <b-col cols="6">
              <b-card>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-card>
                      <a-statistic
                        title="Usuarios Activos"
                        :value="activos"
                        style="margin-right: 50px"
                      />
                    </a-card>
                  </a-col>
                  <a-col :span="12">
                    <a-card>
                      <a-statistic
                        title="Total de Cuentas"
                        :value="t_cuentas"
                        style="margin-right: 50px"
                      />
                    </a-card>
                  </a-col>
                </a-row>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
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
import gql from "graphql-tag";
import LineActividad from "./LineActividad.vue";
export default {
  data() {
    return {
      activos: 0,
      a_ayer: 0,
      a_hoy: 0,
      total_cuenta: gql`
        query {
          total_cuentas
        }
      `,
      t_cuentas: 0,
      permiso: null,
      Fecha_Inicio: null
    };
  },
  components: { LineActividad },
  methods: {
    Saber_Activos() {
      this.$socket.emit("seccion_Admin", true);
      this.$socket.emit("Fecha_Ini", true);
    }
  },
  sockets: {
    connect(data) {
      //
    }
  },
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
          Code: "P47"
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        if (result.data.saber_permiso != null) {
          if (result.data.saber_permiso.Respuesta != null) {
            this.permiso = result.data.saber_permiso.Respuesta;
            if (this.permiso) {
              this.sockets.subscribe("ADM", data => {
                this.activos = data.cuentas;
                this.a_ayer = data.a_ayer;
                this.a_hoy = data.a_hoy;
                this.t_cuentas = data.t_cuenta;
              });
              this.sockets.subscribe("ADM_Activy_hoy", data => {
                this.a_hoy = data;
              });
              this.sockets.subscribe("Ini_Server", data => {
                if (data.fecha != null) {
                  this.Fecha_Inicio = data.fecha;
                }
              });
              this.Saber_Activos();
            }
          } else {
            this.permiso = false;
          }
        } else {
          this.permiso = false;
        }
      });
  },
  mounted() {
    /*
        this.$notification.open({
            message: 'Notification Title',
            description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
            onClick: () => {
                console.log('Notification Clicked!');
            },
            placement:'bottomRight'
        })
        */
  },
  beforeDestroy() {
    this.sockets.unsubscribe("ADM");
    this.sockets.unsubscribe("ADM_Activy_hoy");
    this.sockets.unsubscribe("Ini_Server");
  }
};
</script>
