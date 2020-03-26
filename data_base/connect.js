var Connection = require('tedious').Connection;
var config = {
    server: 'DESKTOP-RNJUCNR',
    authentication: {
        type: 'default',
        options: {
            userName: 'root',
            password: 'admin123'
        }
    },
    options: {
        port: 1433,
        database: 'TaskManager',
        instanceName: '',
        rowCollectionOnDone: true,
        useColumnNames: false
    }
}
var connection = new Connection(config);
connection.on('connect', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected');
    }
});
module.exports = connection;