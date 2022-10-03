const fs = require('fs');
const file_name = './print/reimbursement.txt'

require('dotenv').config();

const formatReimbursement = (exports.formatReimbursement =  (reimbursementData) => {
    return new Promise((resolve, reject) => {

        let newData = {
            "employee_name"              : "",
            "employee_number"            : "",
            "date_submitted"             : "",
            "transaction_number"         : "",
            "total_reimbursement_amount" : "",
            "status"                     : "",
            "details"                    : []
        }
    
        let detailArr = {}
        let subArr = [] 

        let currCategory = null;
        let detCount = 0;

        for (i=0; i < reimbursementData.length; i++) {
            if (reimbursementData.employee_name !== null) {
                newData.employee_name = reimbursementData[i].employee_name
                newData.employee_number = reimbursementData[i].employee_number
                newData.date_submitted = convertDate(reimbursementData[i].date_submitted);
                newData.transaction_number = reimbursementData[i].transaction_number; 
                newData.total_reimbursement_amount = reimbursementData[i].total_reimbursement_amount
                newData.status = reimbursementData[i].status

                break;
            }
        }

        for (i=0;i < reimbursementData.length; i++) {
            if (currCategory === null) {
                currCategory = reimbursementData[i].name

                if (reimbursementData[i].employee_name === null) {
                    detailArr = {
                        "category"              : reimbursementData[i].name,
                        "item_num"              : null,
                        "date_added"            : null,
                        "or_number"             : null,
                        "name_of_establishment" : null,
                        "tin_of_establishment"  : null,
                        "amount"                : null,
                        "status"                : null
                    }
                    subArr.push(detailArr)
                } else {
                    detCount = 1;
                    detailArr = {
                        "category"              : reimbursementData[i].name,
                        "item_num"              : detCount,
                        "date_added"            : convertDate(reimbursementData[i].date_added),
                        "or_number"             : reimbursementData[i].or_number,
                        "name_of_establishment" : reimbursementData[i].name_of_establishment,
                        "tin_of_establishment"  : reimbursementData[i].tin_of_establishment,
                        "amount"                : reimbursementData[i].amount,
                        "status"                : reimbursementData[i].status
                    }
                    subArr.push(detailArr)
                }
            } else {
                if (currCategory === reimbursementData[i].name) {
                    detCount++;
                    detailArr = {
                        "category"              : reimbursementData[i].name,
                        "item_num"              : detCount,
                        "date_added"            : convertDate(reimbursementData[i].date_added),
                        "or_number"             : reimbursementData[i].or_number,
                        "name_of_establishment" : reimbursementData[i].name_of_establishment,
                        "tin_of_establishment"  : reimbursementData[i].tin_of_establishment,
                        "amount"                : reimbursementData[i].amount,
                        "status"                : reimbursementData[i].status
                    }
                    subArr.push(detailArr)
                } else {
                    currCategory = reimbursementData[i].name
                    if (reimbursementData[i].employee_name === null) {
                        detailArr = {
                            "category"              : reimbursementData[i].name,
                            "item_num"              : null,
                            "date_added"            : null,
                            "or_number"             : null,
                            "name_of_establishment" : null,
                            "tin_of_establishment"  : null,
                            "amount"                : null,
                            "status"                : null
                        }
                        subArr.push(detailArr)
                    } else {
                        detCount = 1;
                        detailArr = {
                            "category"              : reimbursementData[i].name,
                            "item_num"              : detCount,
                            "date_added"            : convertDate(reimbursementData[i].date_added),
                            "or_number"             : reimbursementData[i].or_number,
                            "name_of_establishment" : reimbursementData[i].name_of_establishment,
                            "tin_of_establishment"  : reimbursementData[i].tin_of_establishment,
                            "amount"                : reimbursementData[i].amount,
                            "status"                : reimbursementData[i].status
                        }
                        subArr.push(detailArr)
                    }
                } 
            }
        }
        
        newData.details = subArr;
          
        return resolve(newData);
    })    
    
});

const printReimbursement = (exports.printReimbursement =  (formatedData) => {
    return new Promise((resolve, reject) => {
     

        let toWrite = "Employee Name: " + formatedData.employee_name + "\r"
        toWrite += "Employee Number: " + formatedData.employee_number + "\r"
        toWrite += "Date Submitted:  " + formatedData.date_submitted + "\r"
        toWrite += "Transaction Number:  " + formatedData.transaction_number + "\r"
        toWrite += "Amount:  Php " + formatedData.total_reimbursement_amount + "\r" 
        toWrite += "Status: " + formatedData.status + "\r"
        toWrite += "          " + "\r"
        toWrite += "=== DETAILS === " + "\r"
    

        
        
        
        for (i=0;i < formatedData.details.length;i++){

           
            toWrite += "CATEGORY: " + formatedData.details[i].category + "\r"           
            

            if (formatedData.details[i].or_number === null) {
              
                toWrite += "N/A"+ "\r"
                toWrite += " "+ "\r"

                    
            } else {
                
                toWrite +=  "Item # " + formatedData.details[i].item_num + "\r"
                toWrite +=    "Date: " + formatedData.details[i].date_added + "\r"
                toWrite +=    "OR Number: " + formatedData.details[i].or_number + "\r"
                toWrite +=    "Name of Establishment: " + formatedData.details[i].name_of_establishment + "\r"
                toWrite +=    "TIN of Establishment: " + formatedData.details[i].tin_of_establishment + "\r"
                toWrite +=    "Amount: Php" + formatedData.details[i].amount + "\r"
                toWrite +=    "Status: " + formatedData.details[i].status + "\r"
                toWrite += " "+ "\r"
                

                
            }
        } 
        fs.writeFile(file_name, toWrite, function(err){
            if (err) {
                reject (err)
            }
            resolve (true)
        })
    })

    
    
});

function convertDate (dateIn) {

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                
    const subDate = new Date(dateIn)
    const subYear = subDate.getFullYear()
    const subMonth = subDate.getMonth()
    const subDay = subDate.getDate()

    const newDate = monthNames[subMonth] + ' ' + subDay + ', ' + subYear;

    return newDate;
};