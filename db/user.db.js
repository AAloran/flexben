const mysql = require('mysql');
const sqlQuery = require('./query');

require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit : process.env.CONNECTION_LIMIT,
    host            : process.env.HOST,
    user            : process.env.DBUSER,
    password        : process.env.DBPASSWORD,
    database        : process.env.DBNAME
}); 

const dbQuery = {
    getUserInfo : (email) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.getUserInfo, email, (err, results) => {
                if (err) {
                    return reject (err);
                }
                return resolve (results[0])
            })
        })
    },
    addExpiredToken : (token) => {
       return new Promise((resolve, reject) => {
            pool.query(sqlQuery.insertToken, token, (err, results) => {
                if (err) {
                    return reject(err)
                } 
                return resolve(results)
             })
       })
    },
    getExpiredToken : (token) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.getToken, token, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results)
            })
        })
    },

} 

module.exports = dbQuery;