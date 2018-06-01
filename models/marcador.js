var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var marcadorSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    icono: { type: String, required: [true, 'El icono es necesario'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesario'] },    
    lat: { type: Number, required: true, default: '2.446112' },
    lng: { type: Number, required: true, default: '-76.6060556' },
    img1: { type: String, required: false },
    img2: { type: String, required: false },
    img3: { type: String, required: false },
    img4: { type: String, required: false }

}, { collection: 'marcadores' });

module.exports = mongoose.model('Marcador', marcadorSchema);