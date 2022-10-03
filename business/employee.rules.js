const validation = require('../helper/validation');
const auth = require('../helper/auth');
const empQuery = require('../db/employee.db');
const printer = require('../helper/print');

require('dotenv').config();


const employeeRule = {
    postReimbursementDetail : async (req, res, next) => {
        let valResponse;
        let flexData;   
        let reibursementData;   
        

        try {
            await auth.checkToken(req, res, next)

            flexData = {
                "or_number"              : req.body.or_number,
                "name_of_establishment"  : req.body.name_of_establishment,
                "tin_of_establishment"   : req.body.tin_of_establishment,                    
                "amount"                 : req.body.amount,
                "category_code"          : req.body.category_code,
                "date_added"             : req.body.date_added,
                "employee_id"            : req.authData.user.employee_id
            };

            if (req.authData.user.role === 'employee') {  

                let containsNull = Object.values(flexData).every(x=> x === null || x === ' ');
    
                try {
                    valResponse = await validation.reimbursementDetail(flexData)
                } catch (e) { 
                    throw Error (e)
                }
 
                if (valResponse.valErr.length === 0) {
                    try {
                        reibursementData = await empQuery.getReimbursement([valResponse.cycle_id, flexData.employee_id])
                    } catch (e) {
                        throw Error (e)
                    }

                    if (typeof reibursementData === 'undefined' || reibursementData.length === 0) {
                        try {
                            const result = await empQuery.createReimbursement([flexData.employee_id, valResponse.cycle_id])

                            try {
                                reibursementData = await empQuery.getReimbursement([valResponse.cycle_id, flexData.employee_id])
                            } catch (e) {
                                throw Error (e)
                            }

                        } catch (e) {
                            throw Error (e)
                        }
                    } 

                    try {
                        const flexDetailArr = [
                            reibursementData.flex_reimbursement_id,
                            req.body.or_number,
                            req.body.name_of_establishment,
                            req.body.tin_of_establishment,
                            req.body.amount,
                            valResponse.category_id,
                            req.body.date_added
                        ]
    
                        const results = await empQuery.createReimbursementDetail(flexDetailArr)

                        try {
                            const updAmount = reibursementData.total_reimbursement_amount +  req.body.amount
                            const result = await empQuery.updateReimbursementAmount([updAmount, reibursementData.flex_reimbursement_id])

                            res.status(200).json({
                                "status"      : 200,
                                "statusText"  : "OK",
                                "message"     : "Reimbursement Detail Created",
                            })
                        } catch (e) {
                            throw Error (e)
                        }

                    } catch (e) {
                        throw Error (e)
                    }

                } else {
                    const data = valResponse.valErr;
                    res.status(222).json({
                            "status"      : 222,
                            "statusText"  : "Errors found",
                            "message"     : "Validation Errors found",
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
    deleteReimbursementDetail : async (req, res, next) => {
        let reimbursementDetailData;
        let reimbursementData;

        try {

            await auth.checkToken(req, res, next)

            if (req.authData.user.role === 'employee') {                  

                try {
                    reimbursementDetailData = await empQuery.getReimbursementDetailbyId([req.body.fc_reimbursement_id, req.authData.user.employee_id])
                    console.log(reimbursementDetailData)
                } catch (e) {
                    console.log('al ' + e)
                    throw Error (e)
                }                

                if (typeof reimbursementDetailData !== 'undefined') {
                    if (reimbursementDetailData.status === 'Draft') {

                        try {
                            let result = await empQuery.deleteReimbursementDetail(req.body.fc_reimbursement_id)
                        } catch (e) {
                            throw Error (e)
                        }

                        try {
                            reimbursementData = await empQuery.getReimbursementById([reimbursementDetailData.flex_reimbursement_id, req.authData.user.employee_id])
                        } catch (e) {
                            throw Error (e)
                        }

                        try {
                            let result = await empQuery.updateReimbursementAmount([reimbursementData.total_reimbursement_amount - reimbursementDetailData.amount, reimbursementData.flex_reimbursement_id])
                        } catch (e) {
                            throw Error (e)
                        }

                        res.status(200).json({
                            "status"      : 200,
                            "statusText"  : "OK",
                            "message"     : "Reimbursement Detail Deleted",
                        })

                    } else {
                        res.status(222).json({
                            "status"      : 222,
                            "statusText"  : "Errors found",
                            "message"     : "Only Reimbursement with status of DRAFT can be deleted"
                        })
                    }
                } else {
                    res.status(222).json({
                        "status"      : 222,
                        "statusText"  : "Errors found",
                        "message"     : "Reimbursement Detail Does Not Exist"
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
    submitReimbursementDetail : async (req, res, next) => {

        let reimbursementData;
        let companyCode;
        let reimbursementArr;
        const reimbursementDetailArr = [
            "Submitted",
            req.body.reimbursement_id
        ];

        try {

            await auth.checkToken(req, res, next)

            if (req.authData.user.role === 'employee') {    
                
                try {
                    reimbursementData = await empQuery.getReimbursementById([req.body.reimbursement_id, req.authData.user.employee_id])
                } catch (e) {
                    throw Error (e)
                }

                if (typeof reimbursementData !== 'undefined') {
                    if (reimbursementData.status === 'Draft' || reimbursementData.status === 'Rejected') {
                        
                        try {
                            companyCode = await empQuery.getCompanyCode(req.authData.user.employee_id)
                        } catch (e) {
                            throw Error (e)
                        }

                        const currDate = new Date();
                        const currMonth = currDate.getMonth() + 1;
                        const dateParm =  currDate.getFullYear() + currMonth.toString() + currDate.getDate().toString();

                        let tranNumber = companyCode + '-' + reimbursementData.flex_cut_off_id + '-' + dateParm + '-' + reimbursementData.flex_reimbursement_id

                        reimbursementArr = [
                            "Submitted",
                            tranNumber,
                            req.body.reimbursement_id
                        ];

                        try {
                            let result = await empQuery.updateReimbursementStatus(reimbursementArr)
                        } catch (e) {
                            throw Error (e)
                        }

                        try {
                            let result = await empQuery.updateReimbursementDetailStatus(reimbursementDetailArr)

                            res.status(200).json({
                                "status"      : 200,
                                "statusText"  : "OK",
                                "message"     : "Reimbursement Submitted",
                            })
    
                        } catch (e) {
                            throw Error (e)
                        }


                    } else {
                        res.status(222).json({
                            "status"      : 222,
                            "statusText"  : "Errors found",
                            "message"     : "Only Reimbursement with status of Draft or Rejected can be submitted"
                        })
                    }

                } else {
                    res.status(222).json({
                        "status"      : 222,
                        "statusText"  : "Errors found",
                        "message"     : "Reimbursement Detail Does Not Exist"
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
            console.log('5 ' + e)
            throw Error (e)
        }
    },
    computeFlexPoints : async (req, res, next) => {
        
        try {

            await auth.checkToken(req, res, next)

            if (req.authData.user.role === 'employee') {    
                const flexPoints = (req.body.monthly_rate / 21.75) * req.body.flex_credits
                const flexTax = flexPoints * process.env.FLEX_TAX_RATE
                const total = flexPoints - flexTax     

                res.status(200).json({
                    "status"      : 200,
                    "statusText"  : "OK",
                    "message"     : "Flex Points Computation",
                    "data"        : {
                        "flex_points"     : flexPoints.toFixed(2),
                        "tax_rate"        : (process.env.FLEX_TAX_RATE * 100) + '%',
                        "tax deduction"   : flexTax.toFixed(2),
                        "net_flex_points" : total.toFixed(2)
                    }
                })      
                
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
    forReimbursementPrint : async (req, res, next) => {
        let formatReimbursement;

        try {

            await auth.checkToken(req, res, next)

            if (req.authData.user.role === 'employee') {  

                let reimburseData;

                try {
                    reimburseData = await empQuery.getForPrint(req.authData.user.employee_id)
                } catch (e) {
                    throw Error (e)
                }

                if (!reimburseData || reimburseData.length === 0) {
                    res.status(404).json({
                        "status"      : 404,
                        "statusText"  : "Not Found",
                        "message"     : "No reimbursement data found",
                    })
                } else {
                    try {
                         formatReimbursement = await printer.formatReimbursement(reimburseData)
                    } catch (e) {
                        console.log(e)
                        next(e)
                    }
                   
                    try {
                        let result = await printer.printReimbursement(formatReimbursement)
                    } catch (e) {
                        console.log(e)
                        next (e)
                    }
        
                    res.status(200).json({
                        "status"      : 200,
                        "statusText"  : "OK",
                        "message"     : "Reimbursement Printed"
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
};


module.exports = employeeRule;