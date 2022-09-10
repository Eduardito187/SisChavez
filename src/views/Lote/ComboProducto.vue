<template>
    <div class="ComboProducto">
        <b-overlay :show="c_s" rounded="sm">
            <a-select default-value="" v-model="valor" style="width: 100%;" @change="change()" >
                <a-select-option v-for="d in valores" :key="d.text" :value="d.value">
                    {{ d.text }}
                </a-select-option>
            </a-select>
        </b-overlay>
    </div>
</template>

<script>
import gql from "graphql-tag";
export default {
    name: "ComboProducto",
    data() {
        return {
            valor: null,
            c_s: false,
            valores: [],
            consulta: gql`query productos_disponibles($Lote: Int!) {
                productos_disponibles(Lote: $Lote) {
                    ID
                    Factura
                    Nombre
                    Modelo
                    Costo
                    Cantidad
                }
            }
        `
        };
    },
    props: {
        Lote: {
            type: [String, Number]
        }
    },
    watch: {
        Lote: {
            immediate: true,
            handler(val, oldVal) {
                //nuevo--anterior
                if (val != null) {
                    if (val != oldVal) {
                        this.valor=val;
                        this.consultar();
                    }
                }
            }
        }
    },
    methods: {
        change() {
            let c=0;
            for (let k = 0; k < this.valores.length; k++) {
                if (this.valores[k]["value"]==this.valor) {
                    c=this.valores[k]["cantidad"];
                    k=this.valores.length;
                }
            }
            this.$emit("change", this.valor);
            this.$emit("cantidad", c);
        },
        async consultar() {
            this.c_s = true;
            await this.$apollo
            .query({
                query: this.consulta,
                variables: {
                    Lote: parseInt(this.Lote)
                },
                fetchPolicy: "network-only"
            }).then(result => {
                this.asignar_valores(result.data.productos_disponibles);
                this.c_s = false;
            });
        },
        asignar_valores(obj) {
            this.valores = [];
            if (obj != null) {
                for (let index = 0; index < obj.length; index++) {
                    if (obj[index] != null) {
                        this.valores.push({
                            value: obj[index]["ID"],
                            text: obj[index]["Nombre"]+"("+obj[index]["Modelo"]+")",
                            cantidad: obj[index]["Cantidad"]
                        });
                    }
                }
            }
            if (this.valores.length>0) {
                this.valor=this.valores[0]["value"];
                this.$emit("change", this.valor);
                this.$emit("cantidad", this.valores[0]["cantidad"]);
            }
        }
    },
    mounted() {
        if (this.Lote!=null) {
            this.consultar();
        }
    }
};
</script>
