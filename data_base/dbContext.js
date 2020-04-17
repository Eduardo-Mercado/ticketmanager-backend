// var Request = require('tedious').Request;
var connection = require('./connect');
// var utility = require('./utility/utility');
// const { QueryTypes } = require('sequelize');

function spGetExecute(qry, callback) {
    connection.query(qry)
              .then((result) => {
                callback(null, result, 1);
              })
              .error((err)=> callback(err));
}

function queryGetExecute(qry, params, queryType, callback) {
    connection.query(qry, {replacements: params, type: queryType})
              .then((result) => {  callback(null,result, 1) })
              .error((err) => { callback(err); });
}


module.exports = {
    get: spGetExecute,
    getQuery: queryGetExecute   
};
