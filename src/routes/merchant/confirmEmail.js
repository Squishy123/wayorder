import * as merchant from '../../middle/merchantFunctions';
import * as general from '../../middle/generalFunctions';

module.exports = {
    path: '/merchant/confirm',
    method: 'POST',
    handler: [merchant.verifyConfirmationToken, general.sendPayload],
};
