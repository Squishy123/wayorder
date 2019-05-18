import { sendPayload } from './generalFunctions';

function validateUserCredentials(req, res, next) {
    req.payload.message = [];

    let fnLength = req.params.first_name.length;
    if (fnLength < 2) {
        req.payload.status = 'failed';
        req.payload.message.push('First name length is less than 2');
    }
    if (fnLength > 36) {
        req.payload.status = 'failed';
        req.payload.message.push('First name length is greather than 36');
    }

    let lnLength = req.params.last_name.length;
    if (lnLength < 2) {
        req.payload.status = 'failed';
        req.payload.message.push('Last name length is less than 2');
    }
    if (lnLength > 36) {
        req.payload.status = 'failed';
        req.payload.message.push('Last name length is greather than 36');
    }

    let regex = /\S+@\S+\.\S+/;
    if (!regex.test(req.params.email)) {
        req.payload.status = 'failed';
        req.payload.message.push('Invalid email address');
    }

    regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!regex.test(req.params.password)) {
        req.payload.status = 'failed';
        req.payload.message.push('Invalid password');
    }

    if (req.payload.status === 'failed')
        return sendPayload;

    if(next) next();
}

async function checkIfUserExistsNotVerified(req, res, next) {
    if (req.params.first_name && req.params.last_name && req.params.email) {
        if (await User.findOne({ email: req.params.email })) {
            req.payload.status = 'failed';
            req.payload.message = 'User already exists';
            return sendPayload;
        };
    }

    if(next) next();
}

function createUser(req, res, next) {
    let user = new User();
    user.first_name = req.params.first_name;
    user.last_name = req.params.last_name;
    user.email = req.params.email;
    user.password = req.params.password;
    await user.save();

    req.scope.user = user;

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
    validateUserCredentials: validateUserCredentials,
    checkIfUserExistsNotVerified: checkIfUserExistsNotVerified,
    createUser: createUser,
    emailVerified: emailVerified,
};