<template>
  <div>
    <a-table
      v-if="permiso"
      :data-source="data"
      :columns="columns"
      :scroll="{ y: 340 }"
      :pagination="false"
      bordered
    >
      <div
        slot="filterDropdown"
        slot-scope="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column
        }"
        style="padding: 8px"
      >
        <a-input
          v-ant-ref="c => (searchInput = c)"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block;"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="
            () => handleSearch(selectedKeys, confirm, column.dataIndex)
          "
        />
        <a-button
          type="primary"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          Buscar
        </a-button>
        <a-button
          size="small"
          style="width: 90px"
          @click="() => handleReset(clearFilters)"
        >
          Reiniciar
        </a-button>
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="customRender" slot-scope="text, record, index, column">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
              >{{ fragment }}</mark
            >
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </a-table>
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
import ProgresoDiario from "./ProgresoDiario.vue";
export default {
  components: { ProgresoDiario },
  data() {
    return {
      data: [],
      searchText: "",
      searchInput: null,
      permiso: null,
      searchedColumn: "",
      columns: [
        {
          title: "Calculo",
          dataIndex: "Calculo",
          key: "Calculo",
          customRender: (text, row, index) => {
            let i = parseInt(text);
            if (i == 0) {
              return <a-tag color="black">Puntual</a-tag>;
            } else {
              return <a-tag color="#108ee9">{text} min</a-tag>;
            }
          }
        },
        {
          title: "Tiempo",
          dataIndex: "Tiempo",
          key: "Tiempo.ID",
          customRender: (text, row, index) => {
            return (
              <a-tag color="#f50">
                {text.Ingreso} / {text.Salida}
              </a-tag>
            );
          }
        },
        {
          title: "Progreso",
          dataIndex: "ID",
          key: 'ID+"p"',
          customRender: (text, row, index) => {
            return <ProgresoDiario data={text} todo={this.data} />;
          }
        },
        {
          title: "Fecha",
          dataIndex: "Fecha",
          key: "Fecha",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender"
          },
          onFilter: (value, record) =>
            record.Fecha.toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        },
        {
          title: "Empresa",
          dataIndex: "Empresa.Nombre",
          key: "Empresa.ID",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender"
          },
          onFilter: (value, record) =>
            record.Empresa.Nombre.toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        },
        {
          title: "Sucursal",
          dataIndex: "Sucursal.Nombre",
          key: "Sucursal.ID",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender"
          },
          onFilter: (value, record) =>
            record.Sucursal.Nombre.toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        },
        {
          title: "Guardia",
          dataIndex: "Guardia.Nombre",
          key: "Guardia.ID",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender"
          },
          onFilter: (value, record) =>
            record.Guardia.Nombre.toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        }
      ],
      control_diarios: gql`
        query control_diarios {
          control_diarios {
            ID
            Calculo
            Observacion
            Fecha
            Empresa {
              ID
              Nombre
              Telefono
              Direccion
              Correo
              Supervisores
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
            Guardia {
              ID
              Nombre
              Telefono
              Precio
            }
            Tiempo {
              ID
              Ingreso
              Salida
            }
          }
        }
      `
    };
  },
  methods: {
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
    async carga_data() {
      await this.$apollo
        .query({
          query: this.control_diarios,
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.control_diarios;
          this.$socket.emit("Sumar_Linea", true);
        });
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
          Code: "P34"
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        if (result.data.saber_permiso != null) {
          if (result.data.saber_permiso.Respuesta != null) {
            this.permiso = result.data.saber_permiso.Respuesta;
            if (this.permiso) {
              this.carga_data();
            }
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
<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
