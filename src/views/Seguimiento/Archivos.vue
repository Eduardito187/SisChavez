<template>
  <div style="width:100%;border-radius:3px;">
    <div
      style="width:100%;height:100%;background-color:black;border-radius:3px;border-width:1px;border-color:white;"
    >
      <input type="hidden" v-model="Carpeta" />
      <a-row>
        <a-col :span="9" style="aling-items:center;justify-conente:center;">
          <div class="ff">
            <div class="fff">
              <a-popconfirm
                title="Deseas copiar la direccion?"
                ok-text="Si"
                cancel-text="No"
                @confirm="copiar_CARPETA()"
                @cancel="msg_n_copy()"
              >
                <a href="#">Copiar</a>
              </a-popconfirm>
            </div>
          </div>
        </a-col>
        <a-col :span="15" style="aling-items:center;justify-conente:center;">
          <div class="ff">
            <div class="fff">
              <a-tag color="#108ee9" style="width:70px;">
                {{ c }} <a-icon type="file" />
              </a-tag>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      consulta: gql`
        query files_seg($ID: Int!) {
          files_seg(ID: $ID)
        }
      `,
      c: 0
    };
  },
  props: {
    ID: {
      type: [String, Number]
    },
    Carpeta: {
      type: String
    }
  },
  methods: {
    async obtener_data() {
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            ID: parseInt(this.ID)
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.c = result.data.files_seg;
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    msg_n_copy() {
      this.$message.warning("Copia cancelada.");
    },
    copiar_CARPETA() {
      this.$copyText(this.Carpeta).then(
        function(e) {
          this.$message.success("Direccion Copiada.");
        },
        function(e) {
          this.$message.error("Error al Copiar.");
        }
      );
    }
  },
  created() {
    this.obtener_data();
  }
};
</script>
<style>
.ff {
  height: 50px;
  position: relative;
  border-radius: 3px;
}

.fff {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 10%;
  text-align: center;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
