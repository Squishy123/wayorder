import * as merchant from '../../middle/merchantFunctions';
import * as general from '../../middle/generalFunctions';

module.exports = {
    path: '/merchant/login',
    method: 'POST',
    handler: [merchant.verifyUserCredentials, general.sendPayload],
};
