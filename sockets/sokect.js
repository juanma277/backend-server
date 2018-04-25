//SOCKET IO

const { io } = require('../app')

io.on('connection', (socket) => {
    console.log('Usuario Conectado');

    socket.on('disconnect', (data) => {
        console.log('Usuario Desconectado');
    });

    socket.on('obtenerVehiculos', (data) => {
        console.log(data);
    });

    socket.broadcast.emit('obtenerVehiculos', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido'
    });

});