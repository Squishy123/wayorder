const mongoose = require('mongoose');

const merchantModel = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    description: { type: String },
    meta: { Type: Object },
    menu: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        },
    ],
    tables: [
        { table_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' } },
    ],
    open_tables: [
        { table_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' } },
    ],
    filled_tables: [
        { table_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' } },
    ],
    //expect [lat, long]
    location: [{ type: Number }],
    capacity: { type: Number },
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

merchantModel.statics.getMenu = async function(merchant_id) {
    let obj = mongoose.Types.ObjectId(merchant_id);
    if (obj) {
        return obj.menu; 
    } else {
        return {
            status: 'fail',
            message: 'Invalid Merchant ID',
        }
    }
}

module.exports = mongoose.model('Merchant', merchantModel);
