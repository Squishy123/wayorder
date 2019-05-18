const mongoose = require('mongoose');

const tableModel = new mongoose.Schema({
    spaces: { type: Number, required: true },
    status: { type: String, enum: [ 'available', 'unavailable' ] },
});

module.exports = mongoose.model('Table', tableModel);