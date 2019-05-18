const mongoose = require('mongoose');

const orderModel = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'cancelled', 'completed'],
        default: 'pending',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    merchant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    purchased: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        },
    ],
    total_cost: Number,
    meta: { type: Object },
});

module.exports = mongoose.model('Order', orderModel);
