import { sendPayload } from './generalFunctions';
const Product = require('../models/product');

function validateProduct(req, res, next) {
    if (req.params.name) {
        let nameLength = req.params.name.length;
        if (nameLength < 2) {
            req.payload.status = 'failed';
            req.payload.message = 'Name length is less than 2';
        }
        if (nameLength > 36) {
            req.payload.status = 'failed';
            req.payload.message = 'Name length is greater than 36';
        }
    } else {
        req.payload.status = 'failed';
        req.payload.message = 'Missing required param: name';
    }

    if (req.params.price) {
        if (isNaN(req.params.price)) {
            req.payload.status = 'failed';
            req.payload.message = 'Invalid price';
        }
    } else {
        req.payload.status = 'failed';
        req.payload.message = 'Missing required param: price';
    }

    if (req.payload.status === 'failed') {
        return sendPayload(req, res);
    }

    if (next) next();
}

async function addProduct(req, res, next) {
    let product = new Product();
    product.name = req.params.name;
    product.price = req.params.price;
    product.description = req.params.description;
    product.prep_time = req.params.prep_time;
    await product.save();

    req.scope.merchant.menu.push(product);
    await req.scope.merchant.save();

    req.payload = {
        message: 'Successfully added product.',
        status: 'success',
        data: { product: product },
    };

    if (next) next();
}

module.exports = {
    addProduct: addProduct,
    validateProduct: validateProduct,
};
