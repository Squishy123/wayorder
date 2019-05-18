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
    let confirmationToken = await jwt.sign(
        { user_id: this._id },
        process.env.SECRET,
        { algorithm: 'HS256', expiresIn: '1d' }
    );
    this.email_confirm = confirmationToken;
    await this.save();
    return confirmationToken;
};

userModel.statics.verifyEmailConfirmationToken = async function(
    confirmationToken
) {
    let decoded = await jwt.verify(confirmationToken, process.env.SECRET);
    let user = await this.findOne(mongoose.Types.ObjectId(decoded.user_id));

    if (confirmationToken == user.email_confirm)
        return {
            verified: true,
            user: user,
            status: 'success',
            message: 'Successfully confirmed.',
        };

    if (user.is_verified == true)
        return {
            verified: false,
            status: 'fail',
            message: 'User already registered.',
        };

    return {
        verified: false,
        status: 'fail',
        message: 'Invalid confirmation token.',
    };
};

module.exports = mongoose.model('User', userModel);
