const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    card_number: { type: String },
    orders: [
        { order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' } },
    ],
    current_order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    is_verified: { type: Boolean, default: false },
    email_confirm: { type: String },
});

userModel.methods.addHashedPassword = async function(password) {
    let hashed = await new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) reject(err);
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });
        });
    });
    this.password = hashed;
    await this.save();
    return hashed;
};

userModel.methods.createEmailConfirmationToken = async function() {
    /** let confirmationToken = await jwt.sign(
        { user_id: this._id },
        process.env.SECRET,
        { algorithm: 'HS256', expiresIn: '1d' }
    );*/
    this.email_confirm =
        Math.random()
            .toString(36)
            .slice(-8) +
        Math.random()
            .toString(36)
            .slice(-8) +
        Math.random()
            .toString(36)
            .slice(-8);
    await this.save();
    return this.email_confirm;
};

userModel.statics.verifyEmailConfirmationToken = async function(
    confirmationToken
) {
    //let decoded = await jwt.verify(confirmationToken, process.env.SECRET);
    let user = await this.findOne({ email_confirm: confirmationToken });

    if (confirmationToken == user.email_confirm) {
        user.is_verified = true;
        await user.save();
        return {
            //verified: true,
            user: user,
            status: 'success',
            message: 'Successfully confirmed.',
        };
    }

    if (user.is_verified == true)
        return {
            //verified: false,
            status: 'fail',
            message: 'User already registered.',
        };

    return {
        //verified: false,
        status: 'fail',
        message: 'Invalid confirmation token.',
    };
};

userModel.statics.verifyCredentials = async function(email, password) {
    if (!email && !password)
        return { status: 'failed', message: 'Email and password required.' };

    if (!email) return { status: 'failed', message: 'Email required.' };

    if (!password) return { status: 'failed', message: 'Password required.' };

    let user = await this.findOne({ email: email });

    if (!user) return { status: 'failed', message: 'No account found.' };

    let valid = await bcrypt.compare(password, user.password);
    if (!valid) return { status: 'failed', message: 'Incorrect password.' };

    return {
        status: 'success',
        user: user,
        message: 'Verification successful.',
    };
};

userModel.methods.createAccessToken = async function() {
    let accessToken = await jwt.sign(
        { user_id: this._id },
        process.env.SECRET,
        { algorithm: 'HS256', expiresIn: '1d' }
    );

    return accessToken;
};

userModel.methods.verifyAccessToken = async function(accessToken) {
    let decoded = await jwt.verify(accessToken, process.env.SECRET);
    let user = await this.findOne(mongoose.Types.ObjectId(decoded.user_id));
    if (!user) return { message: 'Invalid access token' };
    return { user: user, message: 'Success' };
};

module.exports = mongoose.model('User', userModel);
