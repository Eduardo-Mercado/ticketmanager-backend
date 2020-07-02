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