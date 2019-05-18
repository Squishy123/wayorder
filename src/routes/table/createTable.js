import * as table from '../../middle/tableFunctions';
import * as merchant from '../../middle/merchantFunctions';
import * as general from '../../middle/generalFunctions';

module.exports = {
    path: '/table',
    method: 'POST',
    handler: [
        (req, res, next) => {
            if (next) next();
        },
        merchant.verifyAccessToken,
        table.addTable,
        general.sendPayload,
    ],
};
