const mongoose = require('mongoose');

const sessionModel = new mongoose.Schema({
    start_date: { type: Date, default: Date.now(), required: true },
    end_date: { type: Date, default: Date.now() },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    table_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
});

module.exports = mongoose.model('Session', sessionModel);