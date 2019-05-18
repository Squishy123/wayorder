module.exports = {
    path: '/',
    method: 'GET',
    handler: (req, res) => {
        res.contentType = 'json';
        res.send({ message: 'Hello World!' });
    },
};
