const mongoose = require('mongoose');

const tableModel = new mongoose.Schema({
    merchant_id: {type: mongoose.Types.ObjectId, required: true},
    space: { type: Number, required: true },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available',
    },
});

module.exports = mongoose.model('Table', tableModel);
