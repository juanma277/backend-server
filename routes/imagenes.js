var express = require('express');

var app = express();

const path = require('path');
const filesystem = require('fs');


//Rutas
app.get('/:tipo/:img', (request, response, next) => {

    var tipo = request.params.tipo;
    var img = request.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (filesystem.existsSync(pathImagen)) {
        response.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        response.sendFile(pathNoImage);
    }
});

module.exports = app;