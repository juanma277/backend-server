// Requires
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

//SOCKET IO
//module.exports.io = require('socket.io')(server);
//require('./sockets/sokect');

//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('cliente'));
app.use(express.static(path.join(__dirname, "public")));

//Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var vehiculoRoutes = require('./routes/vehiculo');
var rutaRoutes = require('./routes/ruta');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesdRoutes = require('./routes/imagenes');
var socketRoutes = require('./routes/sockets');
var barrioRoutes = require('./routes/barrio');
var empresaRoutes = require('./routes/empresa');
var mailRoutes = require('./routes/mail');
var marcadoresRoutes = require('./routes/marcador');

//Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/jectappDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/vehiculo', vehiculoRoutes);
app.use('/ruta', rutaRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagenes', imagenesdRoutes);
app.use('/socket.io', socketRoutes);
app.use('/barrio', barrioRoutes);
app.use('/empresa', empresaRoutes);
app.use('/marcador', marcadoresRoutes);
app.use('/mail', mailRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//Escuchar peticiones
server.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});