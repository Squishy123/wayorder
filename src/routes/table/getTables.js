import * as general from '../../middle/generalFunctions';
import * as table from '../../middle/tableFunctions';
import * as merchant from '../../middle/merchantFunctions';

module.exports = {
    path: '/tables',
    method: 'GET',
    handler: [table.getTablesByMerchantId, general.sendPayload]
}