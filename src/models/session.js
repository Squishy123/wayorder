const mongoose = require('mongoose');

const sessionModel = new mongoose.Schema({
    start_date: { type: Date, default: Date.now(), required: true },
    end_date: { type: Date, default: Date.now() },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    table_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true,
    },
    merchant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
        required: true,
    },
});

module.exports = mongoose.model('Session', sessionModel);
