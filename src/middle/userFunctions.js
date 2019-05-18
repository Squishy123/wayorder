import { sendPayload } from './generalFunctions';
const User = require('../models/user');

function validateUserCredentials(req, res, next) {
    req.payload.message = [];

    if (req.params.first_name) {
        let fnLength = req.params.first_name.length;
        if (fnLength < 2) {
            req.payload.status = 'failed';
            req.payload.message.push('First name length is less than 2');
        }
        if (fnLength > 36) {
            req.payload.status = 'failed';
            req.payload.message.push('First name length is greater than 36');
        }
    } else {
        req.payload.status = 'failed';
        req.payload.message.push('Missing required param: first_name');
    }

    if (req.params.last_name) {
        let lnLength = req.params.last_name.length;
        if (lnLength < 2) {
            req.payload.status = 'failed';
            req.payload.message.push('Last name length is less than 2');
        }
        if (lnLength > 36) {
            req.payload.status = 'failed';
            req.payload.message.push('Last name length is greather than 36');
        }
    } else {
        req.payload.status = 'failed';
        req.payload.message.push('Missing required param: last_name');
    }

    if (req.params.email) {
        let regex = /\S+@\S+\.\S+/;
        if (!regex.test(req.params.email)) {
            req.payload.status = 'failed';
            req.payload.message.push('Invalid email address');
        }
    } else {
        req.payload.status = 'failed';
        req.payload.message.push('Missing required param: email');
    }

    if (req.params.password) {
        let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!regex.test(req.params.password) && false) {
            req.payload.status = 'failed';
            req.payload.message.push('Invalid password');
        }
    } else {
        req.payload.status = 'failed';
        req.payload.message.push('Missing required param: password');
    }

    if (req.payload.status === 'failed') return sendPayload(req, res);

    if (next) next();
}

async function checkIfUserExistsNotVerified(req, res, next) {
    if (req.params.first_name && req.params.last_name && req.params.email) {
        if (await User.findOne({ email: req.params.email })) {
            req.payload.status = 'failed';
            req.payload.message = 'User already exists';
            return sendPayload(req, res);
        }
    }

    if (next) next();
}

async function createUser(req, res, next) {
    let user = new User();
    user.first_name = req.params.first_name;
    user.last_name = req.params.last_name;
    user.email = req.params.email;
    await user.addHashedPassword(req.params.password);
    await user.save();
    req.scope.user = user;
    if (next) next();
}

async function sendEmailVerification(req, res, next) {
    let confirmToken = await req.scope.user.createEmailConfirmationToken();

    let info = await this.binds.transporter.sendMail({
        from: "'WayOrder'<service@wayorder.com>",
        to: `${req.params.email}`,
        subject: 'Welcome to WayOrder! Please confirm your account',
        text: `Please visit the following link in order to confirm your account registration: wayorder.com/confirm?confirmation_token=${confirmToken}`,
    });

    //set payload
    req.payload = {
        message: 'Successfully Created New User',
        status: 'success',
        data: req.scope.user,
    };

    if (next) next();
}

async function verifyConfirmationToken(req, res, next) {
    if (!req.params.confirmation_token) {
        req.payload = {
            message: 'Missing required parameter: confirmation_token',
            status: 'fail',
        };
        return sendPayload(req, res);
    }

    req.payload = await User.verifyEmailConfirmationToken(
        req.params.confirmation_token
    );

    if (next) next();
}

async function verifyUserCredentials(req, res, next) {
    let verified = await User.verifyCredentials(req.params.email, req.params.password);

    if (!verified.user) {
        req.payload = verified;
        return sendPayload(req, res);
    }

    let accessToken = await verified.user.createAccessToken();

    req.payload = {
        status: 'success',
        message: 'Successfully Verified',
        data: { access_token: accessToken }
    };

    if (next) next();
}

module.exports = {
    validateUserCredentials: validateUserCredentials,
    checkIfUserExistsNotVerified: checkIfUserExistsNotVerified,
    createUser: createUser,
    sendEmailVerification: sendEmailVerification,
    verifyConfirmationToken: verifyConfirmationToken,
    verifyUserCredentials: verifyUserCredentials
};
