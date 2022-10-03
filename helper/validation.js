const dbQuery = require('../db/user.db');
const empQuery = require('../db/employee.db');

require('dotenv').config;

let validation = {
    reimbursementDetail: async function (flexdata) {
        let valErr = [];
        let flexSrchArray = [];
        let flexCap = 0;
        let categoryData;
        let flexCycleData;

        if (typeof flexdata !== 'undefined') {

            if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(flexdata.date_added)){
                valErr.push("Invalid date format. Format should be mm/dd/yyyy")
            };

            const compDate = await dateFormater(flexdata.date_added)
            const checkDate = await dateFormater();


            if (compDate.getFullYear() !== checkDate.getFullYear()) {
                valErr.push("Add Date is not equal to current year")
            };
            
            if (compDate > checkDate) {
                valErr.push("Add Date is not equal to current year")
            };

            if (flexdata.amount < process.env.MIN_REIMBURSE_AMOUNT) {
                valErr.push(`Reimbursement amount can not be less than ${process.env.MIN_REIMBURSE_AMOUNT}`)
            };

            try {
                categoryData = await empQuery.getCategory(flexdata.category_code)

                if (typeof categoryData  === 'undefined') {
                    valErr.push("Invalid Category Code")
                }

            } catch (e) {
                throw Error (e)
            }

            try {
                flexCycleData = await empQuery.getFlexCycle();

                if (typeof flexCycleData === 'undefined') {
                    throw Error ("Flex cycle missing")
                } else {
                    flexCap = flexCycleData.cut_off_cap_amount
                    flexSrchArray.push(flexCycleData.flex_cutoff_id)
                    flexSrchArray.push(flexdata.employee_id)

                    try {
                        const result = await empQuery.getReimbursement(flexSrchArray)

                        if (typeof result !== 'undefined') {
                            if (result.status === "Draft") {
                                if (result.total_reimbursement_amount + flexdata.amount > flexCap) {
                                    valErr.push("Total Reimbursement exceeds max amount permitted")
                                }
                            }
                        }
                    } catch (e) {
                        throw Error (e)
                    }
                }
            } catch (e) {
                throw Error (e)
            }
        } else {
            throw Error ("No flex data found")
        }
        return {"valErr"      : valErr, 
                "cycle_id"    : flexCycleData.flex_cutoff_id,
                "category_id" : categoryData.category_id};
    },
};


const dateFormater = async (dateInput) => {

    if (typeof dateInput === 'undefined') {
        
        const currDate = new Date();
        const currYear = currDate.getFullYear();
        const currMonth = currDate.getMonth() + 1;
        const currDay = currDate.getDate();

        return new Date(currMonth + "/" + currDay + "/" + currYear);

    } else {
        const currDate = dateInput.split('/')
        const currYear = parseInt(currDate[2], 10);
        const currMonth = parseInt(currDate[0], 10);
        const currDay = parseInt(currDate[1], 10);

        return new Date(currMonth + "/" + currDay + "/" + currYear);

    }
};

module.exports = validation;