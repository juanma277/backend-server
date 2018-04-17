var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Vehiculo = require('../models/vehiculo');

// =========================================
// Obtener todos los vehiculos
// =========================================

app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Vehiculo.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('ruta')
        .exec(

            (err, vehiculos) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando vehiculos!',
                        errors: err
                    });
                }

                Vehiculo.count({}, (err, cuenta) => {
                    response.status(200).json({
                        ok: true,
                        vehiculos: vehiculos,
                        total: cuenta
                    });
                });
            });

});

// =========================================
// Obtener vehiculo
// =========================================

app.get('/:id', (request, response) => {
    var id = request.params.id;

    Vehiculo.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('ruta')
        .exec((err, vehiculo) => {

            if (err) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar vehiculo!',
                    errors: err
                });
            }

            if (!vehiculo) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Vehiculo no existe!',
                    errors: { message: 'Vehiculo no encontrado!' }
                });
            }

            response.status(200).json({
                ok: true,
                vehiculo: vehiculo
            });

        });


});

// =========================================
// Actualizar vehiculo
// =========================================

app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Vehiculo.findById(id, (err, vehiculo) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar vehiculo!',
                errors: err
            });
        }

        if (!vehiculo) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Vehiculo no existe!',
                errors: { message: 'Vehiculo no encontrado!' }
            });
        }

        vehiculo.nombre = body.nombre;
        vehiculo.usuario = request.usuario._id;
        vehiculo.ruta = body.ruta;


        vehiculo.save((err, vehiculoUpdate) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar vehiculo!',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                vehiculo: vehiculoUpdate
            });
        });

    });

});

// =========================================
// Crear nuevo vehiculo
// =========================================

app.post('/', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var body = request.body;

    var vehiculo = new Vehiculo({
        nombre: body.nombre,
        usuario: request.usuario._id,
        ruta: body.ruta
    });

    vehiculo.save((err, newVehiculo) => {

        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear vehiculo!',
                errors: err
            });
        }

        response.status(201).json({
            ok: true,
            vehiculo: newVehiculo,
        });
    });
});

// =========================================
// Eliminar vehiculo
// =========================================

app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;

    Vehiculo.findByIdAndRemove(id, (err, vehiculoDelete) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar vehiculo!',
                errors: err
            });
        }

        if (!vehiculoDelete) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Vehiculo no existe!',
                errors: { message: 'Vehiculo no existe!' }
            });
        }

        response.status(200).json({
            ok: true,
            vehiculo: vehiculoDelete
        });

    });
});

module.exports = app;