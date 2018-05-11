var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vehiculoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    lat: { type: Number, required: true, default: '2.446112' },
    lng: { type: Number, required: true, default: '-76.6060556' },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        default: '5accff719768d11378461ade',
        required: [true, 'El id de la empresa es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    ruta: {
        type: Schema.Types.ObjectId,
        ref: 'Ruta',
        required: [true, 'El id de la ruta es obligatorio']
    }
}, { collection: 'vehiculos' });

module.exports = mongoose.model('Vehiculo', vehiculoSchema);