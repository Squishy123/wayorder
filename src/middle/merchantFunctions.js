import { sendPayload } from './generalFunctions';

function validateMerchant(req, res, next) {
    req.payload.message = [];

    if (req.params.name) {
        let fnLength = req.params.name.length;
        if (fnLength < 2) {
            req.payload.status = 'failed';
            req.payload.message.push('Name length is less than 2');
        }
        if (fnLength > 36) {
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

    if (req.payload.status === 'failed')
        return sendPayload(req, res);

    if (next) next();
}

function createMerchant(req, res, next) {
    let merchant = new Merchant();
    merchant.name = req.params.name;
    merchant.email = req.params.email;
    merchant.password = req.params.password;
    await merchant.save();

    req.scope.merchant = merchant;

    if (next)
        next();
}

async function checkIfMerchantExistsNotVerified(req, res, next) {
    if (req.params.name && req.params.email) {
        if (await User.findOne({ email: req.params.email })) {
            req.payload.status = 'failed';
            req.payload.message = 'Merchant already exists';
            return sendPayload(req, res);
        };
    }

    if(next) next();
}

function emailVerified(req, res, next) {
    let info = await this.binds.transporter.sendMail({
        from: "'WayOrder'<service@wayorder.com>",
        to: `${req.params.email}`,
        subject: "Welcome to WayOrder! Please confirm your account",
        text: `Please visit the following link in order to confirm your account registration: wayorder.com/confirm?confirmation_token=${req.scope.confirmation_token}`,
    })

    if(next) next();
}

module.exports = {
    validateMerchant: validateMerchant,
    createMerchant: createMerchant,
    checkIfMerchantExistsNotVerified: checkIfMerchantExistsNotVerified,
    emailVerified: emailVerified
}