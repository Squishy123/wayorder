import { sendPayload } from './generalFunctions';
const mongoose = require('mongoose');

const Table = require('../models/table');

async function addTable(req, res, next) {
    let table = new Table();
    table.space = req.params.space;

    req.scope.merchant.capacity += req.params.space;
    req.scope.merchant.tables.push(table);
    req.scope.merchant.open_tables.push(table);
    await req.scope.merchant.save();

    table.merchant_id = req.scope.merchant._id;
    await table.save();


    req.payload = {
        message: 'Successfully added table.',
        status: 'success',
        data: { table: table },
    };

    if (next) next();
}

async function getTablesByMerchantId(req, res, next) {
    if (!req.params.merchant_id) {
        req.payload = {
            status: 'failed',
            message: 'Missing required parameter merchant_id'
        }

        return sendPayload(req, res);
    }

    let tables = await Table.find({ merchant_id: mongoose.Types.ObjectId(req.params.merchant_id) });

    req.payload = {
        status: 'success',
        message: 'Successfully queried all tables belong to merchant',
        data: { tables: tables }
    }

    if (next)
        next();
}

module.exports = {
    addTable: addTable,
    getTablesByMerchantId: getTablesByMerchantId
}
