var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Barrio = require('../models/barrio');


// =========================================
// Obtener los barrios
// =========================================

app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Barrio.find({})
        .skip(desde)
        .limit(5)
        .exec(

            (err, barrios) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando barrios!',
                        errors: err
                    });
                }

                Barrio.count({}, (err, cuenta) => {
                    response.status(200).json({
                        ok: true,
                        barrios: barrios,
                        total: cuenta
                    });

                })


            });

});

// =========================================
// Obtener todos los barrios
// =========================================

app.get('/all', (request, response, next) => {

    Barrio.find({})
        .populate('usuario', 'nombre email')
        .exec(

            (err, barrios) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando barrios!',
                        errors: err
                    });
                }

                Barrio.count({}, (err, cuenta) => {
                    response.status(200).json({
                        ok: true,
                        barrios: barrios,
                        total: cuenta
                    });
                });
            });

});

// ===============================================
// Obtener las coordenadas del barrio por Nombre
// ===============================================

app.get('/:nombre', (request, response, next) => {

    var nombre = request.params.nombre;

    Barrio.find({ nombre: nombre })
        .exec(
            (err, barrio) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando barrios!',
                        errors: err
                    });
                }

                Barrio.count({ nombre: nombre }, (err, cuenta) => {
                    response.status(200).json({
                        ok: true,
                        barrio: barrio,
                        total: cuenta
                    });
                });
            });
});


// =========================================
// Obtener Barrio
// =========================================

app.get('/obtener/:id', (request, response) => {
    var id = request.params.id;
    Barrio.findById(id)
        .exec((err, barrio) => {

            if (err) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar barrio!',
                    errors: err
                });
            }

            if (!barrio) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Barrio no existe!',
                    errors: { message: 'Barrio no encontrado!' }
                });
            }

            response.status(200).json({
                ok: true,
                barrio: barrio
            });

        });


});

// =========================================
// Actualizar Barrio
// =========================================

app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Barrio.findById(id, (err, barrio) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar barrio!',
                errors: err
            });
        }

        if (!barrio) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Barrio no existe!',
                errors: { message: 'Barrio no encontrado!' }
            });
        }

        barrio.nombre = body.nombre;
        barrio.lat = body.lat;
        barrio.lng = body.lng;


        barrio.save((err, barrioUpdate) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar barrio!',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                barrio: barrioUpdate
            });
        });

    });

});

// =========================================
// Actualizar Barrio - Nombre - Coordenadas
// =========================================

app.put('/nombre/coordenadas/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;
    var lat = request.query.lat;
    var lng = request.query.lng;
    var body = request.body;

    Barrio.findById(id, (err, barrio) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar barrio!',
                errors: err
            });
        }

        if (!barrio) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Barrio no existe!',
                errors: { message: 'Barrio no encontrado!' }
            });
        }

        barrio.nombre = body.nombre;
        barrio.lat = body.lat;
        barrio.lng = body.lng;


        barrio.save((err, barrioUpdate) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar barrio!',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                barrio: barrioUpdate
            });
        });

    });

});


// =========================================
// Actualizar Barrio - Nombre
// =========================================

app.put('/nombre/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Barrio.findById(id, (err, barrio) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar barrio!',
                errors: err
            });
        }

        if (!barrio) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Barrio no existe!',
                errors: { message: 'Barrio no encontrado!' }
            });
        }

        barrio.nombre = body.nombre;

        barrio.save((err, barrioUpdate) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar barrio!',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                barrio: barrioUpdate
            });
        });

    });

});


// =========================================
// Crear nuevo barrio
// =========================================

app.post('/', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var body = request.body;

    var barrio = new Barrio({
        nombre: body.nombre,
        lat: body.lat,
        lng: body.lng
    });

    barrio.save((err, newBarrio) => {

        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear barrio!',
                errors: err
            });
        }

        response.status(201).json({
            ok: true,
            barrio: newBarrio
        });
    });
});

// =========================================
// Eliminar Barrio
// =========================================

app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;

    Barrio.findByIdAndRemove(id, (err, barrioDelete) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar barrio!',
                errors: err
            });
        }

        if (!barrioDelete) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Barrio no existe!',
                errors: { message: 'Barrio no existe!' }
            });
        }

        response.status(200).json({
            ok: true,
            barrio: barrioDelete
        });

    });
});

module.exports = app;