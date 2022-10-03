const auth = require('../helper/auth');
const hrQuery = require('../db/hr.db');

require('dotenv').config();

const hrRule = {
    getAllReimbursement : async (req, res, next) =>{
        try {
            await auth.checkToken(req, res, next)

            if (req.authData.user.role === 'hr') { 
                try {

                    let results = await hrQuery.getAllReimbursement(req.body.cutoff_id)

                    if (results.length > 0) {
                        res.status(200).json({
                            "status"      : 200,
                            "statusText"  : "OK",
                            "message"     : "Reimbursement List",
                            "data"        : results
                        })
                    } else {
                        res.status(404).json({
                            "status"      : 404,
                            "statusText"  : "Not Found",
                            "message"     : 'No Reimbursement Found'
                        })
                    }
                    

                } catch (e) {
                    throw Error (e)
                }
 
            } else {
                res.status(401).json({
                    "status"      : 401,
                    "statusText"  : "Not Authorized",
                    "message"     : "User Not Authorized for Service",
                })
            }
        } catch (e) {
            throw Error (e)
        }
    },
    getAllReimbursementDetails : async (req, res, next) =>{
        let reimbursementDetails;

        try {
            await auth.checkToken(req, res, next)

            if (req.authData.user.role === 'hr') { 

                try {
                   reimbursementDetails = await hrQuery.getAllReimbursementDetail(req.body.reimbursement_id)
                } catch (e) {
                    throw Error (e)
                }

                if (reimbursementDetails.length === 0) {
                    res.status(404).json({
                        "status"      : 404,
                        "statusText"  : "Not Found",
                        "message"     : "No reimbursement Data Found",
                    })
                } else {
                    let detailsArr = [];
                    let detailObj = {};

                    for (let i = 0; i < reimbursementDetails.length; i++) {
                        detailObj = {
                            "date"                  : reimbursementDetails[i].date_added,
                            "or_number"             : reimbursementDetails[i].or_number,
                            "name_of_establishment" : reimbursementDetails[i].name_of_establishment,
                            "tin_of_establishment"  : reimbursementDetails[i].tin_of_establishment,
                            "amount"                : reimbursementDetails[i].amount,
                            "category"              : reimbursementDetails[i].name
                         }
                         detailsArr.push(detailObj)
                    }

                    let data = {
                        "employee_number"            : reimbursementDetails[0].employee_number,
                        "employee_name"              : reimbursementDetails[0].employee_name,
                        "date_submitted"             : reimbursementDetails[0].date_submitted,
                        "details"                    : detailsArr,
                        "total_reimbursement_amount" : reimbursementDetails[0].total_reimbursement_amount,
                        "transaction_number"         : reimbursementDetails[0].transaction_number, 
                        "status"                     : reimbursementDetails[0].status
                    }

                    res.status(200).json({
                        "status"      : 200,
                        "statusText"  : "OK",
                        "message"     : "Reimbursement Details",
                        "data"        : data
                    })
                }
 
            } else {
                res.status(401).json({
                    "status"      : 401,
                    "statusText"  : "Not Authorized",
                    "message"     : "User Not Authorized for Service",
                })
            }
        } catch (e) {
            throw Error (e)
        }
    },

    getAllReimbursementByEmployee : async (req, res, next) =>{
        let reimbursementData;
        const employeeArr = [
            req.body.employee_id,
            req.body.employee_id,
            req.body.last_name,
            req.body.last_name,
            req.body.first_name,
            req.body.first_name
        ];

        try {
            await auth.checkToken(req, res, next)

            if (req.authData.user.role === 'hr') { 

                try {
                    reimbursementData = await hrQuery.getReimbursementByEmployee(employeeArr)
                } catch (e) {
                    throw Error (e)
                }

                if (!reimbursementData || reimbursementData.length === 0) {
                    res.status(404).json({
                        "status"      : 404,
                        "statusText"  : "Not Found",
                        "message"     : "No reimbursement data found",
                    })
                } else {
                    let detailsArr = [];
                    let detailObj = {};
                    let dataArr = [];
                    let dataObj = {};
                    let currEmployeeName = ' ';
                    let currReimburseData = {};
        
                    for (let i = 0; i < reimbursementData.length; i++) {
                        
                        if (currEmployeeName === ' ') {
                            currEmployeeName = reimbursementData[i].employee_name
                            currReimburseData = reimbursementData[i] 
        
                            detailObj = {
                                "date"                  : reimbursementData[i].date_added,
                                "or_number"             : reimbursementData[i].or_number,
                                "name_of_establishment" : reimbursementData[i].name_of_establishment,
                                "tin_of_establishment"  : reimbursementData[i].tin_of_establishment,
                                "amount"                : reimbursementData[i].amount,
                                "category"              : reimbursementData[i].name
                             }
                            
                             detailsArr.push(detailObj)
                        } else {
                            if (currEmployeeName === reimbursementData[i].employee_name) {
        
                                detailObj = {
                                "date"                  : reimbursementData[i].date_added,
                                "or_number"             : reimbursementData[i].or_number,
                                "name_of_establishment" : reimbursementData[i].name_of_establishment,
                                "tin_of_establishment"  : reimbursementData[i].tin_of_establishment,
                                "amount"                : reimbursementData[i].amount,
                                "category"              : reimbursementData[i].name
                                 }
                                
                                 detailsArr.push(detailObj)
                            } else {
                                dataObj = {
                                    "employee_number"            : currReimburseData.employee_number,
                                    "employee_name"              : currReimburseData.employee_name,
                                    "date_submitted"             : currReimburseData.date_submitted,
                                    "details"                    : detailsArr,
                                    "total_reimbursement_amount" : currReimburseData.total_reimbursement_amount,
                                    "transaction_number"         : currReimburseData.transaction_number, 
                                    "status"                     : currReimburseData.status
                                }
        
                                dataArr.push(dataObj)
        
                                detailsArr = [];
        
                                currEmployeeName = reimbursementData[i].employee_name
                                currReimburseData = reimbursementData[i] 
        
                                detailObj = {
                                    "date"                  : reimbursementData[i].date_added,
                                    "or_number"             : reimbursementData[i].or_number,
                                    "name_of_establishment" : reimbursementData[i].name_of_establishment,
                                    "tin_of_establishment"  : reimbursementData[i].tin_of_establishment,
                                    "amount"                : reimbursementData[i].amount,
                                    "category"              : reimbursementData[i].name
                                 }
                            
                                detailsArr.push(detailObj)
                            }
                        }
                    }
        
                    dataObj = {
                        "employee_number"            : currReimburseData.employee_number,
                        "employee_name"              : currReimburseData.employee_name,
                        "date_submitted"             : currReimburseData.date_submitted,
                        "details"                    : detailsArr,
                        "total_reimbursement_amount" : currReimburseData.total_reimbursement_amount,
                        "transaction_number"         : currReimburseData.transaction_number, 
                        "status"                     : currReimburseData.status
                    }
        
                    dataArr.push(dataObj)
        
                    res.status(200).json({
                        "status"      : 200,
                        "statusText"  : "OK",
                        "message"     : "Reimbursement Details",
                        "data"        : dataArr
                    })
                } 
            } else {
                res.status(401).json({
                    "status"      : 401,
                    "statusText"  : "Not Authorized",
                    "message"     : "User Not Authorized for Service",
                })
            }
        } catch (e) {
            throw Error (e)
        }
    },

    approveReimbursement : async (req, res, next) =>{

        let reimbursementData;
        const reimbursementArr = [
            "Approved",
            req.body.reimbursement_id
        ];
       
        try {
            await auth.checkToken(req, res, next)

            if (req.authData.user.role === 'hr') { 

                try {
                    reimbursementData = await hrQuery.getReimbursementById(req.body.reimbursement_id)
                } catch (e) {
                    throw Error (e)
                }

                if (!reimbursementData || reimbursementData.length === 0) {
                    res.status(404).json({
                        "status"      : 404,
                        "statusText"  : "Not Found",
                        "message"     : "No reimbursement data found",
                    })
                } else {
                    if (reimbursementData.status !== "Submitted") {
                        res.status(222).json({
                            "status"      : 222,
                            "statusText"  : "Errors found",
                            "message"     : "Only Reimbursement with status of submitted can be approved"
                        })
                    } else {
                        try {
                            let results = await hrQuery.updateReimbursement(reimbursementArr);
                        } catch (e) {
                            next (e)
                        }
                 
                        try {
                            let results = await hrQuery.updateReimbursementDetail(reimbursementArr);
                        } catch(e) {
                            next (e)
                        }
                
                        res.status(200).json({
                            "status"      : 200,
                            "statusText"  : "OK",
                            "message"     : "Reimbursement Approved"
                        })
                    }       
                }

            } else {
                res.status(401).json({
                    "status"      : 401,
                    "statusText"  : "Not Authorized",
                    "message"     : "User Not Authorized for Service",
                })
            }
        } catch (e) {
            throw Error (e)
        }
    },

    rejectReimbursement : async (req, res, next) =>{

        let reimbursementData;
        const reimbursementArr = [
            "Rejected",
            req.body.reimbursement_id
        ];
       
        try {
            await auth.checkToken(req, res, next)

            if (req.authData.user.role === 'hr') { 

                try {
                    reimbursementData = await hrQuery.getReimbursementById(req.body.reimbursement_id)
                } catch (e) {
                    throw Error (e)
                }

                if (!reimbursementData || reimbursementData.length === 0) {
                    res.status(404).json({
                        "status"      : 404,
                        "statusText"  : "Not Found",
                        "message"     : "No reimbursement data found",
                    })
                } else {
                    if (reimbursementData.status !== "Submitted") {
                        res.status(222).json({
                            "status"      : 222,
                            "statusText"  : "Errors found",
                            "message"     : "Only Reimbursement with status of submitted can be rejected"
                        })
                    } else {
                        try {
                            let results = await hrQuery.updateReimbursement(reimbursementArr);
                        } catch (e) {
                            next (e)
                        }
                 
                        try {
                            let results = await hrQuery.updateReimbursementDetail(reimbursementArr);
                        } catch(e) {
                            next (e)
                        }
                
                        res.status(200).json({
                            "status"      : 200,
                            "statusText"  : "OK",
                            "message"     : "Reimbursement Rejected"
                        })
                    }       
                }

            } else {
                res.status(401).json({
                    "status"      : 401,
                    "statusText"  : "Not Authorized",
                    "message"     : "User Not Authorized for Service",
                })
            }
        } catch (e) {
            throw Error (e)
        }
    },
    
};

module.exports = hrRule;