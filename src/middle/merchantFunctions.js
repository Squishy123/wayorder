import { sendPayload } from './generalFunctions';
const Merchant = require('../models/merchant');

function validateMerchant(req, res, next) {
    req.payload.message = [];

    if (req.params.name) {
        let nameLength = req.params.name.length;
        if (nameLength < 2) {
            req.payload.status = 'failed';
            req.payload.message.push('Name length is less than 2');
        }
        if (nameLength > 36) {
            req.payload.status = 'failed';
            req.payload.message.push('Name length is greater than 36');
        }
    } else {
        req.payload.status = 'failed';
        req.payload.message.push('Missing required param: name');
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
        if (!regex.test(req.params.password)) {
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

async function createMerchant(req, res, next) {
    let merchant = new Merchant();
    merchant.name = req.params.name;
    merchant.email = req.params.email;
    await merchant.addHashedPassword(req.params.password);
    await merchant.save();

    req.scope.merchant = merchant;

    if (next) next();
}

async function checkIfMerchantExistsNotVerified(req, res, next) {
    if (req.params.name && req.params.email) {
        if (await Merchant.findOne({ email: req.params.email })) {
            req.payload.status = 'failed';
            req.payload.message = 'Merchant already exists';
            return sendPayload(req, res);
        }
    }

    if (next) next();
}

async function sendEmailVerification(req, res, next) {
    let confirmToken = await req.scope.merchant.createEmailConfirmationToken();

    let info = await this.binds.transporter.sendMail({
        from: "'WayOrder'<service@wayorder.com>",
        to: `${req.params.email}`,
        subject: 'Welcome to WayOrder! Please confirm your account',
        text: `Please visit the following link in order to confirm your account registration: wayorder.com/confirm?confirmation_token=${confirmToken}`,
    });

    //set payload
    req.payload = {
        message: 'Successfully Created New Merchant',
        status: 'success',
        data: req.scope.merchant,
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

    req.payload = await Merchant.verifyEmailConfirmationToken(
        req.params.confirmation_token
    );

    if (next) next();
}

async function verifyMerchantCredentials(req, res, next) {
    let verified = await Merchant.verifyCredentials(
        req.params.email,
        req.params.password
    );

    if (!verified.merchant) {
        req.payload = verified;
        return sendPayload(req, res);
    }

    let accessToken = await verified.merchant.createAccessToken();

    req.payload = {
        status: 'success',
        message: 'Successfully Verified',
        data: { access_token: accessToken },
    };

    if (next) next();
}

async function verifyAccessToken(req, res, next) {
    let verified = await Merchant.verifyAccessToken(req.params.access_token);

    req.payload = verified;
    if (!verified.merchant) return sendPayload(req, res);

    req.scope.merchant = verified.merchant;

    if (next) next();
}

async function updateInfo(req, res, next) {
    if (req.params.name)
        req.scope.merchant.name = req.params.name;

    if (req.params.description)
        req.scope.merchant.description = req.params.description;

    if (req.params.location)
        req.scope.merchant.location = req.params.location;

    await req.scope.merchant.save();

    req.payload = {
        message: "Successfully updated info.",
        status: "success",
        data: req.scope.merchant
    }

    if (next) next();
}

module.exports = {
    validateMerchant: validateMerchant,
    createMerchant: createMerchant,
    checkIfMerchantExistsNotVerified: checkIfMerchantExistsNotVerified,
    sendEmailVerification: sendEmailVerification,
    verifyConfirmationToken: verifyConfirmationToken,
    verifyMerchantCredentials: verifyMerchantCredentials,
    verifyAccessToken: verifyAccessToken,
    updateInfo, updateInfo
};
