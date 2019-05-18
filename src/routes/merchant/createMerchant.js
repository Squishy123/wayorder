import * as merchant from '../../middle/merchantFunctions';
import * as general from '../../middle/generalFunctions';

module.exports = {
    path: '/merchant',
    method: 'POST',
    handler: [
        merchant.validateMerchant,
        merchant.checkIfMerchantExistsNotVerified,
        merchant.createMerchant,
        merchant.sendEmailVerification,
        general.sendPayload,
    ],
};
