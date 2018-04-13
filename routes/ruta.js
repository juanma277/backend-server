var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Ruta = require('../models/ruta');

// =========================================
// Obtener todos los rutas
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

// ==========================================
// Obtener Ruta por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Ruta.findById(id)
        .populate('usuario', 'nombre img email')
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

app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {
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
        ruta.usuario = request.usuario._id;

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
// Crear nueva ruta
// =========================================

app.post('/', mdAutenticacion.verificaToken, (request, response) => {
    var body = request.body;

    var ruta = new Ruta({
        nombre: body.nombre,
        usuario: request.usuario._id
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

app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {
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