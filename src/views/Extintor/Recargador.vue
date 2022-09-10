<template>
    <div style="display:inline-block;" :style="{width: '100%', height: '380px', overflow: 'hidden', position: 'relative', borderRadius: '2px', padding: '4px', background: '#fafafa', border: '3px solid '+Border }">
        <b-card no-body class="overflow-hidden" style="height:100%;padding:4px;">
            <b-row no-gutters>
                <b-col md="6">
                    <b-card-body>
                        <b-row no-gutters :style="{margin:'5px',borderRadius: '2px', padding: '4px', background: '#fafafa', border: '3px solid '+Border}">
                            <b-col md="12">
                                <p style="margin:0px;">
                                    <b>Nombre: </b><small>{{ data.Extintores.Sucursal.Nombre }}</small>
                                </p>
                                <p style="margin:0px;">
                                    <b>Codigo Sucursal: </b><small>{{ data.Extintores.Sucursal.CodigoSucursal }}</small>
                                </p>
                                <p style="margin:0px;">
                                    <b>Correo: </b><small>{{ data.Extintores.Sucursal.Correo }}</small>
                                </p>
                            </b-col>
                            <b-col md="12">
                                <p style="margin:0px;">
                                    <b>Telefono: </b><small>{{ data.Extintores.Sucursal.Telefono }}</small>
                                </p>
                                <p style="margin:0px;">
                                    <b>Telefono Interno: </b><small>{{ data.Extintores.Sucursal.TelfInterno }}</small>
                                </p>
                                <p style="margin:0px;">
                                    <b>Direccion: </b><small>{{ data.Extintores.Sucursal.Direccion }}</small>
                                </p>
                            </b-col>
                        </b-row>
                        <b-row no-gutters style="margin:5px;">
                            <b-col md="12">
                                <p style="margin:0px;">
                                    <b>Nombre: </b><small>{{ data.Extintores.Proveedor.Nombre }}</small>
                                </p>
                                <p style="margin:0px;">
                                    <b>Correo: </b><small>{{ data.Extintores.Proveedor.Correo }}</small>
                                </p>
                                <p style="margin:0px;">
                                    <b>Telefono: </b><small>{{ data.Extintores.Proveedor.Telefono }}</small>
                                </p>
                            </b-col>
                            <b-col md="12">
                                <p style="margin:0px;">
                                    <b>Direccion: </b><small>{{ data.Extintores.Proveedor.Direccion }}</small>
                                </p>
                            </b-col>
                        </b-row>
                    </b-card-body>
                </b-col>
                <b-col md="6">
                    <b-card-body>
                        <b-row no-gutters>
                            <b-col md="12">
                                <b-row no-gutters>
                                    <b-col md="6">
                                        <p style="margin:0px;">
                                            <b>Codigo: </b><small>{{ data.Codigo }}</small>
                                        </p>
                                        <p style="margin:0px;">
                                            <b>PH: </b><small>{{ data.PH }}</small>
                                        </p>
                                    </b-col>
                                    <b-col md="6">
                                        <p style="margin:0px;">
                                            <b>Recargo: </b><small>{{ data.Recargo }}</small>
                                        </p>
                                        <p style="margin:0px;">
                                            <b>Tipo: </b><small>{{ data.Extintores.Tipo }}</small>
                                        </p>
                                    </b-col>
                                </b-row>
                            </b-col>
                            <b-col md="12">
                                <b-row no-gutters>
                                    <b-card-text>Registrado el <b>{{ data.Extintores.Fecha }}</b> con un peso de <b>{{ data.Peso }}</b></b-card-text>
                                </b-row>
                            </b-col>
                            <b-col md="12">
                                <b-row no-gutters>
                                    <b-card bg-variant="light">
                                        <b-form-group label-cols-lg="12" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0 col-md-12" >
                                            <div class="d-flex justify-content-between mb-2">
                                                <b-form-group class="col-md-5" label="Observacion:" label-for="Observacion" label-cols-sm="12" label-align-sm="right" >
                                                    <b-form-textarea id="Observacion" v-model="data.Observacion" placeholder="Observacion.." rows="3" max-rows="3" ></b-form-textarea>
                                                </b-form-group>
                                                <b-form-group class="col-md-5" label="Fecha de Recargo:" label-for="Recargo" label-cols-sm="12" label-align-sm="right" >
                                                    <b-form-datepicker id="Recargo" v-model="data.Recargo" ></b-form-datepicker>
                                                </b-form-group>
                                            </div>
                                            <b-button @click="actualizar" :disabled="upd" pill variant="primary">Recargar</b-button>
                                        </b-form-group>
                                    </b-card>
                                </b-row>
                            </b-col>
                        </b-row>
                    </b-card-body>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
import gql from "graphql-tag";
export default {
    data() {
        return {
            Border:"black",
            upd:false,
            Colores:[
                {Region:"La Paz",Color:"#2D48FA"},
                {Region:"Santa Cruz",Color:"#57FF5F"},
                {Region:"Beni",Color:"#9AF5F4"},
                {Region:"Oruro",Color:"#F5E79B"},
                {Region:"Cochabamba",Color:"#EB4AEB"},
                {Region:"Tarija",Color:"#EBB010"},
                {Region:"Pando",Color:"#006625"},
                {Region:"Chuquisaca",Color:"#EFFF0D"},
                {Region:"Potosi",Color:"#D67A43"}
            ],
        };
    },
    props: {
        data: {
            type: Object
        }
    },
    methods:{
        async actualizar() {
            const add = gql`
                mutation RecargarExtintor(
                $ID: Int!
                $Observacion: String!
                $Recargo: String!
                ) {
                RecargarExtintor(
                    ID: $ID
                    Observacion: $Observacion
                    Recargo: $Recargo
                ) {
                    Respuesta
                }
                }
            `;
            await this.$apollo.mutate({
                mutation: add,
                variables: {
                    ID: parseInt(this.data.ID),
                    Observacion: this.data.Observacion,
                    Recargo: this.data.Recargo
                }
                })
                .then(result => {
                    if (result.data.RecargarExtintor.Respuesta) {
                        this.$message.success("Edicion Exitosa");
                        this.$socket.emit("Sumar_Linea", true);
                        this.$notification.open({
                            message: "Recarga Exitosa.",
                            description: "Fecha de Recargo "+this.data.Recargo,
                            onClick: () => {
                                //
                            },
                            placement:'bottomRight'
                        });
                        this.$emit('eliminar',this.data.ID);
                    }
                });
        },
    },
    mounted() {
    },
    async created(){
        if (this.data.Extintores.Sucursal.Region!=null) {
            if (this.data.Extintores.Sucursal.Region!="") {
            for (let i = 0; i < this.Colores.length; i++) {
                if (this.Colores[i]["Region"]==this.data.Extintores.Sucursal.Region) {
                this.Border=this.Colores[i]["Color"];
                i=this.Colores.length;
                }
            }
            }
        }
    }
};
</script>