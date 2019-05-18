import * as user from '../../middle/userFunctions';
import * as general from '../../middle/generalFunctions';

module.exports = {
    path: '/user',
    method: 'POST',
    handler: [
        user.validateUserCredentials,
        user.checkIfUserExistsNotVerified,
        user.createUser,
        user.sendEmailVerification,
        general.sendPayload,
    ],
};
