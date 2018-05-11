var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var barrioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    lat: { type: Number, required: [true, 'La latitud es necesario'] },
    lng: { type: Number, required: [true, 'La longitud es necesario'] },
    //usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { collection: 'barrios' });

module.exports = mongoose.model('Barrio', barrioSchema);