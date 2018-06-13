var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Usuario = require('../models/usuario');

// =========================================
// Obtener todos los usuarios - Paginados
// =========================================

app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec(

            (err, usuarios) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios!',
                        errors: err
                    });
                }

                Usuario.count({}, (err, cuenta) => {
                    response.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: cuenta
                    });

                })


            });

});

// =========================================
// Obtener todos los usuarios
// =========================================

app.get('/all', (request, response, next) => {


    Usuario.find({}, 'nombre email img role google')
        .exec(

            (err, usuarios) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios!',
                        errors: err
                    });
                }

                Usuario.count({}, (err, cuenta) => {
                    response.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: cuenta
                    });

                })


            });

});

// =========================================
// Actualizar usuario
// =========================================

app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE_MISMO_USUARIO], (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }

        if (!usuario) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Usuario no existe!',
                errors: { message: 'Usuario no encontrado!' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioUpdate) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario!',
                    errors: err
                });
            }

            usuarioUpdate.password = '**********';

            response.status(200).json({
                ok: true,
                usuario: usuarioUpdate
            });
        });

    });

});

// =========================================
// Crear usuario
// =========================================

app.post('/', (request, response) => {
    var body = request.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, newUsuario) => {

        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario!',
                errors: err
            });
        }

        response.status(201).json({
            ok: true,
            usuario: newUsuario,
            usuarioToken: request.usuario
        });
    });
});

// =========================================
// Eliminar usuario
// =========================================

app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;
   
    Usuario.findByIdAndRemove(id, (err, usuarioDelete) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario!',
                errors: err
            });
        }

        if (!usuarioDelete) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Usuario no existe!',
                errors: { message: 'Usuario no existe!' }
            });
        }

        response.status(200).json({
            ok: true,
            usuario: usuarioDelete
        });

    });
});

// =========================================
// Reset Password Usuario - Desde USER
// =========================================

app.post('/password/reset/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }

        if (!usuario) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Usuario no existe!',
                errors: { message: 'Usuario no encontrado!' }
            });
        }

        usuario.password = bcrypt.hashSync(body.password, 10);

        usuario.save((err, usuarioUpdate) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario!',
                    errors: err
                });
            }

            usuarioUpdate.password = '**********';

            response.status(200).json({
                ok: true,
                usuario: usuarioUpdate
            });
        });

    });
});

// =========================================
// Reset Password Usuario - Desde SUPER_USER
// =========================================

app.get('/reset/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (request, response) => {
    var id = request.params.id;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }

        if (!usuario) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Usuario no existe!',
                errors: { message: 'Usuario no encontrado!' }
            });
        }

        usuario.password = bcrypt.hashSync('123456*', 10);

        usuario.save((err, usuarioUpdate) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario!',
                    errors: err
                });
            }

            usuarioUpdate.password = '**********';

            response.status(200).json({
                ok: true,
                usuario: usuarioUpdate
            });
        });

    });
});

module.exports = app;