const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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
    is_verified: {type: Boolean, default: false},
    email_confirm: {type: String}
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
        { user_id: this._id},
        process.env.SECRET,
        { algorithm: 'HS256', expiresIn: '1d' }
    );
    this.email_confirm = confirmationToken;
    await this.save();
    return confirmationToken;
};

module.exports = mongoose.model('User', userModel);
