var express = require('express');

var app = express();

var Usuario = require('../models/usuario');

//Rutas
app.get('/', (request, response, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(

            (err, usuarios) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios!',
                        errors: err
                    });
                }

                response.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            });

});


module.exports = app;