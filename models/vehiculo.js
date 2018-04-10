var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vehiculoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    ruta: {
        type: Schema.Types.ObjectId,
        ref: 'Ruta',
        required: [true, 'El id de la ruta es obligatorio']
    }
}, { collection: 'vehiculos' });

module.exports = mongoose.model('Vehiculo', vehiculoSchema);