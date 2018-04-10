var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Usuario = require('../models/usuario');

// =========================================
// Obtener todos los usuarios
// =========================================

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

// =========================================
// Actualizar nuevo usuario
// =========================================

app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {
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
// Crear nuevo usuario
// =========================================

app.post('/', mdAutenticacion.verificaToken, (request, response) => {
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

app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {
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

module.exports = app;