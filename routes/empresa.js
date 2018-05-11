var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Empresa = require('../models/empresa');

var ObjectId = require('mongodb').ObjectID;

// =========================================
// Obtener todas las empresas - Paginadas
// =========================================

app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Empresa.find({})
        .populate('usuario', 'nombre email')
        .exec(

            (err, empresas) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando empresas!',
                        errors: err
                    });
                }

                Empresa.count({}, (err, cuenta) => {
                    response.status(200).json({
                        ok: true,
                        empresas: empresas,
                        total: cuenta
                    });
                });
            });

});

// ===========================================
// Obtener todas las empresas - Tipo Transport
// ===========================================

app.get('/All', (request, response, next) => {

    Empresa.find({ tipo: 'TRANSPORT' })
        .populate('usuario', 'nombre email')
        .exec(

            (err, empresas) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando empresas!',
                        errors: err
                    });
                }

                Empresa.count({ tipo: 'TRANSPORT' }, (err, cuenta) => {
                    response.status(200).json({
                        ok: true,
                        empresas: empresas,
                        total: cuenta
                    });
                });
            });

});

// =========================================
// Obtener empresa por usuario
// =========================================

app.get('/:id', (request, response) => {
    var id = request.params.id;

    Empresa.find({ usuario: ObjectId(id) })
        .populate('usuario', 'nombre email img')
        .exec((err, empresa) => {

            if (err) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar empresa!',
                    errors: err
                });
            }

            if (!empresa) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Empresa no existe!',
                    errors: { message: 'Empresa no encontrada!' }
                });
            }

            response.status(200).json({
                ok: true,
                empresa: empresa
            });

        });


});

// =========================================
// Obtener empresa para select
// =========================================

app.get('/obtener/:id', (request, response) => {
    var id = request.params.id;

    Empresa.findById(id)
        .populate('usuario', 'nombre email img')
        .exec((err, empresa) => {

            if (err) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar empresa!',
                    errors: err
                });
            }

            if (!empresa) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Empresa no existe!',
                    errors: { message: 'Empresa no encontrada!' }
                });
            }

            response.status(200).json({
                ok: true,
                empresa: empresa
            });

        });


});


// =========================================
// Actualizar Datos de Empresa
// =========================================

app.put('/:id', [mdAutenticacion.verificaToken /*mdAutenticacion.verificaADMIN_ROLE*/ ], (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Empresa.findById(id, (err, empresa) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar empresa!',
                errors: err
            });
        }

        if (!empresa) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Empresa no existe!',
                errors: { message: 'Empresa no encontrada!' }
            });
        }

        empresa.nombre = body.nombre;
        empresa.informacion = body.informacion;
        empresa.descripcion = body.descripcion;


        empresa.save((err, empresaUpdate) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar empresa!',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                empresa: empresaUpdate
            });
        });

    });

});

// =========================================
// Actualizar Ubicación de Empresa
// =========================================

app.get('/:id/:lat/:lng', [mdAutenticacion.verificaToken /*mdAutenticacion.verificaADMIN_ROLE*/ ], (request, response) => {

    var id = request.params.id;
    var lat = request.params.lat;
    var lng = request.params.lng;


    Empresa.findById(id, (err, empresa) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar empresa!',
                errors: err
            });
        }

        if (!empresa) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Empresa no existe!',
                errors: { message: 'Empresa no encontrada!' }
            });
        }

        empresa.lat = lat
        empresa.lng = lng;


        empresa.save((err, empresaUpdate) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar empresa!',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                empresa: empresaUpdate
            });
        });

    });

});


// =========================================
// Crear Empresa
// =========================================

app.post('/', [mdAutenticacion.verificaToken, /*mdAutenticacion.verificaADMIN_ROLE*/ ], (request, response) => {
    var body = request.body;

    var empresa = new Empresa({
        nombre: body.nombre,
        tipo: body.tipo,
        informacion: body.informacion,
        descripcion: body.descripcion,
        lat: body.lat,
        lng: body.lng,
        usuario: body.usuario
    });

    empresa.save((err, newEmpresa) => {

        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear empresa!',
                errors: err
            });
        }

        response.status(201).json({
            ok: true,
            empresa: newEmpresa
        });
    });
});

// =========================================
// Eliminar Empresa
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