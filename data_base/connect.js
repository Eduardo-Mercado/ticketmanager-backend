// var Connection = require('tedious').Connection;
// var config = {
//     server: 'DESKTOP-RNJUCNR',
//     authentication: {
//         type: 'default',
//         options: {
//             userName: 'root',
//             password: 'admin123'
//         }
//     },
//     options: {
//         port: 1433,
//         database: 'TaskManager',
//         instanceName: '',
//         rowCollectionOnDone: true,
//         useColumnNames: false
//     }
// }
// var connection = new Connection(config);
// connection.on('connect', function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Connected');
//     }
// });

// // connection.on('debug', function(err) {
// //      console.log('debug:', err);
// //     });
// module.exports = connection;


var Sequelize = require('sequelize');

const sequelize = new Sequelize('TaskManager', 'root', 'admin123', {
  host: 'localhost',
  dialect:  'mssql',
  pool: {
    max: 10,
    min: 1,
    acquire: 30000,
    idle: 10000
  }
});

sequelize.authenticate().then(() => {
    console.log('Connection established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
}).finally(() => {
   // sequelize.close();
  });

module.exports = sequelize;