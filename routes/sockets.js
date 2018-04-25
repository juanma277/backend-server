var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Ruta = require('../models/ruta');

// =========================================
// Obtener todas los rutas
// =========================================

app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Ruta.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(

            (err, rutas) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando rutas!',
                        errors: err
                    });
                }

                Ruta.count({}, (err, cuenta) => {
                    response.status(200).json({
                        ok: true,
                        rutas: rutas,
                        total: cuenta
                    });
                });
            });
});


module.exports = app;