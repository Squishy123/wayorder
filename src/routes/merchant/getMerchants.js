const Merchant = require('../../models/merchant');

import { sendPayload } from '../../middle/generalFunctions';

module.exports = {
    path: "/merchants",
    method: "GET",
    handler: [async (req, res, next) => {

        req.payload = {
            message: "Successfully queried merchants.",
            status: "success", data: { merchants: await Merchant.find().select('-email').select('-password') }
                
        };

        if (next) next();
    }, sendPayload]
}