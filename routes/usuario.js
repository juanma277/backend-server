var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

//NODEMAILER
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var xoauth2 = require('xoauth2');

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

// =========================================
// Reset Password Usuario - Sin logueo
// =========================================

app.post('/password/recover/:id', (request, response) => {
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


// ==============================================
// Enviar Correo Electronico para Reset Password
// ==============================================

app.get('/password/recordar/:email', (request, response) => {

    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'juanma27719@gmail.com',
            pass: '1061692947S*'
        }
    });

    var email = request.params.email;
    var token = bcrypt.hashSync(email, 10);

    Usuario.find({ email: email }, (err, usuario) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }

        if (usuario.length === 0) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Usuario no existe!',
                errors: { message: 'El email ingresado no existe!' }
            });
        } else {
            var html = "<h3>JectApp Recuperación de contraseña</h3><p><strong>Solicitaste recuperacion de la contraseña, por favor sigue el siguiente link: </strong></p>"  + "http://jectapp.com/#/recover/"+usuario[0]._id;

            var mailOptions = {
                from: 'Soporte JectApp',
                to: email,
                subject: 'Recuperacion de Contraseña',
                text: 'Anteriormente solicitaste la recuperacion de la contraseña por favor sigue el siguiente link:',
                html: html
            }

            transport.sendMail(mailOptions, function(error, resp) {
                if (error) {
                    return response.status(200).json({
                        ok: false,
                        respuesta: 'Ha ocurrido un error por favor intentalo nuevamente.',
                        error: error
                    });
                } else {
                    return response.status(200).json({
                        ok: true,
                        usuario: usuario,
                        respuesta: 'Email enviado'
                    });
                }
            });

        }

    });
});

module.exports = app;