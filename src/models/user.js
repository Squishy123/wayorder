const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    card_number: { type: String },
    orders: [
        { order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' } },
    ],
    current_order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
});

module.exports = mongoose.model('User', userModel);
