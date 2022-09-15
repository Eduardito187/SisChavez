<template>
  <div class="MiPerfil columna">
    <div class="col-md-12" style="margin-top:60px;">
      <div class="columna">
        <div style="background-color:white;padding:10px;border-radius:3px;">
          <b-card bg-variant="light">
            <b-overlay :show="validacionR" rounded="sm">
              <b-form-group label-cols-lg="12">
                <div class="d-flex justify-content-between">
                  <div class="col-md-3" style="height:auto;padding:5px;">
                    <a-card hoverable style="width: 100%;">
                      <img slot="cover" alt="example" :src="data.foto" />
                      <a-card-meta title="Editar Foto">
                        <template slot="description">
                          <a-upload-dragger
                            name="file"
                            :multiple="false"
                            :action="
                              url_api+'upload.php?ID=' +
                                id_yo
                            "
                            @change="handleChange"
                          >
                            <p class="ant-upload-drag-icon">
                              <a-icon type="arrow-up" />
                            </p>
                            <p class="ant-upload-text">
                              Seleccione la foto que desea subir.
                            </p>
                            <p class="ant-upload-hint">
                              Esta foto actualizara la foto actual de perfil.
                            </p>
                          </a-upload-dragger>
                        </template>
                      </a-card-meta>
                    </a-card>
                  </div>
                  <div class="col-md-9" style="height:auto;padding:10px;">
                    <div class="d-flex justify-content-between">
                      <b-form-group
                        class="col-md-6"
                        style="padding:5px;"
                        label="Usuario:"
                        label-for="Usuario"
                        label-cols-sm="12"
                        label-align-sm="right"
                      >
                        <a-input-search
                          v-model="usuario"
                          placeholder="Usuario"
                          @search="update_usuario"
                        >
                          <a-button icon="cheack" slot="enterButton">
                            Actualizar
                          </a-button>
                        </a-input-search>
                      </b-form-group>
                      <b-form-group
                        class="col-md-6"
                        style="padding:5px;"
                        label="Nombre:"
                        label-for="Nombre"
                        label-cols-sm="12"
                        label-align-sm="right"
                      >
                        <a-input-search
                          v-model="nombre"
                          placeholder="Nombre"
                          @search="update_nombre"
                        >
                          <a-button icon="cheack" slot="enterButton">
                            Actualizar
                          </a-button>
                        </a-input-search>
                      </b-form-group>
                    </div>
                    <div class="d-flex justify-content-between">
                      <b-form-group
                        class="col-md-4"
                        style="padding:5px;"
                        label="Contraseña:"
                        label-for="Contraseña"
                        label-cols-sm="12"
                        label-align-sm="right"
                      >
                        <b-button @click="update_pwd()" pill variant="primary"
                          ><small>Cambiar</small></b-button
                        >
                      </b-form-group>
                    </div>
                  </div>
                </div>
              </b-form-group>
            </b-overlay>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
import gql from "graphql-tag";
import {URL_APICHAVEZ} from "./../Config/Configuracion"
export default {
  name: "MiPerfil",
  data() {
    return {
      url_api:URL_APICHAVEZ,
      validacionR: false,
      data: [],
      id_yo: "",
      contra: "",
      usuario: "",
      nombre: "",
      consulta: gql`
        query cuenta($ID: String!) {
          cuenta(ID: $ID) {
            ID
            usuario
            nombre
            foto
          }
        }
      `
    };
  },
  methods: {
    async update_usuario() {
      if (this.usuario.length > 2) {
        await this.$apollo
          .mutate({
            mutation: gql`
              mutation editCuenta($ID: Int!, $usuario: String) {
                editCuenta(ID: $ID, usuario: $usuario) {
                  Respuesta
                }
              }
            `,
            variables: {
              ID: parseInt(localStorage.id_cuenta),
              usuario: this.usuario
            }
          })
          .then(result => {
            if (result.data.editCuenta != null) {
              if (
                result.data.editCuenta.Respuesta != null &&
                result.data.editCuenta.Respuesta
              ) {
                this.data.usuario = this.usuario;
                this.$notification.open({
                  message: this.data.nombre,
                  description: "Usuario actualizado.",
                  onClick: () => {
                    console.log("Notification Clicked!");
                  },
                  placement: "bottomRight"
                });
                this.consulta_get_data();
              }
              this.$socket.emit("Sumar_Linea", true);
            }
          });
      }
    },
    async update_nombre() {
      if (this.nombre.length > 4) {
        await this.$apollo
          .mutate({
            mutation: gql`
              mutation editCuenta($ID: Int!, $nombre: String) {
                editCuenta(ID: $ID, nombre: $nombre) {
                  Respuesta
                }
              }
            `,
            variables: {
              ID: parseInt(localStorage.id_cuenta),
              nombre: this.nombre
            }
          })
          .then(result => {
            if (result.data.editCuenta != null) {
              if (
                result.data.editCuenta.Respuesta != null &&
                result.data.editCuenta.Respuesta
              ) {
                this.data.nombre = this.nombre;
                this.$notification.open({
                  message: this.data.nombre,
                  description: "Nombre actualizado.",
                  onClick: () => {
                    console.log("Notification Clicked!");
                  },
                  placement: "bottomRight"
                });
                this.consulta_get_data();
              }
              this.$socket.emit("Sumar_Linea", true);
            }
          });
      }
    },
    handleChange(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        this.consulta_get_data();
        this.$notification.open({
          message: this.data.nombre,
          description: "Foto actualizada.",
          onClick: () => {
            console.log("Notification Clicked!");
          },
          placement: "bottomRight"
        });
      } else if (status === "error") {
        this.$notification.open({
          message: this.data.nombre,
          description: "Error al actualizar foto.",
          onClick: () => {
            console.log("Notification Clicked!");
          },
          placement: "bottomRight"
        });
      }
    },
    async consulta_get_data() {
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            ID: localStorage.id_cuenta
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.cuenta;
          this.$socket.emit("Sumar_Linea", true);
          if (this.data.usuario != null && this.data.nombre != null) {
            this.usuario = this.data.usuario;
            this.nombre = this.data.nombre;
          }
        });
    },
    async update_pwd() {
      var a = prompt("Nueva Contraseña", "");
      if (a != null) {
        await this.$apollo
          .mutate({
            mutation: gql`
              mutation SetPWD($ID: Int!, $contra: String) {
                SetPWD(ID: $ID, contra: $contra) {
                  Respuesta
                }
              }
            `,
            variables: {
              ID: parseInt(localStorage.id_cuenta),
              contra: a
            }
          })
          .then(result => {
            if (result.data.SetPWD != null) {
              if (
                result.data.SetPWD.Respuesta != null &&
                result.data.SetPWD.Respuesta
              ) {
                this.$notification.open({
                  message: this.data.nombre,
                  description: "Contraseña actualizada.",
                  onClick: () => {
                    console.log("Notification Clicked!");
                  },
                  placement: "bottomRight"
                });
              }
              this.$socket.emit("Sumar_Linea", true);
            }
          });
      }
    }
  },
  created() {
    document.title = "Chavez | Mi Perfil";
    if (localStorage.id_cuenta == null) {
      this.$router.push("/");
    } else {
      this.id_yo = localStorage.id_cuenta;
      this.consulta_get_data();
    }
  },
  mounted() {}
};
</script>
