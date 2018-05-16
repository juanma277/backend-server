var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var empresaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    tipo: { type: String, required: [true, 'El tipo es necesario'] },
    informacion: { type: String, required: [true, 'La informacion es necesario'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesario'] },
    icono: { type: String, required: [true, 'El icono es necesario'] },
    img1: { type: String, required: false },
    img2: { type: String, required: false },
    img3: { type: String, required: false },
    img4: { type: String, required: false },
    lat: { type: Number, required: true, default: '2.446112' },
    lng: { type: Number, required: true, default: '-76.6060556' },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, { collection: 'empresas' });

module.exports = mongoose.model('Empresa', empresaSchema);