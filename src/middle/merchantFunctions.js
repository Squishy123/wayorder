function validateMerchant(req, res, next) {

    if(next)
        next();
}

module.exports = {
    validateMerchant: validateMerchant
}