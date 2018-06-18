var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//Modelo
var Usuario = require('../models/usuario');

var mdAutenticacion = require('../middlewares/autenticacion');


// =========================================
// Renovar Token
// =========================================

app.get('/renuevaToken', mdAutenticacion.verificaToken, (request, response) => {

    var token = jwt.sign({ usuario: request.usuario }, SEED, { expiresIn: 500000 });

    response.status(500).json({
        ok: true,
        token: token
    });
});




// =========================================
// Metodo de Login Google
// =========================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(request, response) => {

    var token = request.body.token;
    var googleUser = await verify(token).catch(err => {
        return response.status(403).json({
            ok: false,
            mensaje: 'Token no valido',
        });
    });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Debes usar la autenticación normal!'
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 500000 });

                response.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)
                });
            }
        } else {
            //USUARIO NO EXISTE - SE CREA USUARIO
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = '**********';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error al crear usuario!',
                        errors: err
                    });
                }

                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 500000 });

                response.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)

                });

            })


        }
    });

});



// =========================================
// Metodo de Login Normal
// =========================================

app.post('/', (request, response) => {

    var body = request.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }

        if (!usuarioDB) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Datos incorrectos',
                errors: { message: 'Datos incorrectos' }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Datos incorrectos',
                errors: { message: 'Datos incorrectos' }
            });
        }

        //CREAR TOKEN
        usuarioDB.password = '**********';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 500000 });

        response.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)

        });
    });

});

// =========================================
// Obtener Menú
// =========================================

function obtenerMenu(ROLE) {

    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dasboard', url: '/dashboard' },
                //{ titulo: 'ProgressBar', url: '/progress' },
                //{ titulo: 'Graficas', url: '/graficas1' },
                //{ titulo: 'Chat', url: '/chat' },
                //{ titulo: 'Promesas', url: '/promesas' },
                //{ titulo: 'Rxjs', url: '/Rxjs' }
            ]
        },

    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu.push({

            titulo: 'Mantenimiento',
            icono: 'mdi mdi-settings',
            submenu: [
                //{ titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Vehiculos', url: '/vehiculos' },
                { titulo: 'Rutas', url: '/rutas' }
            ]
        });
    }


    if (ROLE === 'BUSINESS_ROLE') {
        menu.push({

            titulo: 'Datos Empresa',
            icono: 'mdi mdi-cart',
            submenu: [
                { titulo: 'Empresa', url: '/empresa' }
            ]
        });
    }


    if (ROLE === 'USER_ROLE') {
        menu.push({

            titulo: 'Datos Vehiculo',
            icono: 'mdi mdi-car',
            submenu: [
                { titulo: 'Vehiculo', url: '/vehiculo' }
            ]
        });
    }

    if (ROLE === 'SUPER_ROLE') {
        menu.push({

            titulo: 'Super Usuario',
            icono: 'mdi mdi-lock',
            submenu: [
                { titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Rutas', url: '/rutas' },
                { titulo: 'Vehiculos', url: '/vehiculos' },
                { titulo: 'Barrios', url: '/barrios' },
                { titulo: 'Empresas', url: '/empresas' },
                { titulo: 'Marcadores', url: '/marcadores' }

            ]
        });
    }

    return menu;

}

module.exports = app;