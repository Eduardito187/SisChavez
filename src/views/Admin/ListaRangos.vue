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

    <a-modal v-model="visible" title="Permisos" :footer="null" @ok="handleOk">
      <a-tree-select
        class="mb-2"
        v-model="value"
        style="width: 100%"
        :tree-data="combo_p"
        tree-checkable
        search-placeholder="Seleccionar"
      />
      <b-button @click="permisos_db()" pill variant="primary">Actualizar Permisos</b-button>
    </a-modal>
  </div>
</template>
<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      data: [],
      visible: false,
      value: [],
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      permiso: null,
      p_adm: false,
      RangoID: 0,
      columns: [
        {
          title: "ID",
          dataIndex: "ID",
          key: "ID",
          customRender: (text, row, index) => {
            return (
              <a-tag color="#f50" style="padding:4px;">
                {text}
              </a-tag>
            );
          }
        },
        {
          title: "Nombre",
          dataIndex: "Nombre",
          key: "Nombre",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender"
          },
          onFilter: (value, record) =>
            record.Nombre.toString()
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
          title: "Permisos",
          dataIndex: "ID",
          key: 'ID+"per"',
          customRender: (text, row, index) => {
            if (this.p_adm) {
              return (
                <b onClick={() => this.permisos_rango(text)}>
                  <a-tag color="#f50" style="padding:4px;cursor:pointer;">
                    <a-icon type="box-plot" />
                  </a-tag>
                </b>
              );
            } else {
              return <b>Sin Permiso</b>;
            }
          }
        }
      ],
      combo_p: [
        {
          title: "Control de LLaves",
          value: "0-0",
          key: "0-0",
          children: [
            {
              title: "Listar Control de LLaves",
              value: "P1",
              key: "P1"
            },
            {
              title: "Crear Control de LLaves",
              value: "P2",
              key: "P2"
            },
            {
              title: "Editar Control de LLaves",
              value: "P3",
              key: "P3"
            }
          ]
        },
        {
          title: "Sucursales",
          value: "0-1",
          key: "0-1",
          children: [
            {
              title: "Listar Sucursales",
              value: "P4",
              key: "P4"
            },
            {
              title: "Crear Sucursales",
              value: "P5",
              key: "P5"
            },
            {
              title: "Editar Sucursales",
              value: "P6",
              key: "P6"
            }
          ]
        },
        {
          title: "Seguimientos",
          value: "0-2",
          key: "0-2",
          children: [
            {
              title: "Listar Seguimientos",
              value: "P7",
              key: "P7"
            },
            {
              title: "Crear Seguimientos",
              value: "P8",
              key: "P8"
            },
            {
              title: "Editar Seguimientos",
              value: "P9",
              key: "P9"
            },
            {
              title: "Eliminar Seguimientos",
              value: "P59",
              key: "P59"
            },
            {
              title: "Crear Instantaneos",
              value: "P61",
              key: "P61"
            }
          ]
        },
        {
          title: "Lotes",
          value: "0-3",
          key: "0-3",
          children: [
            {
              title: "Listar Lotes",
              value: "P10",
              key: "P10"
            },
            {
              title: "Crear Lotes",
              value: "P11",
              key: "P11"
            },
            {
              title: "Editar Lotes",
              value: "P12",
              key: "P12"
            }
          ]
        },
        {
          title: "Productos",
          value: "0-4",
          key: "0-4",
          children: [
            {
              title: "Listar Productos",
              value: "P13",
              key: "P13"
            },
            {
              title: "Crear Productos",
              value: "P14",
              key: "P14"
            },
            {
              title: "Editar Productos",
              value: "P15",
              key: "P15"
            }
          ]
        },
        {
          title: "Salida de Producto",
          value: "0-5",
          key: "0-5",
          children: [
            {
              title: "Listar Salida de Producto",
              value: "P16",
              key: "P16"
            },
            {
              title: "Crear Salida de Producto",
              value: "P17",
              key: "P17"
            },
            {
              title: "Editar Salida de Producto",
              value: "P18",
              key: "P18"
            }
          ]
        },
        {
          title: "Extintores",
          value: "0-6",
          key: "0-6",
          children: [
            {
              title: "Listar Extintores",
              value: "P19",
              key: "P19"
            },
            {
              title: "Crear Extintores",
              value: "P20",
              key: "P20"
            },
            {
              title: "Editar Extintores",
              value: "P21",
              key: "P21"
            },
            {
              title: "Notificar Recargo",
              value: "P58",
              key: "P58"
            }
          ]
        },
        {
          title: "Proveedores",
          value: "0-7",
          key: "0-7",
          children: [
            {
              title: "Listar Proveedores",
              value: "P22",
              key: "P22"
            },
            {
              title: "Crear Proveedores",
              value: "P23",
              key: "P23"
            },
            {
              title: "Editar Proveedores",
              value: "P24",
              key: "P24"
            }
          ]
        },
        {
          title: "Recepcion",
          value: "0-8",
          key: "0-8",
          children: [
            {
              title: "Listar Recepcion",
              value: "P25",
              key: "P25"
            },
            {
              title: "Crear Recepcion",
              value: "P26",
              key: "P26"
            },
            {
              title: "Editar Recepcion",
              value: "P27",
              key: "P27"
            }
          ]
        },
        {
          title: "Empresa de Seguridad",
          value: "0-10",
          key: "0-10",
          children: [
            {
              title: "Listar Empresa de Seguridad",
              value: "P28",
              key: "P28"
            },
            {
              title: "Crear Empresa de Seguridad",
              value: "P29",
              key: "P29"
            },
            {
              title: "Editar Empresa de Seguridad",
              value: "P30",
              key: "P30"
            }
          ]
        },
        {
          title: "Guardias",
          value: "0-11",
          key: "0-11",
          children: [
            {
              title: "Listar Guardias",
              value: "P31",
              key: "P31"
            },
            {
              title: "Crear Guardias",
              value: "P32",
              key: "P32"
            },
            {
              title: "Editar Guardias",
              value: "P33",
              key: "P33"
            }
          ]
        },
        {
          title: "Control Diario",
          value: "0-12",
          key: "0-12",
          children: [
            {
              title: "Listar Control Diario",
              value: "P34",
              key: "P34"
            },
            {
              title: "Crear Control Diario",
              value: "P35",
              key: "P35"
            },
            {
              title: "Editar Control Diario",
              value: "P36",
              key: "P36"
            }
          ]
        },
        {
          title: "Tareas",
          value: "0-13",
          key: "0-13",
          children: [
            {
              title: "Listar Tareas",
              value: "P37",
              key: "P37"
            },
            {
              title: "Crear Tareas",
              value: "P38",
              key: "P38"
            },
            {
              title: "Editar Tareas",
              value: "P39",
              key: "P39"
            },
            {
              title: "Eliminar Tareas",
              value: "P60",
              key: "P60"
            }
          ]
        },
        {
          title: "Admin",
          value: "0-14",
          key: "0-14",
          children: [
            {
              title: "Cuentas Admin",
              value: "0-14-1",
              key: "0-14-1",
              children: [
                {
                  title: "Listar Cuentas",
                  value: "P40",
                  key: "P40"
                },
                {
                  title: "Crear Cuentas",
                  value: "P41",
                  key: "P41"
                },
                {
                  title: "Editar Cuentas",
                  value: "P42",
                  key: "P42"
                }
              ]
            },
            {
              title: "Rango Admin",
              value: "0-14-2",
              key: "0-14-2",
              children: [
                {
                  title: "Listar Rangos",
                  value: "P43",
                  key: "P43"
                },
                {
                  title: "Crear Rangos",
                  value: "P44",
                  key: "P44"
                },
                {
                  title: "Editar Rangos",
                  value: "P45",
                  key: "P45"
                }
              ]
            },
            {
              title: "Permisos Admin",
              value: "P46",
              key: "P46"
            },
            {
              title: "Panel Admin",
              value: "P47",
              key: "P47"
            }
          ]
        },
        {
          title: "Control de Discos",
          value: "0-15",
          key: "0-15",
          children: [
            {
              title: "Listar Control de Discos",
              value: "P48",
              key: "P48"
            },
            {
              title: "Crear Control de Discos",
              value: "P49",
              key: "P49"
            },
            {
              title: "Editar Control de Discos",
              value: "P50",
              key: "P50"
            }
          ]
        },
        {
          title: "Trabajadores",
          value: "0-16",
          key: "0-16",
          children: [
            {
              title: "Listar Trabajadores",
              value: "P51",
              key: "P51"
            },
            {
              title: "Crear Trabajadores",
              value: "P52",
              key: "P52"
            },
            {
              title: "Editar Trabajadores",
              value: "P53",
              key: "P53"
            }
          ]
        },
        {
          title: "Asistencia",
          value: "0-17",
          key: "0-17",
          children: [
            {
              title: "Listar Asistencia",
              value: "P54",
              key: "P54"
            },
            {
              title: "Crear Asistencia",
              value: "P55",
              key: "P55"
            },
            {
              title: "Editar Asistencia",
              value: "P56",
              key: "P56"
            }
          ]
        },
        {
          title: "Discos",
          value: "0-18",
          key: "0-18",
          children: [
            {
              title: "Control de Discos",
              value: "P57",
              key: "P57"
            }
          ]
        }
      ],
      rangos: gql`
        query rangos {
          rangos {
            ID
            Nombre
            Permisos {
              ID
              P1
              P2
              P3
              P4
              P5
              P6
              P7
              P8
              P9
              P10
              P11
              P12
              P13
              P14
              P15
              P16
              P17
              P18
              P19
              P20
              P21
              P22
              P23
              P24
              P25
              P26
              P27
              P28
              P29
              P30
              P31
              P32
              P33
              P34
              P35
              P36
              P37
              P38
              P39
              P40
              P41
              P42
              P43
              P44
              P45
              P46
              P47
              P48
              P49
              P50
              P51
              P52
              P53
              P54
              P55
              P56
              P57
              P58
              P59
              P60
              P61
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
    permisos_rango(a) {
      this.RangoID = parseInt(a);
      this.value = [];
      for (let index = 0; index < this.data.length; index++) {
        if (this.data[index]["ID"] == a) {
          if (this.data[index]["Permisos"] != null) {
            let x = 0;
            for (let j = 0; j < 61; j++) {
              x = j + 1;
              if (this.data[index]["Permisos"]["P" + x.toString()] != null) {
                if (this.data[index]["Permisos"]["P" + x.toString()] == true) {
                  this.value.push("P" + x.toString());
                }
              }
            }
          }
          index = this.data.length;
          this.showModal();
        }
      }
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
    existe_Permiso(a) {
      let n = 0;
      for (let index = 0; index < this.value.length; index++) {
        if (this.value[index] == a) {
          n = 1;
          index = this.value.length;
        }
      }
      return n;
    },
    async permisos_db() {
      let mutate = gql`
        mutation PermisosUpdate(
          $ID: Int!
          $P1: Int
          $P2: Int
          $P3: Int
          $P4: Int
          $P5: Int
          $P6: Int
          $P7: Int
          $P8: Int
          $P9: Int
          $P10: Int
          $P11: Int
          $P12: Int
          $P13: Int
          $P14: Int
          $P15: Int
          $P16: Int
          $P17: Int
          $P18: Int
          $P19: Int
          $P20: Int
          $P21: Int
          $P22: Int
          $P23: Int
          $P24: Int
          $P25: Int
          $P26: Int
          $P27: Int
          $P28: Int
          $P29: Int
          $P30: Int
          $P31: Int
          $P32: Int
          $P33: Int
          $P34: Int
          $P35: Int
          $P36: Int
          $P37: Int
          $P38: Int
          $P39: Int
          $P40: Int
          $P41: Int
          $P42: Int
          $P43: Int
          $P44: Int
          $P45: Int
          $P46: Int
          $P47: Int
          $P48: Int
          $P49: Int
          $P50: Int
          $P51: Int
          $P52: Int
          $P53: Int
          $P54: Int
          $P55: Int
          $P56: Int
          $P57: Int
          $P58: Int
          $P59: Int
          $P60: Int
          $P61: Int
        ) {
          PermisosUpdate(
            ID: $ID
            P1: $P1
            P2: $P2
            P3: $P3
            P4: $P4
            P5: $P5
            P6: $P6
            P7: $P7
            P8: $P8
            P9: $P9
            P10: $P10
            P11: $P11
            P12: $P12
            P13: $P13
            P14: $P14
            P15: $P15
            P16: $P16
            P17: $P17
            P18: $P18
            P19: $P19
            P20: $P20
            P21: $P21
            P22: $P22
            P23: $P23
            P24: $P24
            P25: $P25
            P26: $P26
            P27: $P27
            P28: $P28
            P29: $P29
            P30: $P30
            P31: $P31
            P32: $P32
            P33: $P33
            P34: $P34
            P35: $P35
            P36: $P36
            P37: $P37
            P38: $P38
            P39: $P39
            P40: $P40
            P41: $P41
            P42: $P42
            P43: $P43
            P44: $P44
            P45: $P45
            P46: $P46
            P47: $P47
            P48: $P48
            P49: $P49
            P50: $P50
            P51: $P51
            P52: $P52
            P53: $P53
            P54: $P54
            P55: $P55
            P56: $P56
            P57: $P57
            P58: $P58
            P59: $P59
            P60: $P60
            P61: $P61
          ) {
            Respuesta
          }
        }
      `;
      await this.$apollo
        .mutate({
          mutation: mutate,
          variables: {
            ID: this.RangoID,
            P1: this.existe_Permiso("P1"),
            P2: this.existe_Permiso("P2"),
            P3: this.existe_Permiso("P3"),
            P4: this.existe_Permiso("P4"),
            P5: this.existe_Permiso("P5"),
            P6: this.existe_Permiso("P6"),
            P7: this.existe_Permiso("P7"),
            P8: this.existe_Permiso("P8"),
            P9: this.existe_Permiso("P9"),
            P10: this.existe_Permiso("P10"),
            P11: this.existe_Permiso("P11"),
            P12: this.existe_Permiso("P12"),
            P13: this.existe_Permiso("P13"),
            P14: this.existe_Permiso("P14"),
            P15: this.existe_Permiso("P15"),
            P16: this.existe_Permiso("P16"),
            P17: this.existe_Permiso("P17"),
            P18: this.existe_Permiso("P18"),
            P19: this.existe_Permiso("P19"),
            P20: this.existe_Permiso("P20"),
            P21: this.existe_Permiso("P21"),
            P22: this.existe_Permiso("P22"),
            P23: this.existe_Permiso("P23"),
            P24: this.existe_Permiso("P24"),
            P25: this.existe_Permiso("P25"),
            P26: this.existe_Permiso("P26"),
            P27: this.existe_Permiso("P27"),
            P28: this.existe_Permiso("P28"),
            P29: this.existe_Permiso("P29"),
            P30: this.existe_Permiso("P30"),
            P31: this.existe_Permiso("P31"),
            P32: this.existe_Permiso("P32"),
            P33: this.existe_Permiso("P33"),
            P34: this.existe_Permiso("P34"),
            P35: this.existe_Permiso("P35"),
            P36: this.existe_Permiso("P36"),
            P37: this.existe_Permiso("P37"),
            P38: this.existe_Permiso("P38"),
            P39: this.existe_Permiso("P39"),
            P40: this.existe_Permiso("P40"),
            P41: this.existe_Permiso("P41"),
            P42: this.existe_Permiso("P42"),
            P43: this.existe_Permiso("P43"),
            P44: this.existe_Permiso("P44"),
            P45: this.existe_Permiso("P45"),
            P46: this.existe_Permiso("P46"),
            P47: this.existe_Permiso("P47"),
            P48: this.existe_Permiso("P48"),
            P49: this.existe_Permiso("P49"),
            P50: this.existe_Permiso("P50"),
            P51: this.existe_Permiso("P51"),
            P52: this.existe_Permiso("P52"),
            P53: this.existe_Permiso("P53"),
            P54: this.existe_Permiso("P54"),
            P55: this.existe_Permiso("P55"),
            P56: this.existe_Permiso("P56"),
            P57: this.existe_Permiso("P57"),
            P58: this.existe_Permiso("P58"),
            P59: this.existe_Permiso("P59"),
            P60: this.existe_Permiso("P60"),
            P61: this.existe_Permiso("P61")
          }
        })
        .then(result => {
          if (result.data.PermisosUpdate.Respuesta != null) {
            this.$notification.open({
              message: "Permisos",
              description: result.data.PermisosUpdate.Respuesta,
              onClick: () => {
                this.handleOk();
              },
              placement: "bottomRight"
            });
            this.$socket.emit("Sumar_Linea", true);
          }
        });
    },
    async carga_data() {
      await this.$apollo
        .query({
          query: this.rangos,
          fetchPolicy: "network-only"
        })
        .then(result => {
          this.data = result.data.rangos;
          this.$socket.emit("Sumar_Linea", true);
        });
    },
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
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
          Code: "P43"
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
          Code: "P46"
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        if (result.data.saber_permiso != null) {
          if (result.data.saber_permiso.Respuesta != null) {
            this.p_adm = result.data.saber_permiso.Respuesta;
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
