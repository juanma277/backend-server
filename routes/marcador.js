var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Marcador = require('../models/marcador');

// =========================================
// Obtener todos los marcadores - paginados
// =========================================

app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Marcador.find({})
        .skip(desde)
        .limit(5)
        .exec(

            (err, marcadores) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando marcadores!',
                        errors: err
                    });
                }

                Marcador.count({}, (err, cuenta) => {
                    response.status(200).json({
                        ok: true,
                        marcadores: marcadores,
                        total: cuenta
                    });
                });
            });

});

// =========================================
// Obtener todos los marcadores
// =========================================

app.get('/All', (request, response, next) => {

    Marcador.find({})
        .exec(

            (err, marcadores) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando marcadores!',
                        errors: err
                    });
                }

                Marcador.count({}, (err, cuenta) => {
                    response.status(200).json({
                        ok: true,
                        marcadores: marcadores,
                        total: cuenta
                    });
                });
            });

});

// =========================================
// Obtener Marcador
// =========================================

app.get('/:id', (request, response) => {
    var id = request.params.id;

    Marcador.findById(id)
        .exec((err, marcador) => {

            if (err) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar marcador!',
                    errors: err
                });
            }

            if (!marcador) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Marcador no existe!',
                    errors: { message: 'Marcador no encontrado!' }
                });
            }

            response.status(200).json({
                ok: true,
                marcador: marcador
            });

        });


});

// =========================================
// Actualizar marcador
// =========================================

app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Marcador.findById(id, (err, marcador) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar marcador!',
                errors: err
            });
        }

        if (!marcador) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Marcador no existe!',
                errors: { message: 'Marcador no encontrado!' }
            });
        }

        marcador.nombre = body.nombre;
        marcador.icono = body.icono;
        marcador.descripcion = body.descripcion;
        

        if (body.lat) {
            marcador.lat = body.lat;
        }
        if (body.lng) {
            marcador.lng = body.lng;
        }

        marcador.save((err, marcadorUpdate) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar marcador!',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                marcador: marcadorUpdate
            });
        });

    });

});

// =========================================
// Crear nuevo marcadorUpdate
// =========================================

app.post('/', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var body = request.body;

    var marcador = new Marcador({
        nombre: body.nombre,
        descripcion: body.descripcion,
        icono: body.icono,
        lat: body.lat,
        lng: body.lng,
    });

    marcador.save((err, newMarcador) => {

        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear marcador!',
                errors: err
            });
        }

        response.status(201).json({
            ok: true,
            marcador: newMarcador,
        });
    });
});

// =========================================
// Eliminar Marcador
// =========================================

app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;

    Marcador.findByIdAndRemove(id, (err, marcadorDelete) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar marcador!',
                errors: err
            });
        }

        if (!marcadorDelete) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Marcador no existe!',
                errors: { message: 'Marcador no existe!' }
            });
        }

        response.status(200).json({
            ok: true,
            marcador: marcadorDelete
        });

    });
});

module.exports = app;