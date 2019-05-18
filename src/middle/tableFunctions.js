import { sendPayload } from './generalFunctions';
const Table = require('../models/table');

async function addTable(req, res, next) {
    let table = new Table();
    table.space = req.params.space;
    await table.save();

    req.scope.merchant.capacity += req.params.space;
    req.scope.merchant.tables.push(table);
    req.scope.merchant.open_tables.push(table);
    await req.scope.merchant.save();

    req.payload = {
        message: 'Successfully added table.',
        status: 'success',
        data: { table: table },
    };

    if (next) next();
}

module.exports = {
    addTable: addTable,
};
