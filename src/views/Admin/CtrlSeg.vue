<template>
  <div id="appC">
    <a-button
      type="danger"
      style="position:absolute;left:5px;bottom:90px;z-index:1000;"
      @click="swipeLeft"
      icon="left"
    />
    <div v-if="c" class="centerC" id="content" ref="content">
      <Carta
        v-for="d in data"
        :key="d.ID"
        class="internalC"
        :data="d"
        @actualizar="actualizar_data($event, d)"
        :max="false"
        @eliminar="eliminar_elemento($event)"
      />
    </div>
    <a-button
      type="danger"
      style="position:absolute;right:5px;bottom:90px;z-index:1000;"
      @click="swipeRight"
      icon="right"
    />
  </div>
</template>
<script>
import Carta from "./../Seguimiento/Carta.vue";
import gql from "graphql-tag";
export default {
  components: { Carta },
  data() {
    return {
      c: true,
      consulta: gql`
        query seguimiento($ID: Int!) {
          seguimiento(ID: $ID) {
            ID
            Codigo
            FechaCreacion
            FechaInicio
            FechaFin
            Solicitante
            Descripcion
            Autorizacion
            Carpeta
            Conclusion
            Estado
            Creador {
              ID
              usuario
              nombre
              foto
            }
            Responsable {
              ID
              usuario
              nombre
              foto
            }
            Sucursal {
              ID
              Nombre
              CodigoSucursal
              Telefono
              Direccion
              TelfInterno
              Correo
            }
            Prioridad {
              ID
              Nombre
              Descripcion
            }
          }
        }
      `
    };
  },
  props: {
    data: {
      type: Array
    }
  },
  methods: {
    /**
     * scrollTo - Horizontal Scrolling
     * @param {(HTMLElement ref)} element - Scroll Container
     * @param {number} scrollPixels - pixel to scroll
     * @param {number} duration -  Duration of scrolling animation in millisec
     */
    scrollTo(element, scrollPixels, duration) {
      const scrollPos = element.scrollLeft;
      // Condition to check if scrolling is required
      if (
        !(
          (scrollPos === 0 || scrollPixels > 0) &&
          (element.clientWidth + scrollPos === element.scrollWidth ||
            scrollPixels < 0)
        )
      ) {
        // Get the start timestamp
        const startTime =
          "now" in window.performance
            ? performance.now()
            : new Date().getTime();

        function scroll(timestamp) {
          //Calculate the timeelapsed
          const timeElapsed = timestamp - startTime;
          //Calculate progress
          const progress = Math.min(timeElapsed / duration, 1);
          //Set the scrolleft
          element.scrollLeft = scrollPos + scrollPixels * progress;
          //Check if elapsed time is less then duration then call the requestAnimation, otherwise exit
          if (timeElapsed < duration) {
            //Request for animation
            window.requestAnimationFrame(scroll);
          } else {
            return;
          }
        }
        //Call requestAnimationFrame on scroll function first time
        window.requestAnimationFrame(scroll);
      }
    },
    swipeLeft() {
      const content = this.$refs.content;
      this.scrollTo(content, -300, 800);
    },
    swipeRight() {
      const content = this.$refs.content;
      this.scrollTo(content, 300, 800);
    },
    actualizar_data(a, f) {
      if (a != null) {
        if (a) {
          this.c = false;
          this.obtenerData(f);
        }
      }
    },
    eliminar_elemento(id){
      for (let index = 0; index < this.data.length; index++) {
        if (id==this.data[index]["ID"]) {
          this.data.splice(index,1);
        }
      }
    },
    async obtenerData(f) {
      await this.$apollo
        .query({
          query: this.consulta,
          variables: {
            ID: f.ID
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          let x = result.data.seguimiento;
          this.$socket.emit("Sumar_Linea", true);
          for (let index = 0; index < this.data.length; index++) {
            if (this.data[index]["ID"] == f.ID) {
              this.data[index] = x;
            }
          }
          this.c = true;
        });
    }
  }
};
</script>
<style scoped>
#appC {
  text-align: center;
}

.internalC {
  width: 50%;
  height: 100%;
  display: inline-block;
  white-space: normal;
  text-align: left;
}

.centerC {
  float: left;
  width: 100%;
  height: 315px;
  margin: 1px;
  overflow: hidden;
  white-space: nowrap;
}
</style>
