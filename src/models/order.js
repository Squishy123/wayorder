const mongoose = require('mongoose');

const orderModel = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'cancelled', 'completed'],
        default: 'pending',
        required: true,
    },
    total: { type: Number },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    meta: { type: Object },
});

module.exports = mongoose.model('Order', orderModel);
