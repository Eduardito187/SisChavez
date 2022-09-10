let express = require("express");
let { Server } = require("socket.io");
const app = express();
const axios_ = require("axios");
const gql = require("graphql-tag");

let URL_APICHAVEZ = "http://localhost/APIChavez/";
let URL_LOCAL = "http://localhost:8080";
let URL_MI_IP = "http://localhost:8080";

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', [URL_LOCAL, URL_MI_IP]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

//ajustes
app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
    console.log('Servidor en puerto', app.get('port'));
});

const io = new Server(server, {
    allowEIO3: true,
    cors: { credentials: true, origin: [URL_LOCAL, URL_MI_IP] },
});
var Fecha_Inicio = new Date().toLocaleString('en-US', {
    timeZone: 'America/La_Paz'
});
var Fecha_SIS = new Date();
var Dia_SIS = null;

function devolverDiaSemana(fecha) {
    var dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    return dias[fecha.getDay()];
}

Dia_SIS = devolverDiaSemana(Fecha_SIS);
var mensajes = [];
let Activiades_SIS = [
    { dia: 'Domingo', cantidad: 0 },
    { dia: 'Lunes', cantidad: 0 },
    { dia: 'Martes', cantidad: 0 },
    { dia: 'Miercoles', cantidad: 0 },
    { dia: 'Jueves', cantidad: 0 },
    { dia: 'Viernes', cantidad: 0 },
    { dia: 'Sabado', cantidad: 0 }
];

let conectados = [];
let actividades_hoy = 0;
let actividades_ayer = 0;
let cuentas_activas = 0;
let t_cuenta = 0;
var query_t_cuenta = `{
    total_cuentas
}`;
var CITE = `{
    SiguienteCITE {
        CITE
    }
}`;
var query_extintores_a_vencer = `{
    extintoresRecargoContador {
        Cantidad
    }
}`;
var query_t_mensajes = `{
    mensajes {
        ID
        Texto
        Fecha
        Leido
        F_Leido
        De {
            ID
            nombre
            foto
        }
        Para {
            ID
            nombre
            foto
        }
    }
}`;

function get_msg_ini(de, para) {
    let x = [];
    for (let z = 0; z < mensajes.length; z++) {
        if (mensajes[z]["De"]["ID"] == de && mensajes[z]["Para"]["ID"] == para || mensajes[z]["De"]["ID"] == para && mensajes[z]["Para"]["ID"] == de) {
            x.push(mensajes[z]);
        }
    }
    return x;
}

function saber_t_msgs() {
    axios_.post(URL_APICHAVEZ, {
        query: query_t_mensajes
    }).then((res) => {
        mensajes = res.data.data.mensajes;
    }).catch((error) => {
        console.error(error)
    });
}

function saber_t_cuentas() {
    axios_.post(URL_APICHAVEZ, {
        query: query_t_cuenta
    }).then((res) => {
        t_cuenta = res.data.data.total_cuentas;
        io.sockets.emit("ADM", { cuentas: cuentas_activas, a_ayer: actividades_ayer, a_hoy: actividades_hoy, t_cuenta: t_cuenta });
    }).catch((error) => {
        console.error(error)
    });
}
saber_t_msgs();
saber_t_cuentas();

function si_conectado(id, s_id) {
    let x = false;
    for (let index = 0; index < conectados.length; index++) {
        if (conectados[index] != null) {
            if (conectados[index]["id"] != null) {
                if (conectados[index]["id"] == id) {
                    x = true;
                    if (conectados[index]["s_id"] != null) {
                        if (conectados[index]["s_id"] != s_id) {
                            conectados[index]["s_id"] = s_id;
                        }
                    }
                    index = conectados.length;
                }
            }
        }
    }
    return x;
}

function retornocuenta(id) {
    var bol = false;
    for (let index = 0; index < conectados.length; index++) {
        if (conectados[index]["s_id"] == id) {
            bol = true;
            conectados.splice(index, 1);
        }
    }
    return bol;
}

function si_activo(id) {
    let x = false;
    for (let index = 0; index < conectados.length; index++) {
        if (conectados[index] != null) {
            if (conectados[index]["id"] != null) {
                if (conectados[index]["id"] == id) {
                    x = true;
                    index = conectados.length;
                }
            }
        }
    }
    return x;
}

function tarea() {
    Fecha_SIS = new Date();
    Dia_SIS = devolverDiaSemana(Fecha_SIS);
    if (Dia_SIS == 'Lunes') {
        actividades_ayer = Activiades_SIS[0]["cantidad"];
        actividades_hoy = 0;
        Activiades_SIS = [
            { dia: 'Domingo', cantidad: 0 },
            { dia: 'Lunes', cantidad: 0 },
            { dia: 'Martes', cantidad: 0 },
            { dia: 'Miercoles', cantidad: 0 },
            { dia: 'Jueves', cantidad: 0 },
            { dia: 'Viernes', cantidad: 0 },
            { dia: 'Sabado', cantidad: 0 }
        ];
        io.sockets.emit("Panel_Actividad_Line", Activiades_SIS);
        io.sockets.emit("ADM", { cuentas: cuentas_activas, a_ayer: actividades_ayer, a_hoy: actividades_hoy, t_cuenta: t_cuenta });
    }
}

function lanzarSiempreALaHora(hora, minutos, tarea) {
    var ahora = new Date();
    var momento = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), hora, minutos);
    if (momento <= ahora) { // la hora era anterior a la hora actual, debo sumar un día
        momento = new Date(momento.getTime() + 1040 * 60 * 60 * 24);
    }
    setTimeout(function() {
        tarea();
        lanzarSiempreALaHora(hora, minutos, tarea);
    }, momento.getTime() - ahora.getTime());
}

lanzarSiempreALaHora(00, 01, tarea);


io.on('connection', (socket) => {
    socket.on('seccion_Admin', data => {
        if (data) {
            io.sockets.emit("ADM", { cuentas: cuentas_activas, a_ayer: actividades_ayer, a_hoy: actividades_hoy, t_cuenta: t_cuenta });
        }
    });
    socket.on('Solicitar_Exintores_Por_Vencer', data => {
        if (data != null) {
            axios_.post(URL_APICHAVEZ, {
                query: query_extintores_a_vencer
            }).then((res) => {
                if (res.data.data.extintoresRecargoContador.Cantidad > 0) {
                    io.sockets.emit("Notificaciones_SISCHAVEZ_" + data, { Titulo: "Extintores a Recargar", Motivo: res.data.data.extintoresRecargoContador.Cantidad + " extintores a Recargar." })
                }
            }).catch((error) => {
                console.error(error)
            });
        }
    });
    socket.on('Fecha_Ini', data => {
        if (data) {
            io.sockets.emit("Ini_Server", { fecha: Fecha_Inicio });
        }
    });
    socket.on('NuevoRegistro', data => {
        if (data) {
            axios_.post(URL_APICHAVEZ, {
                query: CITE
            }).then((res) => {
                if (res.data.data.SiguienteCITE != null) {
                    io.sockets.emit("CITE_SIGUIENTE", { CITE: res.data.data.SiguienteCITE.CITE })
                }
            }).catch((error) => {
                console.error(error)
            });
        }
    });
    socket.on('AlmacenMensajes', (data) => {
        if (data != null) {
            mensajes.push(data.mensaje);
            io.sockets.emit(data.para + "__ROOM__NUEVO__" + data.de, data.mensaje);
        }
    });
    socket.on('Si_Conectado', (data) => {
        if (data != null) {
            if (si_activo(data)) {
                io.sockets.emit(data + "Persona", true);
            } else {
                io.sockets.emit(data + "Persona", false);
            }
        }
    });
    socket.on('Estados', (data) => {
        if (data != null) {
            io.sockets.emit(data.sala, data.estado);
        }
    });
    socket.on('salainicio', (data) => {
        socket.broadcast.emit(data.sala, data);
    });
    socket.on('Cuentas_Activas', (data) => {
        if (data) {
            io.sockets.emit("Cuentas_Activas_CHAT", cuentas_activas);
        }
    });
    socket.on('Recopilar_Chat_INI', (data) => {
        if (data.DE != null && data.PARA != null) {
            let x = get_msg_ini(data.DE, data.PARA);
            io.sockets.emit(data.DE + "__ROOM__" + data.PARA, x);
        }
    });
    socket.on('nueva_cuenta', (data) => {
        if (data) {
            saber_t_cuentas();
        }
    });
    //Sumar_Linea
    socket.on('Sumar_Linea', data => {
        if (data != null) {
            if (data) {
                for (let h = 0; h < Activiades_SIS.length; h++) {
                    if (Dia_SIS == Activiades_SIS[h]["dia"]) {
                        Activiades_SIS[h]["cantidad"] += 1;
                        io.sockets.emit("Agregar_Data_Line", Dia_SIS);
                        actividades_hoy = Activiades_SIS[h]["cantidad"]
                        io.sockets.emit("ADM_Activy_hoy", actividades_hoy);
                        if (h != 0) {
                            actividades_ayer = Activiades_SIS[h - 1]["cantidad"]
                        }
                    }
                }
            }
        }
    });
    socket.on('Line_Actividad', data => {
        if (data != null) {
            if (data) {
                io.sockets.emit("Panel_Actividad_Line", Activiades_SIS);
            }
        }
    });
    socket.on('activo', data => {
        if (data != null) {
            if (data.id != null) {
                io.sockets.emit(data.id + "Persona", true);
                if (si_conectado(data.id, socket.id)) {
                    //
                } else {
                    conectados.push({ "id": data.id, "s_id": socket.id });
                }
                cuentas_activas = conectados.length;
                io.sockets.emit("ADM", { cuentas: cuentas_activas, a_ayer: actividades_ayer, a_hoy: actividades_hoy, t_cuenta: t_cuenta });
                io.sockets.emit("Cuentas_Activas_CHAT", cuentas_activas);
            }
        }
    });
    socket.on('disconnect', function() {
        var aux = retornocuenta(socket.id);
        if (aux) {
            cuentas_activas = conectados.length;
            io.sockets.emit("ADM", { cuentas: cuentas_activas, a_ayer: actividades_ayer, a_hoy: actividades_hoy, t_cuenta: t_cuenta });
            io.sockets.emit("Cuentas_Activas_CHAT", cuentas_activas);
        }
    });
});