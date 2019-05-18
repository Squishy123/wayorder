const mongoose = require('mongoose');

const storeModel = new mongoose.Schema({
    long: { type: Number, required: true },
    lat: { type: Number, required: true },
    tables: [ { table_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' } } ],
    open_tables: [ { table_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' } } ],
    filled_tables: [ { table_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' } } ],
});

module.exports = mongoose.model('Store', storeModel);