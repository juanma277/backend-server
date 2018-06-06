var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('./empresa');
require('./usuario')


var rutaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    lat_origen: { type: Number, required: [true, 'La latitud es necesario'] },
    lng_origen: { type: Number, required: [true, 'La longitud es necesario'] },
    lat_destino: { type: Number, required: [true, 'La latitud es necesario'] },
    lng_destino: { type: Number, required: [true, 'La longitud es necesario'] },
    barrios: { type: String, required: [true, 'Debe ingresar por lo menos un barrio'] },    
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: false },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'El id de la empresa es obligatorio']
    },
}, { collection: 'rutas' });

module.exports = mongoose.model('Ruta', rutaSchema);