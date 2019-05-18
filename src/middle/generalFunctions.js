//combine all parsed into params
async function combineParsed(req, res, next) {
    req.params = Object.assign(req.params, req.body, req.query);

    if (next) next();
}

module.exports = {
    combineParsed: combineParsed,
};
