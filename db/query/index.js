// List all query used by db components

let sqlQuery = {
    getUserInfo : `SELECT e.email,
            e.firstname,
            e.lastname,
            e.employee_id,
            a.password,
            a.salt,
            r.name as role
        FROM employee e
        LEFT JOIN account a on 
            a.employee_id = e.employee_id
        LEFT JOIN role r on 
            r.role_id = e.role_id
        WHERE e.email = ?`,
    insertToken : `INSERT INTO expired_token (token) VALUE (?)`,
    getToken : `SELECT token FROM expired_token WHERE token = ?`,
    getFlexCycle : `SELECT * FROM flex_cycle_cutoff WHERE lower(is_active) = 'y'`,
    getCurrFReimbursement : `SELECT * FROM flex_reimbursement WHERE flex_cut_off_id = ? AND employee_id = ? AND status = 'Draft'`,
    getCategory : `SELECT * FROM category WHERE code = ?`, 
    insertFlexReimbursement :  `INSERT INTO flex_reimbursement (employee_id, flex_cut_off_id, total_reimbursement_amount, date_submitted, status) value (?, ?, 0, now(), 'Draft')`,
    insertReimbursementDetail : `INSERT INTO flex_reimbursement_detail (flex_reimbursement_id, or_number, name_of_establishment, tin_of_establishment, amount, category_id, status, date_added) value (?, ?, ?, ?, ?, ?, 'Draft', str_to_date(?, '%m/%d/%Y'))`,
    updateFlexReimbursement : `UPDATE flex_reimbursement SET total_reimbursement_amount = ?, date_updated = now() WHERE flex_reimbursement_id = ?`,
    deleteReimbursementDetail : `DELETE FROM flex_reimbursement_detail WHERE flex_reimbursement_detail_id = ?`,
    getReimbursementDetailById : `SELECT fd.*
                            FROM flex_reimbursement_detail fd 
                            LEFT JOIN flex_reimbursement fr ON
                                fr.flex_reimbursement_id = fd.flex_reimbursement_id
                            WHERE fd.flex_reimbursement_detail_id = ?
                                AND fr.employee_id = ?`,
    getFlexReimbursementById : `SELECT * FROM  flex_reimbursement WHERE flex_reimbursement_id = ? AND employee_id = ?`, 
    hrGetFlexReimbursementById : `SELECT * FROM  flex_reimbursement WHERE flex_reimbursement_id = ?`, 
    updReimbursementStatus : `UPDATE flex_reimbursement SET status = ?, transaction_number = ?, date_submitted = now(), date_updated = now() WHERE flex_reimbursement_id = ?`,
    hrUpdReimbursementStatus : `UPDATE flex_reimbursement SET status = ? ,date_updated = now()  WHERE flex_reimbursement_id = ?`,
    updReimbursementDetailStatus : `UPDATE flex_reimbursement_detail SET status = ? WHERE flex_reimbursement_id = ?`,
    getCompanyCode : `SELECT c.code
                      FROM employee e
                      LEFT JOIN company c ON 
                        c.company_id = e.company_id
                      WHERE e.employee_id = ?`,
    getAllReimbursement : `SELECT fr.transaction_number, 
	                            e.employee_number,
                                concat(concat(e.lastname, ', '), e.firstname) as employee_name,
                                fr.total_reimbursement_amount,
                                fr.date_submitted,
                                fr.status
                        FROM flex_cycle_cutoff fc 
                        LEFT JOIN flex_reimbursement fr ON
	                        fr.flex_cut_off_id = fc.flex_cutoff_id
                        LEFT JOIN employee e ON 
	                        e.employee_id = fr.employee_id
                        WHERE flex_cutoff_id = ? AND fr.status <> 'Draft' 
                        ORDER BY fr.status DESC`,
    getAllReimbursementDetail : `SELECT e.employee_number,
	                            concat(concat(e.lastname, ', '), e.firstname) as employee_name,
                                fr.date_submitted,
                                fd.date_added,
                                fd.or_number,
                                fd.name_of_establishment,
                                fd.tin_of_establishment,
                                fd.amount,
                                c.name,
                                fr.total_reimbursement_amount,
                                fr.transaction_number,
                                fr.status
                        FROM flex_reimbursement fr 
                        LEFT JOIN flex_reimbursement_detail fd ON 
	                        fd.flex_reimbursement_id = fr.flex_reimbursement_id
                        LEFT JOIN employee e ON 
	                        e.employee_id = fr.employee_id
                        LEFT JOIN category c ON 
	                        c.category_id = fd.category_id
                        WHERE fr.flex_reimbursement_id = ? AND fr.status <> 'Draft' ` ,
    getReimbursementByEmployee : `SELECT e.employee_number,
	                        concat(concat(e.lastname, ', '), e.firstname) as employee_name,
                            fr.date_submitted,
                            fd.date_added,
                            fd.or_number,
                            fd.name_of_establishment,
                            fd.tin_of_establishment,
                            fd.amount,
                            c.name,
                            fr.total_reimbursement_amount,
                            fr.transaction_number,
                            fr.status
                        FROM flex_reimbursement fr 
                        LEFT JOIN flex_reimbursement_detail fd ON 
	                        fd.flex_reimbursement_id = fr.flex_reimbursement_id
                        LEFT JOIN employee e ON 
	                        e.employee_id = fr.employee_id
                        LEFT JOIN category c ON 
	                        c.category_id = fd.category_id
                        WHERE (e.employee_id = ? OR ? is null) 
	                       AND (lower(e.lastname) = lower(?) OR ? is null)
                           AND (lower(e.firstname) = lower(?) OR ? is  null)
                           AND fr.status <> 'Draft'`,
    getReimbursementForPrint : `SELECT concat(concat(e.lastname, ', '), e.firstname)  as employee_name,
	                        e.employee_number,
                            fr.date_submitted,
                            fr.transaction_number,
                            fr.total_reimbursement_amount,
                            fr.status,
                            cat.name,
                            fd.date_added,
                            fd.or_number,
                            fd.name_of_establishment,
                            fd.tin_of_establishment,
                            fd.amount,
                            fd.status
                        FROM 
                        (  	SELECT category_id,
                                name
                            FROM category) cat
                        LEFT JOIN flex_reimbursement_detail fd ON
                            fd.category_id = cat.category_id
                        LEFT JOIN flex_reimbursement fr ON 
	                        fr.flex_reimbursement_id = fd.flex_reimbursement_id
                        LEFT JOIN employee e ON 
	                        e.employee_id = fr.employee_id
                        LEFT JOIN flex_cycle_cutoff fcc ON 
	                        fcc.flex_cutoff_id = fr.flex_cut_off_id
                        where e.employee_id = ? or employee_number is null
                        and (fcc.is_active = 'y' or fcc.is_active is null)`,

};
 
module.exports = sqlQuery;    