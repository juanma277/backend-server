var express = require('express');
var fileUpload = require('express-fileupload');
var filesystem = require('fs');

var app = express();

//Modelos
var Ruta = require('../models/ruta');
var Vehiculo = require('../models/vehiculo');
var Usuario = require('../models/usuario');
var Empresa = require('../models/empresa');
var Marcador = require('../models/marcador');


// default options
app.use(fileUpload());

//Rutas
app.put('/:tipo/:id', (request, response, next) => {

    var tipo = request.params.tipo;
    var id = request.params.id;
    var img = request.query.img;

    //Tipos de coleccion Validos: Vehiculos - Rutas - Usuarios - Empresas - Marcador
    var tiposValidos = ['Vehiculos', 'Rutas', 'Usuarios', 'Empresas', 'Marcador'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no valida!',
            errors: { message: 'Tipo de colección no valida!' }
        });

    }

    if (!request.files) {
        return response.status(400).json({
            ok: false,
            mensaje: 'No hay selección de imagen!',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo
    var archivo = request.files.imagen;
    var archivoSeparado = archivo.name.split('.');
    var tipoArchivo = archivoSeparado[archivoSeparado.length - 1];

    //Extensiones permitidas
    var extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg','PNG', 'JPG', 'GIF', 'JPEG']; // agregar extensiones en may򳣵las

    if (extensionesPermitidas.indexOf(tipoArchivo) < 0) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Tipo de archivo no valido',
            errors: { message: 'Tipo de archivo no valido, son validos: ' + extensionesPermitidas.join(', ') }
        });
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${tipoArchivo}`;

    //Mover archivo del temporal a un PATH
    var path = `./uploads/${tipo.toLowerCase()}/${nombreArchivo}`; //Cambio se crea path con carpeta en minusculas

    archivo.mv(path, err => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo ',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, response, img);
    });
});


function subirPorTipo(tipo, id, nombreArchivo, response, img) {

    if (tipo === 'Usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return response.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }
            var pathOld = './uploads/usuarios/' + usuario.img;

            //Borrar imagen anterior <si existe>.
            if (filesystem.existsSync(pathOld)) {
                try{
              	  filesystem.unlink(pathOld);
		}catch(err){
		  console.log(err);	
		}

            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioUpdate) => {

                usuarioUpdate.password = '**********';
		console.log(err);

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuario: usuarioUpdate
                });
            });
        });
    }

    if (tipo === 'Vehiculos') {

        Vehiculo.findById(id, (err, vehiculo) => {

            if (!vehiculo) {
                return response.status(400).json({
                    ok: true,
                    mensaje: 'Vehiculo no existe',
                    errors: { message: 'Vehiculo no existe' }
                });
            }
            var pathOld = './uploads/vehiculos/' + vehiculo.img;

            //Borrar imagen anterior <si existe>.
            if (filesystem.existsSync(pathOld)) {
                filesystem.unlink(pathOld);
            }

            vehiculo.img = nombreArchivo;
            vehiculo.save((err, vehiculoUpdate) => {

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de vehiculo actualizado',
                    vehiculo: vehiculoUpdate
                });
            });
        });

    }

    if (tipo === 'Rutas') {

        Ruta.findById(id, (err, ruta) => {

            if (!ruta) {
                return response.status(400).json({
                    ok: true,
                    mensaje: 'Ruta no existe',
                    errors: { message: 'Ruta no existe' }
                });
            }
            var pathOld = './uploads/rutas/' + ruta.img;

            //Borrar imagen anterior <si existe>.
            if (filesystem.existsSync(pathOld)) {
		try{
              	  filesystem.unlink(pathOld);  //Manejo de excepciones
		}catch(err){
		  console.log(err);	
		}
            }

            ruta.img = nombreArchivo;
            ruta.save((err, rutaUpdate) => {
		console.log(err);

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de ruta actualizado',
                    ruta: rutaUpdate
                });
            });
        });

    }

    if (tipo === 'Empresas') {

        Empresa.findById(id, (err, empresa) => {

            if (!empresa) {
                return response.status(400).json({
                    ok: true,
                    mensaje: 'Empresa no existe',
                    errors: { message: 'Empresa no existe' }
                });
            }

            switch (img) {
                case '1':
                    var pathOld = './uploads/empresas/' + empresa.img1;
                    empresa.img1 = nombreArchivo;
                    break;

                case '2':
                    var pathOld = './uploads/empresas/' + empresa.img2;
                    empresa.img2 = nombreArchivo;
                    break;

                case '3':
                    var pathOld = './uploads/empresas/' + empresa.img3;
                    empresa.img3 = nombreArchivo;
                    break;

                case '4':
                    var pathOld = './uploads/empresas/' + empresa.img4;
                    empresa.img4 = nombreArchivo;

                default:
                    break;
            }



            //Borrar imagen anterior <si existe>.
            if (filesystem.existsSync(pathOld)) {
                filesystem.unlink(pathOld);
            }



            empresa.save((err, empresaUpdate) => {

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de empresa actualizada',
                    empresa: empresaUpdate
                });
            });
        });

    }


    if (tipo === 'Marcador') {

        Marcador.findById(id, (err, marcador) => {

            if (!marcador) {
                return response.status(400).json({
                    ok: true,
                    mensaje: 'Marcador no existe',
                    errors: { message: 'Marcador no existe' }
                });
            }

            switch (img) {
                case '1':
                    var pathOld = './uploads/marcador/' + marcador.img1;
                    marcador.img1 = nombreArchivo;
                    break;

                case '2':
                    var pathOld = './uploads/marcador/' + marcador.img2;
                    marcador.img2 = nombreArchivo;
                    break;

                case '3':
                    var pathOld = './uploads/marcador/' + marcador.img3;
                    marcador.img3 = nombreArchivo;
                    break;

                case '4':
                    var pathOld = './uploads/marcador/' + marcador.img4;
                    marcador.img4 = nombreArchivo;

                default:
                    break;
            }

            //Borrar imagen anterior <si existe>.
            if (filesystem.existsSync(pathOld)) {
                filesystem.unlink(pathOld);
            }


            marcador.save((err, marcadorUpdate) => {

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de marcador actualizada',
                    marcador: marcadorUpdate
                });
            });
        });

    }

}

module.exports = app;