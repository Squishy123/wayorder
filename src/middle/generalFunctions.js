//combine all parsed into params
function combineParsed(req, res, next) {
    req.params = Object.assign(req.params, req.body, req.query);
    console.log(req.params);
    if (next) next();
}

//send payload
function sendPayload(req, res) {
    return res.send(req.payload);
}

module.exports = {
    combineParsed: combineParsed,
    sendPayload: sendPayload
};
