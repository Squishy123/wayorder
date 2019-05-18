import * as merchant from '../../middle/merchantFunctions';
import * as general from '../../middle/generalFunctions';

module.exports = {
    path: '/merchant',
    method: "PUT",
    handler: [merchant.verifyAccessToken, merchant.updateInfo, general.sendPayload]
}