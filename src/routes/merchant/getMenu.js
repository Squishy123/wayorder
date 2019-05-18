import * as product from '../../middle/productFunctions';
import * as general from '../../middle/generalFunctions';

module.exports = {
    path: '/products',
    method: 'GET',
    handler: [product.getProducts, general.sendPayload]
}