const mongoose = require('mongoose');

const merchantModel = new mongoose.Schema({
    name: { type: String },
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
    meta: { Type: Object },
});

module.exports = mongoose.model('Merchant', merchantModel);
