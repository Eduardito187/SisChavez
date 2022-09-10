<template>
  <div>
    <a-timeline>
      <a-timeline-item v-if="true==false" color="green">
        <b v-if="tipo == 'Tarea'">Solicitante</b>
        <b v-if="tipo == 'Seguimiento'">Creador</b>
        <a-card-meta v-if="a != null" :title="a.nombre" :description="''">
          <a-avatar slot="avatar" :src="a.foto" />
        </a-card-meta>
      </a-timeline-item>
      <a-timeline-item color="red">
        <b>Responsable</b>
        <a-card-meta v-if="b != null" :title="b.nombre" :description="''">
          <a-avatar slot="avatar" :src="b.foto" />
        </a-card-meta>
        <a-button v-else-if="b == null && tipo == 'Tarea'" @click="asignarme_tarea">Responsabilizarme</a-button>
        <a-modal
          v-model="visible"
          :footer="null"
          title="Asignacion de Responsable"
          @ok="handleOk"
        >
          <a-steps :current="current">
            <a-step
              v-for="item in steps"
              :key="item.title"
              :title="item.title"
            />
          </a-steps>
          <div class="steps-content" style="padding:5px;">
            <SeleccionP v-show="current == 0" @Valor="Per_ID = $event" />
            <div v-show="current == 1" class="ancho" style="padding:20px;">
              Una ves se finalice esta accion se le asignara la tarea a la
              persona seleccionada.
            </div>
          </div>
          <div class="steps-action">
            <a-button
              v-if="current < steps.length - 1"
              type="primary"
              @click="next"
            >
              Siguiente
            </a-button>
            <a-button
              v-if="current == steps.length - 1 && Per_ID != null"
              type="primary"
              @click="handleOk"
            >
              Finalizar
            </a-button>
            <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
              Anterior
            </a-button>
          </div>
        </a-modal>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>
<script>
import gql from "graphql-tag";
import SeleccionP from "./SeleccionP.vue";
export default {
  data() {
    return {
      visible: false,
      current: 0,
      mi_id:parseInt(localStorage.id_cuenta),
      steps: [
        {
          title: "Seleccion de Persona"
        },
        {
          title: "Asignacion de Tarea"
        }
      ],
      Per_ID: null,
      addResponsableTarea: gql`
        mutation addResponsableTarea($ID: Int!, $Responsable: Int!) {
          addResponsableTarea(ID: $ID, Responsable: $Responsable) {
            Respuesta
          }
        }
      `
    };
  },
  components: { SeleccionP },
  props: {
    a: {
      type: Object
    },
    b: {
      type: Object
    },
    ID: {
      type: [String, Number]
    },
    tipo: {
      type: String
    }
  },
  methods: {
    async asignarme_tarea(){
      this.visible = false;
      this.$message.info("Se esta procesando la accion.");
      await this.$apollo
        .mutate({
          mutation: this.addResponsableTarea,
          variables: {
            ID: parseInt(this.ID),
            Responsable: parseInt(this.mi_id)
          }
        })
        .then(result => {
          if (result.data.addResponsableTarea.Respuesta) {
            this.$message.success("Tarea asignada exitosamente.");
            this.$emit('actualizar',true);
          }
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    showModal() {
      this.visible = true;
    },
    async handleOk() {
      this.visible = false;
      this.$message.info("Se esta procesando la accion.");
      await this.$apollo
        .mutate({
          mutation: this.addResponsableTarea,
          variables: {
            ID: parseInt(this.ID),
            Responsable: parseInt(this.Per_ID)
          }
        })
        .then(result => {
          if (result.data.addResponsableTarea.Respuesta) {
            this.$message.success("Tarea asignada exitosamente.");
            this.$emit('actualizar',true);
          }
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    next() {
      this.current++;
    },
    prev() {
      this.current--;
    }
  },
  created(){
    this.mi_id=parseInt(localStorage.id_cuenta);
  }
};
</script>
