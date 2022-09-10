<template>
    <div>
        <a-calendar v-if="permiso">
            <ul slot="dateCellRender" slot-scope="value" class="events">
                <li v-for="item in getListData(value)" :key="item.content">
                    <a-badge :status="item.type" :text="item.content" />
                </li>
                </ul>
                <template slot="monthCellRender" slot-scope="value">
                <div v-if="getMonthData(value)" class="notes-month">
                    <section>{{ getMonthData(value) }}</section>
                    <span>Backlog number</span>
                </div>
            </template>
        </a-calendar>
        <b-card v-else-if="permiso == false" bg-variant="light">
            <a-result
            status="403"
            title="403"
            sub-title="Usted no tiene permiso para esta seccion."
            />
        </b-card>
        <a-spin v-else size="large" />
    </div>
</template>
<script>
import gql from "graphql-tag";
export default {
    data() {
        return {
            permiso:null,
            Data:[],
        }
    },
    props:{
        Trabajador:{
            type:[Number,String]
        }
    },
    methods: {
        getListData(value) {
            let listData=[];
            let dia=value.date();
            if (dia<10) {
                dia="0"+dia;
            }
            let mes=value.month();
            mes+=1;
            if (mes<10) {
                mes="0"+mes;
            }
            let anho=value.year();
            let c;
            for (let index = 0; index < this.Data.length; index++) {
                c=anho+"-"+mes+"-"+dia;
                if (c==this.Data[index]["Fecha"]) {
                    let m="";
                    let t="";
                    if (this.Data[index]["Motivo"]!=null) {
                        m=this.Data[index]["Motivo"];
                    }
                    if (this.Data[index]["Tipo"]=="Baja Medica") {
                        t='warning';
                    }else if (this.Data[index]["Tipo"]=="Permiso" || this.Data[index]["Tipo"]=="Falta") {
                        t='error';
                    }else {
                        t='success';
                    }
                    m=this.Data[index]["Tipo"]+"-"+m;
                    listData.push({ type: t, content: m });
                }
            }
            //warning -> Baja Medica
            //success -> Libre
            //error ->Permiso Falta
            return listData || [];
        },

        getMonthData(value) {
            if (value.month() === 8) {
                return 1394;
            }
        },
        async recoleccionData(a){
            await this.$apollo.query({
                query: gql`query ControlesEnDe($De: Int!) {
                    ControlesEnDe(De: $De) {
                        ID
                        Fecha
                        Tipo
                        Motivo
                    }
                }
                `,
                variables: {
                    De: parseInt(this.Trabajador)
                },
                fetchPolicy: "network-only"
            })
            .then(result => {
                if (result.data.ControlesEnDe != null) {
                    this.Data=result.data.ControlesEnDe;
                }
                this.permiso = a;
            });
        }
    },
    async created(){
        await this.$apollo.query({
            query: gql`
            query saber_permiso($Cuenta: Int!, $Code: String!) {
                saber_permiso(Cuenta: $Cuenta, Code: $Code) {
                Respuesta
                }
            }
            `,
            variables: {
            Cuenta: parseInt(localStorage.id_cuenta),
            Code: "P54"
            },
            fetchPolicy: "network-only"
        })
        .then(result => {
            if (result.data.saber_permiso != null) {
                if (result.data.saber_permiso.Respuesta != null) {
                    this.recoleccionData(result.data.saber_permiso.Respuesta);
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
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
</style>