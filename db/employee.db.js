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
    getCategory : (categoryCode) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.getCategory, categoryCode, (err,results) => {
                if (err) {
                    return reject (err) 
                } 
                return resolve (results[0])
            })
        })
    },
    getFlexCycle : () => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.getFlexCycle, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results[0])
            })
        })
    },
    getReimbursement : (srchArray) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.getCurrFReimbursement, srchArray, (err,results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results[0])
            })
        })
    },
    createReimbursement : (reimbursementArr) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.insertFlexReimbursement, reimbursementArr, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results)
            })
        }) 
    },
    createReimbursementDetail : (detailArr) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.insertReimbursementDetail, detailArr, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results)
            })
        })
    },
    updateReimbursementAmount : (reimbursementArr) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.updateFlexReimbursement, reimbursementArr, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results)
            })
        })
    },
    getReimbursementDetailbyId : (reimbursementDetailArr) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.getReimbursementDetailById, reimbursementDetailArr, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results[0])
            })
        })
    },
    deleteReimbursementDetail : (reimbursementDetailId) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.deleteReimbursementDetail, reimbursementDetailId, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results)
            })
        })
    },
    getReimbursementById : (reimbursementArr) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.getFlexReimbursementById, reimbursementArr, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return  resolve (results[0])
            })
        })
    },
    getCompanyCode : (employeeId) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.getCompanyCode, employeeId, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results[0].code)
            })
        })
    },
    updateReimbursementStatus : (reimbursementArr) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.updReimbursementStatus, reimbursementArr, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results)
            })
        })
    },
    updateReimbursementDetailStatus : (reimbursementArr) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.updReimbursementDetailStatus, reimbursementArr, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results)
            })
        })
    },
    getForPrint : (employeeId) => {
        return new Promise((resolve, reject) => {
            pool.query(sqlQuery.getReimbursementForPrint, employeeId, (err, results) => {
                if (err) {
                    return reject (err)
                }
                return resolve (results)
            })
        })
    }
};

module.exports = dbQuery;