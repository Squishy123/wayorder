import * as user from '../../middle/userFunctions';
import * as general from '../../middle/generalFunctions';

module.exports = {
    path: '/user/confirm',
    method: 'POST',
    handler: [user.verifyConfirmationToken, general.sendPayload],
};
