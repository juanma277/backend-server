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


// =========================================
// Obtener todas los rutas
// =========================================

app.get('/All', (request, response, next) => {

    Ruta.find({})
        .populate('usuario', 'nombre email')
        .populate('empresa', 'nombre tipo')        
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

// =========================================
// Obtener todas las rutas por coordenadas
// =========================================

app.get('/:lat_origen/:lng_origen/:lat_destino/:lng_destino', (request, response, next) => {

    var lat_origen = request.params.lat_origen;
    var lng_origen = request.params.lng_origen;
    var lat_destino = request.params.lat_destino;
    var lng_destino = request.params.lng_destino;

    Ruta.find({ lat_origen: lat_origen, lng_origen: lng_origen, lat_destino: lat_destino, lng_destino: lng_destino })
        .populate('empresa', 'nombre')
        .exec(

            (err, rutas) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando rutas!',
                        errors: err
                    });
                }

                Ruta.count({ lat_origen: lat_origen, lng_origen: lng_origen, lat_destino: lat_destino, lng_destino: lng_destino }, (err, cuenta) => {
                    response.status(200).json({
                        ok: true,
                        rutas: rutas,
                        total: cuenta
                    });
                });
            });
});

// ==========================================
// Obtener Ruta por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Ruta.findById(id)
        .populate('usuario', 'nombre img email')
        .populate('empresa', 'nombre tipo informacion')
        .exec((err, ruta) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar Ruta',
                    errors: err
                });
            }
            if (!ruta) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La ruta con el id ' + id + 'no existe ',
                    errors: {
                        message: 'No existe una ruta con ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                ruta: ruta
            });
        })
});

// =========================================
// Actualizar ruta
// =========================================

app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    
    var id = request.params.id;
    var body = request.body;

    Ruta.findById(id, (err, ruta) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar ruta!',
                errors: err
            });
        }

        if (!ruta) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Ruta no existe!',
                errors: { message: 'Ruta no encontrado!' }
            });
        } 

        ruta.nombre = body.nombre;
        ruta.barrios = body.barrios;
        ruta.empresa = body.empresa;
        
        ruta.save((err, rutaUpdate) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar ruta!',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                ruta: rutaUpdate
            });
        });

    });

});

// =========================================
// Actualizar Coordenadas de Ruta
// =========================================

app.put('/coordenadas/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Ruta.findById(id, (err, ruta) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar ruta!',
                errors: err
            });
        }

        if (!ruta) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Ruta no existe!',
                errors: { message: 'Ruta no encontrado!' }
            });
        }

        ruta.lat_origen = body.lat_origen;
        ruta.lng_origen = body.lng_origen;
        ruta.lat_destino = body.lat_destino;
        ruta.lng_destino = body.lng_destino;

        ruta.save((err, rutaUpdate) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar ruta!',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                ruta: rutaUpdate
            });
        });

    });

});

// =========================================
// Crear Ruta
// =========================================

app.post('/', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var body = request.body;

    var ruta = new Ruta({
        nombre: body.nombre,
        empresa: body.empresa,
        barrios: body.barrios,        
        lat_origen: 45.56,
        lng_origen: -45.63,
        lat_destino: -56.36,
        lng_destino: -74.63
    });

    ruta.save((err, newRuta) => {

        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear ruta!',
                errors: err
            });
        }

        response.status(201).json({
            ok: true,
            ruta: newRuta,
        });
    });
});

// =========================================
// Eliminar ruta
// =========================================

app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;

    Ruta.findByIdAndRemove(id, (err, rutaDelete) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar ruta!',
                errors: err
            });
        }

        if (!rutaDelete) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Ruta no existe!',
                errors: { message: 'Ruta no existe!' }
            });
        }

        response.status(200).json({
            ok: true,
            ruta: rutaDelete
        });

    });
});

module.exports = app;