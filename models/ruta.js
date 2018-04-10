var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rutaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { collection: 'rutas' });

module.exports = mongoose.model('Ruta', rutaSchema);