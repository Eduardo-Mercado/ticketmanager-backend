const express = require('express');

function eRoutes() {
    const router = express.Router();
    var company = require('./repository/company/company.routes')(router);
    var businessAgent = require('./repository/businessAgent/agent.routes')(router);
    var customerAgent = require('./repository/customer/customer.routes')(router);
    var ticket = require('./repository/ticket/ticket.routes')(router);
    var dropdown = require('./repository/dropdown/dropdown.routes')(router);
    var file = require('./repository/fileLoad/fileLoad.routes')(router);
    return router;
}

module.exports = eRoutes;