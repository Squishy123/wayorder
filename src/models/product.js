const mongoose = require('mongoose');

const productModel = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    //in millis
    prep_time: Number,
    merchant_id: {type: mongoose.Schema.Types.ObjectId},
    image: String
});

module.exports = mongoose.model('Product', productModel);
