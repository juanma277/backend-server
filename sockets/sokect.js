//SOCKET IO

const { io } = require('../app');
var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Vehiculo = require('../models/vehiculo');
var empresa = '';


io.on('connection', (socket) => {
    console.log('Usuario Conectado');

    socket.on('obtenerVehiculos', (data) => {
        empresa = data.empresa;

        Vehiculo.find({}, function(err, vehiculos) {
            if (err) throw err;
            socket.broadcast.emit('obtenerVehiculos', vehiculos);
        });

    });


    socket.on('disconnect', (data) => {
        console.log('Usuario Desconectado');
    });


});