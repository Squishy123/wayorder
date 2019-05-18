import * as user from '../../middle/userFunctions';
import * as general from '../../middle/generalFunctions';

module.exports = {
    path: '/user/login',
    method: 'POST',
    handler: [user.verifyUserCredentials, general.sendPayload],
};
