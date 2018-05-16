var express = require('express');

var app = express();

var Ruta = require('../models/ruta');
var Vehiculo = require('../models/vehiculo');
var Usuario = require('../models/usuario');
var Barrio = require('../models/barrio');
var Empresa = require('../models/empresa');
var Marcador = require('../models/marcador');


// ================================================
// Busqueda por colección
// ================================================

app.get('/coleccion/:tabla/:busqueda', (request, response) => {

    var busqueda = request.params.busqueda;
    var tabla = request.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'rutas':
            promesa = buscarRutas(busqueda, regex);
            break;

        case 'vehiculos':
            promesa = buscarVehiculos(busqueda, regex);
            break;

        case 'barrios':
            promesa = buscarBarrios(busqueda, regex);
            break;

        case 'empresas':
            promesa = buscarEmpresas(busqueda, regex);
            break;

        case 'marcadores':
            promesa = buscarMarcadores(busqueda, regex);
            break;

        default:
            return response.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda son invalidos!',
                errors: { message: 'Los tipos de busqueda invalidos!' }
            });

    }

    promesa.then(data => {

        response.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});

// ================================================
// Busqueda General
// ================================================
app.get('/todo/:busqueda', (request, response, next) => {

    var busqueda = request.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([buscarRutas(busqueda, regex), buscarVehiculos(busqueda, regex), buscarUsuarios(busqueda, regex), buscarBarrios(busqueda, regex), buscarEmpresas(busqueda, regex), buscarMarcadores(busqueda, regex)])
        .then(respuestas => {
            response.status(200).json({
                ok: true,
                rutas: respuestas[0],
                vehiculos: respuestas[1],
                usuarios: respuestas[2],
                barrios: respuestas[3],
                empresas: respuestas[4],
                marcadores: respuestas[5]
            });

        });
});


function buscarRutas(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Ruta.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, rutas) => {
                if (err) {
                    reject('Error de carga', err);
                } else {
                    resolve(rutas);
                }
            });
    })
}

function buscarVehiculos(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Vehiculo.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('ruta')
            .exec((err, vehiculos) => {
                if (err) {
                    reject('Error de carga', err);
                } else {
                    resolve(vehiculos);
                }
            });
    })
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error de carga', err);
                } else {
                    resolve(usuarios);
                }

            })
    })
}

function buscarBarrios(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Barrio.find({}, 'nombre lat lng')
            .or([{ 'nombre': regex }])
            .exec((err, barrios) => {

                if (err) {
                    reject('Error de carga', err);
                } else {
                    resolve(barrios);
                }

            })
    })
}

function buscarEmpresas(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Empresa.find({}, 'lat lng nombre tipo informacion descripcion img1')
            .or([{ 'nombre': regex }, { 'tipo': regex }, { 'informacion': regex }, { 'descripcion': regex }])
            .exec((err, empresas) => {

                if (err) {
                    reject('Error de carga', err);
                } else {
                    resolve(empresas);
                }

            })
    })
}

function buscarMarcadores(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Marcador.find({}, 'nombre icono lat lng')
            .or([{ 'nombre': regex }])
            .exec((err, marcadores) => {

                if (err) {
                    reject('Error de carga', err);
                } else {
                    resolve(marcadores);
                }

            })
    })
}

module.exports = app;