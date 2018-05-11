var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


// =========================================
// Verificar token
// =========================================
exports.verificaToken = function(request, response, next) {

    var token = request.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return response.status(401).json({
                ok: false,
                mensaje: 'Token Incorrecto!',
                errors: err
            });
        }

        request.usuario = decoded.usuario;
        next();

    });

}



// =========================================
// Verificar Admin
// =========================================
exports.verificaADMIN_ROLE = function(request, response, next) {

    var usuario = request.usuario;

    if (usuario.role === 'ADMIN_ROLE' || usuario.role === 'SUPER_ROLE') {
        next();
        return;
    } else {
        return response.status(401).json({
            ok: false,
            mensaje: 'ERROR: USUARIO NO AUTORIZADO',
            errors: { message: 'ERROR: USUARIO NO AUTORIZADO' }
        });
    }

}



// =========================================
// Permitir edición de datos - Mismo Usuario
// =========================================
exports.verificaADMIN_ROLE_MISMO_USUARIO = function(request, response, next) {

    var usuario = request.usuario;
    var id = request.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id || usuario.role === 'SUPER_ROLE') {
        next();
        return;
    } else {
        return response.status(401).json({
            ok: false,
            mensaje: 'ERROR: USUARIO NO AUTORIZADO',
            errors: { message: 'ERROR: USUARIO NO AUTORIZADO' }
        });
    }

}