const mongoose = require('mongoose');

const merchantModel = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
    meta: { Type: Object },
    email_confirm: { type: String },
    is_verified: { type: Boolean, default: false },
});

merchantModel.methods.addHashedPassword = async function(password) {
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

merchantModel.methods.createEmailConfirmationToken = async function() {
    let confirmationToken = await jwt.sign(
        { merchant_id: this._id },
        process.env.SECRET,
        { algorithm: 'HS256', expiresIn: '1d' }
    );
    this.email_confirm = confirmationToken;
    await this.save();
    return confirmationToken;
};

merchantModel.statics.verifyEmailConfirmationToken = async function(
    confirmationToken
) {
    let decoded = await jwt.verify(confirmationToken, process.env.SECRET);
    let merchant = await this.findOne(
        mongoose.Types.ObjectId(decoded.merchant_id)
    );

    if (confirmationToken == merchant.email_confirm)
        return {
            verified: true,
            merchant: merchant,
            status: 'success',
            message: 'Successfully confirmed.',
        };

    if (merchant.is_verified == true)
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

module.exports = mongoose.model('Merchant', merchantModel);
