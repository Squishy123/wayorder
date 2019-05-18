import { sendPayload } from './generalFunctions';
const Table = require('../models/table');

async function addTable(req, res, next) {
    let table = new Table();
    table.space = req.params.space;
    await tabale.save();

    req.scope.merchant.tables.push(product);
    await req.scope.merchant.save();

    req.payload = {
        message: 'Successfully added table.',
        status: 'success',
        data: { product: product },
    };

    if (next) next();
}

module.exports = {
    addTable: addTable,
}