const express = require('express');
const hrRule = require('../business/hr.rules');
const { route } = require('./employee.router');

let router = express.Router();

router.get('/reimbursement', async (req,res, next) => {
    try {
        res = await hrRule.getAllReimbursement(req, res, next)
    } catch (e) {
        next (e)
    }

});

router.get('/details', async (req,res, next) => {
    try {
        res = await hrRule.getAllReimbursementDetails(req, res, next)
    } catch (e) {
        next (e)
    }

});

router.get('/employee', async (req,res, next) => {
    try {
        res = await hrRule.getAllReimbursementByEmployee(req, res, next)
    } catch (e) {
        next (e)
    }

});

router.patch('/approve', async (req,res, next) => {
    try {
        res = await hrRule.approveReimbursement(req, res, next)
    } catch (e) {
        next (e)
    }

});

router.patch('/reject', async (req,res, next) => {
    try {
        res = await hrRule.rejectReimbursement(req, res, next)
    } catch (e) {
        next (e)
    }

});

module.exports = router;