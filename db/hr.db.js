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
    getAllReimbursement : (cutoffId) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.getAllReimbursement, cutoffId, (err, results) => {
                if (err) {
                    return reject (err) 
                }
                return resolve (results)
            })
        })
    },
    getAllReimbursementDetail : (reimbursementId) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.getAllReimbursementDetail, reimbursementId, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results)
            })
        })
    },
    getReimbursementByEmployee : (employeeArr) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.getReimbursementByEmployee, employeeArr, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results)
            })
        })
    },
    getReimbursementById : (reimbursementId) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.hrGetFlexReimbursementById, reimbursementId, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results[0])
            })

        })
    },
    updateReimbursement : (reimbursementArr) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.hrUpdReimbursementStatus, reimbursementArr, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results)
            })
        })
    },
    updateReimbursementDetail : (reimbursementArr) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.updReimbursementDetailStatus, reimbursementArr, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results)
            })
        })
    }

};

module.exports = dbQuery;