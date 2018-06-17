var express = require('express');
var app = express();

//NODEMAILER
var nodemailer = require('nodemailer');

//Rutas
app.get('/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        mensaje: 'Petición relizada correctamente!'
    });
});


module.exports = app;