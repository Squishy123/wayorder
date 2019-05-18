import * as product from '../../middle/productFunctions';
import * as merchant from '../../middle/merchantFunctions';
import * as general from '../../middle/generalFunctions';

module.exports = {
    path: '/product',
    method: 'POST',
    handler: [
        product.validateProduct,
        merchant.verifyAccessToken,
        product.addProduct,
        general.sendPayload,
    ],
};
